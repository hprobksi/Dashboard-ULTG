import base64
import math
import struct
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone


ION7650_SAG_SWELL_RECORDERS = {
    "0x880": "V1",
    "0x881": "V2",
    "0x882": "V3",
}


def _local_name(tag):
    return str(tag or "").split("}", 1)[-1]


def _children_named(element, name):
    return [child for child in element if _local_name(child.tag) == name]


def _iter_named(element, name):
    for item in element.iter():
        if _local_name(item.tag) == name:
            yield item


def _parse_iso_datetime(value):
    text = str(value or "").strip()
    if not text:
        return None
    if text.endswith("Z"):
        text = text[:-1] + "+00:00"
    return datetime.fromisoformat(text)


def _format_utc(dt_value):
    if not dt_value:
        return ""
    return dt_value.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def _extract_inner_device(root):
    if _local_name(root.tag) == "Device":
        return root

    auth_data = next(
        (child.text for child in root if _local_name(child.tag) == "AuthenticationData"),
        None,
    )
    if not auth_data:
        raise ValueError("File XML tidak berisi AuthenticationData ION.")
    return ET.fromstring(auth_data)


def parse_ion_xml(xml_bytes):
    root = ET.fromstring(xml_bytes)
    device = _extract_inner_device(root)
    identity = {}
    for key, value in device.attrib.items():
        identity[_local_name(key)] = value
    return device, identity


def decode_waveform_values(waveform):
    raw_text = (waveform.text or "").strip()
    if not raw_text:
        return []

    raw = base64.b64decode(raw_text)
    sample_count = len(raw) // 2
    if sample_count <= 0:
        return []

    # ION Setup XML stores waveform sample bytes as little-endian signed int16.
    samples = struct.unpack("<" + "h" * sample_count, raw[: sample_count * 2])
    scale = float(waveform.get("scale") or 1.0)
    offset = float(waveform.get("offset") or 0.0)
    return [(sample * scale) + offset for sample in samples]


def cycle_rms_values(values, sampling_frequency, nominal_frequency=50.0):
    if not values or sampling_frequency <= 0 or nominal_frequency <= 0:
        return []
    samples_per_cycle = max(1, round(sampling_frequency / nominal_frequency))
    result = []
    for start in range(0, len(values) - samples_per_cycle + 1, samples_per_cycle):
        window = values[start : start + samples_per_cycle]
        rms = math.sqrt(sum(value * value for value in window) / len(window))
        result.append(rms)
    return result


def classify_itic_condition(percent_nominal, undervoltage_percent, overvoltage_percent):
    if percent_nominal > overvoltage_percent:
        return "Swell"
    if percent_nominal < 10.0:
        return "Interruption"
    if percent_nominal < undervoltage_percent:
        return "Sag"
    return "Normal"


def detect_itic_events_from_rms(
    rms_values,
    *,
    phase,
    recorder_id,
    recorder_label,
    record_position,
    record_timestamp,
    first_point_time,
    trigger_time,
    nominal_voltage,
    nominal_frequency=50.0,
    undervoltage_ratio=0.90,
    overvoltage_ratio=1.10,
):
    events = []
    if not rms_values or nominal_voltage <= 0:
        return events

    undervoltage_percent = float(undervoltage_ratio) * 100.0
    overvoltage_percent = float(overvoltage_ratio) * 100.0
    cycle_seconds = 1.0 / float(nominal_frequency or 50.0)
    first_dt = _parse_iso_datetime(first_point_time) or _parse_iso_datetime(record_timestamp)

    active = None
    for index, rms in enumerate(rms_values):
        percent_nominal = (float(rms) / nominal_voltage) * 100.0
        condition = classify_itic_condition(
            percent_nominal,
            undervoltage_percent,
            overvoltage_percent,
        )

        if condition == "Normal":
            if active:
                events.append(active)
                active = None
            continue

        if active and active["event_type"] != condition:
            events.append(active)
            active = None

        if not active:
            start_dt = first_dt + timedelta(seconds=index * cycle_seconds) if first_dt else None
            active = {
                "event_type": condition,
                "phase": phase,
                "start_cycle": index,
                "end_cycle": index + 1,
                "duration_seconds": cycle_seconds,
                "magnitude_percent": percent_nominal,
                "waktu_mulai_utc": _format_utc(start_dt),
                "waktu_selesai_utc": _format_utc(
                    start_dt + timedelta(seconds=cycle_seconds) if start_dt else None
                ),
                "record_timestamp_utc": record_timestamp or "",
                "time_of_first_point_utc": first_point_time or "",
                "time_of_trigger_utc": trigger_time or "",
                "recorder_id": recorder_id,
                "recorder_label": recorder_label,
                "record_position": str(record_position or ""),
            }
        else:
            active["end_cycle"] = index + 1
            active["duration_seconds"] = (
                active["end_cycle"] - active["start_cycle"]
            ) * cycle_seconds
            if condition == "Swell":
                active["magnitude_percent"] = max(active["magnitude_percent"], percent_nominal)
            else:
                active["magnitude_percent"] = min(active["magnitude_percent"], percent_nominal)
            if first_dt:
                end_dt = first_dt + timedelta(seconds=active["end_cycle"] * cycle_seconds)
                active["waktu_selesai_utc"] = _format_utc(end_dt)

    if active:
        events.append(active)

    return events


def extract_ion7650_itic_events(
    xml_bytes,
    *,
    nominal_voltage=86600.0,
    nominal_frequency=50.0,
    undervoltage_ratio=0.90,
    overvoltage_ratio=1.10,
):
    device, identity = parse_ion_xml(xml_bytes)
    events = []
    waveform_summary = []

    for recorder in _iter_named(device, "WaveformRecorder"):
        recorder_id = recorder.get("id") or ""
        phase = ION7650_SAG_SWELL_RECORDERS.get(recorder_id)
        if not phase:
            continue

        recorder_label = recorder.get("label") or ""
        records = list(_iter_named(recorder, "WR"))
        waveform_summary.append(
            {
                "recorder_id": recorder_id,
                "recorder_label": recorder_label,
                "phase": phase,
                "record_count": len(records),
            }
        )

        for record in records:
            waveform = next(
                (child for child in _children_named(record, "Waveform")),
                None,
            )
            if waveform is None:
                continue

            sampling_frequency = float(waveform.get("samplingFrequency") or 0.0)
            values = decode_waveform_values(waveform)
            rms_values = cycle_rms_values(values, sampling_frequency, nominal_frequency)
            events.extend(
                detect_itic_events_from_rms(
                    rms_values,
                    phase=phase,
                    recorder_id=recorder_id,
                    recorder_label=recorder_label,
                    record_position=record.get("pos"),
                    record_timestamp=record.get("ts"),
                    first_point_time=waveform.get("timeOfFirstPoint"),
                    trigger_time=waveform.get("timeOfTrigger"),
                    nominal_voltage=nominal_voltage,
                    nominal_frequency=nominal_frequency,
                    undervoltage_ratio=undervoltage_ratio,
                    overvoltage_ratio=overvoltage_ratio,
                )
            )

    return {
        "identity": identity,
        "waveform_summary": waveform_summary,
        "events": events,
    }
