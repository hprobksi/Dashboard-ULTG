import struct
import time
import threading
import asyncio
import os
import secrets
import hashlib
import base64
import html
import ipaddress
import re
import socket
import shutil
import csv
import io
import uuid
import traceback
from concurrent.futures import ThreadPoolExecutor, as_completed
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone
from pathlib import Path
from urllib.parse import quote, urlencode, urlparse
import xml.etree.ElementTree as ET
import requests
from typing import List, Dict, Any, Optional
import paramiko
from fastapi import Cookie, Depends, FastAPI, Header, HTTPException, Query, Request, Response, Body, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from pymodbus.client import ModbusTcpClient
import database as db
import urllib3
import itic_pdf_generator
import pqm_ion_xml

try:
    import psutil
except Exception:
    psutil = None

try:
    from iec61850 import IedConnection, FC as IEC61850_FC, AcsiClass as IEC61850_ACSI_CLASS
    IEC61850_AVAILABLE = True
except Exception:
    IedConnection = None
    IEC61850_FC = None
    IEC61850_ACSI_CLASS = None
    IEC61850_AVAILABLE = False

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
db.init_database()

def env_int(name, default, minimum=1):
    try:
        return max(minimum, int(os.getenv(name, str(default))))
    except ValueError:
        return default

def env_float(name, default, minimum=0.0):
    try:
        return max(minimum, float(os.getenv(name, str(default))))
    except ValueError:
        return default

def env_any(names, default=""):
    if isinstance(names, str):
        names = (names,)
    for name in names:
        value = os.getenv(name, "")
        if str(value or "").strip():
            return str(value).strip()
    return default

def env_int_any(names, default, minimum=1):
    value = env_any(names, "")
    if value == "":
        return default
    try:
        return max(minimum, int(value))
    except ValueError:
        return default

def env_float_any(names, default, minimum=0.0):
    value = env_any(names, "")
    if value == "":
        return default
    try:
        return max(minimum, float(value))
    except ValueError:
        return default

def env_bool_any(names, default=False):
    value = env_any(names, "")
    if value == "":
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}

def read_optional_text_file(path):
    try:
        if path and os.path.exists(path):
            with open(path, "r") as f:
                return f.read().strip()
    except Exception:
        return ""
    return ""

def config_value(env_names, file_path="", default=""):
    env_value = env_any(env_names, "")
    if env_value:
        return env_value
    file_value = read_optional_text_file(file_path)
    if file_value:
        return file_value
    return default

# === KONFIGURASI ===
INTERVAL_DETIK = env_int("DC_POLL_INTERVAL_SECONDS", 30)  # Lebih stabil untuk banyak GI.
DC_MODBUS_TIMEOUT_DETIK = env_float("DC_MODBUS_TIMEOUT_SECONDS", 4.0, 0.5)
DC_MODBUS_RETRY_COUNT = env_int("DC_MODBUS_RETRY_COUNT", 2)
DC_MODBUS_RETRY_DELAY_DETIK = env_float("DC_MODBUS_RETRY_DELAY_SECONDS", 0.5, 0.0)
DC_MODBUS_SLAVE_ID = env_int("DC_MODBUS_SLAVE_ID", 1, 0)
DC_POLL_WORKERS = env_int("DC_POLL_WORKERS", 4)
DC_TREND_MAX_POINTS = max(144, int((12 * 60 * 60) / max(INTERVAL_DETIK, 1)))

# === GLOBAL STATE ===
import json

import uuid

WIB_TZ = timezone(timedelta(hours=7), "WIB")
APP_STARTED_AT = time.time()
APP_STARTED_AT_TEXT = datetime.now(WIB_TZ).strftime("%Y-%m-%d %H:%M:%S")
DAILY_RECAP_HOUR_WIB = 7
DAILY_RECAP_SETTING_KEY = "daily_recap_last_sent_date"
APP_BRAND_NAME = "VoltKraft"
APP_BRAND_FOOTER = f"by {APP_BRAND_NAME}"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ANNUNCIATOR_INTERVAL_DETIK = env_int("ANNUNCIATOR_POLL_INTERVAL_SECONDS", 5)
ANNUNCIATOR_TIMEOUT_DETIK = env_float("ANNUNCIATOR_TIMEOUT_SECONDS", 5.0, 1.0)
ANNUNCIATOR_RETRY_COUNT = env_int("ANNUNCIATOR_RETRY_COUNT", 2)
ANNUNCIATOR_RETRY_DELAY_DETIK = env_float("ANNUNCIATOR_RETRY_DELAY_SECONDS", 0.5, 0.0)
ANNUNCIATOR_FAIL_THRESHOLD = env_int("ANNUNCIATOR_FAIL_THRESHOLD", 2)
ANNUNCIATOR_CHANGE_CONFIRM_POLLS = env_int("ANNUNCIATOR_CHANGE_CONFIRM_POLLS", 2)
ANNUNCIATOR_RECOVERY_RETRY_DETIK = env_float("ANNUNCIATOR_RECOVERY_RETRY_SECONDS", 10 * 60, 30.0)
ANNUNCIATOR_ALARM_RETRY_DETIK = env_float("ANNUNCIATOR_ALARM_RETRY_SECONDS", ANNUNCIATOR_RECOVERY_RETRY_DETIK, 30.0)
ANNUNCIATOR_RETRY_PENDING_NOTIFICATIONS = env_bool_any(
    (
        "ANNUNCIATOR_RETRY_PENDING_NOTIFICATIONS",
        "VoltKraf_ANNUNCIATOR_RETRY_PENDING_NOTIFICATIONS",
        "VOLTCRAFT_ANNUNCIATOR_RETRY_PENDING_NOTIFICATIONS",
    ),
    True,
)
ANNUNCIATOR_TARGET_ALARM = "ALARM TEK. RENDAH (GAS)"
DFR_DEVICES_FILE = os.path.join(BASE_DIR, "dfr_devices.json")
DFR_INTERVAL_DETIK = env_int_any(
    ("DFR_POLL_INTERVAL_SECONDS", "VoltKraf_DFR_POLL_INTERVAL_SECONDS", "VOLTCRAFT_DFR_POLL_INTERVAL_SECONDS"),
    10 * 60,
    60,
)
DFR_TIMEOUT_DETIK = env_float_any(
    ("DFR_TIMEOUT_SECONDS", "VoltKraf_DFR_TIMEOUT_SECONDS", "VOLTCRAFT_DFR_TIMEOUT_SECONDS"),
    20.0,
    3.0,
)
DFR_POLL_WORKERS = env_int_any(
    ("DFR_POLL_WORKERS", "VoltKraf_DFR_POLL_WORKERS", "VOLTCRAFT_DFR_POLL_WORKERS"),
    2,
    1,
)
DFR_STORAGE_WARNING_PERCENT = env_float_any(
    ("DFR_STORAGE_WARNING_PERCENT", "VoltKraf_DFR_STORAGE_WARNING_PERCENT", "VOLTCRAFT_DFR_STORAGE_WARNING_PERCENT"),
    80.0,
    1.0,
)
DFR_STORAGE_CRITICAL_PERCENT = env_float_any(
    ("DFR_STORAGE_CRITICAL_PERCENT", "VoltKraf_DFR_STORAGE_CRITICAL_PERCENT", "VOLTCRAFT_DFR_STORAGE_CRITICAL_PERCENT"),
    90.0,
    1.0,
)
DFR_RAM_WARNING_PERCENT = env_float_any(
    ("DFR_RAM_WARNING_PERCENT", "VoltKraf_DFR_RAM_WARNING_PERCENT", "VOLTCRAFT_DFR_RAM_WARNING_PERCENT"),
    95.0,
    1.0,
)
DFR_RAM_CRITICAL_PERCENT = env_float_any(
    ("DFR_RAM_CRITICAL_PERCENT", "VoltKraf_DFR_RAM_CRITICAL_PERCENT", "VOLTCRAFT_DFR_RAM_CRITICAL_PERCENT"),
    98.0,
    1.0,
)
PQM_INTERVAL_DETIK = env_int("PQM_POLL_INTERVAL_SECONDS", 10)
PQM_TIMEOUT_DETIK = env_float("PQM_TIMEOUT_SECONDS", 4.0, 1.0)
PQM_RETRY_COUNT = env_int("PQM_RETRY_COUNT", 2)
PQM_RETRY_DELAY_DETIK = env_float("PQM_RETRY_DELAY_SECONDS", 0.5, 0.0)
PQM_FAIL_THRESHOLD = env_int("PQM_FAIL_THRESHOLD", 2)
PQM_VOLTAGE_ALARM_CONFIRM_POLLS = env_int("PQM_VOLTAGE_ALARM_CONFIRM_POLLS", 2)
PQM_VOLTAGE_RECOVERY_CONFIRM_POLLS = env_int(
    "PQM_VOLTAGE_RECOVERY_CONFIRM_POLLS",
    max(6, PQM_VOLTAGE_ALARM_CONFIRM_POLLS),
)
PQM_DISTURBANCE_CONFIRM_POLLS = env_int("PQM_DISTURBANCE_CONFIRM_POLLS", 2)
AVR_INTERVAL_DETIK = env_int("AVR_POLL_INTERVAL_SECONDS", 10)
AVR_TIMEOUT_DETIK = env_float("AVR_TIMEOUT_SECONDS", 8.0, 0.5)
AVR_MMS_REQUEST_TIMEOUT_DETIK = env_float("AVR_MMS_REQUEST_TIMEOUT_SECONDS", 5.0, 1.0)
AVR_FAIL_THRESHOLD = env_int("AVR_FAIL_THRESHOLD", 2)
AVR_POINT_NOTIFICATION_CONFIRM_POLLS = env_int("AVR_POINT_NOTIFICATION_CONFIRM_POLLS", 2)
AVR_POINT_NOTIFICATION_RETRY_DETIK = env_float("AVR_POINT_NOTIFICATION_RETRY_SECONDS", 10 * 60, 30.0)
AVR_MANUAL_DEVICES_SETTING_KEY = "avr_manual_devices_v1"
AVR_MMS_BROWSER_CACHE_SETTING_PREFIX = "avr_mms_browser_cache::"
AVR_NODE_ADAPTER_ENABLED = os.getenv("AVR_NODE_ADAPTER_ENABLED", "1").strip() != "0"
AVR_NODE_ADAPTER_SCRIPT = Path(BASE_DIR) / "avr_mms_node_reader.js"

KAPASITOR_INTERVAL_DETIK = env_int("KAPASITOR_POLL_INTERVAL_SECONDS", 10)
KAPASITOR_TIMEOUT_DETIK = env_float("KAPASITOR_TIMEOUT_SECONDS", AVR_TIMEOUT_DETIK, 0.5)
KAPASITOR_POINT_GROUPS = ("metering_points", "angle_points", "power_points", "status_points")
KAPASITOR_FAIL_THRESHOLD = env_int("KAPASITOR_FAIL_THRESHOLD", 3)
KAPASITOR_CB_NOTIFICATION_CONFIRM_POLLS = env_int("KAPASITOR_CB_NOTIFICATION_CONFIRM_POLLS", 1)

AR_POINT_GROUPS = ("rrec_points", "xcbr_points", "rsyn_points", "external_points", "health_points")
AR_POINT_GROUP_DEFAULTS = {
    "rrec_points": {"fc": "ST", "value_type": "bool"},
    "xcbr_points": {"fc": "ST", "value_type": "bool"},
    "rsyn_points": {"fc": "ST", "value_type": "bool"},
    "external_points": {"fc": "ST", "value_type": "bool"},
    "health_points": {"fc": "ST", "value_type": "bool"},
}
AR_INTERVAL_DETIK = 5.0
AR_TIMEOUT_DETIK = 2.0
AR_BEKASI_SOURCE_FILE = "AR BEKASI GISTET NEW TAMBUN .scd"
AR_MUARATAWAR_SOURCE_FILE = "AR MUARATAWAR GISTET NEW TAMBUN.scd"
AR_CIBINONG1_SOURCE_FILE = "AR CIBINONG 1 GISTET NEW TAMBUN.scd"
AR_CIBINONG2_SOURCE_FILE = "AR CIBINONG 2 GISTET NEW TAMBUN.scd"
AR_CAWANG_SOURCE_FILE = "AR CAWANG GITET MUARATAWAR.scd"
AR_TAMBUN_MUARATAWAR_SOURCE_FILE = "AR NEW TAMBUN GITET MUARATAWAR.scd"
AR_SUKATANI1_MUARATAWAR_SOURCE_FILE = "AR NEW SUKATANI 1 GITET MUARATAWAR.scd"
AR_SUKATANI2_MUARATAWAR_SOURCE_FILE = "AR NEW SUKATANI 2 GITET MUARATAWAR.scd"
AR_NOTIFY_ALL_STATE_CHANGES = os.getenv("AR_NOTIFY_ALL_STATE_CHANGES", "1").strip() != "0"
AR_EVENT_CONFIRM_POLLS = env_int("AR_EVENT_CONFIRM_POLLS", 2)
AR_WORKING_EVENT_KEYS = {
    "cycle_state",
    "general_state",
    "reclose_init",
    "close_command",
    "sync_progress",
    "check_progress",
}
AR_READINESS_REQUIRED_KEYS = {
    "ar_mode",
    "ar_health",
    "cycle_state",
    "general_state",
    "not_ready",
    "block_1p",
    "pole_r_block_close",
    "pole_s_block_close",
    "pole_t_block_close",
    "pole_3p_block_close",
    "relay_physical_health",
    "lcch_1_live",
    "lcch_2_live",
    "lcch_3_live",
    "line_lcch_live",
}
AR_CB_POSITION_KEYS = {"pole_r_pos", "pole_s_pos", "pole_t_pos", "pole_3p_pos"}
AR_EVENT_NOTIFICATION_MAX_LINES = env_int("AR_EVENT_NOTIFICATION_MAX_LINES", 10, 3)

def ar_point(group, label, key, reference, fc="ST", cdc="", value_type="bool",
             normal_value="false", severity="warning", unit="", whatsapp=False, readiness_required=None):
    if readiness_required is None:
        readiness_required = key in AR_READINESS_REQUIRED_KEYS
    return {
        "group": group,
        "label": label,
        "key": key,
        "reference": reference,
        "fc": fc,
        "cdc": cdc,
        "unit": unit,
        "value_type": value_type,
        "normal_value": normal_value,
        "severity": severity,
        "whatsapp": whatsapp,
        "readiness_required": bool(readiness_required),
    }

def build_default_ar_device(bay_key, bay_name, ied_name, ip, source_file, cb_name, include_check_progress=True):
    domain_cb = f"{ied_name}{cb_name}"
    domain_ar = f"{ied_name}{cb_name}_79AutoReclosing"
    domain_syn = f"{ied_name}{cb_name}_25Synchronization"
    return {
        "id": f"ar-gistet-new-tambun-{bay_key}-{cb_name.lower()}",
        "nama_gi": "GISTET New Tambun",
        "nama_bay": f"Bay {bay_name} AR {cb_name} 500kV",
        "ip": ip,
        "port": 102,
        "ied_name": ied_name,
        "access_point": "P1",
        "logical_device": "",
        "vendor": "IEC 61850",
        "model": "Auto-Recloser 500kV",
        "source": "default_scd",
        "source_file": source_file,
        "is_manual": False,
        "point_group_names": AR_POINT_GROUPS,
        "rrec_points": [
            ar_point("rrec_points", "AR Mode", "ar_mode", f"{domain_ar}/GEN_RREC1.Mod", value_type="text", normal_value="on"),
            ar_point("rrec_points", "AR Health", "ar_health", f"{domain_ar}/GEN_RREC1.Health", value_type="text", normal_value="Ok"),
            ar_point("rrec_points", "Cycle State", "cycle_state", f"{domain_ar}/CYC_RREC1.AutoRecSt", value_type="text", normal_value="Ready", whatsapp=True),
            ar_point("rrec_points", "Status AR", "general_state", f"{domain_ar}/GEN_RREC1.AutoRecSt", value_type="text", normal_value="Ready", whatsapp=True),
            ar_point("rrec_points", "AR Not Ready", "not_ready", f"{domain_ar}/GEN_RREC1.NotRdy", normal_value="false", severity="critical", whatsapp=True),
            ar_point("rrec_points", "Block 1-Pole Cycle", "block_1p", f"{domain_ar}/GEN_RREC1.Blk1polCyc", normal_value="false", severity="critical", whatsapp=True),
            ar_point("rrec_points", "Block 3-Pole Cycle", "block_3p", f"{domain_ar}/GEN_RREC1.Blk3polCyc", normal_value="true", severity="info", whatsapp=True, readiness_required=False),
            ar_point("rrec_points", "Reclose Initiated", "reclose_init", f"{domain_ar}/GEN_RREC1.RecInit", normal_value="false", severity="info", whatsapp=True),
            ar_point("rrec_points", "Close Command", "close_command", f"{domain_ar}/CYC_RREC1.OpCls.general", normal_value="false", severity="info", whatsapp=True),
        ],
        "xcbr_points": [
            ar_point("xcbr_points", "Pole R Position", "pole_r_pos", f"{domain_cb}/XCBR1.Pos", value_type="text", normal_value="on"),
            ar_point("xcbr_points", "Pole S Position", "pole_s_pos", f"{domain_cb}/XCBR2.Pos", value_type="text", normal_value="on"),
            ar_point("xcbr_points", "Pole T Position", "pole_t_pos", f"{domain_cb}/XCBR3.Pos", value_type="text", normal_value="on"),
            ar_point("xcbr_points", "XCBR4 / Common Position", "pole_3p_pos", f"{domain_cb}/XCBR4.Pos", value_type="text", normal_value="on"),
            ar_point("xcbr_points", "Pole R Block Close", "pole_r_block_close", f"{domain_cb}/XCBR1.BlkCls", normal_value="false", severity="critical", whatsapp=True),
            ar_point("xcbr_points", "Pole S Block Close", "pole_s_block_close", f"{domain_cb}/XCBR2.BlkCls", normal_value="false", severity="critical", whatsapp=True),
            ar_point("xcbr_points", "Pole T Block Close", "pole_t_block_close", f"{domain_cb}/XCBR3.BlkCls", normal_value="false", severity="critical", whatsapp=True),
            ar_point("xcbr_points", "Pole R Block Open / Trip", "pole_r_block_open", f"{domain_cb}/XCBR1.BlkOpn", normal_value="false", severity="warning"),
            ar_point("xcbr_points", "XCBR4 / Common Block Close", "pole_3p_block_close", f"{domain_cb}/XCBR4.BlkCls", normal_value="false", severity="critical", whatsapp=True),
            ar_point("xcbr_points", "XCBR4 / Common Block Open / Trip", "pole_3p_block_open", f"{domain_cb}/XCBR4.BlkOpn", normal_value="false", severity="warning"),
            ar_point("xcbr_points", "Breaker Health", "breaker_health", f"{domain_cb}/XCBR1.Health", value_type="text", normal_value="Ok"),
            ar_point("xcbr_points", "Breaker Common Health", "breaker_common_health", f"{domain_cb}/XCBR4.Health", value_type="text", normal_value="Ok"),
        ],
        "rsyn_points": [
            ar_point("rsyn_points", "Sync Release", "sync_release", f"{domain_syn}/CK_RSYN1.Rel", normal_value="true", severity="info", whatsapp=True, readiness_required=False),
            ar_point("rsyn_points", "Sync In Progress", "sync_progress", f"{domain_syn}/CK_RSYN1.SynPrg", normal_value="false", severity="info", whatsapp=True),
            *([ar_point("rsyn_points", "Check In Progress", "check_progress", f"{domain_syn}/CK_RSYN1.InProgress", normal_value="false", severity="info", whatsapp=True)] if include_check_progress else []),
            ar_point("rsyn_points", "Voltage Indication", "voltage_indication", f"{domain_syn}/CK_RSYN1.VInd", normal_value="true", severity="warning"),
            ar_point("rsyn_points", "Angle Indication", "angle_indication", f"{domain_syn}/CK_RSYN1.AngInd", normal_value="true", severity="warning"),
            ar_point("rsyn_points", "Frequency Indication", "frequency_indication", f"{domain_syn}/CK_RSYN1.HzInd", normal_value="true", severity="warning"),
            ar_point("rsyn_points", "Delta Voltage", "delta_voltage", f"{domain_syn}/GENRSYN1.DifVClc.mag.f", fc="MX", cdc="MV", value_type="float", normal_value="0", unit="kV", severity="info"),
            ar_point("rsyn_points", "Delta Frequency", "delta_frequency", f"{domain_syn}/GENRSYN1.DifHzClc.mag.f", fc="MX", cdc="MV", value_type="float", normal_value="0", unit="Hz", severity="info"),
            ar_point("rsyn_points", "Delta Angle", "delta_angle", f"{domain_syn}/GENRSYN1.DifAngClc.mag.f", fc="MX", cdc="MV", value_type="float", normal_value="0", unit="deg", severity="info"),
        ],
        "external_points": [
            ar_point("external_points", "CB Trip Command", "cb_trip", f"{domain_cb}/PTRC1.Tr.general", normal_value="false", severity="critical", whatsapp=True),
            ar_point("external_points", "CB Protection Start", "cb_start", f"{domain_cb}/PTRC1.Str.general", normal_value="false", severity="warning"),
            ar_point("external_points", "Line Operate Command", "line_trip", f"{ied_name}Ln1/PTRC1.Op.general", normal_value="false", severity="critical", whatsapp=True),
            ar_point("external_points", "Line Protection Start", "line_start", f"{ied_name}Ln1/PTRC1.Str.general", normal_value="false", severity="warning"),
            ar_point("external_points", "External 1-Pole Start", "external_1p_start", f"{ied_name}Ln1_ExternalTrip1pole1/EXTP_PSCH1.Str.general", normal_value="false", severity="warning"),
            ar_point("external_points", "External 1-Pole Operate", "external_1p_operate", f"{ied_name}Ln1_ExternalTrip1pole1/EXTP_PSCH1.Op.general", normal_value="false", severity="critical", whatsapp=True),
        ],
        "health_points": [
            ar_point("health_points", "Relay Physical Health", "relay_physical_health", f"{ied_name}Application/LPHD0.PhyHealth", value_type="text", normal_value="Ok", severity="critical", whatsapp=True),
            ar_point("health_points", "LCCH 1 Live", "lcch_1_live", f"{ied_name}Mod3_Channel1/LCCH1.ChLiv", normal_value="true", severity="critical", whatsapp=True),
            ar_point("health_points", "LCCH 2 Live", "lcch_2_live", f"{ied_name}Mod3_Channel1/LCCH2.ChLiv", normal_value="true", severity="critical", whatsapp=True),
            ar_point("health_points", "LCCH 3 Live", "lcch_3_live", f"{ied_name}Mod3_Channel1/LCCH3.ChLiv", normal_value="true", severity="critical", whatsapp=True),
            ar_point("health_points", "Line LCCH Live", "line_lcch_live", f"{ied_name}Mod3_Channel1/Line_LCCH1.ChLiv", normal_value="true", severity="critical", whatsapp=True),
        ],
    }

def build_muaratawar_q_ar_device(bay_key, bay_name, ied_name, ip, source_file, cb_name):
    device = build_default_ar_device(bay_key, bay_name, ied_name, ip, source_file, cb_name)
    domain_cb = f"{ied_name}{cb_name}"
    domain_external = f"{ied_name}{cb_name}_External79device"
    device.update({
        "id": f"ar-gitet-muaratawar-{bay_key}-{cb_name.lower()}",
        "nama_gi": "GITET Muaratawar",
        "nama_bay": f"Bay {bay_name} AR {cb_name} 500kV",
    })
    device["external_points"] = [
        ar_point("external_points", "CB Trip Command", "cb_trip", f"{domain_cb}/PTRC1.Tr.general", normal_value="false", severity="critical", whatsapp=True),
        ar_point("external_points", "CB Protection Start", "cb_start", f"{domain_cb}/PTRC1.Str.general", normal_value="false", severity="warning"),
        ar_point("external_points", "Line Operate Command", "line_trip", f"{ied_name}LINE/PTRC1.Op.general", normal_value="false", severity="critical", whatsapp=True),
        ar_point("external_points", "Line Protection Start", "line_start", f"{ied_name}LINE/PTRC1.Str.general", normal_value="false", severity="warning"),
        ar_point("external_points", "External AR 1P On", "external_1p_start", f"{domain_external}/EXAR_GAPC1.ExtRec1pOn", normal_value="false", severity="warning"),
        ar_point("external_points", "External AR 1P Operate", "external_1p_operate", f"{domain_external}/EXAR_GAPC1.ExtRec1pOp", normal_value="false", severity="critical", whatsapp=True),
    ]
    device["health_points"] = [
        ar_point("health_points", "Relay Physical Health", "relay_physical_health", f"{ied_name}Application/LPHD0.PhyHealth", value_type="text", normal_value="Ok", severity="critical", whatsapp=True),
        ar_point("health_points", "LCCH 1 Live", "lcch_1_live", f"{ied_name}Mod2_Channel1/LCCH1.ChLiv", normal_value="true", severity="critical", whatsapp=True),
        ar_point("health_points", "LCCH 2 Live", "lcch_2_live", f"{ied_name}Mod2_Channel1/LCCH2.ChLiv", normal_value="true", severity="critical", whatsapp=True),
        ar_point("health_points", "Line LCCH Live", "line_lcch_live", f"{ied_name}Mod2_Channel1/Line_LCCH1.ChLiv", normal_value="true", severity="critical", whatsapp=True),
    ]
    return device

def build_cawang_ar_device(cb_name):
    return build_muaratawar_q_ar_device("cawang", "Cawang", "B07PAR1", "172.20.17.33", AR_CAWANG_SOURCE_FILE, cb_name)

def build_tambun_muaratawar_ar_device(cb_name):
    return build_muaratawar_q_ar_device("tambun", "Tambun", "B08PAR1", "172.20.17.41", AR_TAMBUN_MUARATAWAR_SOURCE_FILE, cb_name)

def build_sukatani1_muaratawar_ar_device(cb_name):
    return build_muaratawar_q_ar_device("sukatani-1", "Sukatani 1", "B13PAR1", "172.20.17.71", AR_SUKATANI1_MUARATAWAR_SOURCE_FILE, cb_name)

def build_sukatani2_muaratawar_ar_device(cb_name):
    return build_muaratawar_q_ar_device("sukatani-2", "Sukatani 2", "B14PAR1", "172.20.17.81", AR_SUKATANI2_MUARATAWAR_SOURCE_FILE, cb_name)

DEFAULT_AR_DEVICES = [
    build_default_ar_device("bekasi", "Bekasi", "B1R4F791", "172.20.121.17", AR_BEKASI_SOURCE_FILE, "CB1"),
    build_default_ar_device("bekasi", "Bekasi", "B1R4F791", "172.20.121.17", AR_BEKASI_SOURCE_FILE, "CB2"),
    build_default_ar_device("muaratawar", "Muaratawar", "B2R4F791", "172.20.121.76", AR_MUARATAWAR_SOURCE_FILE, "CB1"),
    build_default_ar_device("muaratawar", "Muaratawar", "B2R4F791", "172.20.121.76", AR_MUARATAWAR_SOURCE_FILE, "CB2", include_check_progress=False),
    build_default_ar_device("cibinong-1", "Cibinong 1", "B3R4F791", "172.20.121.15", AR_CIBINONG1_SOURCE_FILE, "CB1"),
    build_default_ar_device("cibinong-1", "Cibinong 1", "B3R4F791", "172.20.121.15", AR_CIBINONG1_SOURCE_FILE, "CB2"),
    build_default_ar_device("cibinong-2", "Cibinong 2", "B4R4F791", "172.20.121.16", AR_CIBINONG2_SOURCE_FILE, "CB1"),
    build_default_ar_device("cibinong-2", "Cibinong 2", "B4R4F791", "172.20.121.16", AR_CIBINONG2_SOURCE_FILE, "CB2", include_check_progress=False),
    build_cawang_ar_device("Q52"),
    build_cawang_ar_device("Q53"),
    build_tambun_muaratawar_ar_device("Q52"),
    build_tambun_muaratawar_ar_device("Q53"),
    build_sukatani1_muaratawar_ar_device("Q52"),
    build_sukatani1_muaratawar_ar_device("Q53"),
    build_sukatani2_muaratawar_ar_device("Q52"),
    build_sukatani2_muaratawar_ar_device("Q53"),
]

def get_manual_ar_devices():
    try:
        val = db.get_setting("ar_manual_devices_v1", "[]")
        import json
        return json.loads(val)
    except Exception as exc:
        print(f"[AR] Gagal parse manual devices: {exc}")
        return []

def save_manual_ar_devices(devices):
    import json
    db.set_setting("ar_manual_devices_v1", json.dumps(devices))

def configured_ar_device_exists(device_id):
    return any(device.get("id") == device_id for device in DEFAULT_AR_DEVICES)

def ensure_unique_ar_device(candidate, existing_devices, editing_id=None):
    for existing in existing_devices:
        if editing_id and existing.get("id") == editing_id:
            continue
        same_name = (
            str(existing.get("nama_gi", "")).strip().lower() == candidate["nama_gi"].lower()
            and str(existing.get("nama_bay", "")).strip().lower() == candidate["nama_bay"].lower()
        )
        if same_name:
            raise HTTPException(status_code=400, detail="AR dengan nama GI dan bay ini sudah ada.")

def get_ar_devices():
    manual_devices = get_manual_ar_devices()
    manual_ids = {device.get("id") for device in manual_devices}
    default_devices = [device for device in DEFAULT_AR_DEVICES if device.get("id") not in manual_ids]
    return [*default_devices, *manual_devices]

def ar_truthy(value):
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return value != 0
    if isinstance(value, str):
        return value.strip().lower() in {"1", "true", "on", "active", "alarm", "yes"}
    return False

def ar_bool_setting(value, default=False):
    if value is None:
        return default
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return value != 0
    text = str(value).strip().lower()
    if text in {"1", "true", "on", "yes", "y", "aktif"}:
        return True
    if text in {"0", "false", "off", "no", "n", "tidak"}:
        return False
    return default

def ar_text(value):
    if value is None:
        return ""
    return str(value).strip().lower()

def ar_point_by_key(point_groups, key):
    for group_name in AR_POINT_GROUPS:
        for point in point_groups.get(group_name, []) or []:
            if point.get("key") == key:
                return point
    return {}

def ar_point_is_readiness_required(point):
    if not point:
        return False
    if "readiness_required" in point:
        return bool(point.get("readiness_required"))
    return str(point.get("key") or "") in AR_READINESS_REQUIRED_KEYS

def ar_value(point_groups, key):
    point = ar_point_by_key(point_groups, key)
    return point.get("value", point.get("configured_value"))

def ar_text_ok(value):
    text = ar_text(value)
    return not text or text in {"ok", "on", "ready", "1", "true"}

def ar_normalized_status_token(value, point=None):
    key = str((point or {}).get("key") or "")
    text = ar_text(value)
    if key in AR_CB_POSITION_KEYS:
        position_label = ar_cb_position_label(value)
        if position_label == "CB Close":
            return "ready"
        if position_label == "CB Open":
            return "off"
        if position_label == "CB Intermediate":
            return "intermediate"
        if position_label == "CB Bad State":
            return "bad-state"
        return text
    if key == "ar_mode" and text == "8":
        return "ready"
    if text in {"ok", "on", "ready", "1", "true"}:
        return "ready"
    if text in {"off", "false", "0", "inactive"}:
        return "off"
    return text

def ar_point_matches_normal(point):
    value = point.get("value", point.get("configured_value"))
    if value in (None, "", "-"):
        return False
    normal_value = point.get("normal_value")
    if normal_value in (None, ""):
        return True
    return ar_normalized_status_token(value, point) == ar_normalized_status_token(normal_value, point)

def build_ar_readiness(state):
    if not state.get("connected"):
        return {
            "ready": False,
            "state": "offline",
            "label": "OFFLINE",
            "tone": "critical",
            "failed": ["Port 102 belum terhubung"],
            "active": [],
        }

    failed = []
    active = []
    groups = {group: state.get(group, []) for group in AR_POINT_GROUPS}
    cycle_value = ar_value(groups, "cycle_state") or ar_value(groups, "general_state")
    cycle_state = ar_text(cycle_value)
    handled_readiness_keys = set(AR_READINESS_REQUIRED_KEYS)

    if cycle_state == "2" or "progress" in cycle_state or ar_truthy(ar_value(groups, "reclose_init")) or ar_truthy(ar_value(groups, "close_command")):
        active.append("AR sedang proses")

    if not ar_point_matches_normal(ar_point_by_key(groups, "ar_mode")):
        failed.append("AR mode tidak ON")
    if not ar_point_matches_normal(ar_point_by_key(groups, "ar_health")):
        failed.append("Health AR tidak OK")
    if cycle_state and cycle_state != "1" and "ready" not in cycle_state and "waiting" not in cycle_state and "successful" not in cycle_state:
        failed.append(f"Cycle state {cycle_value}")
    if ar_truthy(ar_value(groups, "not_ready")):
        failed.append("AR Not Ready aktif")
    if ar_truthy(ar_value(groups, "block_1p")):
        failed.append("Block 1-pole aktif")
    if ar_truthy(ar_value(groups, "pole_r_block_close")):
        failed.append("Pole R block close")
    if ar_truthy(ar_value(groups, "pole_s_block_close")):
        failed.append("Pole S block close")
    if ar_truthy(ar_value(groups, "pole_t_block_close")):
        failed.append("Pole T block close")
    if ar_truthy(ar_value(groups, "pole_3p_block_close")):
        failed.append("XCBR4/common block close")
    if not ar_point_matches_normal(ar_point_by_key(groups, "relay_physical_health")):
        failed.append("Relay physical health tidak OK")

    for key, label in (
        ("lcch_1_live", "LCCH 1 loss"),
        ("lcch_2_live", "LCCH 2 loss"),
        ("lcch_3_live", "LCCH 3 loss"),
        ("line_lcch_live", "Line LCCH loss"),
    ):
        if ar_point_by_key(groups, key) and not ar_truthy(ar_value(groups, key)):
            failed.append(label)

    for group_name in AR_POINT_GROUPS:
        for point in groups.get(group_name, []) or []:
            key = str(point.get("key") or "")
            if not key or key in handled_readiness_keys or not ar_point_is_readiness_required(point):
                continue
            if point.get("quality") == "invalid":
                continue
            if not ar_point_matches_normal(point):
                failed.append(f"{point.get('label') or key} belum sesuai")

    invalid_count = sum(
        1
        for group_name in AR_POINT_GROUPS
        for point in groups.get(group_name, []) or []
        if point.get("quality") == "invalid" and ar_point_is_readiness_required(point)
    )
    if invalid_count:
        failed.append(f"{invalid_count} tag belum valid")

    if active:
        return {"ready": False, "state": "progress", "label": "IN PROGRESS", "tone": "warning", "failed": failed, "active": active}
    if failed:
        return {"ready": False, "state": "blocked", "label": "TIDAK SIAP", "tone": "critical", "failed": failed, "active": active}
    return {"ready": True, "state": "ready", "label": "AR SIAP", "tone": "success", "failed": [], "active": active}

def build_empty_ar_state(device, connected=False, last_poll_time=None, status_message="", point_groups=None):
    base = {
        "id": device.get("id", ""),
        "nama_gi": device.get("nama_gi", ""),
        "nama_bay": device.get("nama_bay", ""),
        "ip": device.get("ip", ""),
        "port": device.get("port", 102),
        "ied_name": device.get("ied_name", ""),
        "logical_device": device.get("logical_device", ""),
        "vendor": device.get("vendor", ""),
        "model": device.get("model", ""),
        "access_point": device.get("access_point", "P1"),
        "source_file": device.get("source_file", ""),
        "connected": connected,
        "last_poll_time": last_poll_time,
        "status_message": status_message,
        "source": device.get("source", "manual"),
        "is_manual": device.get("is_manual", True),
    }
    
    if point_groups:
        for group in AR_POINT_GROUPS:
            base[group] = point_groups.get(group, [])
    else:
        for group in AR_POINT_GROUPS:
            base[group] = []
            for point in device.get(group, []):
                base[group].append({
                    "key": point.get("key"),
                    "label": point.get("label"),
                    "reference": point.get("reference"),
                    "value": "-",
                    "fc": point.get("fc", AR_POINT_GROUP_DEFAULTS.get(group, {}).get("fc", "ST")),
                    "value_type": point.get("value_type", AR_POINT_GROUP_DEFAULTS.get(group, {}).get("value_type", "bool")),
                    "normal_value": point.get("normal_value", "false"),
                    "severity": point.get("severity", "info"),
                    "readiness_required": ar_point_is_readiness_required(point),
                    "quality": point.get("quality", ""),
                })
    base["readiness"] = build_ar_readiness(base)
    return base

def build_ar_error_point_groups(device, status_message):
    groups = {group: [] for group in AR_POINT_GROUPS}
    for group in AR_POINT_GROUPS:
        for point in device.get(group, []):
            groups[group].append({
                "key": point.get("key"),
                "label": point.get("label"),
                "reference": point.get("reference"),
                "value": "-",
                "fc": point.get("fc", AR_POINT_GROUP_DEFAULTS.get(group, {}).get("fc", "ST")),
                "value_type": point.get("value_type", AR_POINT_GROUP_DEFAULTS.get(group, {}).get("value_type", "bool")),
                "normal_value": point.get("normal_value", "false"),
                "severity": point.get("severity", "info"),
                "readiness_required": ar_point_is_readiness_required(point),
                "quality": "invalid",
                "last_error": status_message,
                "error": status_message
            })
    return groups

def ar_event_snapshot_key(device_id):
    return f"ar_event_snapshot::{device_id}"

def ar_event_candidate_key(device_id):
    return f"ar_event_candidate::{device_id}"

def notification_candidate_matches(raw_payload, field_name, current_value):
    payload = safe_json_dict(raw_payload)
    if not payload:
        return False, 0
    try:
        seen_count = int(payload.get("seen_count") or 0)
    except (TypeError, ValueError):
        seen_count = 0
    return payload.get(field_name) == current_value, seen_count

def update_notification_candidate(setting_key, field_name, current_value, confirm_polls):
    raw_payload = db.get_setting(setting_key, "")
    matches, seen_count = notification_candidate_matches(raw_payload, field_name, current_value)
    seen_count = seen_count + 1 if matches else 1
    payload = {
        field_name: current_value,
        "seen_count": seen_count,
        "first_seen_at": safe_json_dict(raw_payload).get("first_seen_at") if matches else time.time(),
        "updated_at": time.time(),
    }
    db.set_setting(setting_key, json.dumps(payload, ensure_ascii=True))
    return seen_count >= max(1, int(confirm_polls or 1)), seen_count

def clear_notification_candidate(setting_key):
    db.delete_setting(setting_key)

def ar_event_value(value):
    if value is None:
        return ""
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (int, float)):
        return str(value)
    return str(value).strip()

def ar_should_record_point(point):
    key = str(point.get("key") or "")
    if point.get("quality") == "invalid":
        return False
    if not key:
        return False
    # These analog sync values change often; status-change SOE focuses on state transitions.
    if key in {"delta_voltage", "delta_frequency", "delta_angle"}:
        return False
    return True

def ar_cb_position_label(value):
    if value in (None, ""):
        return ""
    if isinstance(value, bool):
        return "CB Close" if value else "CB Open"
    if isinstance(value, (int, float)):
        number = int(value)
        if number in {2, 8}:
            return "CB Close"
        if number in {0, 1}:
            return "CB Open"
        if number == 3:
            return "CB Bad State"
        return "CB Unknown"

    normalized = str(value).strip().lower()
    if normalized in {"true", "on", "close", "closed", "cb close", "2", "8"}:
        return "CB Close"
    if normalized in {"false", "off", "open", "opened", "cb open", "0", "1"}:
        return "CB Open"
    if normalized in {"intermediate", "intermediate-state"}:
        return "CB Intermediate"
    if normalized in {"bad", "bad-state", "3"}:
        return "CB Bad State"
    return str(value).strip()

def format_ar_event_value(value, point_key=""):
    text = ar_event_value(value)
    if text == "":
        return "-"
    normalized = text.strip().lower()
    key = str(point_key or "").strip()
    if key in AR_CB_POSITION_KEYS:
        return ar_cb_position_label(value)
    if key == "ar_mode":
        if normalized in {"1", "8", "on", "true"}:
            return "ON"
        if normalized in {"5", "off", "false"}:
            return "OFF"
    if key in {"ar_health", "relay_physical_health", "breaker_health", "breaker_common_health"} and normalized == "1":
        return "OK"
    if key in {"cycle_state", "general_state"} and normalized == "1":
        return "Ready"
    if normalized == "true":
        return "ON"
    if normalized == "false":
        return "OFF"
    return text

def ar_event_value_is_working(point_key, value):
    text = ar_text(value)
    if point_key in {"reclose_init", "close_command", "sync_progress", "check_progress"}:
        return ar_truthy(value)
    if point_key in {"cycle_state", "general_state"}:
        return text == "2" or "progress" in text or "in progress" in text
    return False

def ar_event_is_notifiable(event):
    if AR_NOTIFY_ALL_STATE_CHANGES:
        return True
    if str(event.get("point_key") or "") in AR_WORKING_EVENT_KEYS:
        return True
    if str(event.get("severity") or "").lower() in {"critical", "alarm"}:
        return True
    return bool(event.get("whatsapp"))

def ar_event_notification_status(events):
    if any(ar_event_value_is_working(str(event.get("point_key") or ""), event.get("current_value")) for event in events):
        return "AR BEKERJA"
    if any(str(event.get("severity") or "").lower() == "critical" for event in events):
        return "PERUBAHAN STATUS AR CRITICAL"
    return "PERUBAHAN STATUS AR"

def build_ar_events_message(state, events, waktu):
    notify_events = [event for event in events if ar_event_is_notifiable(event)]
    if not notify_events:
        return ""

    indication_lines = []
    for event in notify_events[:AR_EVENT_NOTIFICATION_MAX_LINES]:
        label = event.get("point_label") or event.get("point_key") or "-"
        point_key = str(event.get("point_key") or "")
        before = format_ar_event_value(event.get("previous_value"), point_key)
        after = format_ar_event_value(event.get("current_value"), point_key)
        indication_lines.append(f"{label} = {before} -> {after}")

    remaining = len(notify_events) - len(indication_lines)
    if remaining > 0:
        indication_lines.append(f"+ {remaining} EVENT LAINNYA TERCATAT DI DASHBOARD")

    return notification_event_template(
        state.get("nama_gi", "-"),
        state.get("nama_bay", "-"),
        waktu,
        "AR / AUTO-RECLOSER",
        ip=state.get("ip", ""),
        status=ar_event_notification_status(notify_events),
        indikasi_lines=indication_lines,
    )

def notify_ar_state_events(state, events, waktu):
    message = build_ar_events_message(state, events, waktu)
    if not message:
        return False

    sent = send_whatsapp_notification(message)
    if sent:
        print(
            f"[AR NOTIFICATION] {state.get('nama_gi', '-') } - {state.get('nama_bay', '-')}: "
            f"{len(events)} perubahan terkirim ke WhatsApp."
        )
    else:
        print(
            f"[AR NOTIFICATION FAILED] {state.get('nama_gi', '-') } - {state.get('nama_bay', '-')}: "
            "perubahan AR belum terkirim ke WhatsApp."
        )
    return sent

def record_ar_state_events(state):
    device_id = state.get("id") or ""
    if not device_id:
        return []

    current_snapshot = {}
    point_index = {}
    for group_name in AR_POINT_GROUPS:
        for point in state.get(group_name, []) or []:
            if not ar_should_record_point(point):
                continue
            point_key = str(point.get("key") or "")
            snapshot_key = f"{group_name}:{point_key}"
            current_snapshot[snapshot_key] = format_ar_event_value(point.get("value"), point_key)
            point_index[snapshot_key] = (group_name, point)

    previous_raw = db.get_setting(ar_event_snapshot_key(device_id), "")
    try:
        previous_snapshot = json.loads(previous_raw) if previous_raw else None
    except Exception:
        previous_snapshot = None

    if previous_snapshot is None:
        db.set_setting(ar_event_snapshot_key(device_id), json.dumps(current_snapshot, ensure_ascii=True))
        clear_notification_candidate(ar_event_candidate_key(device_id))
        return []

    if current_snapshot == previous_snapshot:
        clear_notification_candidate(ar_event_candidate_key(device_id))
        return []

    candidate_key = ar_event_candidate_key(device_id)
    confirmed, seen_count = update_notification_candidate(
        candidate_key,
        "snapshot",
        current_snapshot,
        AR_EVENT_CONFIRM_POLLS,
    )
    if not confirmed:
        print(
            f"[AR CHANGE HOLD] {state.get('nama_gi', '-') } - {state.get('nama_bay', '-')}: "
            f"perubahan terdeteksi, menunggu konfirmasi {seen_count}/{AR_EVENT_CONFIRM_POLLS}."
        )
        return []

    events = []
    waktu = format_wib(wib_now())
    for snapshot_key, current_value in current_snapshot.items():
        previous_value = previous_snapshot.get(snapshot_key)
        if previous_value == current_value:
            continue
        group_name, point = point_index[snapshot_key]
        event = {
            "id": f"{device_id}-{snapshot_key}-{int(time.time() * 1000)}-{uuid.uuid4().hex[:6]}",
            "waktu": waktu,
            "device_id": device_id,
            "nama_gi": state.get("nama_gi", ""),
            "nama_bay": state.get("nama_bay", ""),
            "ip": state.get("ip", ""),
            "group_name": group_name,
            "point_key": point.get("key", ""),
            "point_label": point.get("label", point.get("key", "")),
            "reference": point.get("reference", ""),
            "previous_value": previous_value,
            "current_value": current_value,
            "quality": point.get("quality", ""),
            "severity": point.get("severity", "info"),
            "whatsapp": bool(point.get("whatsapp", False)),
        }
        db.insert_ar_event(event)
        events.append(event)

    db.set_setting(ar_event_snapshot_key(device_id), json.dumps(current_snapshot, ensure_ascii=True))
    clear_notification_candidate(candidate_key)
    if events:
        app_state["ar_events"] = db.list_ar_events(limit=300)
        notify_ar_state_events(state, events, waktu)
    return events

AVR_POINT_GROUPS = ("measurement_points", "setting_points", "status_points", "alarm_points", "led_points")
AVR_POINT_GROUP_DEFAULTS = {
    "measurement_points": {"fc": "MX", "value_type": "float"},
    "setting_points": {"fc": "MX", "value_type": "float"},
    "status_points": {"fc": "ST", "value_type": "bool"},
    "alarm_points": {"fc": "ST", "value_type": "bool"},
    "led_points": {"fc": "ST", "value_type": "bool"},
}
AVR_LED_LABEL_OVERRIDES = {
    "gi-cikarang-trafo-1-avr": {
        "led_1": "TAP In Proggres",
        "led_2": "OLTC Alarm",
        "led_3": "OLTC Block",
        "led_4": "Local",
        "led_5": "Remote",
        "led_6": "TC Auto",
        "led_7": "TC Manual",
        "led_8": "Raise Own",
        "led_9": "Lower Own",
        "led_10": "Disturb Rec",
        "led_11": "Block UV/OC",
    },
}
AVR_ALARM_ONLY_NOTIFICATION_DEVICE_IDS = {
    "gis-new-tambun-trafo-1-avr",
    "gis-new-tambun-trafo-2-avr",
}
AVR_ALARM_ONLY_NOTIFICATION_IPS = {
    "172.20.121.96",
    "172.20.121.84",
}
AVR_ALARM_ONLY_NOTIFICATION_SOURCE_FILES = {
    "AVR TRAFO 1 GIS NEW TAMBUN.SCD",
    "AVR TRAFO 2 GIS NEW TAMBUN.SCD",
}
PQM_TYPE_ION7650 = "ion7650"
PQM_TYPE_ION9000 = "ion9000"
PQM_ION9000_USERNAME = os.getenv("PQM_ION9000_USERNAME", "USER1").strip() or "USER1"
PQM_ION9000_PASSWORD = os.getenv("PQM_ION9000_PASSWORD", "0").strip() or "0"
PQM_ION9000_SESSION_TTL_DETIK = env_int("PQM_ION9000_SESSION_TTL_SECONDS", 25 * 60)
PQM_ION9000_REQUEST_TIMEOUT_DETIK = env_float("PQM_ION9000_REQUEST_TIMEOUT_SECONDS", 6.0, 1.0)
PQM_ION9000_MAX_POLL_DETIK = env_float("PQM_ION9000_MAX_POLL_SECONDS", 45.0, 5.0)
PQM_ION9000_VERIFY_SSL = os.getenv("PQM_ION9000_VERIFY_SSL", "0") == "1"
PQM_ION9000_REQUEST_BATCH_SIZE = env_int("PQM_ION9000_REQUEST_BATCH_SIZE", 25)
PQM_ION9000_MUARATAWAR_FAST_POLL = env_bool_any(
    (
        "PQM_ION9000_MUARATAWAR_FAST_POLL",
        "VoltKraf_PQM_ION9000_MUARATAWAR_FAST_POLL",
        "VOLTCRAFT_PQM_ION9000_MUARATAWAR_FAST_POLL",
    ),
    True,
)
PQM_ION9000_MUARATAWAR_REQUEST_TIMEOUT_DETIK = env_float_any(
    (
        "PQM_ION9000_MUARATAWAR_REQUEST_TIMEOUT_SECONDS",
        "VoltKraf_PQM_ION9000_MUARATAWAR_REQUEST_TIMEOUT_SECONDS",
        "VOLTCRAFT_PQM_ION9000_MUARATAWAR_REQUEST_TIMEOUT_SECONDS",
    ),
    20.0,
    1.0,
)
PQM_ION9000_MUARATAWAR_MAX_POLL_DETIK = env_float_any(
    (
        "PQM_ION9000_MUARATAWAR_MAX_POLL_SECONDS",
        "VoltKraf_PQM_ION9000_MUARATAWAR_MAX_POLL_SECONDS",
        "VOLTCRAFT_PQM_ION9000_MUARATAWAR_MAX_POLL_SECONDS",
    ),
    120.0,
    5.0,
)
PQM_NOMINAL_LN_VOLTAGE = env_float("PQM_NOMINAL_LN_VOLTAGE", 86600.0, 1.0)
PQM_MUARATAWAR_500KV_NOMINAL_LN_VOLTAGE = env_float(
    "PQM_MUARATAWAR_500KV_NOMINAL_LN_VOLTAGE",
    500000.0 / (3 ** 0.5),
    1.0,
)
PQM_MUARATAWAR_LOAD_THRESHOLD_AMPERE = env_float_any(
    (
        "PQM_MUARATAWAR_LOAD_THRESHOLD_AMPERE",
        "VoltKraf_PQM_MUARATAWAR_LOAD_THRESHOLD_AMPERE",
        "VOLTCRAFT_PQM_MUARATAWAR_LOAD_THRESHOLD_AMPERE",
    ),
    10.0,
    0.0,
)
PQM_GI_FAJAR_TRIP_CURRENT_AMPERE = env_float_any(
    (
        "PQM_GI_FAJAR_TRIP_CURRENT_AMPERE",
        "VoltKraf_PQM_GI_FAJAR_TRIP_CURRENT_AMPERE",
        "VOLTCRAFT_PQM_GI_FAJAR_TRIP_CURRENT_AMPERE",
    ),
    0.0,
    0.0,
)
PQM_GI_FAJAR_HIGH_LOAD_THRESHOLD_AMPERE = env_float_any(
    (
        "PQM_GI_FAJAR_HIGH_LOAD_THRESHOLD_AMPERE",
        "VoltKraf_PQM_GI_FAJAR_HIGH_LOAD_THRESHOLD_AMPERE",
        "VOLTCRAFT_PQM_GI_FAJAR_HIGH_LOAD_THRESHOLD_AMPERE",
    ),
    192.0,
    0.0,
)
PQM_UNDERVOLTAGE_RATIO = env_float("PQM_UNDERVOLTAGE_RATIO", 0.90, 0.1)
PQM_OVERVOLTAGE_RATIO = env_float("PQM_OVERVOLTAGE_RATIO", 1.10, 1.0)
PQM_VOLTAGE_ALARM_RETRY_DETIK = env_float("PQM_VOLTAGE_ALARM_RETRY_SECONDS", 10 * 60, 30.0)
PQM_BASE_REGISTER = 40001
PQM_MAIN_REGISTER_COUNT = 130
PQM_MAIN_LAST_REGISTER = 40277
MODBUS_MAX_READ_REGISTERS = 125
PQM_DISTURBANCE_COUNTER_START_REGISTER = 41000
PQM_DISTURBANCE_COUNTER_START_ADDRESS = PQM_DISTURBANCE_COUNTER_START_REGISTER - PQM_BASE_REGISTER
PQM_DISTURBANCE_COUNTER_END_REGISTER = 41170
PQM_DISTURBANCE_COUNTER_COUNT = PQM_DISTURBANCE_COUNTER_END_REGISTER - PQM_DISTURBANCE_COUNTER_START_REGISTER + 2
SESSION_COOKIE_NAME = "VoltKraf_session"
SESSION_TTL_SECONDS = env_int_any(("VoltKraf_SESSION_TTL_SECONDS", "VOLTCRAFT_SESSION_TTL_SECONDS"), 12 * 60 * 60, 5 * 60)
ADMIN_USERNAME_ENV = "VoltKraf_ADMIN_USERNAME"
ADMIN_PASSWORD_ENV = "VoltKraf_ADMIN_PASSWORD"
ADMIN_USERNAME_ENVS = ("VoltKraf_ADMIN_USERNAME", "VOLTCRAFT_ADMIN_USERNAME")
ADMIN_PASSWORD_ENVS = ("VoltKraf_ADMIN_PASSWORD", "VOLTCRAFT_ADMIN_PASSWORD")
ADMIN_CREDENTIALS_FILE = os.path.join(BASE_DIR, "VoltKraf_admin_credentials.json")
ADMIN_PASSWORD_HASH_ITERATIONS = env_int_any(("VoltKraf_ADMIN_PASSWORD_HASH_ITERATIONS", "VOLTCRAFT_ADMIN_PASSWORD_HASH_ITERATIONS"), 260000, 100000)
LOGIN_RATE_LIMIT_WINDOW_DETIK = env_int_any(("VoltKraf_LOGIN_RATE_LIMIT_WINDOW_SECONDS", "VOLTCRAFT_LOGIN_RATE_LIMIT_WINDOW_SECONDS"), 15 * 60, 60)
LOGIN_RATE_LIMIT_MAX_ATTEMPTS = env_int_any(("VoltKraf_LOGIN_RATE_LIMIT_MAX_ATTEMPTS", "VOLTCRAFT_LOGIN_RATE_LIMIT_MAX_ATTEMPTS"), 8, 1)
LOGIN_RATE_LIMIT_LOCK_DETIK = env_int_any(("VoltKraf_LOGIN_RATE_LIMIT_LOCK_SECONDS", "VOLTCRAFT_LOGIN_RATE_LIMIT_LOCK_SECONDS"), 15 * 60, 60)
CSRF_HEADER_NAME = "X-VoltKraf-CSRF"
WHATSAPP_ENDPOINT_URL = config_value(("WHATSAPP_ENDPOINT_URL", "VoltKraf_WHATSAPP_ENDPOINT_URL", "VOLTCRAFT_WHATSAPP_ENDPOINT_URL"), os.path.join(BASE_DIR, "whatsapp_endpoint_url.txt"), "http://192.168.110.100:8001/id/send-message")
WHATSAPP_API_KEY = config_value(("WHATSAPP_API_KEY", "VoltKraf_WHATSAPP_API_KEY", "VOLTCRAFT_WHATSAPP_API_KEY"), os.path.join(BASE_DIR, "whatsapp_api_key.txt"))
WHATSAPP_SENDER = config_value(("WHATSAPP_SENDER", "VoltKraf_WHATSAPP_SENDER", "VOLTCRAFT_WHATSAPP_SENDER"), os.path.join(BASE_DIR, "whatsapp_sender.txt"))
WHATSAPP_GROUP_NUMBER = config_value(("WHATSAPP_GROUP_NUMBER", "VoltKraf_WHATSAPP_GROUP_NUMBER", "VOLTCRAFT_WHATSAPP_GROUP_NUMBER"), os.path.join(BASE_DIR, "whatsapp_group_number.txt"))
WHATSAPP_MESSAGE_TYPE = env_any(("WHATSAPP_MESSAGE_TYPE", "VoltKraf_WHATSAPP_MESSAGE_TYPE", "VOLTCRAFT_WHATSAPP_MESSAGE_TYPE"), "text") or "text"
WHATSAPP_RECONNECT_URL = config_value(("WHATSAPP_RECONNECT_URL", "VoltKraf_WHATSAPP_RECONNECT_URL", "VOLTCRAFT_WHATSAPP_RECONNECT_URL"), os.path.join(BASE_DIR, "whatsapp_reconnect_url.txt"), "http://192.168.110.100:3100/backend-initialize")
WHATSAPP_DOCUMENT_URL = config_value(("WHATSAPP_DOCUMENT_URL", "VoltKraf_WHATSAPP_DOCUMENT_URL", "VOLTCRAFT_WHATSAPP_DOCUMENT_URL"), os.path.join(BASE_DIR, "whatsapp_document_url.txt"))
WHATSAPP_MEDIA_URL = config_value(("WHATSAPP_MEDIA_URL", "VoltKraf_WHATSAPP_MEDIA_URL", "VOLTCRAFT_WHATSAPP_MEDIA_URL"), os.path.join(BASE_DIR, "whatsapp_media_url.txt"), WHATSAPP_ENDPOINT_URL.replace("/send-message", "/send-media"))
APP_PUBLIC_BASE_URL = config_value(("VoltKraf_PUBLIC_BASE_URL", "VOLTCRAFT_PUBLIC_BASE_URL", "APP_PUBLIC_BASE_URL"), os.path.join(BASE_DIR, "public_base_url.txt"))
WHATSAPP_TIMEOUT_DETIK = env_float("WHATSAPP_TIMEOUT_SECONDS", 5.0, 1.0)
WHATSAPP_MIN_INTERVAL_DETIK = env_float("WHATSAPP_MIN_INTERVAL_SECONDS", 20.0, 1.0)
WHATSAPP_DUPLICATE_TTL_DETIK = env_float("WHATSAPP_DUPLICATE_TTL_SECONDS", 10 * 60, 1.0)
WHATSAPP_MAX_MESSAGE_LENGTH = env_int("WHATSAPP_MAX_MESSAGE_LENGTH", 3500, 200)
WHATSAPP_RECOVERY_CHECK_SECONDS = env_int("WHATSAPP_RECOVERY_CHECK_SECONDS", 30, 10)
WHATSAPP_OFFLINE_RETRY_SECONDS = env_int("WHATSAPP_OFFLINE_RETRY_SECONDS", 60, 10)
WHATSAPP_RATE_LIMIT_WINDOW_DETIK = env_int("WHATSAPP_RATE_LIMIT_WINDOW_SECONDS", 60 * 60, 60)
WHATSAPP_MAX_MESSAGES_PER_WINDOW = env_int("WHATSAPP_MAX_MESSAGES_PER_WINDOW", 120, 0)
WHATSAPP_OUTBOX_ENABLED = env_bool_any(("WHATSAPP_OUTBOX_ENABLED", "VoltKraf_WHATSAPP_OUTBOX_ENABLED", "VOLTCRAFT_WHATSAPP_OUTBOX_ENABLED"), True)
WHATSAPP_QUEUE_FAILED_MESSAGES = env_bool_any(("WHATSAPP_QUEUE_FAILED_MESSAGES", "VoltKraf_WHATSAPP_QUEUE_FAILED_MESSAGES", "VOLTCRAFT_WHATSAPP_QUEUE_FAILED_MESSAGES"), False)
WHATSAPP_DISCARD_PENDING_ON_RECOVERY = env_bool_any(("WHATSAPP_DISCARD_PENDING_ON_RECOVERY", "VoltKraf_WHATSAPP_DISCARD_PENDING_ON_RECOVERY", "VOLTCRAFT_WHATSAPP_DISCARD_PENDING_ON_RECOVERY"), True)
WHATSAPP_OUTBOX_RETRY_SECONDS = env_float_any(("WHATSAPP_OUTBOX_RETRY_SECONDS", "VoltKraf_WHATSAPP_OUTBOX_RETRY_SECONDS", "VOLTCRAFT_WHATSAPP_OUTBOX_RETRY_SECONDS"), 60.0, 10.0)
WHATSAPP_OUTBOX_MAX_RETRY_SECONDS = env_float_any(("WHATSAPP_OUTBOX_MAX_RETRY_SECONDS", "VoltKraf_WHATSAPP_OUTBOX_MAX_RETRY_SECONDS", "VOLTCRAFT_WHATSAPP_OUTBOX_MAX_RETRY_SECONDS"), 15 * 60, 60.0)
WHATSAPP_OUTBOX_MAX_ATTEMPTS = env_int_any(("WHATSAPP_OUTBOX_MAX_ATTEMPTS", "VoltKraf_WHATSAPP_OUTBOX_MAX_ATTEMPTS", "VOLTCRAFT_WHATSAPP_OUTBOX_MAX_ATTEMPTS"), 0, 0)
WHATSAPP_OUTBOX_BATCH_SIZE = env_int_any(("WHATSAPP_OUTBOX_BATCH_SIZE", "VoltKraf_WHATSAPP_OUTBOX_BATCH_SIZE", "VOLTCRAFT_WHATSAPP_OUTBOX_BATCH_SIZE"), 5, 1)
WHATSAPP_DOCUMENT_ENABLED = env_bool_any(("WHATSAPP_DOCUMENT_ENABLED", "VoltKraf_WHATSAPP_DOCUMENT_ENABLED", "VOLTCRAFT_WHATSAPP_DOCUMENT_ENABLED"), True)
WHATSAPP_DOCUMENT_TIMEOUT_DETIK = env_float_any(("WHATSAPP_DOCUMENT_TIMEOUT_SECONDS", "VoltKraf_WHATSAPP_DOCUMENT_TIMEOUT_SECONDS", "VOLTCRAFT_WHATSAPP_DOCUMENT_TIMEOUT_SECONDS"), 30.0, 5.0)
WHATSAPP_DOCUMENT_MIN_INTERVAL_DETIK = env_float_any(("WHATSAPP_DOCUMENT_MIN_INTERVAL_SECONDS", "VoltKraf_WHATSAPP_DOCUMENT_MIN_INTERVAL_SECONDS", "VOLTCRAFT_WHATSAPP_DOCUMENT_MIN_INTERVAL_SECONDS"), 10 * 60, 60.0)
WHATSAPP_DOCUMENT_DUPLICATE_TTL_DETIK = env_float_any(("WHATSAPP_DOCUMENT_DUPLICATE_TTL_SECONDS", "VoltKraf_WHATSAPP_DOCUMENT_DUPLICATE_TTL_SECONDS", "VOLTCRAFT_WHATSAPP_DOCUMENT_DUPLICATE_TTL_SECONDS"), 6 * 60 * 60, 60.0)
WHATSAPP_DOCUMENT_RATE_LIMIT_WINDOW_DETIK = env_float_any(("WHATSAPP_DOCUMENT_RATE_LIMIT_WINDOW_SECONDS", "VoltKraf_WHATSAPP_DOCUMENT_RATE_LIMIT_WINDOW_SECONDS", "VOLTCRAFT_WHATSAPP_DOCUMENT_RATE_LIMIT_WINDOW_SECONDS"), 60 * 60, 60.0)
WHATSAPP_DOCUMENT_MAX_PER_WINDOW = env_int_any(("WHATSAPP_DOCUMENT_MAX_PER_WINDOW", "VoltKraf_WHATSAPP_DOCUMENT_MAX_PER_WINDOW", "VOLTCRAFT_WHATSAPP_DOCUMENT_MAX_PER_WINDOW"), 6, 0)
WHATSAPP_DOCUMENT_SEND_DELAY = env_int_any(("WHATSAPP_DOCUMENT_SEND_DELAY", "VoltKraf_WHATSAPP_DOCUMENT_SEND_DELAY", "VOLTCRAFT_WHATSAPP_DOCUMENT_SEND_DELAY"), 2, 0)
WHATSAPP_GATEWAY_MODE = config_value(("WHATSAPP_GATEWAY_MODE", "VoltKraf_WHATSAPP_GATEWAY_MODE", "VOLTCRAFT_WHATSAPP_GATEWAY_MODE"), os.path.join(BASE_DIR, "whatsapp_gateway_mode.txt"), "waha").strip().lower() or "waha"
WAHA_BASE_URL = config_value(("WAHA_BASE_URL", "VoltKraf_WAHA_BASE_URL", "VOLTCRAFT_WAHA_BASE_URL"), os.path.join(BASE_DIR, "waha_base_url.txt"), "http://localhost:3000")
WAHA_API_KEY = config_value(("WAHA_API_KEY", "VoltKraf_WAHA_API_KEY", "VOLTCRAFT_WAHA_API_KEY"), os.path.join(BASE_DIR, "waha_api_key.txt"))
WAHA_SESSION = config_value(("WAHA_SESSION", "VoltKraf_WAHA_SESSION", "VOLTCRAFT_WAHA_SESSION"), os.path.join(BASE_DIR, "waha_session.txt"), "default")
WAHA_CHAT_ID = config_value(("WAHA_CHAT_ID", "VoltKraf_WAHA_CHAT_ID", "VOLTCRAFT_WAHA_CHAT_ID"), os.path.join(BASE_DIR, "waha_chat_id.txt"), WHATSAPP_GROUP_NUMBER)
WAHA_SEND_TEXT_PATH = env_any(("WAHA_SEND_TEXT_PATH", "VoltKraf_WAHA_SEND_TEXT_PATH", "VOLTCRAFT_WAHA_SEND_TEXT_PATH"), "/api/sendText") or "/api/sendText"
WAHA_SEND_FILE_PATH = env_any(("WAHA_SEND_FILE_PATH", "VoltKraf_WAHA_SEND_FILE_PATH", "VOLTCRAFT_WAHA_SEND_FILE_PATH"), "/api/sendFile") or "/api/sendFile"
TELEGRAM_ENABLED = env_bool_any(("TELEGRAM_ENABLED", "VoltKraf_TELEGRAM_ENABLED", "VOLTCRAFT_TELEGRAM_ENABLED"), True)
TELEGRAM_BOT_TOKEN = config_value(("TELEGRAM_BOT_TOKEN", "VoltKraf_TELEGRAM_BOT_TOKEN", "VOLTCRAFT_TELEGRAM_BOT_TOKEN"), os.path.join(BASE_DIR, "telegram_token.txt"))
TELEGRAM_CHAT_ID = config_value(("TELEGRAM_CHAT_ID", "VoltKraf_TELEGRAM_CHAT_ID", "VOLTCRAFT_TELEGRAM_CHAT_ID"), os.path.join(BASE_DIR, "telegram_chat_id.txt"))
TELEGRAM_API_BASE_URL = env_any(("TELEGRAM_API_BASE_URL", "VoltKraf_TELEGRAM_API_BASE_URL", "VOLTCRAFT_TELEGRAM_API_BASE_URL"), "https://api.telegram.org") or "https://api.telegram.org"
TELEGRAM_TIMEOUT_DETIK = env_float_any(("TELEGRAM_TIMEOUT_SECONDS", "VoltKraf_TELEGRAM_TIMEOUT_SECONDS", "VOLTCRAFT_TELEGRAM_TIMEOUT_SECONDS"), 10.0, 1.0)
TELEGRAM_MAX_MESSAGE_LENGTH = env_int_any(("TELEGRAM_MAX_MESSAGE_LENGTH", "VoltKraf_TELEGRAM_MAX_MESSAGE_LENGTH", "VOLTCRAFT_TELEGRAM_MAX_MESSAGE_LENGTH"), 3900, 200)
TELEGRAM_DOCUMENT_CAPTION_MAX_LENGTH = env_int_any(("TELEGRAM_DOCUMENT_CAPTION_MAX_LENGTH", "VoltKraf_TELEGRAM_DOCUMENT_CAPTION_MAX_LENGTH", "VOLTCRAFT_TELEGRAM_DOCUMENT_CAPTION_MAX_LENGTH"), 1000, 100)
TELEGRAM_PARSE_MODE = env_any(("TELEGRAM_PARSE_MODE", "VoltKraf_TELEGRAM_PARSE_MODE", "VOLTCRAFT_TELEGRAM_PARSE_MODE"), "")
SECONDARY_NOTIFICATION_DUPLICATE_TTL_DETIK = env_float_any(("SECONDARY_NOTIFICATION_DUPLICATE_TTL_SECONDS", "VoltKraf_SECONDARY_NOTIFICATION_DUPLICATE_TTL_SECONDS", "VOLTCRAFT_SECONDARY_NOTIFICATION_DUPLICATE_TTL_SECONDS"), 6 * 60 * 60, 60.0)
SECONDARY_CONNECTION_NOTICE_TTL_DETIK = env_float_any(("SECONDARY_CONNECTION_NOTICE_TTL_SECONDS", "VoltKraf_SECONDARY_CONNECTION_NOTICE_TTL_SECONDS", "VOLTCRAFT_SECONDARY_CONNECTION_NOTICE_TTL_SECONDS"), 12 * 60 * 60, 60.0)
SECONDARY_DOCUMENT_DUPLICATE_TTL_DETIK = env_float_any(("SECONDARY_DOCUMENT_DUPLICATE_TTL_SECONDS", "VoltKraf_SECONDARY_DOCUMENT_DUPLICATE_TTL_SECONDS", "VOLTCRAFT_SECONDARY_DOCUMENT_DUPLICATE_TTL_SECONDS"), 24 * 60 * 60, 60.0)
SUPABASE_ENABLED = env_bool_any(("SUPABASE_ENABLED", "VoltKraf_SUPABASE_ENABLED", "VOLTCRAFT_SUPABASE_ENABLED"), True)
SUPABASE_URL = config_value(("SUPABASE_URL", "VoltKraf_SUPABASE_URL", "VOLTCRAFT_SUPABASE_URL"), os.path.join(BASE_DIR, "supabase_url.txt"))
SUPABASE_API_KEY = config_value(("SUPABASE_API_KEY", "VoltKraf_SUPABASE_API_KEY", "VOLTCRAFT_SUPABASE_API_KEY"), os.path.join(BASE_DIR, "supabase_api_key.txt"))
SUPABASE_NOTIFICATIONS_TABLE = env_any(("SUPABASE_NOTIFICATIONS_TABLE", "VoltKraf_SUPABASE_NOTIFICATIONS_TABLE", "VOLTCRAFT_SUPABASE_NOTIFICATIONS_TABLE"), "voltkraft_notifications") or "voltkraft_notifications"
SUPABASE_TIMEOUT_DETIK = env_float_any(("SUPABASE_TIMEOUT_SECONDS", "VoltKraf_SUPABASE_TIMEOUT_SECONDS", "VOLTCRAFT_SUPABASE_TIMEOUT_SECONDS"), 10.0, 1.0)
SUPABASE_EDGE_ENABLED = env_bool_any(("SUPABASE_EDGE_ENABLED", "VoltKraf_SUPABASE_EDGE_ENABLED", "VOLTCRAFT_SUPABASE_EDGE_ENABLED"), True)
SUPABASE_EDGE_FUNCTION_URL = config_value(
    ("SUPABASE_EDGE_FUNCTION_URL", "TELEGRAM_SUPABASE_WEBHOOK_URL", "VoltKraf_SUPABASE_EDGE_FUNCTION_URL", "VOLTCRAFT_SUPABASE_EDGE_FUNCTION_URL"),
    os.path.join(BASE_DIR, "telegram_supabase_webhook_url.txt"),
)
SUPABASE_EDGE_SECRET = config_value(
    ("SUPABASE_EDGE_SECRET", "TELEGRAM_WEBHOOK_SECRET", "VoltKraf_SUPABASE_EDGE_SECRET", "VOLTCRAFT_SUPABASE_EDGE_SECRET"),
    os.path.join(BASE_DIR, "telegram_webhook_secret.txt"),
)
SUPABASE_EDGE_SOURCE = env_any(("SUPABASE_EDGE_SOURCE", "VoltKraf_SUPABASE_EDGE_SOURCE", "VOLTCRAFT_SUPABASE_EDGE_SOURCE"), "direct_voltkraft") or "direct_voltkraft"
SUPABASE_EDGE_SENDER = env_any(("SUPABASE_EDGE_SENDER", "VoltKraf_SUPABASE_EDGE_SENDER", "VOLTCRAFT_SUPABASE_EDGE_SENDER"), APP_BRAND_NAME) or APP_BRAND_NAME
PQM_ITIC_PDF_ENABLED = env_bool_any(("PQM_ITIC_PDF_ENABLED", "VoltKraf_PQM_ITIC_PDF_ENABLED", "VOLTCRAFT_PQM_ITIC_PDF_ENABLED"), True)
PQM_ITIC_PDF_COOLDOWN_DETIK = env_float_any(("PQM_ITIC_PDF_COOLDOWN_SECONDS", "VoltKraf_PQM_ITIC_PDF_COOLDOWN_SECONDS", "VOLTCRAFT_PQM_ITIC_PDF_COOLDOWN_SECONDS"), 10 * 60, 60.0)
PQM_ITIC_PDF_MIN_DURATION_DETIK = env_float_any(("PQM_ITIC_PDF_MIN_DURATION_SECONDS", "VoltKraf_PQM_ITIC_PDF_MIN_DURATION_SECONDS", "VOLTCRAFT_PQM_ITIC_PDF_MIN_DURATION_SECONDS"), 0.2, 0.0)
PQM_ION_XML_MAX_BYTES = env_int_any(("PQM_ION_XML_MAX_BYTES", "VoltKraf_PQM_ION_XML_MAX_BYTES", "VOLTCRAFT_PQM_ION_XML_MAX_BYTES"), 50 * 1024 * 1024, 1024)
PQM_PME_REPORT_ENABLED = env_bool_any(("PQM_PME_REPORT_ENABLED", "VoltKraf_PQM_PME_REPORT_ENABLED", "VOLTCRAFT_PQM_PME_REPORT_ENABLED"), True)
PQM_PME_REPORT_BASE_URL = config_value(("PQM_PME_REPORT_BASE_URL", "VoltKraf_PQM_PME_REPORT_BASE_URL", "VOLTCRAFT_PQM_PME_REPORT_BASE_URL"), os.path.join(BASE_DIR, "pme_report_base_url.txt"), "http://10.89.1.76")
PQM_PME_REPORT_COOKIE = config_value(("PQM_PME_REPORT_COOKIE", "VoltKraf_PQM_PME_REPORT_COOKIE", "VOLTCRAFT_PQM_PME_REPORT_COOKIE"), os.path.join(BASE_DIR, "pme_report_cookie.txt"))
PQM_PME_REPORT_USERNAME = config_value(("PQM_PME_REPORT_USERNAME", "VoltKraf_PQM_PME_REPORT_USERNAME", "VOLTCRAFT_PQM_PME_REPORT_USERNAME"), os.path.join(BASE_DIR, "pme_username.txt"))
PQM_PME_REPORT_PASSWORD = config_value(("PQM_PME_REPORT_PASSWORD", "VoltKraf_PQM_PME_REPORT_PASSWORD", "VOLTCRAFT_PQM_PME_REPORT_PASSWORD"), os.path.join(BASE_DIR, "pme_password.txt"))
PQM_PME_REPORT_SOURCE_FILE = os.path.join(BASE_DIR, "pme_pqm_sources.json")
PQM_PME_REPORT_TIMEOUT_DETIK = env_float_any(("PQM_PME_REPORT_TIMEOUT_SECONDS", "VoltKraf_PQM_PME_REPORT_TIMEOUT_SECONDS", "VOLTCRAFT_PQM_PME_REPORT_TIMEOUT_SECONDS"), 45.0, 10.0)
PQM_PME_REPORT_COOLDOWN_DETIK = env_float_any(("PQM_PME_REPORT_COOLDOWN_SECONDS", "VoltKraf_PQM_PME_REPORT_COOLDOWN_SECONDS", "VOLTCRAFT_PQM_PME_REPORT_COOLDOWN_SECONDS"), 10 * 60, 60.0)
PQM_PME_REPORT_ID = env_any(("PQM_PME_REPORT_ID", "VoltKraf_PQM_PME_REPORT_ID", "VOLTCRAFT_PQM_PME_REPORT_ID"), "91") or "91"
PQM_PME_REPORT_PERIOD_CODE = env_any(("PQM_PME_REPORT_PERIOD_CODE", "VoltKraf_PQM_PME_REPORT_PERIOD_CODE", "VOLTCRAFT_PQM_PME_REPORT_PERIOD_CODE"), "2") or "2"
PQM_PME_REPORT_TIMEZONE_CODE = env_any(("PQM_PME_REPORT_TIMEZONE_CODE", "VoltKraf_PQM_PME_REPORT_TIMEZONE_CODE", "VOLTCRAFT_PQM_PME_REPORT_TIMEZONE_CODE"), "-100") or "-100"
PQM_PME_REPORT_INCIDENT_INTERVAL = env_any(("PQM_PME_REPORT_INCIDENT_INTERVAL", "VoltKraf_PQM_PME_REPORT_INCIDENT_INTERVAL", "VOLTCRAFT_PQM_PME_REPORT_INCIDENT_INTERVAL"), "20") or "20"
PQM_PME_REPORT_Y_AXIS_MAX = env_any(("PQM_PME_REPORT_Y_AXIS_MAX", "VoltKraf_PQM_PME_REPORT_Y_AXIS_MAX", "VOLTCRAFT_PQM_PME_REPORT_Y_AXIS_MAX"), "500") or "500"
PQM_PME_SCAN_ENABLED = env_bool_any(("PQM_PME_SCAN_ENABLED", "VoltKraf_PQM_PME_SCAN_ENABLED", "VOLTCRAFT_PQM_PME_SCAN_ENABLED"), True)
PQM_PME_SCAN_INTERVAL_DETIK = env_int_any(("PQM_PME_SCAN_INTERVAL_SECONDS", "VoltKraf_PQM_PME_SCAN_INTERVAL_SECONDS", "VOLTCRAFT_PQM_PME_SCAN_INTERVAL_SECONDS"), 10 * 60, 60)
PQM_PME_SCAN_FIRST_RUN_SEND = env_bool_any(("PQM_PME_SCAN_FIRST_RUN_SEND", "VoltKraf_PQM_PME_SCAN_FIRST_RUN_SEND", "VOLTCRAFT_PQM_PME_SCAN_FIRST_RUN_SEND"), False)
PQM_PME_REPORT_ROUTE = "/generated-pme-pdf"
PQM_PME_REPORT_DIR = os.path.join(BASE_DIR, "runtime-localhost", "pme-pdf")
WHATSAPP_CONNECTION_STATE_KEY = "whatsapp_connection_state"
WHATSAPP_RECOVERY_RECAP_PENDING_KEY = "whatsapp_recovery_recap_pending"
PANDU_GI_API_KEY_ENV = ("PANDU_GI_API_KEY", "VoltKraf_PANDU_GI_API_KEY", "VOLTCRAFT_PANDU_GI_API_KEY")
PANDU_GI_API_KEY_FILE = os.path.join(BASE_DIR, "pandu_gi_api_key.txt")
DEVICE_ALLOWED_NETWORKS_RAW = env_any(("VoltKraf_DEVICE_ALLOWED_NETWORKS", "VOLTCRAFT_DEVICE_ALLOWED_NETWORKS"), "10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,127.0.0.0/8")
DEVICE_ALLOWED_PORTS_RAW = env_any(("VoltKraf_DEVICE_ALLOWED_PORTS", "VOLTCRAFT_DEVICE_ALLOWED_PORTS"), "80,102,443,502")

def parse_allowed_networks(raw_value):
    networks = []
    for item in str(raw_value or "").split(","):
        token = item.strip()
        if not token:
            continue
        try:
            networks.append(ipaddress.ip_network(token, strict=False))
        except ValueError:
            print(f"[SECURITY WARNING] DEVICE_ALLOWED_NETWORKS mengabaikan network tidak valid: {token}")
    return tuple(networks)

def parse_allowed_ports(raw_value):
    ports = set()
    for item in str(raw_value or "").split(","):
        token = item.strip()
        if not token:
            continue
        try:
            port = int(token)
            if 1 <= port <= 65535:
                ports.add(port)
        except ValueError:
            print(f"[SECURITY WARNING] DEVICE_ALLOWED_PORTS mengabaikan port tidak valid: {token}")
    return ports

DEVICE_ALLOWED_NETWORKS = parse_allowed_networks(DEVICE_ALLOWED_NETWORKS_RAW)
DEVICE_ALLOWED_PORTS = parse_allowed_ports(DEVICE_ALLOWED_PORTS_RAW)

def extract_host_from_address(address):
    value = str(address or "").strip()
    if not value:
        return ""
    if "://" in value:
        parsed = urlparse(value)
        return parsed.hostname or ""
    if value.startswith("[") and "]" in value:
        return value[1:value.index("]")]
    if value.count(":") == 1:
        host, possible_port = value.rsplit(":", 1)
        if possible_port.isdigit():
            return host
    return value

def extract_port_from_address(address, fallback_port):
    value = str(address or "").strip()
    if "://" in value:
        parsed = urlparse(value)
        if parsed.port:
            return parsed.port
        return 443 if parsed.scheme == "https" else 80
    try:
        return int(fallback_port)
    except (TypeError, ValueError):
        return 0

def ensure_device_endpoint_allowed(address, fallback_port, label="perangkat"):
    host = extract_host_from_address(address)
    if not host:
        raise HTTPException(status_code=400, detail=f"Alamat {label} wajib diisi.")

    port = extract_port_from_address(address, fallback_port)
    if port not in DEVICE_ALLOWED_PORTS:
        raise HTTPException(status_code=400, detail=f"Port {label} {port} tidak diizinkan oleh allowlist dashboard.")

    try:
        host_ip = ipaddress.ip_address(host)
    except ValueError:
        raise HTTPException(status_code=400, detail=f"Alamat {label} harus berupa IP, bukan hostname.")

    if DEVICE_ALLOWED_NETWORKS and not any(host_ip in network for network in DEVICE_ALLOWED_NETWORKS):
        raise HTTPException(status_code=400, detail=f"IP {label} {host_ip} di luar allowlist dashboard.")

    return True

def read_text_file(path):
    if os.path.exists(path):
        with open(path, "r") as f:
            return f.read().strip()
    return ""

def write_text_file(path, value):
    with open(path, "w") as f:
        f.write(value)
    try:
        os.chmod(path, 0o600)
    except OSError:
        pass

def load_secret(env_name, file_path, default=""):
    env_value = env_any(env_name, "")
    if env_value:
        return env_value
    file_value = read_text_file(file_path)
    if file_value:
        return file_value
    if default:
        write_text_file(file_path, default)
    return default

def write_admin_credentials(credentials):
    with open(ADMIN_CREDENTIALS_FILE, "w") as f:
        json.dump(credentials, f, indent=2)
    try:
        os.chmod(ADMIN_CREDENTIALS_FILE, 0o600)
    except OSError:
        pass

def build_admin_password_record(password):
    salt = secrets.token_hex(16)
    password_hash = hashlib.pbkdf2_hmac(
        "sha256",
        str(password or "").encode("utf-8"),
        salt.encode("utf-8"),
        ADMIN_PASSWORD_HASH_ITERATIONS,
    ).hex()
    return {
        "password_hash": password_hash,
        "salt": salt,
        "iterations": ADMIN_PASSWORD_HASH_ITERATIONS,
        "scheme": "pbkdf2_sha256",
    }

def build_admin_credentials(username, password):
    return {
        "username": str(username or "").strip(),
        **build_admin_password_record(password),
    }

def verify_admin_password(password, credentials):
    if credentials.get("password_hash") and credentials.get("salt"):
        try:
            iterations = int(credentials.get("iterations") or ADMIN_PASSWORD_HASH_ITERATIONS)
            candidate_hash = hashlib.pbkdf2_hmac(
                "sha256",
                str(password or "").encode("utf-8"),
                str(credentials.get("salt") or "").encode("utf-8"),
                iterations,
            ).hex()
            return secrets.compare_digest(candidate_hash, str(credentials.get("password_hash") or ""))
        except Exception:
            return False
    return secrets.compare_digest(str(password or ""), str(credentials.get("password") or ""))

def load_or_create_admin_credentials():
    env_username = env_any(ADMIN_USERNAME_ENVS, "")
    env_password = env_any(ADMIN_PASSWORD_ENVS, "")
    if env_username and env_password:
        return {"username": env_username, "password": env_password}

    if os.path.exists(ADMIN_CREDENTIALS_FILE):
        try:
            with open(ADMIN_CREDENTIALS_FILE, "r") as f:
                data = json.load(f)
            username = str(data.get("username", "")).strip()
            password_hash = str(data.get("password_hash", "")).strip()
            salt = str(data.get("salt", "")).strip()
            if username and password_hash and salt:
                return data
            password = str(data.get("password", "")).strip()
            if username and password:
                credentials = build_admin_credentials(username, password)
                write_admin_credentials(credentials)
                print("[AUTH] Credential admin plaintext dimigrasikan ke hash lokal.")
                return credentials
        except Exception as exc:
            print(f"[AUTH WARNING] Gagal membaca credential admin: {exc}")

    credentials = build_admin_credentials("DCMonitor", f"vc_admin_{secrets.token_urlsafe(18)}")
    write_admin_credentials(credentials)
    return credentials

def get_allowed_origins():
    raw_value = env_any(("VoltKraf_CORS_ORIGINS", "VOLTCRAFT_CORS_ORIGINS"), "")
    if raw_value.strip():
        origins = []
        for origin in raw_value.split(","):
            origin = origin.strip().rstrip("/")
            if not origin:
                continue
            if origin in {"*", "null"}:
                print("[SECURITY WARNING] CORS origin wildcard/null diabaikan karena credential cookie aktif.")
                continue
            parsed = urlparse(origin)
            if parsed.scheme not in {"http", "https"} or not parsed.netloc:
                print(f"[SECURITY WARNING] CORS origin tidak valid diabaikan: {origin}")
                continue
            origins.append(origin)
        if origins:
            return origins
    return [
        "http://127.0.0.1:8000",
        "http://localhost:8000",
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ]

def client_error_message(label, exc=None):
    if exc:
        print(f"[{label}] {exc.__class__.__name__}: {exc}")
    return f"{label} gagal. Periksa koneksi, konfigurasi IP/port, dan mapping perangkat."

def create_session_token():
    return secrets.token_urlsafe(32)

def session_key_from_cookie(session_token):
    return f"admin_session::{session_token}"

def is_session_valid(session_token):
    if not session_token:
        return False

    with app_locks["auth"]:
        session_record = app_state["auth_sessions"].get(session_token)
        if not session_record:
            db_key = session_key_from_cookie(session_token)
            session_value = db.get_setting(db_key, "")
            if not session_value:
                return False
            try:
                session_record = json.loads(session_value)
            except Exception:
                return False

        expires_at = float(session_record.get("expires_at") or 0)
        if expires_at <= time.time():
            app_state["auth_sessions"].pop(session_token, None)
            db.delete_setting(session_key_from_cookie(session_token))
            return False
        return True

def register_session(username):
    session_token = create_session_token()
    expires_at = time.time() + SESSION_TTL_SECONDS
    session_record = {
        "username": username,
        "created_at": time.time(),
        "expires_at": expires_at,
    }
    with app_locks["auth"]:
        app_state["auth_sessions"][session_token] = session_record
        db.set_setting(session_key_from_cookie(session_token), json.dumps(session_record))
    return session_token, expires_at

def revoke_session(session_token):
    if not session_token:
        return
    with app_locks["auth"]:
        app_state["auth_sessions"].pop(session_token, None)
        db.delete_setting(session_key_from_cookie(session_token))

def load_or_create_pandu_gi_api_key():
    env_key = env_any(PANDU_GI_API_KEY_ENV, "")
    if env_key:
        return env_key

    saved_key = read_text_file(PANDU_GI_API_KEY_FILE)
    if saved_key:
        return saved_key

    new_key = f"vc_pandu_gi_{secrets.token_urlsafe(32)}"
    write_text_file(PANDU_GI_API_KEY_FILE, new_key)
    return new_key

PANDU_GI_API_KEY = load_or_create_pandu_gi_api_key()
ADMIN_CREDENTIALS = load_or_create_admin_credentials()

def normalize_pqm_type(value):
    if isinstance(value, dict):
        value = value.get("pqm_type")
    pqm_type = str(value or PQM_TYPE_ION7650).strip().lower()
    if pqm_type not in {PQM_TYPE_ION7650, PQM_TYPE_ION9000}:
        return PQM_TYPE_ION7650
    return pqm_type

ANNUNCIATOR_SOURCES = [
    {
        "id": "gi-cikarang-listrindo-1",
        "source_name": "GI Cikarang",
        "bay_name": "Bay C. Listrindo 1",
        "ip": "172.20.17.133",
        "api_url": "http://172.20.17.133/cgi-bin/ipcxml.cgi?dis:dis/data/fr_data",
        "type": "qualitrol",
        "target_alarm": None,
        "qualitrol_mapping": {
            1: "LP OPRT",
            2: "OCR OPRT",
            3: "GFR OPRT",
            4: "CBF OPRT",
            5: "INTER TRIP",
            6: "COM FAIL",
            7: "CB POLE DISCREPANCY",
            8: "TRIP PHASA R",
            9: "TRIP PHASA S",
            10: "TRIP PHASA T",
            11: "CB OPEN",
            12: "CVT FAIL",
        }
    },
    {
        "id": "gi-cikarang-listrindo-2",
        "source_name": "GI Cikarang",
        "bay_name": "Bay C. Listrindo 2",
        "ip": "172.20.17.133",
        "api_url": "http://172.20.17.133/cgi-bin/ipcxml.cgi?dis:dis/data/fr_data",
        "type": "qualitrol",
        "target_alarm": None,
        "qualitrol_mapping": {
            33: "LP OPRT",
            34: "OCR OPRT",
            35: "GFR OPRT",
            36: "CBF OPRT",
            37: "INTER TRIP",
            38: "COM FAIL",
            39: "CB POLE DISCREPANCY",
            40: "TRIP PHASA R",
            41: "TRIP PHASA S",
            42: "TRIP PHASA T",
            43: "CB OPEN",
            44: "CVT FAIL",
        }
    },
    {
        "id": "gi-cikarang-trafo-3",
        "source_name": "GI Cikarang",
        "bay_name": "Bay Trafo 3",
        "ip": "172.20.17.156",
        "api_url": "http://172.20.17.156/das/api/item/48",
        "target_alarm": ANNUNCIATOR_TARGET_ALARM,
    },
    {
        "id": "gi-cikarang-jababeka-1",
        "source_name": "GI Cikarang",
        "bay_name": "Bay Jababeka 1",
        "ip": "172.20.17.157",
        "api_url": "http://172.20.17.157/das/api/item/28",
        "target_alarm": None,
    },
    {
        "id": "gi-jababeka-mulia-keramik",
        "source_name": "GI Jababeka",
        "bay_name": "Bay Mulia Keramik",
        "ip": "172.20.21.151",
        "api_url": "http://172.20.21.151/cgi-bin/ipcxml.cgi?dis:dis/data/fr_data",
        "type": "qualitrol",
        "target_alarm": None,
        "qualitrol_mapping": {
            1: "LINE CURRENT DIFF PROT OPRT",
            2: "DIRECTIONAL O/C, E/F PROT OPRT",
            3: "CB POLE DISCREPANCY OPRT",
            4: "TRIPPING BUSBAR PROT",
            5: "CB OPEN POSITION",
            6: "CB CLOSING LOCKOUT DRIVE",
            7: "CB SF6 LOW ALARM",
            8: "CB OPERATING LOCKOUT SF6",
            9: "DC SUPPLY FAILURE",
            10: "AC SUPPLY FAILURE",
            11: "CB OPEN STATUS PHASA R",
            12: "CB OPEN STATUS PHASA S",
            13: "CB OPEN STATUS PHASA T",
        }
    },
    {
        "id": "gi-cikarang-rajapaksi-1",
        "source_name": "GI Cikarang",
        "bay_name": "Bay Rajapaksi 1",
        "ip": "172.20.17.151",
        "api_url": "http://172.20.17.151/cgi-bin/ipcxml.cgi?dis:dis/data/fr_data",
        "type": "qualitrol",
        "target_alarm": None,
        "qualitrol_mapping": {
            1: "LINE DIFF OPRT R.PAKSI 1",
            2: "OCR PROT OPRT R.PAKSI 1",
            3: "GFR PROT OPRT R.PAKSI 1",
            4: "CB POLE DISCREPANCY R.PAKSI 1",
            5: "CB OPEN R.PAKSI 1",
            6: "SF6 1st STAGE R.PAKSI 1",
            7: "SF6 2nd STAGE R.PAKSI 1",
            8: "AR IN PROGRESS R.PAKSI 1",
            9: "AR LOCKOUT R.PAKSI 1",
            10: "TRIP BUSPRO (KLG1A) R.PAKSI 1",
            11: "LOCKOUT (KLG 2A) R.PAKSI 1",
            12: "DIST Z1 OPRT R.PAKSI 1",
            13: "DIST Z2 OPRT R.PAKSI 1",
            14: "DIST Z3 OPRT R.PAKSI 1",
            15: "FAULT PHASE R R.PAKSI 1",
            16: "FAULT PHASE S R.PAKSI 1",
            17: "FAULT PHASE T R.PAKSI 1",
        }
    },
    {
        "id": "gi-cikarang-rajapaksi-2",
        "source_name": "GI Cikarang",
        "bay_name": "Bay Rajapaksi 2",
        "ip": "172.20.17.155",
        "api_url": "http://172.20.17.155/das/api/item/28",
        "target_alarm": None,
    },
    {
        "id": "gi-cikarang-kopel-150kv",
        "source_name": "GI Cikarang",
        "bay_name": "Bay Kopel 150kV",
        "ip": "172.20.17.153",
        "api_url": "http://172.20.17.153/das/api/item/28",
        "target_alarm": None,
    },
    {
        "id": "gi-poncol-baru-kopel-150kv",
        "source_name": "GI Poncol Baru",
        "bay_name": "Bay Kopel 150kV",
        "ip": "172.20.27.154",
        "api_url": "http://172.20.27.154/das/api/item/28",
        "target_alarm": None,
    },
    {
        "id": "gi-fajar-sw-cikarang-1",
        "source_name": "GI Fajar SW",
        "bay_name": "Bay Cikarang 1",
        "ip": "172.20.19.151",
        "api_url": "http://172.20.19.151/cgi-bin/ipcxml.cgi?dis:dis/data/fr_data",
        "type": "qualitrol",
        "target_alarm": None,
        "qualitrol_mapping": {
            1: "TCS FAIL CKRNG1",
            2: "BUSBAR TRIP CKRNG1",
            3: "LP SEND CKRNG1",
            4: "LP RECV CKRNG1",
            5: "MAIN PROT OPRT CKRNG1",
            6: "CB CLOSE CKRNG1",
            7: "CB OPEN CKRNG1",
            8: "SF6 ALARM CKRNG1",
            9: "SF6 TRIP CKRNG1",
            10: "VT LINE TRIP CKRNG1",
            11: "CB POLE DISCREPANCY CKRNG1",
            12: "AR IN ROGRESS CKRNG1",
            13: "BACKUP OPRT CKRNG1",
            14: "DIST Z1 CKRNG1",
            15: "DIST Z2 CKRNG1",
            16: "DIST Z3 CKRNG1",
        }
    },
    {
        "id": "gi-fajar-sw-cikarang-2",
        "source_name": "GI Fajar SW",
        "bay_name": "Bay Cikarang 2",
        "ip": "172.20.19.151",
        "api_url": "http://172.20.19.151/cgi-bin/ipcxml.cgi?dis:dis/data/fr_data",
        "type": "qualitrol",
        "target_alarm": None,
        "qualitrol_mapping": {
            33: "TCS FAIL CKRNG2",
            34: "BUSBAR TRIP CKRNG2",
            35: "LP SEND CKRNG2",
            36: "LP RECV CKRNG2",
            37: "MAIN PROT OPRT CKRNG2",
            38: "CB CLOSE CKRNG2",
            39: "CB OPEN CKRNG2",
            40: "SF6 ALARM CKRNG2",
            41: "SF6 TRIP CKRNG2",
            42: "VT LINE TRIP CKRNG2",
            43: "CB POLE DISCREPANCY CKRNG2",
            44: "AR IN PROGRESS CKRNG2",
            45: "BACKUP OPRT CKRNG2",
            46: "DIST Z1 CKRNG2",
            47: "DIST Z2 CKRNG2",
            48: "DIST Z3 CKRNG2",
            49: "TRIP PHASA R CKRNG2",
            50: "TRIP PHASA S CKRNG2",
            51: "TRIP PHASA T CKRNG2",
        }
    },
    {
        "id": "gi-tambun-new-tambun-1",
        "source_name": "GI Tambun",
        "bay_name": "Bay New Tambun 1",
        "ip": "172.20.31.12",
        "api_url": "http://172.20.31.12/cgi-bin/ipcxml.cgi?dis:dis/data/fr_data",
        "type": "qualitrol",
        "target_alarm": None,
        "qualitrol_mapping": {
            1: "CB OPEN NEW TAMBUN 1",
            2: "MAIN PROT NEW TAMBUN 1",
            3: "BACK UP PROT NEW TAMBUN 1",
            4: "F21 RECEIVE NEW TAMBUN 1",
            5: "SF6 2ND STAGE NEW TAMBUN 1",
            6: "F21 SENDING NEW TAMBUN 1",
            7: "A/R IN PROGRESS NEW TAMBUN 1",
            8: "OLS OPRT NEW TAMBUN 1",
        }
    },
    {
        "id": "gi-tambun-new-tambun-2",
        "source_name": "GI Tambun",
        "bay_name": "Bay New Tambun 2",
        "ip": "172.20.31.12",
        "api_url": "http://172.20.31.12/cgi-bin/ipcxml.cgi?dis:dis/data/fr_data",
        "type": "qualitrol",
        "target_alarm": None,
        "qualitrol_mapping": {
            33: "CB OPEN NEW TAMBUN 2",
            34: "MAIN PROT NEW TAMBUN 2",
            35: "BACK UP PROT NEW TAMBUN 2",
            36: "F21 RECEIVE NEW TAMBUN 2",
            37: "SF6 2ND STAGE NEW TAMBUN 2",
            38: "F21 SENDING NEW TAMBUN 2",
            39: "A/R IN PROGRESS NEW TAMBUN 2",
            40: "OLS OPRT NEW TAMBUN 2",
        }
    },
    {
        "id": "gi-rajapaksi-gandamekar-1",
        "source_name": "GI Rajapaksi",
        "bay_name": "Bay Gandamekar 1",
        "ip": "172.20.29.6",
        "api_url": "http://172.20.29.6/cgi-bin/ipcxml.cgi?dis:dis/data/fr_data",
        "type": "qualitrol",
        "target_alarm": None,
        "qualitrol_mapping": {
            33: "87L GENERAL TRIP OPRT GANDA MEKA",
            34: "AUTORECLOSE IN PROGRESS GANDA ME",
            35: "87L OPRT POLE A GANDA MEKAR1",
            36: "87L OPRT POLE B GANDA MEKAR1",
            37: "87L OPRT POLE C GANDA MEKAR1",
            38: "50/51,50N/51N OPRT GANDA MEKAR1",
            39: "DTT RECEIVE FROM REMOTE END GAND",
            40: "CB OPEN POLE A GANDA MEKAR1",
            41: "CB OPEN POLE B GANDA MEKAR1",
            42: "CB OPEN POLE C GANDA MEKAR1",
        }
    },
    {
        "id": "gi-rajapaksi-gandamekar-2",
        "source_name": "GI Rajapaksi",
        "bay_name": "Bay Gandamekar 2",
        "ip": "172.20.29.6",
        "api_url": "http://172.20.29.6/cgi-bin/ipcxml.cgi?dis:dis/data/fr_data",
        "type": "qualitrol",
        "target_alarm": None,
        "qualitrol_mapping": {
            1: "87L GENERAL TRIP OPRT GANDA MEKA",
            2: "AUTORECLOSE IN PROGRESS GANDA ME",
            3: "87L OPRT POLE A GANDA MEKAR2",
            4: "87L OPRT POLE B GANDA MEKAR2",
            5: "87L OPRT POLE C GANDA MEKAR2",
            6: "50/51,50N/51N OPRT GANDA MEKAR2",
            7: "DTT RECEIVE FROM REMOTE END GAND",
            9: "CB OPEN GANDA MEKAR2",
        }
    },
    {
        "id": "gi-rajapaksi-konsumen-1",
        "source_name": "GI Rajapaksi",
        "bay_name": "Bay Konsumen 1",
        "ip": "172.20.29.4",
        "api_url": "http://172.20.29.4/cgi-bin/ipcxml.cgi?dis:dis/data/fr_data",
        "type": "qualitrol",
        "target_alarm": None,
        "qualitrol_mapping": {
            33: "87L GENERAL TRIP OPRT KONSUMEN1",
            34: "AUTORECLOSE IN PROG KONSUMEN1",
            35: "87L OPRT KONSUMEN1",
            36: "50/51,50N/51N OPRT KONSUMEN1",
            37: "DTT RCV FROM REMOTE END KONS1",
            38: "CB OPEN KONSUMEN1",
        }
    },
    {
        "id": "gi-rajapaksi-konsumen-2",
        "source_name": "GI Rajapaksi",
        "bay_name": "Bay Konsumen 2",
        "ip": "172.20.29.4",
        "api_url": "http://172.20.29.4/cgi-bin/ipcxml.cgi?dis:dis/data/fr_data",
        "type": "qualitrol",
        "target_alarm": None,
        "qualitrol_mapping": {
            1: "87L GENERAL TRIP OPRT KONSUMEN12",
            2: "AUTORECLOSE IN PROG KONSUMEN2",
            3: "87L OPRT KONSUMEN2",
            4: "50/51,50N/51N OPRT KONSUMEN2",
            5: "DTT RCV FROM REMOTE END KONS2",
            6: "CB OPEN KONSUMEN2",
        }
    },
    {
        "id": "gi-rajapaksi-trafo-2",
        "source_name": "GI Rajapaksi",
        "bay_name": "Bay Trafo 2",
        "ip": "172.20.29.8",
        "api_url": "http://172.20.29.8/cgi-bin/ipcxml.cgi?dis:dis/data/fr_data",
        "type": "qualitrol",
        "target_alarm": None,
        "qualitrol_mapping": {
            1: "MAIN PROT OPRT",
            2: "REF HV OPRT",
            3: "REF LV OPRT",
            4: "OC HV OPRT",
            5: "OC LV OPRT",
            6: "SBEF OPRT",
            7: "BUCHOLZ ALARM",
            8: "BUCHOLZ TRIP",
            9: "JANSEN",
            10: "OTI ALARM",
            11: "OTI TRIP",
            12: "WTI HV/LV ALARM",
            13: "WTI HV TRIP",
            14: "WTI LV TRIP",
            15: "PRD MAINTANK TRIP",
            16: "PRD OLTC TRIP",
            17: "CB HV OPEN",
            18: "CB HV CLOSE",
            19: "CB LV OPEN",
            20: "CB LV CLOSE",
        }
    },
    {
        "id": "gi-rajapaksi-trafo-1",
        "source_name": "GI Rajapaksi",
        "bay_name": "Bay Trafo 1",
        "ip": "172.20.29.7",
        "api_url": "http://172.20.29.7/cgi-bin/ipcxml.cgi?dis:dis/data/fr_data",
        "type": "qualitrol",
        "target_alarm": None,
        "qualitrol_mapping": {
            1: "87T OPRT TRAFO1",
            2: "64 150KV SIDE OPRT TRAFO1",
            3: "64 20KV SIDE OPRT TRAFO1",
            4: "50/51,50N/51N OPRT TRAFO1",
            5: "SBEF OPRT TRAFO1",
            6: "DTT RECEIVE FROM REMOTE END TRAF",
            7: "CB OPEN TRAFO1 150 KV",
            8: "CB OPEN TRAFO1 20 KV",
        }
    },
    {
        "id": "gi-rajapaksi-kopel-150kv",
        "source_name": "GI Rajapaksi",
        "bay_name": "Bay Kopel 150kV",
        "ip": "172.20.29.7",
        "api_url": "http://172.20.29.7/cgi-bin/ipcxml.cgi?dis:dis/data/fr_data",
        "type": "qualitrol",
        "target_alarm": None,
        "qualitrol_mapping": {
            33: "50/51,50N/51N TRIP COUPLER",
            34: "CB OPEN A COUPLER",
            35: "CB OPEN B COUPLER",
            36: "CB OPEN C COUPLER",
        }
    },
    {
        "id": "gis-new-tambun-tambun-1",
        "source_name": "GIS New Tambun",
        "bay_name": "Bay Tambun 1",
        "ip": "172.20.121.12",
        "api_url": "http://172.20.121.12/cgi-bin/ipcxml.cgi?dis:dis/data/fr_data",
        "type": "qualitrol",
        "target_alarm": None,
        "qualitrol_mapping": {
            1: "MAIN PROT OPRT TAMBUN 1",
            2: "AR IN PROGRESS TAMBUN 1",
            3: "BACKUP OPRT 50/51N TAMBUN 1",
            4: "50BF 1ST OPRT TAMBUN 1",
            5: "CCP OPRT TAMBUN 1",
            6: "50BF TRIP TAMBUN 1",
            7: "87B TRIP TAMBUN 1",
            8: "SF6 TRIP TAMBUN 1",
            9: "SF6 DTT TRIP TAMBUN 1",
            10: "CB OPEN R TAMBUN 1",
            11: "CB OPEN S TAMBUN 1",
            12: "CB OPEN T TAMBUN 1",
            13: "ZONE 1 TRIP TAMBUN 1",
            14: "ZONE 2 TRIP TAMBUN 1",
            15: "ZONE 3 TRIP TAMBUN 1",
            16: "DIST SEND TAMBUN 1",
            17: "DIST RECV TAMBUN 1",
        }
    },
    {
        "id": "gis-new-tambun-tambun-2",
        "source_name": "GIS New Tambun",
        "bay_name": "Bay Tambun 2",
        "ip": "172.20.121.12",
        "api_url": "http://172.20.121.12/cgi-bin/ipcxml.cgi?dis:dis/data/fr_data",
        "type": "qualitrol",
        "target_alarm": None,
        "qualitrol_mapping": {
            33: "MAIN PROT OPRT TAMBUN 2",
            34: "AR IN PROGRESS TAMBUN 2",
            35: "BACKUP OPRT 50/51N TAMBUN 2",
            36: "50BF 1ST OPRT TAMBUN 2",
            37: "CCP OPRT TAMBUN 2",
            38: "50BF OPRT TAMBUN 2",
            39: "87B TRIP TAMBUN 2",
            40: "SF6 TRIP TAMBUN 2",
            41: "SF6 DTT TRIP TAMBUN 2",
            42: "CB OPEN R TAMBUN 2",
            43: "CB OPEN S TAMBUN 2",
            44: "CB OPEN T TAMBUN 2",
            45: "ZONE 1 TRIP TAMBUN 2",
            46: "ZONE 2 TRIP TAMBUN 2",
            47: "ZONE 3 TRIP TAMBUN 2",
            48: "DIST SEND TAMBUN 2",
            49: "DIST RECV TAMBUN 2",
        }
    },
]
DEFAULT_ANNUNCIATOR_SOURCE_ID = ANNUNCIATOR_SOURCES[0]["id"]
db.migrate_legacy_json_files(ANNUNCIATOR_SOURCES)

DEFAULT_PQM_DEVICES = [
    {
        "id": "gi-jababeka-ktt-muliakeramik",
        "nama_gi": "GI Jababeka",
        "nama_bay": "KTT Muliakeramik",
        "ip": "172.20.21.131",
        "pqm_type": PQM_TYPE_ION7650,
        "port": 502,
        "slave_id": 1,
        "start_address": 147,
        "count": PQM_MAIN_REGISTER_COUNT,
    },
    {
        "id": "gi-fajar-sw-trafo-5",
        "nama_gi": "GI Fajar SW",
        "nama_bay": "Trafo 5",
        "ip": "172.20.19.131",
        "pqm_type": PQM_TYPE_ION7650,
        "port": 502,
        "slave_id": 1,
        "start_address": 147,
        "count": PQM_MAIN_REGISTER_COUNT,
    },
    {
        "id": "gi-juishin-bay-konsumen",
        "nama_gi": "GI Juishin",
        "nama_bay": "Bay Konsumen",
        "ip": "172.20.22.56",
        "pqm_type": PQM_TYPE_ION9000,
        "port": 443,
        "slave_id": 1,
        "start_address": 0,
        "count": PQM_MAIN_REGISTER_COUNT,
    },
]
db.ensure_default_pqm_devices(DEFAULT_PQM_DEVICES)

DEFAULT_AVR_DEVICES = [
    {
        "id": "gi-fajar-sw-trafo-4-avr",
        "nama_gi": "GI FAJAR SW",
        "nama_bay": "Trafo 4",
        "ip": "172.20.19.162",
        "port": 102,
        "ied_name": "REG",
        "access_point": "P1",
        "logical_device": "DAA",
        "vendor": "a-Eberle",
        "model": "REG-D",
        "software_revision": "2.20",
        "config_revision": "1.0",
        "source_file": "REG.scd",
        "measurement_points": [
            {
                "key": "voltage_actual",
                "label": "Tegangan Aktual",
                "reference": "REGDAA/ATCC1.CtlV.mag.f",
                "fc": "MX",
                "cdc": "MV",
                "unit": "kV",
                "value_type": "float",
                "scale_multiplier": 20,
                "scale_divisor": 100,
            },
            {
                "key": "load_current",
                "label": "Arus Beban",
                "reference": "REGDAA/ATCC1.LodA.mag.f",
                "fc": "MX",
                "cdc": "MV",
                "unit": "A",
                "value_type": "float",
                "scale_multiplier": 2000,
            },
            {
                "key": "band_center",
                "label": "Band / Deadband",
                "reference": "REGDAA/ATCC1.BndCtr.mag.f",
                "fc": "MX",
                "cdc": "ASG",
                "unit": "V",
                "value_type": "float",
            },
            {
                "key": "tap_position",
                "label": "Posisi Tap",
                "reference": "REGDAA/GGIO4.TapPos.stVal",
                "fallback_reference": "REGDAA/ATCC1.A25.stVal",
                "fc": "ST",
                "cdc": "INS",
                "unit": "",
                "value_type": "int",
            },
            {
                "key": "tap_transition",
                "label": "Tap Bergerak",
                "reference": "REGDAA/GGIO4.TapTrans.stVal",
                "fallback_reference": "REGDAA/ATCC1.TapChg.valWTr.transInd",
                "fc": "ST",
                "cdc": "SPS",
                "unit": "",
                "value_type": "bool",
            },
        ],
        "setting_points": [
            {
                "key": "active_setting_index",
                "label": "Setting Aktif",
                "reference": "REGDAA/ATCC1.SPIndex.setVal",
                "fc": "SP",
                "cdc": "ING",
                "unit": "",
                "value_type": "int",
                "configured_value": 1,
                "min_value": 1,
                "max_value": 4,
            },
            {
                "key": "setting_1",
                "label": "Setting 1",
                "reference": "REGDAA/ATCC1.SPVal1.setMag.f",
                "fc": "SP",
                "cdc": "ASG",
                "unit": "V",
                "value_type": "float",
                "configured_value": 103.5,
            },
            {
                "key": "setting_2",
                "label": "Setting 2",
                "reference": "REGDAA/ATCC1.SPVal2.setMag.f",
                "fc": "SP",
                "cdc": "ASG",
                "unit": "V",
                "value_type": "float",
                "configured_value": 100.0,
            },
            {
                "key": "setting_3",
                "label": "Setting 3",
                "reference": "REGDAA/ATCC1.SPVal3.setMag.f",
                "fc": "SP",
                "cdc": "ASG",
                "unit": "V",
                "value_type": "float",
                "configured_value": 100.0,
            },
            {
                "key": "setting_4",
                "label": "Setting 4",
                "reference": "REGDAA/ATCC1.SPVal4.setMag.f",
                "fc": "SP",
                "cdc": "ASG",
                "unit": "V",
                "value_type": "float",
                "configured_value": 100.0,
            },
            {
                "key": "nominal_voltage_setting",
                "label": "Setting V Nominal",
                "reference": "REGDAA/ATCC1.SPValVNom.mag.f",
                "fc": "MX",
                "cdc": "MV",
                "unit": "V",
                "value_type": "float",
            },
        ],
        "status_points": [
            {
                "key": "auto_mode",
                "label": "Auto",
                "reference": "REGDAA/ATCC1.Auto.stVal",
                "fc": "ST",
                "cdc": "SPC",
                "value_type": "bool",
            },
            {
                "key": "local_mode",
                "label": "Local",
                "reference": "REGDAA/ATCC1.Loc.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
            },
            {
                "key": "remote_mode",
                "label": "Remote",
                "reference": "REGDAA/GGIO4.RemMode.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
            },
            {
                "key": "tap_changing",
                "label": "Tap Change Oper",
                "reference": "REGDAA/ATCC1.TapChgOper.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
            },
            {
                "key": "tap_up",
                "label": "Tap Up",
                "reference": "REGDAA/ATCC1.TapChgUp.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
            },
            {
                "key": "tap_down",
                "label": "Tap Down",
                "reference": "REGDAA/ATCC1.TapChgDown.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
            },
            {
                "key": "reg_u1_active",
                "label": "Reg U1 Active",
                "reference": "REGDAA/ATCC1.RegU1Act.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
            },
            {
                "key": "reg_u2_active",
                "label": "Reg U2 Active",
                "reference": "REGDAA/ATCC1.RegU2Act.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
            },
        ],
        "alarm_points": [
            {
                "key": "tap_change_fail",
                "label": "Tap Change Fail",
                "reference": "REGDAA/ATCC1.TapChgFail.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "severity": "critical",
                "normal_value": False,
                "whatsapp": True,
            },
            {
                "key": "elan_fail",
                "label": "ELAN Fail",
                "reference": "REGDAA/ATCC1.ELANFail.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "severity": "warning",
                "normal_value": False,
                "whatsapp": True,
            },
            {
                "key": "parallel_program_fail",
                "label": "Parallel Program Fail",
                "reference": "REGDAA/ATCC1.ParPFail.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "severity": "warning",
                "normal_value": False,
                "whatsapp": True,
            },
            {
                "key": "over_voltage",
                "label": "Over Voltage",
                "reference": "REGDAA/ATCC1.OvV.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "severity": "critical",
                "normal_value": False,
                "whatsapp": True,
            },
            {
                "key": "over_current",
                "label": "Over Current",
                "reference": "REGDAA/ATCC1.OvA.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "severity": "critical",
                "normal_value": False,
                "whatsapp": True,
            },
            {
                "key": "undervoltage",
                "label": "Under Voltage",
                "reference": "REGDAA/ATCC1.UnUnV.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "severity": "critical",
                "normal_value": False,
                "whatsapp": True,
            },
            {
                "key": "ltc_blocked",
                "label": "LTC Blocked",
                "reference": "REGDAA/ATCC1.LTCBlk.stVal",
                "fc": "ST",
                "cdc": "SPC",
                "severity": "warning",
                "normal_value": False,
                "whatsapp": True,
            },
            {
                "key": "inhibit",
                "label": "Inhibit",
                "reference": "REGDAA/ATCC1.Inh.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "severity": "warning",
                "normal_value": False,
                "whatsapp": True,
            },
            {
                "key": "common_fault",
                "label": "Common Fault",
                "reference": "REGDAA/GGIO4.CFlt.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "severity": "critical",
                "normal_value": False,
                "whatsapp": True,
            },
        ],
        "led_points": [
            {
                "key": "remote_avr",
                "label": "Remote AVR",
                "reference": "REGDAA/GGIO2.Ind1.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
                "normal_value": False,
            },
            {
                "key": "local_avr",
                "label": "Lokal AVR",
                "reference": "REGDAA/GGIO2.Ind2.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
                "normal_value": False,
            },
            {
                "key": "remote_oltc",
                "label": "Remote OLTC",
                "reference": "REGDAA/GGIO2.Ind5.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
                "normal_value": False,
            },
            {
                "key": "local_oltc",
                "label": "Lokal OLTC",
                "reference": "REGDAA/GGIO2.Ind6.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
                "normal_value": False,
            },
            {
                "key": "tc_operate",
                "label": "TC Operate",
                "reference": "REGDAA/GGIO2.Ind7.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
                "normal_value": False,
            },
            {
                "key": "com2act",
                "label": "Com2ACT",
                "reference": "REGDAA/GGIO2.Ind8.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
                "normal_value": False,
            },
            {
                "key": "tap_error",
                "label": "Tap Error",
                "reference": "REGDAA/GGIO2.Ind9.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
                "normal_value": False,
            },
        ],
    },
    {
        "id": "gi-cikarang-trafo-1-avr",
        "nama_gi": "GI Cikarang",
        "nama_bay": "Trafo 1",
        "ip": "172.20.17.164",
        "port": 102,
        "ied_name": "AA1E1Q01KF2",
        "access_point": "P1",
        "logical_device": "LD0",
        "vendor": "ABB",
        "model": "REU615",
        "software_revision": "5.0.8",
        "config_revision": "106339",
        "source_file": "AVR ABB TRF 1 CIKARANG.scd",
        "measurement_points": [
            {
                "key": "voltage_actual_ab",
                "label": "Voltage Actual AB",
                "reference": "AA1E1Q01KF2LD0/VMMXU1.PPV.phsAB.cVal.mag.f",
                "fc": "MX",
                "cdc": "DEL",
                "unit": "kV",
                "value_type": "float",
                "scale_multiplier": 20,
            },
            {
                "key": "voltage_actual_bc",
                "label": "Voltage Actual BC",
                "reference": "AA1E1Q01KF2LD0/VMMXU1.PPV.phsBC.cVal.mag.f",
                "fc": "MX",
                "cdc": "DEL",
                "unit": "kV",
                "value_type": "float",
                "scale_multiplier": 20,
            },
            {
                "key": "voltage_actual_ca",
                "label": "Voltage Actual CA",
                "reference": "AA1E1Q01KF2LD0/VMMXU1.PPV.phsCA.cVal.mag.f",
                "fc": "MX",
                "cdc": "DEL",
                "unit": "kV",
                "value_type": "float",
                "scale_multiplier": 20,
            },
            {
                "key": "tap_position",
                "label": "Posisi Tap",
                "reference": "AA1E1Q01KF2LD0/OLATCC1.TapChg.valWTr.posVal",
                "fc": "ST",
                "cdc": "ISC",
                "unit": "",
                "value_type": "int",
            },
            {
                "key": "counter_avr",
                "label": "Counter AVR",
                "reference": "AA1E1Q01KF2LD0/OLATCC1.OpCntRs.stVal",
                "fc": "ST",
                "cdc": "INS",
                "unit": "",
                "value_type": "int",
            },
            {
                "key": "load_current_phr",
                "label": "Load Current PHR",
                "reference": "AA1E1Q01KF2LD0/CMMXU1.A.phsA.cVal.mag.f",
                "fc": "MX",
                "cdc": "WYE",
                "unit": "A",
                "value_type": "float",
                "scale_multiplier": 2000,
            },
            {
                "key": "load_current_phs",
                "label": "Load Current PHS",
                "reference": "AA1E1Q01KF2LD0/CMMXU1.A.phsB.cVal.mag.f",
                "fc": "MX",
                "cdc": "WYE",
                "unit": "A",
                "value_type": "float",
                "scale_multiplier": 2000,
            },
            {
                "key": "load_current_pht",
                "label": "Load Current PHT",
                "reference": "AA1E1Q01KF2LD0/CMMXU1.A.phsC.cVal.mag.f",
                "fc": "MX",
                "cdc": "WYE",
                "unit": "A",
                "value_type": "float",
                "scale_multiplier": 2000,
            },
            {
                "key": "band_width",
                "label": "Band Width",
                "reference": "AA1E1Q01KF2LD0/OLATCC1.BndWid.setMag.f",
                "fc": "SP",
                "cdc": "ASG",
                "unit": "V",
                "value_type": "float",
            },
        ],
        "setting_points": [
            {
                "key": "setting_1",
                "label": "Setting 1",
                "reference": "AA1E1Q01KF2LD0/OLATCC1.CtlV.mag.f",
                "fc": "MX",
                "cdc": "MV",
                "unit": "kV",
                "value_type": "float",
            },
        ],
        "status_points": [
            {
                "key": "auto_mode",
                "label": "Auto",
                "reference": "AA1E1Q01KF2LD0/OLATCC1.Auto.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
            },
            {
                "key": "local_mode",
                "label": "Lokal",
                "reference": "AA1E1Q01KF2LD0/OLATCC1.Loc.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
            },
        ],
        "alarm_points": [],
        "led_points": [
            {
                "key": "led_1",
                "label": "TAP In Proggres",
                "reference": "AA1E1Q01KF2LD0/LEDGGIO1.Alm1.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
                "normal_value": False,
            },
            {
                "key": "led_2",
                "label": "OLTC Alarm",
                "reference": "AA1E1Q01KF2LD0/LEDGGIO1.Alm2.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
                "normal_value": False,
            },
            {
                "key": "led_3",
                "label": "OLTC Block",
                "reference": "AA1E1Q01KF2LD0/LEDGGIO1.Alm3.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
                "normal_value": False,
            },
            {
                "key": "led_4",
                "label": "Local",
                "reference": "AA1E1Q01KF2LD0/LEDGGIO1.Alm4.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
                "normal_value": False,
            },
            {
                "key": "led_5",
                "label": "Remote",
                "reference": "AA1E1Q01KF2LD0/LEDGGIO1.Alm5.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
                "normal_value": False,
            },
            {
                "key": "led_6",
                "label": "TC Auto",
                "reference": "AA1E1Q01KF2LD0/LEDGGIO1.Alm6.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
                "normal_value": False,
            },
            {
                "key": "led_7",
                "label": "TC Manual",
                "reference": "AA1E1Q01KF2LD0/LEDGGIO1.Alm7.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
                "normal_value": False,
            },
            {
                "key": "led_8",
                "label": "Raise Own",
                "reference": "AA1E1Q01KF2LD0/LEDGGIO1.Alm8.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
                "normal_value": False,
            },
            {
                "key": "led_9",
                "label": "Lower Own",
                "reference": "AA1E1Q01KF2LD0/LEDGGIO1.Alm9.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
                "normal_value": False,
            },
            {
                "key": "led_10",
                "label": "Disturb Rec",
                "reference": "AA1E1Q01KF2LD0/LEDGGIO1.Alm10.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
                "normal_value": False,
            },
            {
                "key": "led_11",
                "label": "Block UV/OC",
                "reference": "AA1E1Q01KF2LD0/LEDGGIO1.Alm11.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
                "normal_value": False,
            },
        ],
    },
    {
        "id": "gis-new-tambun-trafo-1-avr",
        "nama_gi": "GIS New Tambun",
        "nama_bay": "Trafo 1",
        "ip": "172.20.121.96",
        "port": 102,
        "ied_name": "E12N901E12",
        "access_point": "P1",
        "logical_device": "N901",
        "vendor": "Maschinenfabrik Reinhausen",
        "model": "TAPCON",
        "software_revision": "3.172",
        "config_revision": "1.0",
        "source_file": "AVR TRAFO 1 GIS NEW TAMBUN.scd",
        "measurement_points": [
            {
                "key": "voltage_actual_ab",
                "label": "Voltage Actual AB",
                "reference": "E12N901E12N901/MMXU1.PPV.phsAB.cVal.mag.f",
                "fc": "MX",
                "cdc": "DEL",
                "unit": "V",
                "value_type": "float",
            },
            {
                "key": "voltage_actual_bc",
                "label": "Voltage Actual BC",
                "reference": "E12N901E12N901/MMXU1.PPV.phsBC.cVal.mag.f",
                "fc": "MX",
                "cdc": "DEL",
                "unit": "V",
                "value_type": "float",
            },
            {
                "key": "voltage_actual_ca",
                "label": "Voltage Actual CA",
                "reference": "E12N901E12N901/MMXU1.PPV.phsCA.cVal.mag.f",
                "fc": "MX",
                "cdc": "DEL",
                "unit": "V",
                "value_type": "float",
            },
            {
                "key": "control_voltage",
                "label": "Control Voltage",
                "reference": "E12N901E12N901/ATCC1.CtlV.mag.f",
                "fc": "MX",
                "cdc": "MV",
                "unit": "V",
                "value_type": "float",
            },
            {
                "key": "tap_position",
                "label": "Posisi Tap",
                "reference": "E12N901E12N901/ATCC1.TapChg.valWTr.posVal",
                "fc": "ST",
                "cdc": "BSC",
                "unit": "",
                "value_type": "int",
            },
            {
                "key": "counter_avr",
                "label": "Counter AVR",
                "reference": "E12N901E12N901/ATCC1.OpCntRs.stVal",
                "fc": "ST",
                "cdc": "INC",
                "unit": "",
                "value_type": "int",
            },
            {
                "key": "load_current",
                "label": "Load Current",
                "reference": "E12N901E12N901/ATCC1.LodA.mag.f",
                "fc": "MX",
                "cdc": "MV",
                "unit": "A",
                "value_type": "float",
            },
            {
                "key": "load_current_phr",
                "label": "Load Current PHR",
                "reference": "E12N901E12N901/MMXU1.A.phsA.cVal.mag.f",
                "fc": "MX",
                "cdc": "WYE",
                "unit": "A",
                "value_type": "float",
            },
            {
                "key": "load_current_phs",
                "label": "Load Current PHS",
                "reference": "E12N901E12N901/MMXU1.A.phsB.cVal.mag.f",
                "fc": "MX",
                "cdc": "WYE",
                "unit": "A",
                "value_type": "float",
            },
            {
                "key": "load_current_pht",
                "label": "Load Current PHT",
                "reference": "E12N901E12N901/MMXU1.A.phsC.cVal.mag.f",
                "fc": "MX",
                "cdc": "WYE",
                "unit": "A",
                "value_type": "float",
            },
            {
                "key": "band_center",
                "label": "Band Center",
                "reference": "E12N901E12N901/ATCC1.BndCtr.setMag.f",
                "fc": "SP",
                "cdc": "ASG",
                "unit": "V",
                "value_type": "float",
            },
            {
                "key": "band_width",
                "label": "Band Width",
                "reference": "E12N901E12N901/ATCC1.BndWid.setMag.f",
                "fc": "SP",
                "cdc": "ASG",
                "unit": "%",
                "value_type": "float",
            },
        ],
        "setting_points": [
            {
                "key": "setting_1",
                "label": "Setting 1",
                "reference": "E12N901E12N901/ATCC1.BndCtrV1.setMag.f",
                "fc": "SP",
                "cdc": "ASG",
                "unit": "V",
                "value_type": "float",
                "configured_value": 20700.0,
            },
            {
                "key": "setting_2",
                "label": "Setting 2",
                "reference": "E12N901E12N901/ATCC1.BndCtrV2.setMag.f",
                "fc": "SP",
                "cdc": "ASG",
                "unit": "V",
                "value_type": "float",
                "configured_value": 20000.0,
            },
            {
                "key": "setting_3",
                "label": "Setting 3",
                "reference": "E12N901E12N901/ATCC1.BndCtrV3.setMag.f",
                "fc": "SP",
                "cdc": "ASG",
                "unit": "V",
                "value_type": "float",
                "configured_value": 20000.0,
            },
            {
                "key": "control_delay",
                "label": "Delay T1",
                "reference": "E12N901E12N901/ATCC1.CtlDlTms.setMag.f",
                "fc": "SP",
                "cdc": "ASG",
                "unit": "s",
                "value_type": "float",
                "configured_value": 40.0,
            },
        ],
        "status_points": [
            {
                "key": "auto_mode",
                "label": "Auto",
                "reference": "E12N901E12N901/ATCC1.Auto.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
            },
            {
                "key": "local_mode",
                "label": "Lokal",
                "reference": "E12N901E12N901/ATCC1.Loc.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
            },
            {
                "key": "tap_changing",
                "label": "Motor Drive Running",
                "reference": "E12N901E12N901/ATCC1.MotDrv.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
            },
            {
                "key": "ltc_blocked",
                "label": "LTC Block",
                "reference": "E12N901E12N901/ATCC1.LTCBlk.stVal",
                "fc": "ST",
                "cdc": "SPC",
                "value_type": "bool",
            },
            {
                "key": "setting_1_active",
                "label": "Setting 1 Aktif",
                "reference": "E12N901E12N901/ATCC1.BndCtrAct1.stVal",
                "fc": "ST",
                "cdc": "SPC",
                "value_type": "bool",
            },
            {
                "key": "setting_2_active",
                "label": "Setting 2 Aktif",
                "reference": "E12N901E12N901/ATCC1.BndCtrAct2.stVal",
                "fc": "ST",
                "cdc": "SPC",
                "value_type": "bool",
            },
            {
                "key": "setting_3_active",
                "label": "Setting 3 Aktif",
                "reference": "E12N901E12N901/ATCC1.BndCtrAct3.stVal",
                "fc": "ST",
                "cdc": "SPC",
                "value_type": "bool",
            },
        ],
        "alarm_points": [
            {
                "key": "tap_error",
                "label": "Tap Indication Error",
                "reference": "E12N901E12N901/ATCC1.TapOpErr.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "severity": "critical",
                "normal_value": False,
                "whatsapp": True,
            },
            {
                "key": "parallel_error",
                "label": "Error Parallel Operation",
                "reference": "E12N901E12N901/ATCC1.ErrPar.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "severity": "warning",
                "normal_value": False,
                "whatsapp": True,
            },
            {
                "key": "ltc_inhibit_undervoltage",
                "label": "LTC Inhibit Under Voltage",
                "reference": "E12N901E12N901/ATCC1.LTCBlkVLo.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "severity": "critical",
                "normal_value": False,
                "whatsapp": True,
            },
            {
                "key": "ltc_inhibit_overvoltage",
                "label": "LTC Inhibit Over Voltage",
                "reference": "E12N901E12N901/ATCC1.LTCBlkVHi.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "severity": "critical",
                "normal_value": False,
                "whatsapp": True,
            },
            {
                "key": "ltc_inhibit_overcurrent",
                "label": "LTC Inhibit Over Current",
                "reference": "E12N901E12N901/ATCC1.LTCBlkAHi.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "severity": "critical",
                "normal_value": False,
                "whatsapp": True,
            },
            {
                "key": "function_monitoring",
                "label": "Function Monitoring",
                "reference": "E12N901E12N901/ATCC1.FuncMon.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "severity": "warning",
                "normal_value": False,
                "whatsapp": True,
            },
        ],
        "led_points": [
            {
                "key": f"led_{index}",
                "label": f"LED {index}",
                "reference": f"E12N901E12N901/GGIO1.Ind{index}.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
                "normal_value": False,
            }
            for index in range(1, 43)
        ],
    },
    {
        "id": "gis-new-tambun-trafo-2-avr",
        "nama_gi": "GIS New Tambun",
        "nama_bay": "Trafo 2",
        "ip": "172.20.121.84",
        "port": 102,
        "ied_name": "E15N901E15",
        "access_point": "P1",
        "logical_device": "N901",
        "vendor": "Maschinenfabrik Reinhausen",
        "model": "TAPCON",
        "software_revision": "3.172",
        "config_revision": "1.0",
        "source_file": "AVR TRAFO 2 GIS NEW TAMBUN.scd",
        "measurement_points": [
            {
                "key": "voltage_actual_ab",
                "label": "Voltage Actual AB",
                "reference": "E15N901E15N901/MMXU1.PPV.phsAB.cVal.mag.f",
                "fc": "MX",
                "cdc": "DEL",
                "unit": "V",
                "value_type": "float",
            },
            {
                "key": "voltage_actual_bc",
                "label": "Voltage Actual BC",
                "reference": "E15N901E15N901/MMXU1.PPV.phsBC.cVal.mag.f",
                "fc": "MX",
                "cdc": "DEL",
                "unit": "V",
                "value_type": "float",
            },
            {
                "key": "voltage_actual_ca",
                "label": "Voltage Actual CA",
                "reference": "E15N901E15N901/MMXU1.PPV.phsCA.cVal.mag.f",
                "fc": "MX",
                "cdc": "DEL",
                "unit": "V",
                "value_type": "float",
            },
            {
                "key": "control_voltage",
                "label": "Control Voltage",
                "reference": "E15N901E15N901/ATCC1.CtlV.mag.f",
                "fc": "MX",
                "cdc": "MV",
                "unit": "V",
                "value_type": "float",
            },
            {
                "key": "tap_position",
                "label": "Posisi Tap",
                "reference": "E15N901E15N901/ATCC1.TapChg.valWTr.posVal",
                "fc": "ST",
                "cdc": "BSC",
                "unit": "",
                "value_type": "int",
            },
            {
                "key": "counter_avr",
                "label": "Counter AVR",
                "reference": "E15N901E15N901/ATCC1.OpCntRs.stVal",
                "fc": "ST",
                "cdc": "INC",
                "unit": "",
                "value_type": "int",
            },
            {
                "key": "load_current",
                "label": "Load Current",
                "reference": "E15N901E15N901/ATCC1.LodA.mag.f",
                "fc": "MX",
                "cdc": "MV",
                "unit": "A",
                "value_type": "float",
            },
            {
                "key": "load_current_phr",
                "label": "Load Current PHR",
                "reference": "E15N901E15N901/MMXU1.A.phsA.cVal.mag.f",
                "fc": "MX",
                "cdc": "WYE",
                "unit": "A",
                "value_type": "float",
            },
            {
                "key": "load_current_phs",
                "label": "Load Current PHS",
                "reference": "E15N901E15N901/MMXU1.A.phsB.cVal.mag.f",
                "fc": "MX",
                "cdc": "WYE",
                "unit": "A",
                "value_type": "float",
            },
            {
                "key": "load_current_pht",
                "label": "Load Current PHT",
                "reference": "E15N901E15N901/MMXU1.A.phsC.cVal.mag.f",
                "fc": "MX",
                "cdc": "WYE",
                "unit": "A",
                "value_type": "float",
            },
            {
                "key": "band_center",
                "label": "Band Center",
                "reference": "E15N901E15N901/ATCC1.BndCtr.setMag.f",
                "fc": "SP",
                "cdc": "ASG",
                "unit": "V",
                "value_type": "float",
            },
            {
                "key": "band_width",
                "label": "Band Width",
                "reference": "E15N901E15N901/ATCC1.BndWid.setMag.f",
                "fc": "SP",
                "cdc": "ASG",
                "unit": "%",
                "value_type": "float",
            },
        ],
        "setting_points": [
            {
                "key": "setting_1",
                "label": "Setting 1",
                "reference": "E15N901E15N901/ATCC1.BndCtrV1.setMag.f",
                "fc": "SP",
                "cdc": "ASG",
                "unit": "V",
                "value_type": "float",
                "configured_value": 20700.0,
            },
            {
                "key": "setting_2",
                "label": "Setting 2",
                "reference": "E15N901E15N901/ATCC1.BndCtrV2.setMag.f",
                "fc": "SP",
                "cdc": "ASG",
                "unit": "V",
                "value_type": "float",
                "configured_value": 20000.0,
            },
            {
                "key": "setting_3",
                "label": "Setting 3",
                "reference": "E15N901E15N901/ATCC1.BndCtrV3.setMag.f",
                "fc": "SP",
                "cdc": "ASG",
                "unit": "V",
                "value_type": "float",
                "configured_value": 20000.0,
            },
            {
                "key": "control_delay",
                "label": "Delay T1",
                "reference": "E15N901E15N901/ATCC1.CtlDlTms.setMag.f",
                "fc": "SP",
                "cdc": "ASG",
                "unit": "s",
                "value_type": "float",
                "configured_value": 40.0,
            },
        ],
        "status_points": [
            {
                "key": "auto_mode",
                "label": "Auto",
                "reference": "E15N901E15N901/ATCC1.Auto.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
            },
            {
                "key": "local_mode",
                "label": "Lokal",
                "reference": "E15N901E15N901/ATCC1.Loc.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
            },
            {
                "key": "tap_changing",
                "label": "Motor Drive Running",
                "reference": "E15N901E15N901/ATCC1.MotDrv.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
            },
            {
                "key": "ltc_blocked",
                "label": "LTC Block",
                "reference": "E15N901E15N901/ATCC1.LTCBlk.stVal",
                "fc": "ST",
                "cdc": "SPC",
                "value_type": "bool",
            },
            {
                "key": "setting_1_active",
                "label": "Setting 1 Aktif",
                "reference": "E15N901E15N901/ATCC1.BndCtrAct1.stVal",
                "fc": "ST",
                "cdc": "SPC",
                "value_type": "bool",
            },
            {
                "key": "setting_2_active",
                "label": "Setting 2 Aktif",
                "reference": "E15N901E15N901/ATCC1.BndCtrAct2.stVal",
                "fc": "ST",
                "cdc": "SPC",
                "value_type": "bool",
            },
            {
                "key": "setting_3_active",
                "label": "Setting 3 Aktif",
                "reference": "E15N901E15N901/ATCC1.BndCtrAct3.stVal",
                "fc": "ST",
                "cdc": "SPC",
                "value_type": "bool",
            },
        ],
        "alarm_points": [
            {
                "key": "tap_error",
                "label": "Tap Indication Error",
                "reference": "E15N901E15N901/ATCC1.TapOpErr.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "severity": "critical",
                "normal_value": False,
                "whatsapp": True,
            },
            {
                "key": "parallel_error",
                "label": "Error Parallel Operation",
                "reference": "E15N901E15N901/ATCC1.ErrPar.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "severity": "warning",
                "normal_value": False,
                "whatsapp": True,
            },
            {
                "key": "ltc_inhibit_undervoltage",
                "label": "LTC Inhibit Under Voltage",
                "reference": "E15N901E15N901/ATCC1.LTCBlkVLo.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "severity": "critical",
                "normal_value": False,
                "whatsapp": True,
            },
            {
                "key": "ltc_inhibit_overvoltage",
                "label": "LTC Inhibit Over Voltage",
                "reference": "E15N901E15N901/ATCC1.LTCBlkVHi.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "severity": "critical",
                "normal_value": False,
                "whatsapp": True,
            },
            {
                "key": "ltc_inhibit_overcurrent",
                "label": "LTC Inhibit Over Current",
                "reference": "E15N901E15N901/ATCC1.LTCBlkAHi.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "severity": "critical",
                "normal_value": False,
                "whatsapp": True,
            },
            {
                "key": "function_monitoring",
                "label": "Function Monitoring",
                "reference": "E15N901E15N901/ATCC1.FuncMon.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "severity": "warning",
                "normal_value": False,
                "whatsapp": True,
            },
        ],
        "led_points": [
            {
                "key": f"led_{index}",
                "label": f"LED {index}",
                "reference": f"E15N901E15N901/GGIO1.Ind{index}.stVal",
                "fc": "ST",
                "cdc": "SPS",
                "value_type": "bool",
                "normal_value": False,
            }
            for index in range(1, 43)
        ],
    },
]

PQM_DISTURBANCE_COUNTER_GROUPS = [
    ("frequency", "Frequency", ["Freq N", "Freq N1", "Freq N2", "Freq N invld"]),
    (
        "voltage_magnitude",
        "Voltage Magnitude",
        [
            "V1Mag N", "V1Mag N1", "V1Mag N2", "V1Mag Ninvld",
            "V2Mag N", "V2Mag N1", "V2Mag N2", "V2Mag Ninvld",
            "V3Mag N", "V3Mag N1", "V3Mag N2", "V3Mag Ninvld",
        ],
    ),
    (
        "flicker",
        "Flicker",
        ["V1-Flck N", "V1-Flck N1", "V2-Flck N", "V2-Flck N1", "V3-Flck N", "V3-Flck N1"],
    ),
]

PQM_POST_INTERRUPTION_COUNTER_GROUPS = [
    ("voltage_unbalance", "Voltage Unbalance", ["Vunbal N", "Vunbal N1", "Vunbl Ninvld"]),
    (
        "mains_signaling",
        "Mains Signaling",
        [
            "V1-MSignal N", "V1-MSgnal N1",
            "V2-MSignal N", "V2-MSgnal N1",
            "V3-MSignal N", "V3-MSgnal N1",
        ],
    ),
    (
        "harmonic",
        "Harmonic",
        [
            "V1-Hrm N", "V1-Hrm N1", "V1-Hrm N2",
            "V2-Hrm N", "V2-Hrm N1", "V2-Hrm N2",
            "V1-Hrm invld", "V2-Hrm invld",
            "V3-Hrm N", "V3-Hrm N1", "V3-Hrm N2", "V3-Hrm invld",
        ],
    ),
    (
        "interharmonic",
        "Interharmonic",
        [
            "V1-Inthrm N", "V1-Inthrm N1",
            "V2-Inthrm N", "V2-Inthrm N1",
            "V3-Inthrm N", "V3-Inthrm N1",
        ],
    ),
    ("rvc", "Rapid Voltage Change", ["RVC"]),
]

PQM_DISTURBANCE_TYPE_ORDER = [
    "sag_dip",
    "swell",
    "interruption",
    "voltage_magnitude",
    "frequency",
    "flicker",
    "voltage_unbalance",
    "mains_signaling",
    "harmonic",
    "interharmonic",
    "rvc",
]

def build_pqm_counter_name(name, use_ion9000_names):
    return name if use_ion9000_names else f"PO {name}"

def build_pqm_disturbance_counter_catalog(pqm_type=PQM_TYPE_ION7650):
    counters = []
    address = PQM_DISTURBANCE_COUNTER_START_REGISTER
    use_ion9000_names = normalize_pqm_type(pqm_type) == PQM_TYPE_ION9000
    for event_type, event_label, names in PQM_DISTURBANCE_COUNTER_GROUPS:
        for name in names:
            counters.append({
                "name": build_pqm_counter_name(name, use_ion9000_names),
                "address": address,
                "event_type": event_type,
                "event_label": event_label,
            })
            address += 2

    for level in range(1, 6):
        for bucket in ("A", "B", "C", "D", "X"):
            counters.append({
                "name": build_pqm_counter_name(f"V-Dip {bucket}{level}", use_ion9000_names),
                "address": address,
                "event_type": "sag_dip",
                "event_label": "Sag / Dip",
            })
            address += 2

    for level in range(1, 5):
        for bucket in ("S", "T"):
            counters.append({
                "name": build_pqm_counter_name(f"V-Swell {bucket}{level}", use_ion9000_names),
                "address": address,
                "event_type": "swell",
                "event_label": "Swell",
            })
            address += 2

    for index in range(1, 4):
        counters.append({
            "name": build_pqm_counter_name(f"V-Intrpt N{index}", use_ion9000_names),
            "address": address,
            "event_type": "interruption",
            "event_label": "Interruption",
        })
        address += 2

    for event_type, event_label, names in PQM_POST_INTERRUPTION_COUNTER_GROUPS:
        for name in names:
            counters.append({
                "name": build_pqm_counter_name(name, use_ion9000_names),
                "address": address,
                "event_type": event_type,
                "event_label": event_label,
            })
            address += 2

    return counters

PQM_DISTURBANCE_COUNTERS = build_pqm_disturbance_counter_catalog(PQM_TYPE_ION7650)
PQM_ION9000_DISTURBANCE_COUNTERS = build_pqm_disturbance_counter_catalog(PQM_TYPE_ION9000)

PQM_MAIN_REGISTER_SPECS = [
    ("current_a", "I r", 40150, "UINT16", 10),
    ("current_b", "I s", 40151, "UINT16", 10),
    ("current_c", "I t", 40152, "UINT16", 10),
    ("current_4", "I 4", 40153, "UINT16", 10),
    ("current_5", "I 5", 40154, "UINT16", 10),
    ("current_avg", "I avg", 40155, "UINT16", 10),
    ("current_avg_min", "I avg mn", 40156, "UINT16", 10),
    ("current_avg_max", "I avg mx", 40157, "UINT16", 10),
    ("current_avg_mean", "I avg mean", 40158, "UINT16", 10),
    ("freq", "Freq", 40159, "UINT16", 10),
    ("freq_min", "Freq mn", 40160, "UINT16", 10),
    ("freq_max", "Freq mx", 40161, "UINT16", 10),
    ("freq_mean", "Freq mean", 40162, "UINT16", 10),
    ("v_unbal", "V unbal", 40163, "UINT16", 10),
    ("i_unbal", "I unbal", 40164, "UINT16", 10),
    ("phase_rev", "Phase Rev", 40165, "UINT16", 10),
    ("v_an", "Vln r", 40166, "UINT32", 1),
    ("v_bn", "Vln s", 40168, "UINT32", 1),
    ("v_cn", "Vln t", 40170, "UINT32", 1),
    ("v_ln_avg", "Vln avg", 40172, "UINT32", 1),
    ("v_ln_avg_max", "Vln avg mx", 40174, "UINT32", 1),
    ("v_ab", "Vll rs", 40178, "UINT32", 1),
    ("v_bc", "Vll st", 40180, "UINT32", 1),
    ("v_ca", "Vll tr", 40182, "UINT32", 1),
    ("v_ll_avg", "Vll avg", 40184, "UINT32", 1),
    ("v_ll_avg_max", "Vll avg mx", 40186, "UINT32", 1),
    ("v_ll_avg_mean", "Vll avg mean", 40188, "UINT32", 1),
    ("kw_a", "kW r", 40198, "INT32", 1),
    ("kw_b", "kW s", 40200, "INT32", 1),
    ("kw_c", "kW t", 40202, "INT32", 1),
    ("kw_total", "kW tot", 40204, "INT32", 1),
    ("kw_total_max", "kW tot mx", 40206, "INT32", 1),
    ("kvar_a", "kVAR r", 40208, "INT32", 1),
    ("kvar_b", "kVAR s", 40210, "INT32", 1),
    ("kvar_c", "kVAR t", 40212, "INT32", 1),
    ("kvar_total", "kVAR tot", 40214, "INT32", 1),
    ("kvar_total_max", "kVAR tot mx", 40216, "INT32", 1),
    ("kva_a", "kVA r", 40218, "INT32", 1),
    ("kva_b", "kVA s", 40220, "INT32", 1),
    ("kva_c", "kVA t", 40222, "INT32", 1),
    ("kva_total", "kVA tot", 40224, "INT32", 1),
    ("kva_total_max", "kVA tot mx", 40226, "INT32", 1),
    ("kwh_del", "kWh del", 40230, "INT32", 1),
    ("kwh_rec", "kWh rec", 40232, "INT32", 1),
    ("kvarh_del", "kVARh del", 40234, "INT32", 1),
    ("kvarh_rec", "kVARh rec", 40236, "INT32", 1),
    ("kvah_del_rec", "kVAh del+rec", 40238, "INT32", 1),
    ("pf_a", "PF sign r", 40262, "INT16", 100),
    ("pf_b", "PF sign s", 40263, "INT16", 100),
    ("pf_c", "PF sign t", 40264, "INT16", 100),
    ("pf_total", "PF sign tot", 40265, "INT16", 100),
    ("v1_thd_max", "V1 THD mx", 40266, "INT16", 100),
    ("v2_thd_max", "V2 THD mx", 40267, "INT16", 100),
    ("v3_thd_max", "V3 THD mx", 40268, "INT16", 100),
    ("i1_thd_max", "I1 THD mx", 40269, "INT16", 100),
    ("i2_thd_max", "I2 THD mx", 40270, "INT16", 100),
    ("i3_thd_max", "I3 THD mx", 40271, "INT16", 100),
    ("i1_k_factor", "I1 K Factor", 40272, "INT16", 100),
    ("i2_k_factor", "I2 K Factor", 40273, "INT16", 100),
    ("i3_k_factor", "I3 K Factor", 40274, "INT16", 100),
    ("i1_crest_factor", "I1 Crest Factor", 40275, "INT16", 100),
    ("i2_crest_factor", "I2 Crest Factor", 40276, "INT16", 100),
    ("i3_crest_factor", "I3 Crest Factor", 40277, "INT16", 100),
]

PQM_MAIN_REGISTER_CATALOG = [
    {
        "key": key,
        "name": name,
        "address": address,
        "format": data_format,
        "scaling": scaling,
    }
    for key, name, address, data_format, scaling in PQM_MAIN_REGISTER_SPECS
]

PQM_ION9000_MAIN_FIELD_SPECS = [
    ("current_a", "I a"),
    ("current_b", "I b"),
    ("current_c", "I c"),
    ("current_4", "I 4"),
    ("current_5", "I 5"),
    ("current_avg", "I avg"),
    ("current_avg_min", "I avg mn"),
    ("current_avg_max", "I avg mx"),
    ("current_avg_mean", "I avg mean"),
    ("freq", "Freq"),
    ("freq_min", "Freq mn"),
    ("freq_max", "Freq mx"),
    ("freq_mean", "Freq mean"),
    ("v_unbal", "V unbal"),
    ("i_unbal", "I unbal"),
    ("v_an", "Vln a"),
    ("v_bn", "Vln b"),
    ("v_cn", "Vln c"),
    ("v_ln_avg", "Vln avg"),
    ("v_ln_avg_max", "Vln avg mx"),
    ("v_ab", "Vll ab"),
    ("v_bc", "Vll bc"),
    ("v_ca", "Vll ca"),
    ("v_ll_avg", "Vll avg"),
    ("v_ll_avg_max", "Vll avg mx"),
    ("v_ll_avg_mean", "Vll avg mean"),
    ("phase_rev", "Phase Rev"),
    ("kw_a", "kW a"),
    ("kw_b", "kW b"),
    ("kw_c", "kW c"),
    ("kw_total", "kW tot"),
    ("kw_total_max", "kW tot mx"),
    ("kvar_a", "kVAR a"),
    ("kvar_b", "kVAR b"),
    ("kvar_c", "kVAR c"),
    ("kvar_total", "kVAR tot"),
    ("kvar_total_max", "kVAR tot mx"),
    ("kva_a", "kVA a"),
    ("kva_b", "kVA b"),
    ("kva_c", "kVA c"),
    ("kva_total", "kVA tot"),
    ("kva_total_max", "kVA tot mx"),
    ("kwh_del", "kWh del"),
    ("kwh_rec", "kWh rec"),
    ("kvarh_del", "kVARh del"),
    ("kvarh_rec", "kVARh rec"),
    ("kvah_del_rec", "kVAh del-rec"),
    ("pf_a", "PF sign a"),
    ("pf_b", "PF sign b"),
    ("pf_c", "PF sign c"),
    ("pf_total", "PF sign tot"),
    ("v1_thd_max", "V1 THD mx"),
    ("v2_thd_max", "V2 THD mx"),
    ("v3_thd_max", "V3 THD mx"),
    ("i1_thd_max", "I1 THD mx"),
    ("i2_thd_max", "I2 THD mx"),
    ("i3_thd_max", "I3 THD mx"),
    ("i1_k_factor", "I1 K Factor"),
    ("i2_k_factor", "I2 K Factor"),
    ("i3_k_factor", "I3 K Factor"),
    ("i1_crest_factor", "I1 Crest Factor"),
    ("i2_crest_factor", "I2 Crest Factor"),
    ("i3_crest_factor", "I3 Crest Factor"),
]

PQM_ION9000_SUPPORTED_MAIN_KEYS = {
    key for key, _name in PQM_ION9000_MAIN_FIELD_SPECS
}
PQM_ION9000_UNSUPPORTED_MAIN_KEYS = set()

def safe_json_dict(value):
    if not value:
        return {}
    try:
        data = json.loads(value)
        return data if isinstance(data, dict) else {}
    except Exception:
        return {}

def safe_json_list(value):
    if not value:
        return []
    try:
        data = json.loads(value)
        return data if isinstance(data, list) else []
    except Exception:
        return []

def apply_avr_reference_aliases(reference):
    text = str(reference or "").strip()
    if not text:
        return ""

    text = re.sub(r"\s+", "", text)
    text = re.sub(r"(?i)\bTapChg\.valWTr\.posVal\.(stVal|setVal)\b", "TapChg.valWTr.posVal", text)
    text = re.sub(r"(?i)\bTapChg\.posVal\.(stVal|setVal)\b", "TapChg.valWTr.posVal", text)
    text = re.sub(r"(?i)\bTapChg\.posVal\b", "TapChg.valWTr.posVal", text)
    text = re.sub(r"(?i)\b(Alm\d+)\.setVal\b", lambda match: f"{match.group(1)}.stVal", text)
    return text

def normalize_avr_reference_attributes(attributes):
    clean_attributes = [str(attribute or "").strip() for attribute in attributes if str(attribute or "").strip()]
    if len(clean_attributes) == 2 and clean_attributes[0].lower() == "tapchg" and clean_attributes[1].lower() == "posval":
        return ["TapChg", "valWTr", "posVal"]
    if len(clean_attributes) >= 2 and re.fullmatch(r"(?i)alm\d+", clean_attributes[-2] or "") and clean_attributes[-1].lower() == "setval":
        clean_attributes[-1] = "stVal"
    return clean_attributes

def looks_like_iec61850_logical_node(value):
    token = str(value or "").strip().upper()
    return bool(re.fullmatch(r"(LLN0|LPHD\d*|[A-Z0-9]*[A-Z]{4}\d*)", token))

def normalize_avr_reference(reference, ied_name="", logical_device=""):
    text = str(reference or "").strip()
    if not text:
        return ""

    text = re.sub(r"\s+", "", text)
    ied_name = str(ied_name or "").strip()
    logical_device = str(logical_device or "").strip()
    parts = [part.strip() for part in text.split("/") if part.strip()]
    if len(parts) >= 4:
        is_full_scd_path = (
            ied_name
            and logical_device
            and parts[0].lower() == ied_name.lower()
            and parts[1].lower() == logical_device.lower()
        ) or (
            "." not in parts[1]
            and "." not in parts[2]
            and parts[1].upper().startswith(("LD", "LLN"))
        )
        if is_full_scd_path:
            domain = f"{parts[0]}{parts[1]}"
            logical_node = parts[2]
            attributes = normalize_avr_reference_attributes(parts[3:])
            return apply_avr_reference_aliases(f"{domain}/{logical_node}.{'.'.join(attributes)}")

    if len(parts) >= 3:
        if ied_name and logical_device and parts[0].lower() == logical_device.lower():
            domain = f"{ied_name}{parts[0]}"
            logical_node = parts[1]
            attributes = normalize_avr_reference_attributes(parts[2:])
            return apply_avr_reference_aliases(f"{domain}/{logical_node}.{'.'.join(attributes)}")
        if "." not in parts[1] and looks_like_iec61850_logical_node(parts[1]):
            domain = parts[0]
            logical_node = parts[1]
            attributes = normalize_avr_reference_attributes(parts[2:])
            return apply_avr_reference_aliases(f"{domain}/{logical_node}.{'.'.join(attributes)}")

    if "/" not in text and "." in text and ied_name and logical_device:
        return apply_avr_reference_aliases(f"{ied_name}{logical_device}/{text}")

    return apply_avr_reference_aliases(text)

def normalize_avr_point_references(point, device):
    clean_point = {**point}
    clean_point["reference"] = normalize_avr_reference(
        clean_point.get("reference"),
        device.get("ied_name"),
        device.get("logical_device"),
    )
    if clean_point.get("fallback_reference"):
        clean_point["fallback_reference"] = normalize_avr_reference(
            clean_point.get("fallback_reference"),
            device.get("ied_name"),
            device.get("logical_device"),
        )
    return clean_point

def normalize_avr_device_references(device):
    clean_device = {**device}
    for group_name in AVR_POINT_GROUPS:
        clean_device[group_name] = [
            normalize_avr_point_references(point, clean_device)
            for point in clean_device.get(group_name, [])
            if isinstance(point, dict) and point.get("reference")
        ]
    return clean_device

def apply_avr_led_label_overrides(device):
    overrides = AVR_LED_LABEL_OVERRIDES.get(str(device.get("id") or ""))
    if not overrides:
        return device

    clean_device = {**device}
    led_points = []
    for point in clean_device.get("led_points") or []:
        if not isinstance(point, dict):
            continue
        clean_point = {**point}
        point_key = str(clean_point.get("key") or "")
        if point_key in overrides:
            clean_point["label"] = overrides[point_key]
        led_points.append(clean_point)
    clean_device["led_points"] = led_points
    return clean_device

def slugify_token(value, fallback="item"):
    token = re.sub(r"[^a-zA-Z0-9]+", "_", str(value or "").strip().lower()).strip("_")
    return token or fallback

def normalize_avr_value_type(value_type, group_name):
    defaults = AVR_POINT_GROUP_DEFAULTS.get(group_name, AVR_POINT_GROUP_DEFAULTS["measurement_points"])
    normalized = str(value_type or defaults["value_type"]).strip().lower()
    return normalized if normalized in {"float", "int", "bool", "text"} else defaults["value_type"]

def normalize_avr_point_group(group_name):
    normalized = str(group_name or "measurement_points").strip()
    return normalized if normalized in AVR_POINT_GROUPS else "measurement_points"

def normalize_avr_fc(fc_name, group_name):
    defaults = AVR_POINT_GROUP_DEFAULTS.get(group_name, AVR_POINT_GROUP_DEFAULTS["measurement_points"])
    normalized = str(fc_name or defaults["fc"]).strip().upper()
    return normalized or defaults["fc"]

def normalize_avr_normal_value(value, value_type):
    if value in (None, ""):
        return False if value_type == "bool" else 0
    if value_type == "bool":
        if isinstance(value, str):
            return value.strip().lower() in {"1", "true", "on", "active", "alarm", "aktif", "yes", "ya"}
        return bool(value)
    if value_type == "int":
        try:
            return int(float(value))
        except (TypeError, ValueError):
            return 0
    if value_type == "float":
        try:
            return float(value)
        except (TypeError, ValueError):
            return 0
    return str(value)

def get_manual_avr_devices():
    raw_devices = safe_json_list(db.get_setting(AVR_MANUAL_DEVICES_SETTING_KEY, "[]"))
    devices = []
    for device in raw_devices:
        if not isinstance(device, dict):
            continue
        clean_device = {
            **device,
            "source": "manual",
            "is_manual": True,
        }
        clean_device = normalize_avr_device_references(clean_device)
        clean_device = apply_regda_scale_defaults(clean_device)
        clean_device = apply_avr_led_label_overrides(clean_device)
        devices.append(clean_device)
    return devices

def save_manual_avr_devices(devices):
    clean_devices = [
        apply_regda_scale_defaults(normalize_avr_device_references(device))
        for device in devices
        if isinstance(device, dict)
    ]
    db.set_setting(AVR_MANUAL_DEVICES_SETTING_KEY, json.dumps(clean_devices, ensure_ascii=True))

def get_avr_devices():
    manual_devices = get_manual_avr_devices()
    manual_by_id = {device.get("id"): device for device in manual_devices if device.get("id")}
    default_ids = {device.get("id") for device in DEFAULT_AVR_DEVICES}
    devices = []
    for device in DEFAULT_AVR_DEVICES:
        cloned = normalize_avr_device_references(json.loads(json.dumps(device)))
        cloned = apply_avr_led_label_overrides(cloned)
        cloned["source"] = "default"
        cloned["is_manual"] = False
        devices.append(manual_by_id.get(cloned["id"], cloned))

    for device in manual_devices:
        if device.get("id") not in default_ids:
            devices.append(device)
    return devices

def build_avr_point_from_payload(point_payload, index, used_keys, ied_name="", logical_device=""):
    group_name = normalize_avr_point_group(point_payload.get("group") or point_payload.get("group_name"))
    reference = normalize_avr_reference(point_payload.get("reference"), ied_name, logical_device)
    if not reference:
        raise HTTPException(status_code=400, detail=f"Reference tag AVR baris {index + 1} wajib diisi.")

    label = str(point_payload.get("label") or point_payload.get("key") or f"Point {index + 1}").strip()
    key_base = slugify_token(point_payload.get("key") or label, f"point_{index + 1}")
    key = key_base
    suffix = 2
    while key in used_keys[group_name]:
        key = f"{key_base}_{suffix}"
        suffix += 1
    used_keys[group_name].add(key)

    value_type = normalize_avr_value_type(point_payload.get("value_type"), group_name)
    point = {
        "key": key,
        "label": label,
        "reference": reference,
        "fc": normalize_avr_fc(point_payload.get("fc"), group_name),
        "cdc": str(point_payload.get("cdc") or "").strip().upper(),
        "unit": str(point_payload.get("unit") or "").strip(),
        "value_type": value_type,
    }

    raw_scale_multiplier = point_payload.get("scale_multiplier")
    if str(raw_scale_multiplier or "").strip() != "":
        try:
            point["scale_multiplier"] = float(raw_scale_multiplier)
        except (TypeError, ValueError):
            pass

    raw_scale_divisor = point_payload.get("scale_divisor")
    if str(raw_scale_divisor or "").strip() != "":
        try:
            scale_divisor = float(raw_scale_divisor)
            if scale_divisor != 0:
                point["scale_divisor"] = scale_divisor
        except (TypeError, ValueError):
            pass

    if point["cdc"] == "":
        point.pop("cdc")

    if group_name in {"alarm_points", "led_points"}:
        point["normal_value"] = normalize_avr_normal_value(point_payload.get("normal_value"), value_type)
        point["whatsapp"] = bool(point_payload.get("whatsapp", True))
        if group_name == "alarm_points":
            point["severity"] = str(point_payload.get("severity") or "warning").strip().lower()

    return group_name, point

REGDA_SCALE_DEFAULTS = {
    "voltage_actual": {"scale_multiplier": 20, "scale_divisor": 100},
    "current_actual": {"scale_multiplier": 2000},
    "load_current": {"scale_multiplier": 2000},
}

def is_regda_avr_device(device):
    text = " ".join(
        str(device.get(key) or "")
        for key in ("vendor", "model", "source_file")
    ).lower()
    return "reg-d" in text or "regd" in text or "a-eberle" in text or "reg.scd" in text

def apply_regda_scale_defaults(device):
    if not is_regda_avr_device(device):
        return device

    for point in device.get("measurement_points", []):
        key = str(point.get("key") or "").strip().lower()
        defaults = REGDA_SCALE_DEFAULTS.get(key)
        if not defaults:
            continue
        if str(point.get("scale_multiplier") or "").strip() == "":
            point["scale_multiplier"] = defaults["scale_multiplier"]
        if defaults.get("scale_divisor") and str(point.get("scale_divisor") or "").strip() == "":
            point["scale_divisor"] = defaults["scale_divisor"]
    return device

def build_manual_avr_device_from_payload(payload, device_id=None):
    nama_gi = str(payload.get("nama_gi") or "").strip()
    nama_bay = str(payload.get("nama_bay") or "").strip()
    ip = str(payload.get("ip") or "").strip()
    ied_name = str(payload.get("ied_name") or "").strip() or "MANUAL"
    logical_device = str(payload.get("logical_device") or "").strip()
    if not nama_gi or not nama_bay or not ip:
        raise HTTPException(status_code=400, detail="Nama GI, nama bay, dan IP AVR wajib diisi.")

    try:
        port = int(payload.get("port") or 102)
    except (TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Port AVR harus berupa angka.")
    if port < 1 or port > 65535:
        raise HTTPException(status_code=400, detail="Port AVR harus berada di rentang 1-65535.")
    ensure_device_endpoint_allowed(ip, port, "AVR")

    raw_points = payload.get("points") or []
    if not isinstance(raw_points, list) or not raw_points:
        raise HTTPException(status_code=400, detail="Minimal satu tag AVR wajib dimapping.")

    point_groups = {group_name: [] for group_name in AVR_POINT_GROUPS}
    used_keys = {group_name: set() for group_name in AVR_POINT_GROUPS}
    for index, raw_point in enumerate(raw_points):
        if not isinstance(raw_point, dict):
            continue
        group_name, point = build_avr_point_from_payload(raw_point, index, used_keys, ied_name, logical_device)
        point_groups[group_name].append(point)

    if not any(point_groups.values()):
        raise HTTPException(status_code=400, detail="Minimal satu tag AVR valid wajib dimapping.")

    safe_id = device_id or f"manual-avr-{slugify_token(nama_gi)}-{slugify_token(nama_bay)}-{uuid.uuid4().hex[:8]}"
    device = {
        "id": safe_id,
        "nama_gi": nama_gi,
        "nama_bay": nama_bay,
        "ip": ip,
        "port": port,
        "ied_name": ied_name,
        "access_point": str(payload.get("access_point") or "").strip() or "P1",
        "logical_device": logical_device,
        "vendor": str(payload.get("vendor") or "").strip() or "Manual",
        "model": str(payload.get("model") or "").strip() or "Custom AVR",
        "software_revision": str(payload.get("software_revision") or "").strip(),
        "config_revision": str(payload.get("config_revision") or "").strip(),
        "source_file": str(payload.get("source_file") or "").strip() or "Manual Dashboard Mapping",
        "source": "manual",
        "is_manual": True,
        **point_groups,
    }
    return apply_regda_scale_defaults(device)

def ensure_unique_avr_device(candidate, existing_devices, editing_id=None):
    for existing in existing_devices:
        if editing_id and existing.get("id") == editing_id:
            continue
        same_name = (
            str(existing.get("nama_gi", "")).strip().lower() == candidate["nama_gi"].lower()
            and str(existing.get("nama_bay", "")).strip().lower() == candidate["nama_bay"].lower()
        )
        if same_name:
            raise HTTPException(status_code=400, detail="AVR dengan nama GI dan bay ini sudah ada.")
        if str(existing.get("ip", "")).strip() == candidate["ip"] and int(existing.get("port") or 102) == candidate["port"]:
            raise HTTPException(status_code=400, detail="AVR dengan IP dan port ini sudah ada.")

def reset_avr_state_from_config():
    app_state["avr_devices"] = [build_empty_avr_state(device) for device in get_avr_devices()]

def configured_avr_device_exists(device_id):
    return any(device.get("id") == device_id for device in get_avr_devices())

def get_pqm_disturbance_counter_catalog(device_or_type=None):
    if isinstance(device_or_type, dict):
        device_type = normalize_pqm_type(device_or_type.get("pqm_type"))
    else:
        device_type = normalize_pqm_type(device_or_type)

    if device_type == PQM_TYPE_ION9000:
        return PQM_ION9000_DISTURBANCE_COUNTERS
    return PQM_DISTURBANCE_COUNTERS

def summarize_pqm_counters(counters, device_or_type=None):
    summary = {"total": 0}
    for counter in get_pqm_disturbance_counter_catalog(device_or_type):
        value = int(counters.get(counter["name"], 0) or 0)
        summary[counter["event_type"]] = summary.get(counter["event_type"], 0) + value
        summary["total"] += value
    for event_type in PQM_DISTURBANCE_TYPE_ORDER:
        summary.setdefault(event_type, 0)
    return summary

def build_empty_annunciator_state(source):
    return {
        "source_id": source["id"],
        "connected": False,
        "last_poll_time": None,
        "status_message": "Belum ada polling announciator.",
        "active_alarms": [],
        "channels": [],
        "target_alarm": None,
        "channel_count": 0,
        "api_url": source["api_url"],
        "source_name": source["source_name"],
        "bay_name": source["bay_name"],
        "ip": source["ip"],
        "target_alarm_name": source.get("target_alarm"),
    }

def dfr_diag_url(ip):
    return f"http://{str(ip or '').strip()}/cgi-bin/diagreport.cgi?now=0"

def parse_dfr_number(value):
    text = str(value or "").strip().replace("%", "").replace(",", ".")
    if not text or text.upper() == "NOT APPLICABLE":
        return None
    try:
        return float(text)
    except ValueError:
        return None

def parse_dfr_int(value):
    number = parse_dfr_number(value)
    return None if number is None else int(number)

def dfr_child_text(parent, tag_name):
    if parent is None:
        return ""
    child = parent.find(tag_name)
    return child.text.strip() if child is not None and child.text else ""

def parse_dfr_diagnostic_report(xml_text):
    root = ET.fromstring(str(xml_text or "").strip())
    memory_usage = root.find(".//Memory_Usage")
    if memory_usage is None:
        raise ValueError("Diagnostic report DFR tidak berisi Memory_Usage.")

    volatile = memory_usage.find("Volatile")
    ram = {
        "total_mb": parse_dfr_number(dfr_child_text(volatile, "Total_RAM")),
        "free_mb": parse_dfr_number(dfr_child_text(volatile, "Free_RAM")),
        "shared_mb": parse_dfr_number(dfr_child_text(volatile, "Shared_RAM")),
        "buffer_mb": parse_dfr_number(dfr_child_text(volatile, "Buffer_RAM")),
        "used_percent": parse_dfr_number(dfr_child_text(volatile, "Percentage_Memory_Used")),
    }

    storage = []
    for child in list(memory_usage):
        if not str(child.tag or "").startswith("Non_Volatile"):
            continue
        mount = dfr_child_text(child, "Mounted_On")
        if not mount or mount.upper() == "NOT APPLICABLE":
            continue
        storage.append({
            "name": child.tag,
            "mount": mount,
            "used_kb": parse_dfr_int(dfr_child_text(child, "Used")),
            "available_kb": parse_dfr_int(dfr_child_text(child, "Available")),
            "used_percent": parse_dfr_number(dfr_child_text(child, "Percentage_use")),
        })

    return {
        "station_name": dfr_child_text(root, "Station_Name"),
        "device_name": dfr_child_text(root, "Device_Name"),
        "board_type": dfr_child_text(root, "Board_Type"),
        "ram": ram,
        "storage": storage,
    }

def normalize_dfr_device(raw_device):
    ip = str(raw_device.get("ip") or "").strip()
    device_id = str(raw_device.get("id") or "").strip()
    if not device_id:
        device_id = re.sub(
            r"[^a-z0-9]+",
            "-",
            f"{raw_device.get('nama_gi', '')}-{raw_device.get('nama_bay', '')}-{ip}".lower(),
        ).strip("-")
    return {
        "id": device_id,
        "ultg": str(raw_device.get("ultg") or "").strip(),
        "nama_gi": str(raw_device.get("nama_gi") or raw_device.get("gi") or "").strip(),
        "nama_bay": str(raw_device.get("nama_bay") or raw_device.get("bay") or "").strip(),
        "merk_tipe": str(raw_device.get("merk_tipe") or raw_device.get("merk") or "").strip(),
        "kondisi_peralatan": str(raw_device.get("kondisi_peralatan") or "").strip(),
        "ip": ip,
        "status_excel": str(raw_device.get("status_excel") or raw_device.get("status") or "").strip(),
        "enabled": bool(raw_device.get("enabled", True)),
        "diag_url": str(raw_device.get("diag_url") or dfr_diag_url(ip)).strip(),
    }

def get_dfr_devices():
    try:
        with open(DFR_DEVICES_FILE, "r", encoding="utf-8") as file:
            payload = json.load(file)
    except Exception as exc:
        print(f"[DFR CONFIG] Gagal membaca {DFR_DEVICES_FILE}: {exc}")
        payload = {"devices": []}
    devices = []
    seen_ips = set()
    for raw_device in payload.get("devices") or []:
        device = normalize_dfr_device(raw_device)
        if str(device.get("ultg") or "").strip().upper() != "BEKASI":
            continue
        ip = device.get("ip")
        if not ip or ip in seen_ips:
            continue
        seen_ips.add(ip)
        devices.append(device)
    return devices

def classify_dfr_state(connected, ram, storage):
    if not connected:
        return "offline"
    storage_percents = [
        float(item.get("used_percent"))
        for item in storage or []
        if item.get("used_percent") is not None
    ]
    ram_percent = ram.get("used_percent") if isinstance(ram, dict) else None
    max_storage = max(storage_percents, default=None)
    if max_storage is None and ram_percent is None:
        return "unsupported"
    if max_storage is not None and max_storage >= DFR_STORAGE_CRITICAL_PERCENT:
        return "critical"
    if ram_percent is not None and ram_percent >= DFR_RAM_CRITICAL_PERCENT:
        return "critical"
    if max_storage is not None and max_storage >= DFR_STORAGE_WARNING_PERCENT:
        return "warning"
    if ram_percent is not None and ram_percent >= DFR_RAM_WARNING_PERCENT:
        return "warning"
    return "normal"

def build_empty_dfr_state(device):
    return {
        **device,
        "connected": False,
        "status": "offline",
        "last_poll_time": None,
        "status_message": "Belum ada polling DFR.",
        "station_name": "",
        "device_name": "",
        "board_type": "",
        "ram": {
            "total_mb": None,
            "free_mb": None,
            "shared_mb": None,
            "buffer_mb": None,
            "used_percent": None,
        },
        "storage": [],
    }

def build_empty_pqm_state(device):
    raw_payload = safe_json_dict(device.get("raw_json"))
    pqm_type = normalize_pqm_type(device.get("pqm_type") or raw_payload.get("pqm_type"))
    pq_counters = raw_payload.get("pq_counters") or {}
    pq_counter_summary = raw_payload.get("pq_counter_summary") or summarize_pqm_counters(pq_counters, pqm_type)
    enabled_value = str(device.get("enabled", 1)).strip().lower()
    enabled = 0 if enabled_value in {"0", "false", "no", "off"} else 1
    is_connected = bool(device.get("connected", 0)) if enabled else False
    status_message = device.get("status_message") or "Belum ada polling PQM."
    if not enabled:
        status_message = "Polling PQM dimatikan."

    state = {
        "id": device["id"],
        "nama_gi": device["nama_gi"],
        "nama_bay": device["nama_bay"],
        "ip": device["ip"],
        "pqm_type": pqm_type,
        "enabled": enabled,
        "port": device.get("port", 502),
        "slave_id": device.get("slave_id", 1),
        "start_address": device.get("start_address", 147),
        "count": max(int(device.get("count") or 0), PQM_MAIN_REGISTER_COUNT),
        "created_at": device.get("created_at"),
        "last_poll_time": device.get("last_poll_time") or "",
        "connected": is_connected,
        "status_message": status_message,
        "raw_json": device.get("raw_json") or "",
        "pq_counters": pq_counters,
        "pq_counter_summary": pq_counter_summary,
        "new_disturbance_count": int(raw_payload.get("new_disturbance_count") or 0),
    }

    for spec in PQM_MAIN_REGISTER_CATALOG:
        value = raw_payload.get(spec["key"], device.get(spec["key"], 0))
        if value is None:
            state[spec["key"]] = None
            continue
        try:
            state[spec["key"]] = float(value or 0)
        except (TypeError, ValueError):
            state[spec["key"]] = 0.0

    state["phase_rev"] = int(state.get("phase_rev") or 0)
    return state

def clone_avr_points(points):
    cloned_points = []
    for point in points:
        cloned_points.append({
            **point,
            "value": point.get("value"),
            "quality": point.get("quality", ""),
            "timestamp": point.get("timestamp", ""),
        })
    return cloned_points

def get_mms_point_group_names(device):
    group_names = device.get("point_group_names") or AVR_POINT_GROUPS
    return tuple(group for group in group_names if isinstance(group, str) and group)

def is_ar_mms_device(device):
    group_names = set(get_mms_point_group_names(device))
    return bool(str(device.get("id") or "").startswith("ar-") or group_names.intersection(AR_POINT_GROUPS))

def ar_mms_read_reference(point, device):
    reference = normalize_avr_reference(
        point.get("reference"),
        device.get("ied_name"),
        device.get("logical_device"),
    )
    if (
        is_ar_mms_device(device)
        and str(point.get("fc") or "").strip().upper() == "ST"
        and str(point.get("key") or "") in AR_CB_POSITION_KEYS
    ):
        base_reference = re.sub(r"(?i)\.stVal$", "", reference)
        return f"{base_reference}.stVal" if base_reference else reference
    if is_ar_mms_device(device) and str(point.get("fc") or "").strip().upper() == "ST":
        return re.sub(r"(?i)\.stVal$", "", reference)
    return reference

def normalize_avr_mms_value(value):
    if isinstance(value, dict):
        for key in ("stVal", "setVal", "value", "val", "mag", "f", "i", "posVal", "general"):
            if key in value:
                return normalize_avr_mms_value(value.get(key))
        for key, item in value.items():
            if str(key).lower() in {"q", "t", "quality", "timestamp"}:
                continue
            return normalize_avr_mms_value(item)
        return None
    if isinstance(value, (list, tuple)):
        for item in value:
            if isinstance(item, (bytes, bytearray)):
                continue
            return normalize_avr_mms_value(item)
        return None
    return value

def coerce_avr_value(value, value_type):
    value = normalize_avr_mms_value(value)
    if value is None:
        return None

    try:
        if value_type == "bool":
            if isinstance(value, str):
                return value.strip().lower() in {"1", "true", "on", "active", "alarm"}
            return bool(value)
        if value_type == "int":
            if isinstance(value, str):
                numeric_match = re.search(r"-?\d+(?:\.\d+)?", value)
                if numeric_match:
                    return int(round(float(numeric_match.group(0))))
            return int(round(float(value)))
        if value_type == "float":
            if isinstance(value, str):
                numeric_match = re.search(r"-?\d+(?:\.\d+)?", value)
                if numeric_match:
                    return round(float(numeric_match.group(0)), 3)
            return round(float(value), 3)
    except (TypeError, ValueError):
        return value

    return value

def scale_avr_point_value(point, value):
    if value is None or not isinstance(value, (int, float)):
        return value

    multiplier = point.get("scale_multiplier")
    divisor = point.get("scale_divisor", 1)
    if multiplier is None:
        return value

    try:
        return round((float(value) * float(multiplier)) / float(divisor), 3)
    except (TypeError, ValueError, ZeroDivisionError):
        return value

def is_avr_iso_negotiation_error(exc):
    message = str(exc) or exc.__class__.__name__
    return "SPDU ID" in message or "ISO" in message

def extract_avr_node_adapter_json(output):
    start_marker = "__VoltKraf_AVR_JSON_START__"
    end_marker = "__VoltKraf_AVR_JSON_END__"
    start = output.find(start_marker)
    end = output.find(end_marker, start + len(start_marker))
    if start == -1 or end == -1:
        raise RuntimeError("Output adapter Node AVR tidak berisi payload JSON yang valid.")
    raw_json = output[start + len(start_marker):end].strip()
    try:
        return json.loads(raw_json)
    except json.JSONDecodeError as exc:
        raise RuntimeError(f"Output adapter Node AVR tidak valid: {exc}") from exc

def build_avr_node_adapter_point_groups(device, adapter_results):
    point_groups = {}
    read_count = 0
    error_count = 0
    total_count = 0
    results_by_position = {
        (result.get("group_name"), result.get("point_index")): result
        for result in adapter_results
        if isinstance(result, dict)
    }

    for group_name in get_mms_point_group_names(device):
        point_groups[group_name] = []
        for point_index, point in enumerate(clone_avr_points(device.get(group_name, []))):
            total_count += 1
            point = normalize_avr_point_references(point, device)
            result = results_by_position.get((group_name, point_index), {})
            if result.get("is_valid"):
                coerced_value = coerce_avr_value(result.get("value"), point.get("value_type"))
                point["raw_value"] = coerced_value
                point["value"] = scale_avr_point_value(point, coerced_value)
                point["quality"] = "valid"
                point["timestamp"] = format_wib(wib_now())
                point["used_reference"] = result.get("read_reference") or point.get("reference", "")
                point["adapter"] = "node-libiec61850"
                read_count += 1
            else:
                point["quality"] = "invalid"
                point["last_error"] = result.get("error") or "Data access error"
                if result.get("read_reference"):
                    point["used_reference"] = result.get("read_reference")
                error_count += 1
            point_groups[group_name].append(point)

    return point_groups, read_count, total_count, error_count

async def read_avr_mms_points_with_node_adapter(device, previous_error=None):
    if not AVR_NODE_ADAPTER_ENABLED:
        raise RuntimeError("Adapter Node IEC 61850 untuk AVR sedang dinonaktifkan.")
    if not AVR_NODE_ADAPTER_SCRIPT.exists():
        raise RuntimeError(f"Adapter Node IEC 61850 tidak ditemukan: {AVR_NODE_ADAPTER_SCRIPT}")
    if not shutil.which("node"):
        raise RuntimeError("Node.js belum tersedia di PATH untuk adapter IEC 61850 AVR.")

    request_points = []
    for group_name in get_mms_point_group_names(device):
        for point_index, point in enumerate(clone_avr_points(device.get(group_name, []))):
            point = normalize_avr_point_references(point, device)
            read_reference = ar_mms_read_reference(point, device)
            request_points.append({
                "group_name": group_name,
                "point_index": point_index,
                "key": point.get("key", ""),
                "reference": read_reference,
                "fc": point.get("fc", ""),
            })

    adapter_payload = {
        "device": {
            "id": device.get("id", ""),
            "ip": device.get("ip", ""),
            "port": int(device.get("port") or 102),
        },
        "timeout_ms": int(AVR_TIMEOUT_DETIK * 1000),
        "points": request_points,
    }
    process = await asyncio.create_subprocess_exec(
        "node",
        str(AVR_NODE_ADAPTER_SCRIPT),
        cwd=BASE_DIR,
        stdin=asyncio.subprocess.PIPE,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE,
    )
    stdout, stderr = await asyncio.wait_for(
        process.communicate(json.dumps(adapter_payload).encode("utf-8")),
        timeout=max(AVR_TIMEOUT_DETIK + AVR_MMS_REQUEST_TIMEOUT_DETIK + 8, 15),
    )
    combined_output = "\n".join([
        stdout.decode("utf-8", errors="ignore"),
        stderr.decode("utf-8", errors="ignore"),
    ])
    adapter_response = extract_avr_node_adapter_json(combined_output)
    if not adapter_response.get("ok"):
        error_message = adapter_response.get("error") or "Adapter Node IEC 61850 gagal membaca AVR."
        if previous_error:
            error_message = f"{error_message}; fallback dari error Python: {previous_error}"
        raise RuntimeError(error_message)

    return build_avr_node_adapter_point_groups(device, adapter_response.get("results") or [])

def get_avr_fc(fc_name):
    if not IEC61850_AVAILABLE or IEC61850_FC is None:
        raise RuntimeError("Library iec61850 belum tersedia.")
    return getattr(IEC61850_FC, str(fc_name or "").upper())

AVR_KNOWN_FC_NAMES = {"ST", "MX", "SP", "SV", "CF", "DC", "SG", "SE", "SR", "OR", "BL", "EX", "CO", "US", "MS", "RP", "BR", "LG"}

def infer_avr_browser_fc(attributes):
    attrs = [str(attr or "").strip() for attr in attributes if str(attr or "").strip()]
    lower_attrs = [attr.lower() for attr in attrs]
    if not attrs:
        return ""
    if lower_attrs[-1] in {"stval", "posval", "transind"}:
        return "ST"
    if lower_attrs[-1] in {"setval", "setmag"} or "setmag" in lower_attrs:
        return "SP"
    if any(attr in lower_attrs for attr in ("cval", "mag", "instmag")) or lower_attrs[-1] in {"f", "i"}:
        return "MX"
    return ""

def infer_avr_browser_value_type(reference, fc_name, attributes):
    text = str(reference or "").lower()
    last_attr = str((attributes or [""])[-1] or "").lower()
    if "posval" in text or "opcntrs" in text or last_attr in {"i", "intaddr"}:
        return "int"
    if str(fc_name or "").upper() == "MX" or last_attr == "f" or "mag.f" in text:
        return "float"
    if str(fc_name or "").upper() == "ST" or last_attr == "stval":
        return "bool"
    return "text"

def infer_avr_browser_group(reference, fc_name):
    text = str(reference or "").upper()
    fc_name = str(fc_name or "").upper()
    if "LED" in text or ".ALM" in text or "/ALM" in text:
        return "led_points"
    if fc_name in {"SP", "SE", "SG", "CF"}:
        return "setting_points"
    if fc_name == "ST":
        return "status_points"
    return "measurement_points"

def avr_browser_label_from_reference(reference):
    path = str(reference or "").split("/", 1)[-1]
    parts = re.split(r"[.$/]+", path)
    useful = [part for part in parts if part and part.upper() not in AVR_KNOWN_FC_NAMES]
    return " ".join(useful[-3:]) or path or "Tag MMS"

def parse_avr_mms_variable(ld_name, variable_name, device):
    raw_variable = str(variable_name or "").strip()
    if not raw_variable:
        return None

    domain = str(ld_name or "").strip()
    variable = raw_variable
    if "/" in variable:
        domain, variable = variable.split("/", 1)

    fc_name = ""
    logical_node = ""
    attributes = []
    if "$" in variable:
        tokens = [token for token in variable.split("$") if token]
        if len(tokens) < 2:
            return None
        logical_node = tokens[0]
        if len(tokens) >= 3 and tokens[1].upper() in AVR_KNOWN_FC_NAMES:
            fc_name = tokens[1].upper()
            attributes = tokens[2:]
        else:
            attributes = tokens[1:]
    elif "." in variable:
        logical_node, attribute_text = variable.split(".", 1)
        attributes = [part for part in attribute_text.split(".") if part]
    else:
        return None

    if not logical_node or not attributes:
        return None

    attributes = normalize_avr_reference_attributes(attributes)
    reference = apply_avr_reference_aliases(f"{domain}/{logical_node}.{'.'.join(attributes)}")
    fc_name = fc_name or infer_avr_browser_fc(attributes)
    value_type = infer_avr_browser_value_type(reference, fc_name, attributes)
    return {
        "raw_variable": raw_variable,
        "domain": domain,
        "logical_node": logical_node,
        "attributes": attributes,
        "reference": reference,
        "fc": fc_name,
        "value_type": value_type,
        "group": infer_avr_browser_group(reference, fc_name),
        "label": avr_browser_label_from_reference(reference),
    }

def find_or_add_avr_browser_child(children, label, node_type, node_id):
    for child in children:
        if child.get("id") == node_id:
            return child

    node = {
        "id": node_id,
        "label": label,
        "type": node_type,
        "children": [],
        "selectable": False,
    }
    children.append(node)
    return node

def add_avr_browser_leaf(root_nodes, leaf):
    labels = [leaf["domain"], leaf["logical_node"], *leaf["attributes"]]
    node_types = ["logical_device", "logical_node"] + ["data_object"] * max(len(leaf["attributes"]) - 1, 0) + ["data_attribute"]
    children = root_nodes
    path = []
    for index, label in enumerate(labels):
        path.append(label)
        node_type = node_types[index] if index < len(node_types) else "data_attribute"
        node_id = "mms::" + "::".join(path)
        node = find_or_add_avr_browser_child(children, label, node_type, node_id)
        if index == len(labels) - 1:
            node.update({
                "selectable": True,
                "reference": leaf["reference"],
                "fc": leaf["fc"],
                "value_type": leaf["value_type"],
                "group": leaf["group"],
                "raw_variable": leaf["raw_variable"],
                "domain": leaf["domain"],
                "logical_node": leaf["logical_node"],
                "path": ".".join([leaf["logical_node"], *leaf["attributes"]]),
            })
        children = node["children"]

def sort_avr_browser_nodes(nodes):
    for node in nodes:
        sort_avr_browser_nodes(node.get("children", []))
    nodes.sort(key=lambda item: (0 if item.get("children") else 1, str(item.get("label", "")).lower()))

def count_avr_browser_selectable(nodes):
    total = 0
    for node in nodes:
        total += 1 if node.get("selectable") else 0
        total += count_avr_browser_selectable(node.get("children", []))
    return total

def build_avr_mms_browser_tree(model, device):
    root_nodes = []
    for logical_device in model.get("logical_devices", []):
        if isinstance(logical_device, str):
            ld_name = logical_device
            variables = []
        else:
            ld_name = str(logical_device.get("name") or logical_device.get("logical_device") or "").strip()
            variables = logical_device.get("variables") or logical_device.get("named_variables") or []
        if not ld_name:
            continue
        if not variables:
            find_or_add_avr_browser_child(root_nodes, ld_name, "logical_device", f"mms::{ld_name}")
            continue
        for variable in variables:
            leaf = parse_avr_mms_variable(ld_name, variable, device)
            if leaf:
                add_avr_browser_leaf(root_nodes, leaf)

    sort_avr_browser_nodes(root_nodes)
    return root_nodes

def local_name(xml_tag):
    return str(xml_tag or "").split("}", 1)[-1]

def scd_child(element, name):
    if element is None:
        return None
    for child in list(element):
        if local_name(child.tag) == name:
            return child
    return None

def scd_children(element, name):
    if element is None:
        return []
    return [child for child in list(element) if local_name(child.tag) == name]

def find_avr_scd_file(device):
    source_file = str(device.get("source_file") or "").strip()
    candidates = []
    if source_file:
        source_path = Path(source_file)
        if source_path.is_absolute():
            candidates.append(source_path)
        else:
            candidates.extend([
                Path(BASE_DIR) / source_file,
                Path.home() / "Desktop" / source_file,
                Path.home() / "Downloads" / source_file,
            ])

    ied_name = str(device.get("ied_name") or "").strip()
    if ied_name:
        candidates.extend(Path.home().glob(f"Desktop/*{ied_name}*.scd"))
        candidates.extend(Path.home().glob(f"Downloads/*{ied_name}*.scd"))

    for candidate in candidates:
        try:
            if candidate.exists() and candidate.is_file():
                return candidate
        except OSError:
            continue
    return None

def build_ln_name_from_scd(ln_element):
    tag_name = local_name(ln_element.tag)
    if tag_name == "LN0":
        return "LLN0"
    return "".join([
        str(ln_element.get("prefix") or ""),
        str(ln_element.get("lnClass") or ""),
        str(ln_element.get("inst") or ""),
    ])

def scd_btype_is_structural(btype):
    return str(btype or "").strip().lower() in {"struct", "structure"}

def scd_add_template_leaves(root_nodes, device, domain, logical_node, do_name, do_type_id, type_indexes):
    do_types = type_indexes["do_types"]
    da_types = type_indexes["da_types"]

    def add_leaf(path_parts, fc_name, btype=""):
        reference = normalize_avr_reference(
            f"{domain}/{logical_node}.{'.'.join(path_parts)}",
            device.get("ied_name"),
            device.get("logical_device"),
        )
        fc = str(fc_name or infer_avr_browser_fc(path_parts)).strip().upper()
        leaf = {
            "raw_variable": f"{logical_node}${fc}${'$'.join(path_parts)}" if fc else f"{logical_node}${'$'.join(path_parts)}",
            "domain": domain,
            "logical_node": logical_node,
            "attributes": path_parts,
            "reference": reference,
            "fc": fc,
            "value_type": infer_avr_browser_value_type(reference, fc, path_parts),
            "group": infer_avr_browser_group(reference, fc),
            "label": avr_browser_label_from_reference(reference),
            "btype": btype,
        }
        add_avr_browser_leaf(root_nodes, leaf)

    def walk_da_type(path_parts, da_type_id, fc_name):
        da_type = da_types.get(da_type_id)
        if da_type is None:
            add_leaf(path_parts, fc_name)
            return
        bdas = scd_children(da_type, "BDA")
        if not bdas:
            add_leaf(path_parts, fc_name)
            return
        for bda in bdas:
            bda_name = bda.get("name")
            if not bda_name:
                continue
            bda_type = bda.get("type")
            btype = bda.get("bType")
            if bda_type and scd_btype_is_structural(btype):
                walk_da_type([*path_parts, bda_name], bda_type, fc_name)
            else:
                add_leaf([*path_parts, bda_name], fc_name, btype)

    def walk_do_type(path_parts, do_type_id):
        do_type = do_types.get(do_type_id)
        if do_type is None:
            return
        for sdo in scd_children(do_type, "SDO"):
            sdo_name = sdo.get("name")
            sdo_type = sdo.get("type")
            if sdo_name and sdo_type:
                walk_do_type([*path_parts, sdo_name], sdo_type)
        for da in scd_children(do_type, "DA"):
            da_name = da.get("name")
            if not da_name:
                continue
            fc_name = da.get("fc") or ""
            da_type = da.get("type")
            btype = da.get("bType")
            if da_type and scd_btype_is_structural(btype):
                walk_da_type([*path_parts, da_name], da_type, fc_name)
            else:
                add_leaf([*path_parts, da_name], fc_name, btype)

    walk_do_type([do_name], do_type_id)

def build_avr_mms_browser_tree_from_scd(scd_path, device):
    tree = ET.parse(scd_path)
    root = tree.getroot()
    data_templates = scd_child(root, "DataTypeTemplates")
    type_indexes = {
        "ln_types": {},
        "do_types": {},
        "da_types": {},
    }
    for lnode_type in scd_children(data_templates, "LNodeType"):
        if lnode_type.get("id"):
            type_indexes["ln_types"][lnode_type.get("id")] = lnode_type
    for do_type in scd_children(data_templates, "DOType"):
        if do_type.get("id"):
            type_indexes["do_types"][do_type.get("id")] = do_type
    for da_type in scd_children(data_templates, "DAType"):
        if da_type.get("id"):
            type_indexes["da_types"][da_type.get("id")] = da_type

    target_ied_name = str(device.get("ied_name") or "").strip()
    ieds = scd_children(root, "IED")
    target_ied = next((ied for ied in ieds if not target_ied_name or ied.get("name") == target_ied_name), None)
    if target_ied is None:
        raise RuntimeError(f"IED {target_ied_name or '-'} tidak ditemukan di SCD.")

    ied_name = target_ied.get("name") or target_ied_name
    root_nodes = []
    for access_point in scd_children(target_ied, "AccessPoint"):
        server = scd_child(access_point, "Server")
        for ldevice in scd_children(server, "LDevice"):
            ld_inst = ldevice.get("inst") or ""
            domain = f"{ied_name}{ld_inst}"
            for ln_element in [*scd_children(ldevice, "LN0"), *scd_children(ldevice, "LN")]:
                logical_node = build_ln_name_from_scd(ln_element)
                ln_type = type_indexes["ln_types"].get(ln_element.get("lnType"))
                if ln_type is None:
                    continue
                for do_element in scd_children(ln_type, "DO"):
                    do_name = do_element.get("name")
                    do_type = do_element.get("type")
                    if do_name and do_type:
                        scd_add_template_leaves(root_nodes, device, domain, logical_node, do_name, do_type, type_indexes)

    sort_avr_browser_nodes(root_nodes)
    return root_nodes

def browse_avr_mms_structure_from_scd(device, live_error=""):
    scd_path = find_avr_scd_file(device)
    if scd_path is None:
        return None
    nodes = build_avr_mms_browser_tree_from_scd(scd_path, device)
    cache_time = format_wib(wib_now())
    status = f"Live MMS gagal, struktur ditampilkan dari SCD: {scd_path.name}."
    if not live_error:
        status = f"Struktur MMS ditampilkan dari SCD: {scd_path.name}."
    return {
        "device": {
            "id": device.get("id", ""),
            "nama_gi": device.get("nama_gi", ""),
            "nama_bay": device.get("nama_bay", ""),
            "ip": device.get("ip", ""),
            "port": int(device.get("port") or 102),
            "ied_name": device.get("ied_name", ""),
            "logical_device": device.get("logical_device", ""),
        },
        "nodes": nodes,
        "cache_time": cache_time,
        "cached": True,
        "source": "scd",
        "selected_count": count_avr_browser_selectable(nodes),
        "status_message": status,
        "error": live_error,
        "scd_file": str(scd_path),
    }

async def collect_avr_directory_leaves(connection, reference, depth=0, max_depth=6):
    if depth >= max_depth:
        return [reference]
    try:
        child_names = await connection.get_data_directory(reference)
    except Exception:
        return [reference]

    if not child_names:
        return [reference]

    leaves = []
    for child_name in child_names:
        leaves.extend(await collect_avr_directory_leaves(connection, f"{reference}.{child_name}", depth + 1, max_depth))
    return leaves

async def browse_avr_mms_directories(connection, device):
    root_nodes = []
    if IEC61850_ACSI_CLASS is None:
        return root_nodes

    logical_devices = await connection.get_server_directory()
    for ld_name in logical_devices:
        try:
            logical_nodes = await connection.get_logical_device_directory(ld_name)
        except Exception:
            logical_nodes = []
        for logical_node in logical_nodes:
            ln_ref = f"{ld_name}/{logical_node}"
            try:
                data_objects = await connection.get_logical_node_directory(ln_ref, IEC61850_ACSI_CLASS.DATA_OBJECT)
            except Exception:
                data_objects = []
            for data_object in data_objects:
                for leaf_ref in await collect_avr_directory_leaves(connection, f"{ln_ref}.{data_object}"):
                    parsed = parse_avr_mms_variable(ld_name, leaf_ref.split("/", 1)[-1], device)
                    if parsed:
                        add_avr_browser_leaf(root_nodes, parsed)

    sort_avr_browser_nodes(root_nodes)
    return root_nodes

def build_avr_browser_device(payload):
    base_device = {}
    device_id = str(payload.get("device_id") or "").strip()
    if device_id:
        base_device = next((device for device in get_avr_devices() if device.get("id") == device_id), {}) or {}

    port_value = payload.get("port", base_device.get("port", 102))
    try:
        port = int(port_value or 102)
    except (TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Port AVR harus berupa angka.")
    if port < 1 or port > 65535:
        raise HTTPException(status_code=400, detail="Port AVR harus berada di rentang 1-65535.")

    device = {
        **base_device,
        "id": device_id or base_device.get("id") or f"browser-{slugify_token(payload.get('ip') or base_device.get('ip'))}",
        "nama_gi": str(payload.get("nama_gi") or base_device.get("nama_gi") or "").strip() or "Manual",
        "nama_bay": str(payload.get("nama_bay") or base_device.get("nama_bay") or "").strip() or "AVR",
        "ip": str(payload.get("ip") or base_device.get("ip") or "").strip(),
        "port": port,
        "ied_name": str(payload.get("ied_name") or base_device.get("ied_name") or "").strip(),
        "logical_device": str(payload.get("logical_device") or base_device.get("logical_device") or "").strip(),
        "access_point": str(payload.get("access_point") or base_device.get("access_point") or "P1").strip(),
        "vendor": str(payload.get("vendor") or base_device.get("vendor") or "").strip(),
        "model": str(payload.get("model") or base_device.get("model") or "").strip(),
        "source_file": str(payload.get("source_file") or base_device.get("source_file") or "").strip(),
    }
    if not device["ip"]:
        raise HTTPException(status_code=400, detail="IP AVR wajib diisi sebelum browse MMS.")
    return device

def avr_mms_browser_cache_key(device):
    identity = "|".join([
        str(device.get("id") or ""),
        str(device.get("ip") or ""),
        str(device.get("port") or 102),
        str(device.get("ied_name") or ""),
        str(device.get("logical_device") or ""),
    ])
    digest = hashlib.sha1(identity.encode("utf-8", errors="ignore")).hexdigest()[:16]
    return f"{AVR_MMS_BROWSER_CACHE_SETTING_PREFIX}{digest}"

async def browse_avr_mms_structure(device, refresh=False):
    if not IEC61850_AVAILABLE or IedConnection is None:
        raise RuntimeError("Library iec61850 belum terpasang.")

    cache_key = avr_mms_browser_cache_key(device)
    cached_payload = safe_json_dict(db.get_setting(cache_key, ""))
    if cached_payload and not refresh:
        cached_payload["cached"] = True
        if cached_payload.get("source") != "scd":
            cached_payload["source"] = "cached"
        cached_payload["status_message"] = cached_payload.get("status_message") or "Struktur MMS memakai cache terakhir."
        return cached_payload

    address = f"{device['ip']}:{int(device.get('port') or 102)}"
    try:
        connection = await IedConnection.connect(
            address,
            timeout_ms=int(AVR_TIMEOUT_DETIK * 1000),
            request_timeout_ms=int(AVR_MMS_REQUEST_TIMEOUT_DETIK * 1000),
        )
        try:
            model = await connection.get_device_model(refresh=True)
            nodes = build_avr_mms_browser_tree(model if isinstance(model, dict) else {}, device)
            if count_avr_browser_selectable(nodes) == 0:
                nodes = await browse_avr_mms_directories(connection, device)
        finally:
            await connection.disconnect()

        cache_time = format_wib(wib_now())
        payload = {
            "device": {
                "id": device.get("id", ""),
                "nama_gi": device.get("nama_gi", ""),
                "nama_bay": device.get("nama_bay", ""),
                "ip": device.get("ip", ""),
                "port": int(device.get("port") or 102),
                "ied_name": device.get("ied_name", ""),
                "logical_device": device.get("logical_device", ""),
            },
            "nodes": nodes,
            "cache_time": cache_time,
            "cached": False,
            "source": "live",
            "selected_count": count_avr_browser_selectable(nodes),
            "status_message": f"Struktur MMS live berhasil dibaca dari {address}.",
            "error": "",
        }
        db.set_setting(cache_key, json.dumps(payload, ensure_ascii=True))
        return payload
    except Exception as exc:
        error_message = describe_avr_mms_error(exc)
        if cached_payload:
            cached_payload["cached"] = True
            if cached_payload.get("source") != "scd":
                cached_payload["source"] = "cached"
            cached_payload["error"] = error_message
            cached_payload["status_message"] = f"Live refresh gagal, memakai cache terakhir: {error_message}"
            return cached_payload
        scd_payload = browse_avr_mms_structure_from_scd(device, live_error=error_message)
        if scd_payload:
            db.set_setting(cache_key, json.dumps(scd_payload, ensure_ascii=True))
            return scd_payload
        raise RuntimeError(error_message)

def build_avr_error_point_groups(device, error_message):
    point_groups = {}
    timestamp = format_wib(wib_now())
    for group_name in get_mms_point_group_names(device):
        point_groups[group_name] = []
        for point in clone_avr_points(device.get(group_name, [])):
            point = normalize_avr_point_references(point, device)
            point["quality"] = "invalid"
            point["last_error"] = error_message
            point["timestamp"] = timestamp
            point_groups[group_name].append(point)
    return point_groups

async def read_avr_mms_points(device):
    if not IEC61850_AVAILABLE or IedConnection is None:
        return await read_avr_mms_points_with_node_adapter(
            device,
            previous_error="Library Python iec61850 belum terpasang.",
        )

    address = f"{device['ip']}:{int(device.get('port') or 102)}"
    try:
        connection = await IedConnection.connect(
            address,
            timeout_ms=int(AVR_TIMEOUT_DETIK * 1000),
            request_timeout_ms=int(AVR_MMS_REQUEST_TIMEOUT_DETIK * 1000),
        )
    except Exception as exc:
        if is_avr_iso_negotiation_error(exc):
            return await read_avr_mms_points_with_node_adapter(device, previous_error=describe_avr_mms_error(exc))
        raise

    point_groups = {}
    read_count = 0
    error_count = 0
    total_count = 0

    try:
        for group_name in get_mms_point_group_names(device):
            point_groups[group_name] = []
            for point in clone_avr_points(device.get(group_name, [])):
                total_count += 1
                point = normalize_avr_point_references(point, device)
                reference = ar_mms_read_reference(point, device)
                used_reference = reference

                try:
                    fc = get_avr_fc(point.get("fc"))
                    raw_value = await connection.read(reference, fc)
                    coerced_value = coerce_avr_value(raw_value, point.get("value_type"))
                    point["raw_value"] = coerced_value
                    point["value"] = scale_avr_point_value(point, coerced_value)
                    point["quality"] = "valid"
                    point["timestamp"] = format_wib(wib_now())
                    point["used_reference"] = used_reference
                    read_count += 1
                except Exception as exc:
                    fallback_reference = normalize_avr_reference(
                        point.get("fallback_reference"),
                        device.get("ied_name"),
                        device.get("logical_device"),
                    )
                    if fallback_reference:
                        try:
                            fc = get_avr_fc(point.get("fc"))
                            raw_value = await connection.read(fallback_reference, fc)
                            coerced_value = coerce_avr_value(raw_value, point.get("value_type"))
                            point["raw_value"] = coerced_value
                            point["value"] = scale_avr_point_value(point, coerced_value)
                            point["quality"] = "valid"
                            point["timestamp"] = format_wib(wib_now())
                            point["used_reference"] = fallback_reference
                            read_count += 1
                        except Exception as fallback_exc:
                            point["quality"] = "invalid"
                            point["last_error"] = str(fallback_exc) or fallback_exc.__class__.__name__
                            error_count += 1
                    else:
                        point["quality"] = "invalid"
                        point["last_error"] = str(exc) or exc.__class__.__name__
                        error_count += 1

                point_groups[group_name].append(point)
    finally:
        await connection.disconnect()

    return point_groups, read_count, total_count, error_count

def avr_point_is_active(point):
    value = point.get("value")
    if isinstance(value, bool):
        return value
    if isinstance(value, (int, float)):
        return value != point.get("normal_value", 0)
    if isinstance(value, str):
        return value.strip().lower() in {"1", "true", "on", "active", "alarm"}
    return False

def avr_point_state_key(device_id, group_name, point_key):
    return f"avr_point_state::{device_id}::{group_name}::{point_key}"

def avr_point_attempt_key(device_id, group_name, point_key):
    return f"avr_point_notification_attempt::{device_id}::{group_name}::{point_key}"

def avr_active_point_set_key(device_id, group_name):
    return f"avr_active_point_set::{device_id}::{group_name}"

def avr_active_indication_set_key(device_id):
    return f"avr_active_indication_set::{device_id}"

def avr_active_indication_candidate_key(device_id):
    return f"avr_active_indication_candidate::{device_id}"

def avr_normal_attempt_key(device_id):
    return f"avr_normal_notification_attempt::{device_id}"

def avr_status_snapshot_key(device_id):
    return f"avr_status_snapshot::{device_id}"

def avr_status_attempt_key(device_id):
    return f"avr_status_notification_attempt::{device_id}"

def avr_status_candidate_key(device_id):
    return f"avr_status_candidate::{device_id}"

def format_avr_notification_value(point):
    value = point.get("value")
    if isinstance(value, bool):
        return "ON" if value else "OFF"
    if value is None or value == "":
        return "-"

    unit = str(point.get("unit") or "").strip()
    if isinstance(value, float):
        text = f"{value:.3f}".rstrip("0").rstrip(".")
    else:
        text = str(value)
    return f"{text} {unit}".strip()

def avr_notification_alarm_only(device):
    device_id = str(device.get("id") or "").strip()
    if device_id in AVR_ALARM_ONLY_NOTIFICATION_DEVICE_IDS:
        return True

    ip = str(device.get("ip") or "").strip()
    if ip in AVR_ALARM_ONLY_NOTIFICATION_IPS:
        return True

    source_file = str(device.get("source_file") or "").strip().upper()
    if source_file in AVR_ALARM_ONLY_NOTIFICATION_SOURCE_FILES:
        return True

    name_text = " ".join([
        str(device.get("nama_gi") or ""),
        str(device.get("nama_bay") or ""),
    ]).upper()
    if "NEW TAMBUN" not in name_text:
        return False
    if "TRAFO 1" in name_text or "TRAFO 2" in name_text:
        return True
    return False

def should_notify_avr_point(device, group_name, point):
    if avr_notification_alarm_only(device) and group_name not in {"alarm_points", "status_points"}:
        return False
    return point.get("whatsapp", True) is not False

def build_avr_point_active_message(device, point, group_name, waktu):
    status_label = "ALARM AVR AKTIF" if group_name == "alarm_points" else "LED AVR AKTIF"
    return notification_event_template(
        device.get("nama_gi", "-"),
        device.get("nama_bay", "-"),
        waktu,
        "AVR",
        ip=device.get("ip", ""),
        status=status_label,
        indikasi_lines=[
            f"{point.get('label', point.get('key', '-'))} = {format_avr_notification_value(point)}",
        ],
    )

def build_avr_normal_message(device, state, waktu):
    if avr_notification_alarm_only(device):
        indikasi_lines = [
            "SEMUA ALARM AVR SUDAH HILANG",
            f"ACTIVE ALARM = {len(state.get('active_alarms') or [])}",
        ]
    else:
        indikasi_lines = [
            "SEMUA ALARM / LED INDIKASI SUDAH HILANG",
            f"ACTIVE ALARM = {len(state.get('active_alarms') or [])}",
            f"ACTIVE LED = {len(state.get('active_leds') or [])}",
        ]
    return notification_event_template(
        device.get("nama_gi", "-"),
        device.get("nama_bay", "-"),
        waktu,
        "AVR",
        ip=device.get("ip", ""),
        status="NORMAL",
        indikasi_lines=indikasi_lines,
    )

def build_avr_status_change_message(device, changed_points, waktu):
    return notification_event_template(
        device.get("nama_gi", "-"),
        device.get("nama_bay", "-"),
        waktu,
        "AVR",
        ip=device.get("ip", ""),
        status="PERUBAHAN STATUS / INDIKASI",
        indikasi_lines=[
            f"{point.get('label', point.get('key', '-'))} = {format_avr_notification_value(point)}"
            for point in changed_points
        ],
    )

def handle_avr_point_notifications(device, state, waktu):
    device_id = device["id"]
    active_points_by_key = {}
    active_keys_by_group = {}

    for group_name in ("alarm_points", "led_points"):
        valid_points = [
            point for point in state.get(group_name) or []
            if point.get("quality") != "invalid"
            and point.get("key")
            and should_notify_avr_point(device, group_name, point)
        ]
        active_points = [point for point in valid_points if avr_point_is_active(point)]
        active_keys = {str(point.get("key")) for point in active_points}
        active_keys_by_group[group_name] = active_keys

        for point in valid_points:
            point_key = str(point.get("key", ""))
            is_active = point_key in active_keys
            db.set_setting(avr_point_state_key(device_id, group_name, point_key), "1" if is_active else "0")
            if not is_active:
                db.delete_setting(avr_point_attempt_key(device_id, group_name, point_key))

        for point in active_points:
            active_points_by_key[f"{group_name}:{point.get('key')}"] = (group_name, point)

    current_active_keys = set(active_points_by_key.keys())
    aggregate_key = avr_active_indication_set_key(device_id)
    previous_raw = db.get_setting(aggregate_key, None)
    for group_name, active_keys in active_keys_by_group.items():
        db.set_setting(avr_active_point_set_key(device_id, group_name), json.dumps(sorted(active_keys)))

    if previous_raw is None:
        db.set_setting(aggregate_key, json.dumps(sorted(current_active_keys)))
        clear_notification_candidate(avr_active_indication_candidate_key(device_id))
    else:
        try:
            previous_active_keys_raw = set(json.loads(previous_raw))
        except Exception:
            previous_active_keys_raw = set()
        previous_active_keys = previous_active_keys_raw
        if avr_notification_alarm_only(device):
            previous_active_keys = {
                key for key in previous_active_keys_raw
                if str(key).startswith("alarm_points:")
            }
            if previous_active_keys != previous_active_keys_raw:
                db.set_setting(aggregate_key, json.dumps(sorted(previous_active_keys)))

        candidate_key = avr_active_indication_candidate_key(device_id)
        if current_active_keys == previous_active_keys:
            clear_notification_candidate(candidate_key)
        else:
            confirmed, seen_count = update_notification_candidate(
                candidate_key,
                "active_keys",
                sorted(current_active_keys),
                AVR_POINT_NOTIFICATION_CONFIRM_POLLS,
            )
            if not confirmed:
                print(
                    f"[AVR CHANGE HOLD] {device['nama_gi']} - {device['nama_bay']}: "
                    f"indikasi aktif menunggu konfirmasi "
                    f"{seen_count}/{AVR_POINT_NOTIFICATION_CONFIRM_POLLS}."
                )
                current_active_keys = previous_active_keys

        changed_active_keys = current_active_keys - previous_active_keys
        sent_active_keys = set(previous_active_keys & current_active_keys)
        for active_key in sorted(changed_active_keys):
            group_name, point = active_points_by_key[active_key]
            point_key = str(point.get("key"))
            attempt_key = avr_point_attempt_key(device_id, group_name, point_key)
            last_attempt = float(db.get_setting(attempt_key, "0") or 0)
            now = time.time()
            if now - last_attempt < AVR_POINT_NOTIFICATION_RETRY_DETIK:
                continue

            db.set_setting(attempt_key, str(now))
            sent = send_whatsapp_notification(build_avr_point_active_message(device, point, group_name, waktu))
            if sent:
                sent_active_keys.add(active_key)
                db.delete_setting(attempt_key)
                print(
                    f"[AVR NOTIFICATION] {device['nama_gi']} - {device['nama_bay']}: "
                    f"{group_name} {point.get('label', point_key)} terkirim ke WhatsApp."
                )
            else:
                print(
                    f"[AVR NOTIFICATION FAILED] {device['nama_gi']} - {device['nama_bay']}: "
                    f"{group_name} {point.get('label', point_key)} belum terkirim. "
                    "Akan dicoba lagi setelah jeda aman."
                )

        if previous_active_keys and not current_active_keys:
            attempt_key = avr_normal_attempt_key(device_id)
            last_attempt = float(db.get_setting(attempt_key, "0") or 0)
            now = time.time()
            if now - last_attempt >= AVR_POINT_NOTIFICATION_RETRY_DETIK:
                db.set_setting(attempt_key, str(now))
                sent = send_whatsapp_notification(build_avr_normal_message(device, state, waktu))
                if sent:
                    db.delete_setting(attempt_key)
                    sent_active_keys = set()
                    print(f"[AVR NORMAL] {device['nama_gi']} - {device['nama_bay']}: normal terkirim ke WhatsApp.")

        if current_active_keys:
            db.set_setting(aggregate_key, json.dumps(sorted(sent_active_keys)))
        elif not previous_active_keys:
            db.set_setting(aggregate_key, json.dumps([]))
        elif not db.get_setting(avr_normal_attempt_key(device_id), ""):
            db.set_setting(aggregate_key, json.dumps([]))
        if current_active_keys == set(active_points_by_key.keys()) and current_active_keys != previous_active_keys:
            clear_notification_candidate(candidate_key)

    valid_status_points = [
        point for point in state.get("status_points") or []
        if point.get("quality") != "invalid"
        and point.get("key")
        and should_notify_avr_point(device, "status_points", point)
    ]
    status_snapshot = {
        str(point.get("key")): point.get("value")
        for point in valid_status_points
    }
    snapshot_key = avr_status_snapshot_key(device_id)
    previous_status_raw = db.get_setting(snapshot_key, None)
    if previous_status_raw is None:
        db.set_setting(snapshot_key, json.dumps(status_snapshot, ensure_ascii=True))
        return

    previous_status = safe_json_dict(previous_status_raw)
    changed_status_points = [
        point for point in valid_status_points
        if previous_status.get(str(point.get("key"))) != point.get("value")
    ]
    if not changed_status_points:
        db.set_setting(snapshot_key, json.dumps(status_snapshot, ensure_ascii=True))
        db.delete_setting(avr_status_attempt_key(device_id))
        clear_notification_candidate(avr_status_candidate_key(device_id))
        return

    status_candidate_key = avr_status_candidate_key(device_id)
    confirmed, seen_count = update_notification_candidate(
        status_candidate_key,
        "snapshot",
        status_snapshot,
        AVR_POINT_NOTIFICATION_CONFIRM_POLLS,
    )
    if not confirmed:
        print(
            f"[AVR STATUS HOLD] {device['nama_gi']} - {device['nama_bay']}: "
            f"perubahan status menunggu konfirmasi {seen_count}/{AVR_POINT_NOTIFICATION_CONFIRM_POLLS}."
        )
        return

    attempt_key = avr_status_attempt_key(device_id)
    last_attempt = float(db.get_setting(attempt_key, "0") or 0)
    now = time.time()
    if now - last_attempt < AVR_POINT_NOTIFICATION_RETRY_DETIK:
        return

    db.set_setting(attempt_key, str(now))
    sent = send_whatsapp_notification(build_avr_status_change_message(device, changed_status_points, waktu))
    if sent:
        db.set_setting(snapshot_key, json.dumps(status_snapshot, ensure_ascii=True))
        db.delete_setting(attempt_key)
        clear_notification_candidate(status_candidate_key)
        print(f"[AVR STATUS] {device['nama_gi']} - {device['nama_bay']}: perubahan status terkirim ke WhatsApp.")

def build_empty_avr_state(device, connected=False, last_poll_time="", status_message=None, point_groups=None):
    point_groups = point_groups or {}
    measurement_points = clone_avr_points(point_groups.get("measurement_points", device.get("measurement_points", [])))
    setting_points = clone_avr_points(point_groups.get("setting_points", device.get("setting_points", [])))
    status_points = clone_avr_points(point_groups.get("status_points", device.get("status_points", [])))
    alarm_points = clone_avr_points(point_groups.get("alarm_points", device.get("alarm_points", [])))
    led_points = clone_avr_points(point_groups.get("led_points", device.get("led_points", [])))
    active_alarms = [point for point in alarm_points if avr_point_is_active(point)]
    active_leds = [point for point in led_points if avr_point_is_active(point)]

    setting_index = next(
        (
            point.get("value") if point.get("value") is not None else point.get("configured_value")
            for point in setting_points
            if point.get("key") == "active_setting_index"
        ),
        None,
    )
    active_setting_key = f"setting_{setting_index}" if setting_index not in (None, "") else "setting_1"
    active_setting = next(
        (point for point in setting_points if point.get("key") == active_setting_key),
        next((point for point in setting_points if point.get("key") == "setting_1"), {}),
    )

    return {
        "id": device["id"],
        "nama_gi": device["nama_gi"],
        "nama_bay": device["nama_bay"],
        "ip": device["ip"],
        "port": int(device.get("port") or 102),
        "ied_name": device.get("ied_name", ""),
        "access_point": device.get("access_point", ""),
        "logical_device": device.get("logical_device", ""),
        "vendor": device.get("vendor", ""),
        "model": device.get("model", ""),
        "software_revision": device.get("software_revision", ""),
        "config_revision": device.get("config_revision", ""),
        "source_file": device.get("source_file", ""),
        "source": device.get("source", "default"),
        "is_manual": bool(device.get("is_manual", False)),
        "connected": bool(connected),
        "last_poll_time": last_poll_time,
        "status_message": status_message or "Belum ada polling AVR.",
        "measurement_points": measurement_points,
        "setting_points": setting_points,
        "status_points": status_points,
        "alarm_points": alarm_points,
        "led_points": led_points,
        "active_alarms": active_alarms,
        "active_leds": active_leds,
        "active_setting_value": active_setting.get("value")
        if active_setting.get("value") is not None
        else active_setting.get("configured_value"),
        "active_setting_reference": active_setting.get("reference", ""),
        "data_source": device.get("source_file", "REG.scd"),
    }

def kapasitor_point(group, label, key, reference, fc="MX", value_type="float", unit="", normal_value=None, fallback_reference=None):
    point = {
        "group": group,
        "label": label,
        "key": key,
        "reference": reference,
        "fc": fc,
        "unit": unit,
        "value_type": value_type,
    }
    if fallback_reference:
        point["fallback_reference"] = fallback_reference
    if normal_value is not None:
        point["normal_value"] = normal_value
    return point

DEFAULT_KAPASITOR_DEVICES = [
    {
        "id": "kapasitor-gi-tambun-bcu",
        "nama_gi": "GI Tambun",
        "nama_bay": "Bay Kapasitor GI Tambun",
        "ip": "172.20.31.84",
        "port": 102,
        "ied_name": "D50",
        "access_point": "P1",
        "logical_device": "",
        "vendor": "NR",
        "model": "BCU Kapasitor",
        "source_file": "BCU KAPASITOR GI TAMBUN.scd",
        "source": "default_scd",
        "is_manual": False,
        "point_group_names": KAPASITOR_POINT_GROUPS,
        "metering_points": [
            kapasitor_point("metering_points", "RN", "v_rn", "D50MEAS/MMXU1.PhV.phsA.cVal.mag.f", unit="kV"),
            kapasitor_point("metering_points", "SN", "v_sn", "D50MEAS/MMXU1.PhV.phsB.cVal.mag.f", unit="kV"),
            kapasitor_point("metering_points", "TN", "v_tn", "D50MEAS/MMXU1.PhV.phsC.cVal.mag.f", unit="kV"),
            kapasitor_point("metering_points", "RS", "v_rs", "D50MEAS/MMXU1.PPV.phsAB.cVal.mag.f", unit="kV"),
            kapasitor_point("metering_points", "ST", "v_st", "D50MEAS/MMXU1.PPV.phsBC.cVal.mag.f", unit="kV"),
            kapasitor_point("metering_points", "TR", "v_tr", "D50MEAS/MMXU1.PPV.phsCA.cVal.mag.f", unit="kV"),
            kapasitor_point("metering_points", "Arus R", "i_r", "D50MEAS/MMXU1.A.phsA.cVal.mag.f", unit="A"),
            kapasitor_point("metering_points", "Arus S", "i_s", "D50MEAS/MMXU1.A.phsB.cVal.mag.f", unit="A"),
            kapasitor_point("metering_points", "Arus T", "i_t", "D50MEAS/MMXU1.A.phsC.cVal.mag.f", unit="A"),
            kapasitor_point("metering_points", "Arus N", "i_n", "D50MEAS/MMXU1.A.net.cVal.mag.f", unit="A"),
        ],
        "angle_points": [
            kapasitor_point("angle_points", "Sudut RN", "ang_v_rn", "D50MEAS/MMXU1.PhV.phsA.cVal.ang.f", unit="deg"),
            kapasitor_point("angle_points", "Sudut SN", "ang_v_sn", "D50MEAS/MMXU1.PhV.phsB.cVal.ang.f", unit="deg"),
            kapasitor_point("angle_points", "Sudut TN", "ang_v_tn", "D50MEAS/MMXU1.PhV.phsC.cVal.ang.f", unit="deg"),
            kapasitor_point("angle_points", "Sudut RS", "ang_v_rs", "D50MEAS/MMXU1.PPV.phsAB.cVal.ang.f", unit="deg"),
            kapasitor_point("angle_points", "Sudut ST", "ang_v_st", "D50MEAS/MMXU1.PPV.phsBC.cVal.ang.f", unit="deg"),
            kapasitor_point("angle_points", "Sudut TR", "ang_v_tr", "D50MEAS/MMXU1.PPV.phsCA.cVal.ang.f", unit="deg"),
            kapasitor_point("angle_points", "Sudut Arus R", "ang_i_r", "D50MEAS/MMXU1.A.phsA.cVal.ang.f", unit="deg"),
            kapasitor_point("angle_points", "Sudut Arus S", "ang_i_s", "D50MEAS/MMXU1.A.phsB.cVal.ang.f", unit="deg"),
            kapasitor_point("angle_points", "Sudut Arus T", "ang_i_t", "D50MEAS/MMXU1.A.phsC.cVal.ang.f", unit="deg"),
        ],
        "power_points": [
            kapasitor_point("power_points", "Daya Aktif", "p_total", "D50MEAS/MMXU1.TotW.mag.f", unit="MW"),
            kapasitor_point("power_points", "Daya Reaktif", "q_total", "D50MEAS/MMXU1.TotVAr.mag.f", unit="MVAr"),
            kapasitor_point("power_points", "Daya Semu", "s_total", "D50MEAS/MMXU1.TotVA.mag.f", unit="MVA"),
            kapasitor_point("power_points", "Power Factor", "pf", "D50MEAS/MMXU1.TotPF.mag.f"),
            kapasitor_point("power_points", "Frekuensi", "freq", "D50MEAS/MMXU1.Hz.mag.f", unit="Hz"),
        ],
        "status_points": [
            kapasitor_point("status_points", "CB 150kV Kapasitor", "cb_q50", "D50CTRL/XCBR1.Pos.stVal", fc="ST", value_type="text", fallback_reference="D50CTRL/XCBR1.Pos"),
            kapasitor_point("status_points", "DS Bus A", "ds_q21", "D50CTRL/XCBR2.Pos.stVal", fc="ST", value_type="text", fallback_reference="D50CTRL/XCBR2.Pos"),
            kapasitor_point("status_points", "DS Bus B", "ds_q22", "D50CTRL/XSWI1.Pos.stVal", fc="ST", value_type="text", fallback_reference="D50CTRL/XSWI1.Pos"),
            kapasitor_point("status_points", "DS Earthing", "es_q38", "D50CTRL/XSWI2.Pos.stVal", fc="ST", value_type="text", fallback_reference="D50CTRL/XSWI2.Pos"),
        ],
    },
]

def get_kapasitor_devices():
    return [normalize_avr_device_references(json.loads(json.dumps(device))) for device in DEFAULT_KAPASITOR_DEVICES]

def build_empty_kapasitor_state(
    device,
    connected=False,
    last_poll_time="",
    status_message=None,
    point_groups=None,
    tcp_connected=None,
):
    point_groups = point_groups or {}
    tcp_status = bool(connected) if tcp_connected is None else bool(tcp_connected)
    state = {
        "id": device["id"],
        "nama_gi": device["nama_gi"],
        "nama_bay": device["nama_bay"],
        "ip": device["ip"],
        "port": int(device.get("port") or 102),
        "ied_name": device.get("ied_name", ""),
        "access_point": device.get("access_point", ""),
        "vendor": device.get("vendor", ""),
        "model": device.get("model", ""),
        "source_file": device.get("source_file", ""),
        "source": device.get("source", "default_scd"),
        "connected": bool(connected),
        "tcp_connected": tcp_status,
        "communication_status": "mms_online" if bool(connected) else ("tcp_only" if tcp_status else "offline"),
        "last_poll_time": last_poll_time,
        "status_message": status_message or "Belum ada polling kapasitor.",
    }
    total_points = 0
    valid_points = 0
    invalid_points = 0
    for group_name in KAPASITOR_POINT_GROUPS:
        points = clone_avr_points(point_groups.get(group_name, device.get(group_name, [])))
        state[group_name] = points
        total_points += len(points)
        valid_points += len([point for point in points if point.get("quality") == "valid"])
        invalid_points += len([point for point in points if point.get("quality") == "invalid"])
    state["point_count"] = total_points
    state["valid_point_count"] = valid_points
    state["invalid_point_count"] = invalid_points
    state["readiness"] = {
        "ready": bool(connected) and invalid_points == 0 and valid_points > 0,
        "label": "READY" if bool(connected) and invalid_points == 0 and valid_points > 0 else "CHECK",
        "failed": [point.get("label") for point in state["status_points"] if point.get("quality") == "invalid"],
    }
    return state

initial_whatsapp_recovery_recap_pending = (
    db.get_setting(WHATSAPP_RECOVERY_RECAP_PENDING_KEY, "0") == "1"
)
# Hapus riwayat alarm lama saat server mulai, rekam baru sejak startup.
db.clear_all_dc_alarm_events()

app_state = {
    "auto_polling_active": db.get_setting("dc_auto_polling_active", "1") == "1",
    "last_scan_data": [],
    "last_scan_time": None,
    "last_scan_duration_seconds": 0,
    "is_scanning": False,
    "alarm_history": [],
    "trend_data": {},
    "daftar_gi": db.get_gi_devices(),
    "annunciator": build_empty_annunciator_state(ANNUNCIATOR_SOURCES[0]),
    "annunciators": {
        source["id"]: build_empty_annunciator_state(source)
        for source in ANNUNCIATOR_SOURCES
    },
    "annunciator_history": db.list_annunciator_events(),
    "annunciator_active_ports": {
        source["id"]: db.get_active_annunciator_ports(source["id"])
        for source in ANNUNCIATOR_SOURCES
    },
    "annunciator_failure_counts": {
        source["id"]: 0
        for source in ANNUNCIATOR_SOURCES
    },
    "annunciator_auto_polling_active": db.get_setting("annunciator_auto_polling_active", "1") == "1",
    "pqm_devices": [build_empty_pqm_state(device) for device in db.get_pqm_devices_with_latest_reading()],
    "pqm_last_scan_time": None,
    "pqm_is_scanning": False,
    "pqm_failure_counts": {},
    "avr_devices": [build_empty_avr_state(device) for device in get_avr_devices()],
    "avr_last_scan_time": None,
    "avr_is_scanning": False,
    "avr_failure_counts": {},
    "avr_auto_polling_active": db.get_setting("avr_auto_polling_active", "1") == "1",
    "kapasitor_devices": [build_empty_kapasitor_state(device) for device in get_kapasitor_devices()],
    "kapasitor_last_scan_time": None,
    "kapasitor_is_scanning": False,
    "kapasitor_auto_polling_active": db.get_setting("kapasitor_auto_polling_active", "1") == "1",
    "ar_devices": [build_empty_ar_state(device) for device in get_ar_devices()],
    "ar_events": db.list_ar_events(limit=300),
    "ar_last_scan_time": None,
    "ar_is_scanning": False,
    "ar_auto_polling_active": db.get_setting("ar_auto_polling_active", "1") == "1",
    "dfr_devices": [build_empty_dfr_state(device) for device in get_dfr_devices()],
    "dfr_last_scan_time": None,
    "dfr_is_scanning": False,
    "dfr_auto_polling_active": db.get_setting("dfr_auto_polling_active", "1") == "1",
    "whatsapp_recovery_recap_pending": initial_whatsapp_recovery_recap_pending,
    "whatsapp_recovery_recap_not_before": (
        time.monotonic() + WHATSAPP_RECOVERY_CHECK_SECONDS
        if initial_whatsapp_recovery_recap_pending
        else 0
    ),
    "whatsapp_recovery_notice_sent_this_run": False,
    "whatsapp_outbox_pending_count": db.count_pending_whatsapp_messages(),
    "auth_sessions": {},
    "login_rate_limits": {},
}

app_locks = {
    "dc_scan": threading.Lock(),
    "pqm_scan": threading.Lock(),
    "pme_report_scan": threading.Lock(),
    "avr_scan": threading.Lock(),
    "kapasitor_scan": threading.Lock(),
    "ar_scan": threading.Lock(),
    "annunciator_scan": threading.Lock(),
    "dfr_scan": threading.Lock(),
    "auth": threading.RLock(),
}

whatsapp_send_lock = threading.Lock()
telegram_send_lock = threading.Lock()
secondary_notification_lock = threading.Lock()
secondary_notification_executor = ThreadPoolExecutor(max_workers=4, thread_name_prefix="secondary-notify")
whatsapp_recent_message_times = {}
whatsapp_last_sent_at = 0.0
whatsapp_sent_window_times = []
whatsapp_recent_document_times = {}
whatsapp_last_document_sent_at = 0.0
whatsapp_document_sent_window_times = []
dfr_session = requests.Session()

def mask_identifier(value, visible=4):
    text = str(value or "").strip()
    if len(text) <= visible * 2:
        return "***"
    return f"{text[:visible]}...{text[-visible:]}"

def whatsapp_gateway_mode():
    mode = str(WHATSAPP_GATEWAY_MODE or "waha").strip().lower()
    if mode in {"waha", "wa-ha"}:
        return "waha"
    if mode in {"mpwa", "mp-wa"}:
        return "mpwa"
    return "waha"

def is_whatsapp_waha_gateway():
    return whatsapp_gateway_mode() == "waha"

def is_whatsapp_mpwa_gateway():
    return whatsapp_gateway_mode() == "mpwa"

def redact_telegram_error(value):
    text = str(value or "")
    token = str(TELEGRAM_BOT_TOKEN or "").strip()
    if token:
        text = text.replace(token, "<redacted>")
    return text

def redact_supabase_error(value):
    text = str(value or "")
    api_key = str(SUPABASE_API_KEY or "").strip()
    edge_secret = str(SUPABASE_EDGE_SECRET or "").strip()
    if api_key:
        text = text.replace(api_key, "<redacted>")
    if edge_secret:
        text = text.replace(edge_secret, "<redacted>")
    return text

def is_telegram_configured():
    return bool(
        TELEGRAM_ENABLED
        and str(TELEGRAM_BOT_TOKEN or "").strip()
        and str(TELEGRAM_CHAT_ID or "").strip()
    )

def normalize_telegram_message(message):
    text = html.unescape(str(message or "")).strip()
    if len(text) <= TELEGRAM_MAX_MESSAGE_LENGTH:
        return text

    suffix = f"\n\n[Pesan Telegram dipotong otomatis oleh {APP_BRAND_NAME}.]"
    max_body_length = max(1, TELEGRAM_MAX_MESSAGE_LENGTH - len(suffix))
    return text[:max_body_length].rstrip() + suffix

def build_telegram_api_url(method):
    base_url = str(TELEGRAM_API_BASE_URL or "https://api.telegram.org").rstrip("/")
    return f"{base_url}/bot{TELEGRAM_BOT_TOKEN}/{method}"

def build_telegram_url():
    return build_telegram_api_url("sendMessage")

def post_telegram_payload(message):
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": normalize_telegram_message(message),
        "disable_web_page_preview": True,
    }
    if str(TELEGRAM_PARSE_MODE or "").strip():
        payload["parse_mode"] = str(TELEGRAM_PARSE_MODE).strip()

    response = requests.post(
        build_telegram_url(),
        data=payload,
        timeout=TELEGRAM_TIMEOUT_DETIK,
    )
    response_text = str(getattr(response, "text", "") or "")
    if not response.ok:
        return False, f"HTTP {response.status_code}", response_text

    try:
        data = response.json()
    except ValueError:
        return False, "Response Telegram bukan JSON.", response_text

    if not data.get("ok"):
        description = data.get("description") or response_text or "Telegram menolak pesan."
        return False, str(description), response_text

    return True, "ok", response_text

def send_telegram_notification(message: str):
    normalized_message = normalize_telegram_message(message)
    if not normalized_message:
        return False

    if not is_telegram_configured():
        print("[TELEGRAM SKIPPED] Konfigurasi Telegram belum lengkap atau Telegram dinonaktifkan.")
        return False

    with telegram_send_lock:
        try:
            ok, result, response_text = post_telegram_payload(normalized_message)
            if ok:
                print(f"[TELEGRAM] Notifikasi terkirim ke {mask_identifier(TELEGRAM_CHAT_ID)}.")
                return True
            print(f"[TELEGRAM FAILED] Gagal kirim Telegram: {redact_telegram_error(result)} {redact_telegram_error(response_text[:300])}")
            return False
        except Exception as exc:
            print(f"[TELEGRAM FAILED] Gagal kirim Telegram ke {mask_identifier(TELEGRAM_CHAT_ID)}: {redact_telegram_error(exc)}")
            return False

def normalize_telegram_document_caption(caption):
    text = html.unescape(str(caption or "")).strip()
    if len(text) <= TELEGRAM_DOCUMENT_CAPTION_MAX_LENGTH:
        return text

    suffix = f"\n\n[Caption dipotong otomatis oleh {APP_BRAND_NAME}.]"
    max_body_length = max(1, TELEGRAM_DOCUMENT_CAPTION_MAX_LENGTH - len(suffix))
    return text[:max_body_length].rstrip() + suffix

def post_telegram_document_payload(document_path, caption=""):
    normalized_caption = normalize_telegram_document_caption(caption)
    with open(document_path, "rb") as document_file:
        files = {
            "document": (os.path.basename(document_path), document_file, "application/pdf"),
        }
        data = {
            "chat_id": TELEGRAM_CHAT_ID,
            "caption": normalized_caption,
        }
        if str(TELEGRAM_PARSE_MODE or "").strip():
            data["parse_mode"] = str(TELEGRAM_PARSE_MODE).strip()

        response = requests.post(
            build_telegram_api_url("sendDocument"),
            data=data,
            files=files,
            timeout=max(TELEGRAM_TIMEOUT_DETIK, WHATSAPP_DOCUMENT_TIMEOUT_DETIK),
        )

    response_text = str(getattr(response, "text", "") or "")
    if not response.ok:
        return False, f"HTTP {response.status_code}", response_text

    try:
        data = response.json()
    except ValueError:
        return False, "Response Telegram bukan JSON.", response_text

    if not data.get("ok"):
        description = data.get("description") or response_text or "Telegram menolak dokumen."
        return False, str(description), response_text

    return True, "ok", response_text

def send_telegram_document(document_path, caption=""):
    if not os.path.exists(document_path):
        print(f"[TELEGRAM DOCUMENT SKIPPED] File dokumen tidak ditemukan: {os.path.basename(str(document_path))}")
        return False

    if not is_telegram_configured():
        print("[TELEGRAM DOCUMENT SKIPPED] Konfigurasi Telegram belum lengkap atau Telegram dinonaktifkan.")
        return False

    with telegram_send_lock:
        try:
            ok, result, response_text = post_telegram_document_payload(document_path, caption)
            if ok:
                print(f"[TELEGRAM DOCUMENT] Dokumen terkirim ke {mask_identifier(TELEGRAM_CHAT_ID)}: {os.path.basename(document_path)}")
                return True
            print(f"[TELEGRAM DOCUMENT FAILED] Gagal kirim dokumen: {redact_telegram_error(result)} {redact_telegram_error(response_text[:300])}")
            return False
        except Exception as exc:
            print(f"[TELEGRAM DOCUMENT FAILED] Gagal kirim dokumen ke {mask_identifier(TELEGRAM_CHAT_ID)}: {redact_telegram_error(exc)}")
            return False

def is_supabase_edge_configured():
    return bool(
        SUPABASE_EDGE_ENABLED
        and str(SUPABASE_EDGE_FUNCTION_URL or "").strip()
        and str(SUPABASE_EDGE_SECRET or "").strip()
    )

def build_supabase_edge_payload(message, source=None, sender=None):
    return {
        "source": str(source or SUPABASE_EDGE_SOURCE or "direct_voltkraft"),
        "sender": str(sender or SUPABASE_EDGE_SENDER or APP_BRAND_NAME),
        "text": str(message or "").strip(),
    }

def send_supabase_edge_notification_text(message, source=None, sender=None):
    text = str(message or "").strip()
    if not text:
        return False

    if not is_supabase_edge_configured():
        print("[SUPABASE EDGE SKIPPED] Konfigurasi Edge Function belum lengkap atau dinonaktifkan.")
        return False

    payload = build_supabase_edge_payload(text, source=source, sender=sender)
    headers = {
        "X-Telegram-Bot-Api-Secret-Token": str(SUPABASE_EDGE_SECRET or "").strip(),
    }

    try:
        response = requests.post(
            str(SUPABASE_EDGE_FUNCTION_URL or "").strip(),
            headers=headers,
            json=payload,
            timeout=SUPABASE_TIMEOUT_DETIK,
        )
        response_text = str(getattr(response, "text", "") or "")
        if response.ok:
            print("[SUPABASE EDGE] Notifikasi terkirim ke Edge Function.")
            return True
        print(
            "[SUPABASE EDGE FAILED] Gagal kirim ke Edge Function: "
            f"HTTP {response.status_code} {redact_supabase_error(response_text[:500])}"
        )
        return False
    except Exception as exc:
        print(f"[SUPABASE EDGE FAILED] Gagal koneksi Edge Function: {redact_supabase_error(exc)}")
        return False

def secondary_notification_category(message):
    text = str(message or "").strip()
    if not text:
        return ""

    upper_text = text.upper()
    connection_markers = (
        "WHATSAPP GATEWAY",
        "GATEWAY WHATSAPP SUDAH TERHUBUNG",
        "WA/SERVER ONLINE",
        "SERVER ONLINE",
        "SERVER TERHUBUNG",
        "TERHUBUNG KEMBALI",
    )
    if any(marker in upper_text for marker in connection_markers):
        return "connection"

    return "message"

def secondary_notification_identity(message, category):
    text = str(message or "").strip()
    normalized_lines = []
    for line in text.splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        if re.fullmatch(r"\d{2}-\d{2}-\d{4}\s+\d{2}:\d{2}:\d{2}(?:\.\d+)?", stripped):
            continue
        stripped = re.sub(r"\d{2}-\d{2}-\d{4}\s+\d{2}:\d{2}:\d{2}(?:\.\d+)?", "<time>", stripped)
        stripped = re.sub(r"\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}", "<time>", stripped)
        normalized_lines.append(stripped)

    identity_source = "\n".join(normalized_lines) or text
    digest = hashlib.sha256(identity_source.encode("utf-8", errors="ignore")).hexdigest()[:24]
    if category == "connection":
        return "connection"
    return digest

def secondary_notification_recently_sent(channel, identity, ttl_seconds):
    key = f"secondary_notification_sent::{channel}::{identity}"
    try:
        last_sent = float(db.get_setting(key, "0") or 0)
    except (TypeError, ValueError):
        last_sent = 0
    now = time.time()
    if last_sent > 0 and now - last_sent < ttl_seconds:
        return True, key
    return False, key

def send_secondary_notification_once(channel, message, sender):
    category = secondary_notification_category(message)
    if not category:
        print(f"[{channel.upper()} SKIPPED] Pesan bukan alarm/anomali atau notif koneksi utama.")
        return False

    identity = secondary_notification_identity(message, category)
    ttl_seconds = (
        SECONDARY_CONNECTION_NOTICE_TTL_DETIK
        if category == "connection"
        else SECONDARY_NOTIFICATION_DUPLICATE_TTL_DETIK
    )
    with secondary_notification_lock:
        recently_sent, setting_key = secondary_notification_recently_sent(channel, identity, ttl_seconds)
        if recently_sent:
            print(f"[{channel.upper()} SKIPPED] Pesan {category} sudah pernah dikirim dalam periode aman.")
            return False
        db.set_setting(setting_key, str(time.time()))

    sent = sender(message)
    if not sent:
        db.delete_setting(setting_key)
    return sent

def send_notification_side_channels(message, send_telegram=True, send_supabase_edge=True):
    results = {}
    if send_telegram:
        results["telegram"] = send_secondary_notification_once("telegram", message, send_telegram_notification)
    if send_supabase_edge:
        results["supabase_edge"] = send_secondary_notification_once("supabase_edge", message, send_supabase_edge_notification_text)
    return results

def submit_secondary_notification(channel, message, sender):
    def task():
        try:
            send_secondary_notification_once(channel, message, sender)
        except Exception as exc:
            print(f"[{channel.upper()} FAILED] Worker notifikasi redundant error: {exc}")

    secondary_notification_executor.submit(task)

def dispatch_notification_side_channels(message, send_telegram=True, send_supabase_edge=True):
    dispatched = {}
    if send_telegram:
        submit_secondary_notification("telegram", message, send_telegram_notification)
        dispatched["telegram"] = "queued"
    if send_supabase_edge:
        submit_secondary_notification("supabase_edge", message, send_supabase_edge_notification_text)
        dispatched["supabase_edge"] = "queued"
    if dispatched:
        print("[NOTIFICATION REDUNDANT] Telegram/Supabase diproses paralel dengan WhatsApp.")
    return dispatched

def is_supabase_configured():
    return bool(
        SUPABASE_ENABLED
        and str(SUPABASE_URL or "").strip()
        and str(SUPABASE_API_KEY or "").strip()
        and str(SUPABASE_NOTIFICATIONS_TABLE or "").strip()
    )

def build_supabase_table_url(table_name=None):
    base_url = str(SUPABASE_URL or "").strip().rstrip("/")
    table = str(table_name or SUPABASE_NOTIFICATIONS_TABLE or "").strip()
    return f"{base_url}/rest/v1/{quote(table)}"

def build_supabase_headers():
    api_key = str(SUPABASE_API_KEY or "").strip()
    return {
        "apikey": api_key,
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
    }

def build_supabase_notification_payload(
    message,
    channel="telegram",
    title="VoltKraft Notification",
    subtitle="",
    module="",
    status="",
    payload=None,
):
    return {
        "source": APP_BRAND_NAME,
        "channel": str(channel or "telegram"),
        "title": str(title or ""),
        "subtitle": str(subtitle or ""),
        "module": str(module or ""),
        "status": str(status or ""),
        "message": str(message or ""),
        "payload": payload or {},
    }

def send_supabase_notification_event(event):
    if not is_supabase_configured():
        print("[SUPABASE SKIPPED] Konfigurasi Supabase belum lengkap atau Supabase dinonaktifkan.")
        return False

    payload = dict(event or {})
    if not str(payload.get("message") or "").strip():
        print("[SUPABASE SKIPPED] Payload Supabase tidak berisi message.")
        return False

    try:
        response = requests.post(
            build_supabase_table_url(),
            headers=build_supabase_headers(),
            json=payload,
            timeout=SUPABASE_TIMEOUT_DETIK,
        )
        response_text = str(getattr(response, "text", "") or "")
        if response.ok:
            print(f"[SUPABASE] Notifikasi tersimpan di table {SUPABASE_NOTIFICATIONS_TABLE}.")
            return True
        print(
            "[SUPABASE FAILED] Gagal simpan notifikasi: "
            f"HTTP {response.status_code} {redact_supabase_error(response_text[:500])}"
        )
        return False
    except Exception as exc:
        print(f"[SUPABASE FAILED] Gagal koneksi Supabase: {redact_supabase_error(exc)}")
        return False

def is_whatsapp_configured():
    if is_whatsapp_waha_gateway():
        return all(
            str(value or "").strip()
            for value in (
                WAHA_BASE_URL,
                WAHA_SESSION,
                WAHA_CHAT_ID,
            )
        )

    return all(
        str(value or "").strip()
        for value in (
            WHATSAPP_ENDPOINT_URL,
            WHATSAPP_API_KEY,
            WHATSAPP_SENDER,
            WHATSAPP_GROUP_NUMBER,
            WHATSAPP_MESSAGE_TYPE,
        )
    )

def normalize_whatsapp_message(message):
    text = html.unescape(str(message or "")).strip()
    if len(text) <= WHATSAPP_MAX_MESSAGE_LENGTH:
        return text

    suffix = f"\n\n[Pesan dipotong otomatis oleh {APP_BRAND_NAME}.]"
    max_body_length = max(1, WHATSAPP_MAX_MESSAGE_LENGTH - len(suffix))
    return text[:max_body_length].rstrip() + suffix

def whatsapp_message_digest(message):
    return hashlib.sha256(str(message or "").encode("utf-8")).hexdigest()

def should_skip_duplicate_whatsapp_message(message, now):
    digest = whatsapp_message_digest(message)
    expired_before = now - WHATSAPP_DUPLICATE_TTL_DETIK

    for old_digest, sent_at in list(whatsapp_recent_message_times.items()):
        if sent_at < expired_before:
            whatsapp_recent_message_times.pop(old_digest, None)

    last_sent = whatsapp_recent_message_times.get(digest)
    if last_sent and now - last_sent < WHATSAPP_DUPLICATE_TTL_DETIK:
        return True, digest

    return False, digest

def prune_whatsapp_sent_window(now):
    if WHATSAPP_MAX_MESSAGES_PER_WINDOW <= 0:
        whatsapp_sent_window_times.clear()
        return

    expired_before = now - WHATSAPP_RATE_LIMIT_WINDOW_DETIK
    while whatsapp_sent_window_times and whatsapp_sent_window_times[0] < expired_before:
        whatsapp_sent_window_times.pop(0)

def whatsapp_rate_limit_allows_send(now):
    if WHATSAPP_MAX_MESSAGES_PER_WINDOW <= 0:
        return True

    prune_whatsapp_sent_window(now)
    return len(whatsapp_sent_window_times) < WHATSAPP_MAX_MESSAGES_PER_WINDOW

def schedule_whatsapp_offline_retry(now=None):
    app_state["whatsapp_offline_retry_after"] = (now or time.monotonic()) + WHATSAPP_OFFLINE_RETRY_SECONDS

def clear_whatsapp_offline_retry():
    app_state["whatsapp_offline_retry_after"] = 0

def should_delay_whatsapp_offline_retry(now):
    try:
        retry_after = float(app_state.get("whatsapp_offline_retry_after") or 0)
    except (TypeError, ValueError):
        retry_after = 0
    return retry_after > now, retry_after

def schedule_whatsapp_recovery_recap():
    if app_state.get("whatsapp_recovery_notice_sent_this_run"):
        print(
            "[WHATSAPP RECOVERY NOTICE SKIPPED] "
            "Notifikasi WA/SERVER ONLINE sudah terkirim pada proses server ini."
        )
        return
    app_state["whatsapp_recovery_recap_pending"] = True
    app_state["whatsapp_recovery_recap_not_before"] = time.monotonic()
    db.set_setting(WHATSAPP_RECOVERY_RECAP_PENDING_KEY, "1")

def is_whatsapp_recovery_recap_pending():
    return (
        app_state.get("whatsapp_recovery_recap_pending")
        or db.get_setting(WHATSAPP_RECOVERY_RECAP_PENDING_KEY, "0") == "1"
    )

def discard_pending_whatsapp_outbox(reason=""):
    if not WHATSAPP_DISCARD_PENDING_ON_RECOVERY:
        return 0

    try:
        discarded_count = db.discard_pending_whatsapp_messages(reason)
        app_state["whatsapp_outbox_pending_count"] = db.count_pending_whatsapp_messages()
        if discarded_count:
            print(
                "[WHATSAPP OUTBOX DISCARDED] "
                f"{discarded_count} pesan tertunda dilewati untuk mencegah spam saat gateway pulih."
            )
        return discarded_count
    except Exception as exc:
        print(f"[WHATSAPP OUTBOX DISCARD FAILED] Gagal melewati antrean lama: {exc}")
        return 0

def mark_whatsapp_connection_state(is_online, allow_recovery_recap=True):
    previous_state = db.get_setting(WHATSAPP_CONNECTION_STATE_KEY, "online")
    current_state = "online" if is_online else "offline"
    db.set_setting(WHATSAPP_CONNECTION_STATE_KEY, current_state)
    if not is_online:
        schedule_whatsapp_offline_retry()
        schedule_whatsapp_recovery_recap()
    else:
        clear_whatsapp_offline_retry()
        if allow_recovery_recap and previous_state == "offline":
            schedule_whatsapp_recovery_recap()

def restore_whatsapp_connection():
    if not WHATSAPP_RECONNECT_URL or not WHATSAPP_SENDER:
        return False

    try:
        response = requests.post(
            WHATSAPP_RECONNECT_URL,
            data={"token": WHATSAPP_SENDER},
            timeout=WHATSAPP_TIMEOUT_DETIK,
        )
        response.raise_for_status()
        try:
            result = response.json()
        except ValueError:
            result = {}

        if isinstance(result, dict) and result.get("status") is False:
            print(f"[WHATSAPP RECONNECT FAILED] Gateway menolak reconnect: {result}")
            return False

        print(f"[WHATSAPP RECONNECT] Koneksi sender {mask_identifier(WHATSAPP_SENDER)} dipulihkan.")
        return True
    except Exception as exc:
        print(f"[WHATSAPP RECONNECT FAILED] Gagal restore koneksi sender {mask_identifier(WHATSAPP_SENDER)}: {exc}")
        return False

def whatsapp_failure_needs_reconnect(result=None, response_text=""):
    haystack = f"{result or ''} {response_text or ''}".lower()
    return any(
        marker in haystack
        for marker in (
            "check your whatsapp connection",
            "connection closed",
            "failed to send message",
            "precondition required",
        )
    )

def build_mpwa_text_payload(message):
    return {
        "api_key": WHATSAPP_API_KEY,
        "sender": WHATSAPP_SENDER,
        "number": WHATSAPP_GROUP_NUMBER,
        "type": WHATSAPP_MESSAGE_TYPE,
        "message": message,
    }

def build_waha_text_payload(message):
    return {
        "session": WAHA_SESSION,
        "chatId": WAHA_CHAT_ID,
        "text": message,
    }

def build_whatsapp_text_payload(message):
    if is_whatsapp_waha_gateway():
        return build_waha_text_payload(message)
    return build_mpwa_text_payload(message)

def post_mpwa_whatsapp_payload(payload):
    response = requests.post(
        WHATSAPP_ENDPOINT_URL,
        data=payload,
        timeout=WHATSAPP_TIMEOUT_DETIK,
    )
    response_text = str(getattr(response, "text", "") or "")
    try:
        result = response.json()
    except ValueError:
        result = None

    if response.status_code >= 400:
        return False, result or {"status_code": response.status_code}, response_text

    if isinstance(result, dict) and (
        result.get("status") is False or result.get("success") is False
    ):
        return False, result, response_text

    return True, result, response_text

def whatsapp_document_digest(document_path, caption="", dedupe_key=""):
    source = str(dedupe_key or "").strip()
    if not source:
        try:
            stat = os.stat(document_path)
            source = f"{os.path.basename(document_path)}:{stat.st_size}:{caption}"
        except OSError:
            source = f"{os.path.basename(document_path)}:{caption}"
    return hashlib.sha256(source.encode("utf-8")).hexdigest()

def secondary_document_category(caption, dedupe_key=""):
    return "document"

def secondary_document_recently_sent(channel, document_digest, ttl_seconds):
    key = f"secondary_document_sent::{channel}::{document_digest}"
    try:
        last_sent = float(db.get_setting(key, "0") or 0)
    except (TypeError, ValueError):
        last_sent = 0
    now = time.time()
    if last_sent > 0 and now - last_sent < ttl_seconds:
        return True, key
    return False, key

def send_secondary_document_once(channel, document_path, caption, dedupe_key, sender):
    category = secondary_document_category(caption, dedupe_key)
    if not category:
        print(f"[{channel.upper()} DOCUMENT SKIPPED] Dokumen tidak perlu redundant.")
        return False

    if not os.path.exists(document_path):
        print(f"[{channel.upper()} DOCUMENT SKIPPED] File dokumen tidak ditemukan: {os.path.basename(str(document_path))}")
        return False

    document_digest = whatsapp_document_digest(document_path, caption, dedupe_key)
    with secondary_notification_lock:
        recently_sent, setting_key = secondary_document_recently_sent(
            channel,
            document_digest,
            SECONDARY_DOCUMENT_DUPLICATE_TTL_DETIK,
        )
        if recently_sent:
            print(f"[{channel.upper()} DOCUMENT SKIPPED] Dokumen sudah pernah dikirim dalam periode aman.")
            return False
        db.set_setting(setting_key, str(time.time()))

    sent = sender(document_path, caption)
    if not sent:
        db.delete_setting(setting_key)
    return sent

def submit_secondary_document(channel, document_path, caption, dedupe_key, sender):
    safe_document_path = str(document_path)
    safe_caption = str(caption or "")
    safe_dedupe_key = str(dedupe_key or "")

    def task():
        try:
            send_secondary_document_once(channel, safe_document_path, safe_caption, safe_dedupe_key, sender)
        except Exception as exc:
            print(f"[{channel.upper()} DOCUMENT FAILED] Worker dokumen redundant error: {exc}")

    secondary_notification_executor.submit(task)

def dispatch_secondary_document_channels(document_path, caption="", dedupe_key="", send_telegram=True):
    dispatched = {}
    if send_telegram:
        submit_secondary_document("telegram", document_path, caption, dedupe_key, send_telegram_document)
        dispatched["telegram"] = "queued"
    if dispatched:
        print("[DOCUMENT REDUNDANT] Dokumen Telegram diproses paralel dengan WhatsApp.")
    return dispatched

def should_skip_duplicate_whatsapp_document(document_digest, now):
    expired_before = now - WHATSAPP_DOCUMENT_DUPLICATE_TTL_DETIK

    for old_digest, sent_at in list(whatsapp_recent_document_times.items()):
        if sent_at < expired_before:
            whatsapp_recent_document_times.pop(old_digest, None)

    last_sent = whatsapp_recent_document_times.get(document_digest)
    if last_sent and now - last_sent < WHATSAPP_DOCUMENT_DUPLICATE_TTL_DETIK:
        return True

    return False

def prune_whatsapp_document_sent_window(now):
    if WHATSAPP_DOCUMENT_MAX_PER_WINDOW <= 0:
        whatsapp_document_sent_window_times.clear()
        return

    expired_before = now - WHATSAPP_DOCUMENT_RATE_LIMIT_WINDOW_DETIK
    while whatsapp_document_sent_window_times and whatsapp_document_sent_window_times[0] < expired_before:
        whatsapp_document_sent_window_times.pop(0)

def whatsapp_document_rate_limit_allows_send(now):
    if WHATSAPP_DOCUMENT_MAX_PER_WINDOW <= 0:
        return True

    prune_whatsapp_document_sent_window(now)
    return len(whatsapp_document_sent_window_times) < WHATSAPP_DOCUMENT_MAX_PER_WINDOW

def post_whatsapp_document_payload(document_path, caption):
    with open(document_path, "rb") as document_file:
        files = {
            "document": (os.path.basename(document_path), document_file, "application/pdf")
        }
        data = {
            "target": WHATSAPP_GROUP_NUMBER,
            "caption": caption,
            "delay": str(WHATSAPP_DOCUMENT_SEND_DELAY),
        }
        headers = {"Authorization": WHATSAPP_API_KEY}
        response = requests.post(
            WHATSAPP_DOCUMENT_URL,
            headers=headers,
            data=data,
            files=files,
            timeout=WHATSAPP_DOCUMENT_TIMEOUT_DETIK,
        )

    response_text = str(getattr(response, "text", "") or "")
    try:
        result = response.json()
    except ValueError:
        result = None

    if response.status_code >= 400:
        return False, result or {"status_code": response.status_code}, response_text

    if isinstance(result, dict) and (
        result.get("status") is False or result.get("success") is False
    ):
        return False, result, response_text

    return True, result, response_text

def post_waha_whatsapp_payload(payload):
    base_url = str(WAHA_BASE_URL or "").rstrip("/")
    path = str(WAHA_SEND_TEXT_PATH or "/api/sendText")
    if not path.startswith("/"):
        path = f"/{path}"

    headers = {"Content-Type": "application/json"}
    if str(WAHA_API_KEY or "").strip():
        headers["X-Api-Key"] = str(WAHA_API_KEY).strip()

    response = requests.post(
        f"{base_url}{path}",
        json=payload,
        headers=headers,
        timeout=WHATSAPP_TIMEOUT_DETIK,
    )
    response_text = str(getattr(response, "text", "") or "")
    try:
        result = response.json()
    except ValueError:
        result = None

    if response.status_code >= 400:
        return False, result or {"status_code": response.status_code}, response_text

    if isinstance(result, dict) and (
        result.get("status") is False
        or result.get("success") is False
        or result.get("error")
    ):
        return False, result, response_text

    return True, result, response_text

def post_waha_whatsapp_document_payload(document_path, caption):
    media_url = public_document_url(document_path)
    if not media_url:
        return False, {"error": "public_document_url_empty"}, ""

    base_url = str(WAHA_BASE_URL or "").rstrip("/")
    path = str(WAHA_SEND_FILE_PATH or "/api/sendFile")
    if not path.startswith("/"):
        path = f"/{path}"

    headers = {"Content-Type": "application/json"}
    if str(WAHA_API_KEY or "").strip():
        headers["X-Api-Key"] = str(WAHA_API_KEY).strip()

    payload = {
        "session": WAHA_SESSION,
        "chatId": WAHA_CHAT_ID,
        "file": {
            "mimetype": "application/pdf",
            "filename": os.path.basename(document_path),
            "url": media_url,
        },
        "caption": caption,
    }
    response = requests.post(
        f"{base_url}{path}",
        json=payload,
        headers=headers,
        timeout=WHATSAPP_DOCUMENT_TIMEOUT_DETIK,
    )
    response_text = str(getattr(response, "text", "") or "")
    try:
        result = response.json()
    except ValueError:
        result = None

    if response.status_code >= 400:
        return False, result or {"status_code": response.status_code}, response_text

    if isinstance(result, dict) and (
        result.get("status") is False
        or result.get("success") is False
        or result.get("error")
    ):
        return False, result, response_text

    return True, result, response_text

def post_whatsapp_payload(payload):
    if is_whatsapp_waha_gateway():
        return post_waha_whatsapp_payload(payload)
    return post_mpwa_whatsapp_payload(payload)

def get_lan_ip_for_url():
    try:
        gateway_url = WAHA_BASE_URL if is_whatsapp_waha_gateway() else WHATSAPP_ENDPOINT_URL
        parsed = urlparse(gateway_url or "http://127.0.0.1")
        host = parsed.hostname or "192.168.110.100"
        port = int(parsed.port or (443 if parsed.scheme == "https" else 80))
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        try:
            sock.connect((host, port))
            ip_address = sock.getsockname()[0]
        finally:
            sock.close()
        if ip_address and not ip_address.startswith("127."):
            return ip_address
    except Exception:
        pass
    return "127.0.0.1"

def get_public_base_url():
    configured = str(APP_PUBLIC_BASE_URL or "").strip().rstrip("/")
    if configured:
        return configured
    return f"http://{get_lan_ip_for_url()}:8000"

def public_document_url(document_path):
    try:
        source_path = Path(document_path).resolve()
        public_dir = Path(PQM_PME_REPORT_DIR).resolve()
        public_dir.mkdir(parents=True, exist_ok=True)
        if source_path.parent != public_dir:
            target_path = public_dir / source_path.name
            shutil.copyfile(source_path, target_path)
            source_path = target_path
        return f"{get_public_base_url()}{PQM_PME_REPORT_ROUTE}/{source_path.name}"
    except Exception as exc:
        print(f"[WHATSAPP MEDIA URL FAILED] Gagal menyiapkan URL dokumen: {exc}")
        return ""

def post_whatsapp_media_document_payload(document_path, caption):
    media_url = public_document_url(document_path)
    if not media_url:
        return False, {"error": "public_document_url_empty"}, ""

    data = {
        "api_key": WHATSAPP_API_KEY,
        "sender": WHATSAPP_SENDER,
        "number": WHATSAPP_GROUP_NUMBER,
        "url": media_url,
        "media_type": "document",
        "message": caption,
        "caption": caption,
    }
    response = requests.post(
        WHATSAPP_MEDIA_URL,
        data=data,
        timeout=WHATSAPP_DOCUMENT_TIMEOUT_DETIK,
    )

    response_text = str(getattr(response, "text", "") or "")
    try:
        result = response.json()
    except ValueError:
        result = None

    if response.status_code >= 400:
        return False, result or {"status_code": response.status_code}, response_text

    if isinstance(result, dict) and (
        result.get("status") is False or result.get("success") is False
    ):
        return False, result, response_text

    return True, result, response_text

def send_whatsapp_document(document_path, caption="", dedupe_key="", fanout_secondary=True):
    global whatsapp_last_sent_at, whatsapp_last_document_sent_at

    if not os.path.exists(document_path):
        print(f"[WHATSAPP DOCUMENT SKIPPED] File dokumen tidak ditemukan: {os.path.basename(str(document_path))}")
        return False

    normalized_caption = normalize_whatsapp_message(caption)
    if fanout_secondary:
        dispatch_secondary_document_channels(document_path, normalized_caption, dedupe_key)

    if not WHATSAPP_DOCUMENT_ENABLED:
        print("[WHATSAPP DOCUMENT SKIPPED] Pengiriman dokumen WhatsApp sedang dimatikan.")
        return False

    has_waha_gateway = bool(is_whatsapp_waha_gateway() and is_whatsapp_configured())
    has_upload_gateway = bool(not is_whatsapp_waha_gateway() and WHATSAPP_DOCUMENT_URL and WHATSAPP_API_KEY and WHATSAPP_GROUP_NUMBER)
    has_media_gateway = bool(not is_whatsapp_waha_gateway() and WHATSAPP_MEDIA_URL and WHATSAPP_API_KEY and WHATSAPP_SENDER and WHATSAPP_GROUP_NUMBER)
    if not has_waha_gateway and not has_upload_gateway and not has_media_gateway:
        print("[WHATSAPP DOCUMENT SKIPPED] Konfigurasi WhatsApp document gateway belum lengkap.")
        return False

    with whatsapp_send_lock:
        now = time.monotonic()
        document_digest = whatsapp_document_digest(document_path, normalized_caption, dedupe_key)

        if should_skip_duplicate_whatsapp_document(document_digest, now):
            print("[WHATSAPP DOCUMENT SKIPPED] Dokumen duplikat dalam periode aman, tidak dikirim ulang.")
            return False

        retry_delayed, retry_after = should_delay_whatsapp_offline_retry(now)
        if retry_delayed:
            wait_seconds = max(1, retry_after - now)
            print(
                "[WHATSAPP DOCUMENT SKIPPED] Gateway belum reachable. "
                f"Dokumen tidak dikirim untuk menghindari retry spam; cek lagi sekitar {wait_seconds:.0f} detik."
            )
            schedule_whatsapp_recovery_recap()
            return False

        if not whatsapp_rate_limit_allows_send(now):
            print(
                "[WHATSAPP DOCUMENT SKIPPED] Batas aman total WhatsApp tercapai "
                f"({WHATSAPP_MAX_MESSAGES_PER_WINDOW} pesan/{WHATSAPP_RATE_LIMIT_WINDOW_DETIK} detik)."
            )
            schedule_whatsapp_recovery_recap()
            return False

        if not whatsapp_document_rate_limit_allows_send(now):
            print(
                "[WHATSAPP DOCUMENT SKIPPED] Batas aman dokumen tercapai "
                f"({WHATSAPP_DOCUMENT_MAX_PER_WINDOW} dokumen/{WHATSAPP_DOCUMENT_RATE_LIMIT_WINDOW_DETIK:.0f} detik)."
            )
            return False

        document_elapsed = now - whatsapp_last_document_sent_at
        if whatsapp_last_document_sent_at > 0 and document_elapsed < WHATSAPP_DOCUMENT_MIN_INTERVAL_DETIK:
            wait_seconds = WHATSAPP_DOCUMENT_MIN_INTERVAL_DETIK - document_elapsed
            print(
                "[WHATSAPP DOCUMENT SKIPPED] Jeda aman antar dokumen belum terpenuhi "
                f"({wait_seconds:.0f} detik lagi)."
            )
            return False

        elapsed = now - whatsapp_last_sent_at
        if elapsed < WHATSAPP_MIN_INTERVAL_DETIK:
            delay = WHATSAPP_MIN_INTERVAL_DETIK - elapsed
            delay += secrets.randbelow(2000) / 1000
            print(f"[WHATSAPP DOCUMENT DELAY] Menunggu {delay:.1f} detik sebelum kirim dokumen.")
            time.sleep(delay)

        try:
            if has_waha_gateway:
                ok, result, response_text = post_waha_whatsapp_document_payload(document_path, normalized_caption)
            elif has_upload_gateway:
                ok, result, response_text = post_whatsapp_document_payload(document_path, normalized_caption)
            else:
                ok, result, response_text = post_whatsapp_media_document_payload(document_path, normalized_caption)
            if not has_waha_gateway and not ok and whatsapp_failure_needs_reconnect(result, response_text):
                print("[WHATSAPP DOCUMENT RETRY] Gateway kehilangan koneksi, mencoba restore lalu kirim ulang sekali.")
                if restore_whatsapp_connection():
                    time.sleep(2)
                    if has_upload_gateway:
                        ok, result, response_text = post_whatsapp_document_payload(document_path, normalized_caption)
                    else:
                        ok, result, response_text = post_whatsapp_media_document_payload(document_path, normalized_caption)

            if not ok:
                print(f"[WHATSAPP DOCUMENT FAILED] Gateway menolak dokumen: {result}")
                mark_whatsapp_connection_state(False)
                return False

            sent_at = time.monotonic()
            whatsapp_last_sent_at = sent_at
            whatsapp_last_document_sent_at = sent_at
            whatsapp_recent_document_times[document_digest] = sent_at
            whatsapp_sent_window_times.append(sent_at)
            whatsapp_document_sent_window_times.append(sent_at)
            mark_whatsapp_connection_state(True)
            return True
        except Exception as exc:
            response = getattr(exc, "response", None)
            response_text = ""
            if response is not None:
                response_text = str(getattr(response, "text", "") or "").strip()
                if response_text:
                    response_text = f" Response: {response_text[:500]}"
            if not has_waha_gateway and whatsapp_failure_needs_reconnect(response_text=response_text):
                print("[WHATSAPP DOCUMENT RETRY] Exception gateway mengarah ke koneksi WA putus, mencoba restore.")
                if restore_whatsapp_connection():
                    try:
                        if has_waha_gateway:
                            ok, result, raw_response_text = post_waha_whatsapp_document_payload(document_path, normalized_caption)
                        elif has_upload_gateway:
                            ok, result, raw_response_text = post_whatsapp_document_payload(document_path, normalized_caption)
                        else:
                            ok, result, raw_response_text = post_whatsapp_media_document_payload(document_path, normalized_caption)
                        if ok:
                            sent_at = time.monotonic()
                            whatsapp_last_sent_at = sent_at
                            whatsapp_last_document_sent_at = sent_at
                            whatsapp_recent_document_times[document_digest] = sent_at
                            whatsapp_sent_window_times.append(sent_at)
                            whatsapp_document_sent_window_times.append(sent_at)
                            mark_whatsapp_connection_state(True)
                            return True
                        print(
                            "[WHATSAPP DOCUMENT FAILED] Gateway tetap menolak dokumen setelah restore: "
                            f"{result} {raw_response_text[:200]}"
                        )
                    except Exception as retry_exc:
                        print(f"[WHATSAPP DOCUMENT FAILED] Retry dokumen setelah restore gagal: {retry_exc}")
            print(
                "[WHATSAPP DOCUMENT FAILED] Gagal kirim dokumen WhatsApp ke "
                f"{mask_identifier(WAHA_CHAT_ID if is_whatsapp_waha_gateway() else WHATSAPP_GROUP_NUMBER)}: {exc}.{response_text}"
            )
            mark_whatsapp_connection_state(False)
            return False

def whatsapp_outbox_retry_delay(attempts):
    attempt_index = max(0, int(attempts or 0) - 1)
    delay = min(
        WHATSAPP_OUTBOX_MAX_RETRY_SECONDS,
        WHATSAPP_OUTBOX_RETRY_SECONDS * (2 ** min(attempt_index, 4)),
    )
    return delay + (secrets.randbelow(3000) / 1000)

def enqueue_whatsapp_notification(message, allow_recovery_recap=True, reason=""):
    if not WHATSAPP_OUTBOX_ENABLED:
        return False

    if not WHATSAPP_QUEUE_FAILED_MESSAGES:
        app_state["whatsapp_outbox_pending_count"] = db.count_pending_whatsapp_messages()
        print(
            "[WHATSAPP OUTBOX SKIPPED] Pesan gagal tidak diantrikan, "
            "agar saat gateway WA pulih tidak terjadi spam pesan lama."
        )
        return False

    normalized_message = normalize_whatsapp_message(message)
    if not normalized_message:
        return False

    try:
        row = db.enqueue_whatsapp_message({
            "id": f"wa-{int(time.time() * 1000)}-{uuid.uuid4().hex[:8]}",
            "digest": whatsapp_message_digest(normalized_message),
            "message": normalized_message,
            "allow_recovery_recap": 1 if allow_recovery_recap else 0,
            "max_attempts": WHATSAPP_OUTBOX_MAX_ATTEMPTS,
            "next_attempt_at": time.time() + WHATSAPP_OUTBOX_RETRY_SECONDS,
            "last_error": str(reason or "")[:500],
        })
        app_state["whatsapp_outbox_pending_count"] = db.count_pending_whatsapp_messages()
        print(
            "[WHATSAPP OUTBOX] Pesan masuk antrian retry "
            f"({app_state['whatsapp_outbox_pending_count']} pending)."
        )
        return bool(row)
    except Exception as exc:
        print(f"[WHATSAPP OUTBOX FAILED] Gagal menyimpan pesan retry: {exc}")
        return False

def process_whatsapp_outbox_once():
    if not WHATSAPP_OUTBOX_ENABLED or not is_whatsapp_configured():
        return 0

    if not WHATSAPP_QUEUE_FAILED_MESSAGES:
        discard_pending_whatsapp_outbox("Antrean lama dilewati karena mode anti-spam WA aktif.")
        return 0

    if WHATSAPP_DISCARD_PENDING_ON_RECOVERY and is_whatsapp_recovery_recap_pending():
        return 0

    rows = db.list_due_whatsapp_messages(time.time(), limit=WHATSAPP_OUTBOX_BATCH_SIZE)
    sent_count = 0
    for item in rows:
        message_id = item.get("id")
        attempts = int(item.get("attempts") or 0) + 1
        sent = send_whatsapp_notification(
            item.get("message", ""),
            allow_recovery_recap=bool(item.get("allow_recovery_recap", 1)),
            enqueue_on_failure=False,
            respect_duplicate=False,
            fanout_secondary=False,
        )
        if sent:
            db.mark_whatsapp_message_sent(message_id)
            sent_count += 1
            print(f"[WHATSAPP OUTBOX] Pesan tertunda terkirim. ID: {message_id}")
            continue

        next_attempt_at = time.time() + whatsapp_outbox_retry_delay(attempts)
        db.mark_whatsapp_message_failed(
            message_id,
            attempts,
            next_attempt_at,
            "Retry WA belum berhasil.",
            int(item.get("max_attempts") or 0),
        )

    if rows:
        app_state["whatsapp_outbox_pending_count"] = db.count_pending_whatsapp_messages()
    return sent_count

def send_whatsapp_notification(
    message: str,
    allow_recovery_recap=True,
    enqueue_on_failure=True,
    respect_duplicate=True,
    fanout_secondary=True,
):
    global whatsapp_last_sent_at

    normalized_message = normalize_whatsapp_message(message)
    if not normalized_message:
        return False

    if fanout_secondary:
        dispatch_notification_side_channels(normalized_message)

    if not is_whatsapp_configured():
        print("[WHATSAPP SKIPPED] Konfigurasi WhatsApp gateway belum lengkap.")
        return False

    with whatsapp_send_lock:
        now = time.monotonic()
        message_digest = whatsapp_message_digest(normalized_message)
        if respect_duplicate:
            skip_duplicate, message_digest = should_skip_duplicate_whatsapp_message(normalized_message, now)
            if skip_duplicate:
                print("[WHATSAPP SKIPPED] Pesan duplikat dalam periode aman, tidak dikirim ulang.")
                return False

        retry_delayed, retry_after = should_delay_whatsapp_offline_retry(now)
        if retry_delayed:
            wait_seconds = max(1, retry_after - now)
            print(f"[WHATSAPP OFFLINE] Gateway belum reachable. Retry otomatis sekitar {wait_seconds:.0f} detik lagi.")
            schedule_whatsapp_recovery_recap()
            if enqueue_on_failure:
                return enqueue_whatsapp_notification(normalized_message, allow_recovery_recap, "Gateway masih offline.")
            return False

        if not whatsapp_rate_limit_allows_send(now):
            print(
                "[WHATSAPP RATE LIMIT] Batas aman kirim tercapai "
                f"({WHATSAPP_MAX_MESSAGES_PER_WINDOW} pesan/{WHATSAPP_RATE_LIMIT_WINDOW_DETIK} detik). "
                "Pesan ditahan untuk mengurangi risiko blokir."
            )
            schedule_whatsapp_recovery_recap()
            if enqueue_on_failure:
                return enqueue_whatsapp_notification(normalized_message, allow_recovery_recap, "Rate limit WhatsApp tercapai.")
            return False

        elapsed = now - whatsapp_last_sent_at
        if elapsed < WHATSAPP_MIN_INTERVAL_DETIK:
            delay = WHATSAPP_MIN_INTERVAL_DETIK - elapsed
            delay += secrets.randbelow(2000) / 1000
            print(f"[WHATSAPP DELAY] Menunggu {delay:.1f} detik sebelum kirim pesan berikutnya.")
            time.sleep(delay)

        payload = build_whatsapp_text_payload(normalized_message)

        try:
            ok, result, response_text = post_whatsapp_payload(payload)
            if is_whatsapp_mpwa_gateway() and not ok and whatsapp_failure_needs_reconnect(result, response_text):
                print("[WHATSAPP RETRY] Gateway kehilangan koneksi, mencoba restore lalu kirim ulang sekali.")
                if restore_whatsapp_connection():
                    time.sleep(2)
                    ok, result, response_text = post_whatsapp_payload(payload)

            if not ok:
                print(f"[WHATSAPP FAILED] Gateway menolak pesan: {result}")
                mark_whatsapp_connection_state(False, allow_recovery_recap=allow_recovery_recap)
                if enqueue_on_failure:
                    return enqueue_whatsapp_notification(normalized_message, allow_recovery_recap, f"Gateway menolak pesan: {result}")
                return False

            whatsapp_last_sent_at = time.monotonic()
            whatsapp_recent_message_times[message_digest] = whatsapp_last_sent_at
            whatsapp_sent_window_times.append(whatsapp_last_sent_at)
            mark_whatsapp_connection_state(True, allow_recovery_recap=allow_recovery_recap)
            return True
        except Exception as e:
            response = getattr(e, "response", None)
            response_text = ""
            if response is not None:
                response_text = str(getattr(response, "text", "") or "").strip()
                if response_text:
                    response_text = f" Response: {response_text[:500]}"
            if whatsapp_failure_needs_reconnect(response_text=response_text):
                print("[WHATSAPP RETRY] Exception gateway mengarah ke koneksi WA putus, mencoba restore.")
                if restore_whatsapp_connection():
                    try:
                        ok, result, raw_response_text = post_whatsapp_payload(payload)
                        if ok:
                            whatsapp_last_sent_at = time.monotonic()
                            whatsapp_recent_message_times[message_digest] = whatsapp_last_sent_at
                            whatsapp_sent_window_times.append(whatsapp_last_sent_at)
                            mark_whatsapp_connection_state(True, allow_recovery_recap=allow_recovery_recap)
                            return True
                        print(f"[WHATSAPP FAILED] Gateway tetap menolak pesan setelah restore: {result} {raw_response_text[:200]}")
                    except Exception as retry_exc:
                        print(f"[WHATSAPP FAILED] Retry setelah restore gagal: {retry_exc}")
            target_id = WAHA_CHAT_ID if is_whatsapp_waha_gateway() else WHATSAPP_GROUP_NUMBER
            print(f"[WHATSAPP FAILED] Gagal kirim WhatsApp ke {mask_identifier(target_id)}: {e}.{response_text}")
            mark_whatsapp_connection_state(False, allow_recovery_recap=allow_recovery_recap)
            if enqueue_on_failure:
                return enqueue_whatsapp_notification(normalized_message, allow_recovery_recap, str(e))
            return False

@asynccontextmanager
async def lifespan(app: FastAPI):
    start_background_threads()
    yield

app = FastAPI(title=f"{APP_BRAND_NAME} API", lifespan=lifespan)

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "SAMEORIGIN")
    response.headers.setdefault("Referrer-Policy", "same-origin")
    response.headers.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
    if env_bool_any(("VoltKraf_HSTS", "VOLTCRAFT_HSTS"), False):
        response.headers.setdefault("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
    return response

def gabung_ke_float(reg_awal, reg_akhir):
    byte_data = struct.pack('>HH', reg_awal, reg_akhir)
    return struct.unpack('>f', byte_data)[0]

def get_32bit_int(registers, start_index):
    high_word = registers[start_index]
    low_word = registers[start_index + 1]
    value = (high_word << 16) | low_word
    if value >= 0x80000000:
        value -= 0x100000000
    return value

def get_32bit_uint(registers, start_index):
    high_word = registers[start_index]
    low_word = registers[start_index + 1]
    return (high_word << 16) | low_word

def get_16bit_int(value):
    value = int(value)
    if value >= 0x8000:
        value -= 0x10000
    return value

def modbus_register_index(register_address, start_address):
    return int(register_address) - PQM_BASE_REGISTER - int(start_address)

def read_uint16_register(registers, start_address, register_address, scale=1.0):
    index = modbus_register_index(register_address, start_address)
    if index < 0 or index >= len(registers):
        raise ValueError(f"Register {register_address} di luar jangkauan data PQM.")
    return round(registers[index] / scale, 2)

def read_uint32_register(registers, start_address, register_address, scale=1.0):
    index = modbus_register_index(register_address, start_address)
    if index < 0 or index + 1 >= len(registers):
        raise ValueError(f"Register {register_address} di luar jangkauan data PQM.")
    return round(get_32bit_uint(registers, index) / scale, 2)

def read_int32_register(registers, start_address, register_address, scale=1.0):
    index = modbus_register_index(register_address, start_address)
    if index < 0 or index + 1 >= len(registers):
        raise ValueError(f"Register {register_address} di luar jangkauan data PQM.")
    return round(get_32bit_int(registers, index) / scale, 2)

def read_int16_register(registers, start_address, register_address, scale=1.0):
    index = modbus_register_index(register_address, start_address)
    if index < 0 or index >= len(registers):
        raise ValueError(f"Register {register_address} di luar jangkauan data PQM.")
    return round(get_16bit_int(registers[index]) / scale, 2)

def read_pqm_metric(registers, start_address, register_address, data_format, scale=1.0):
    if data_format == "UINT16":
        return read_uint16_register(registers, start_address, register_address, scale)
    if data_format == "INT16":
        return read_int16_register(registers, start_address, register_address, scale)
    if data_format == "UINT32":
        return read_uint32_register(registers, start_address, register_address, scale)
    if data_format == "INT32":
        return read_int32_register(registers, start_address, register_address, scale)
    raise ValueError(f"Format register PQM tidak didukung: {data_format}")

def make_pqm_metric_defaults(device_or_type=None):
    device_type = normalize_pqm_type(device_or_type)
    defaults = {}
    for spec in PQM_MAIN_REGISTER_CATALOG:
        defaults[spec["key"]] = None if (
            device_type == PQM_TYPE_ION9000 and spec["key"] in PQM_ION9000_UNSUPPORTED_MAIN_KEYS
        ) else 0.0
    defaults.update({
        "pq_counters": {},
        "pq_counter_summary": summarize_pqm_counters({}, device_type),
        "new_disturbance_count": 0,
    })
    return defaults

def empty_pqm_metrics(device_or_type=None):
    return make_pqm_metric_defaults(device_or_type)

def normalize_ion9000_label(value):
    return (
        " ".join(
            str(value or "")
            .replace("\xa0", " ")
            .replace("\u2013", "-")
            .replace("\u2014", "-")
            .split()
        )
        .strip()
        .lower()
    )

def parse_ion9000_number(value):
    if value is None:
        return None
    if isinstance(value, bool):
        return 1.0 if value else 0.0
    if isinstance(value, (int, float)):
        return float(value)

    text = str(value).strip()
    if not text or text.upper() in {"N/A", "NA", "NULL", "NONE", "--", "-"}:
        return None

    text = text.replace("\xa0", " ").replace(" ", "")
    if "," in text:
        text = text.replace(".", "").replace(",", ".")
    cleaned = re.sub(r"[^0-9.\-]", "", text)
    if cleaned in {"", "-", ".", "-."}:
        return None
    try:
        return float(cleaned)
    except ValueError:
        return None

def ion9000_unit_scale(units):
    normalized_units = normalize_ion9000_label(units).replace(" ", "")
    return {
        "kv": 1000.0,
        "mw": 1000.0,
        "mvar": 1000.0,
        "mva": 1000.0,
        "mwh": 1000.0,
        "mvarh": 1000.0,
        "mvah": 1000.0,
    }.get(normalized_units, 1.0)

def extract_ion9000_item_label(item):
    if not isinstance(item, dict):
        return ""
    for key in ("label", "name", "displayName", "registerName", "id"):
        value = item.get(key)
        if value:
            return str(value)
    return ""

def extract_ion9000_item_value(item):
    if not isinstance(item, dict):
        return None
    for key in ("value", "val", "registerValue", "currentValue"):
        if key in item:
            return item.get(key)
    return None

def extract_ion9000_item_units(item):
    if not isinstance(item, dict):
        return ""
    for key in ("units", "unit", "uom"):
        value = item.get(key)
        if value:
            return str(value)
    return ""

def parse_ion9000_item_number(item):
    number = parse_ion9000_number(extract_ion9000_item_value(item))
    if number is None:
        return None
    return round(number * ion9000_unit_scale(extract_ion9000_item_units(item)), 3)

def extract_ion9000_result_items(payload):
    if isinstance(payload, list):
        return payload
    if isinstance(payload, dict):
        for key in ("result", "data", "values", "items"):
            items = payload.get(key)
            if isinstance(items, list):
                return items
    raise ValueError("Format respons ION9000 tidak berisi daftar register.")

def build_ion9000_value_map(payload):
    items = extract_ion9000_result_items(payload)
    value_map = {}
    for item in items:
        label = normalize_ion9000_label(extract_ion9000_item_label(item))
        if label:
            value_map[label] = item
    if not value_map:
        raise ValueError("Respons ION9000 kosong atau label register tidak terbaca.")
    return value_map

def parse_ion9000_metrics(value_map):
    metrics = make_pqm_metric_defaults(PQM_TYPE_ION9000)
    metrics["pqm_type"] = PQM_TYPE_ION9000

    for spec in PQM_MAIN_REGISTER_CATALOG:
        if spec["key"] not in PQM_ION9000_SUPPORTED_MAIN_KEYS:
            metrics[spec["key"]] = None

    available_count = 0
    for key, register_name in PQM_ION9000_MAIN_FIELD_SPECS:
        item = value_map.get(normalize_ion9000_label(register_name))
        value = parse_ion9000_item_number(item)
        metrics[key] = value
        if value is not None:
            available_count += 1

    if available_count == 0:
        raise ValueError("Tidak ada nilai register utama ION9000 yang valid.")
    return metrics

def parse_ion9000_disturbance_counters(value_map):
    counters = {}
    for counter in PQM_ION9000_DISTURBANCE_COUNTERS:
        item = value_map.get(normalize_ion9000_label(counter["name"]))
        value = parse_ion9000_item_number(item)
        counters[counter["name"]] = int(value or 0)
    return counters

PQM_ION9000_SESSION_CACHE = {}

def clear_ion9000_session(device_id):
    cached = PQM_ION9000_SESSION_CACHE.pop(device_id, None)
    session = cached.get("session") if cached else None
    if session:
        try:
            session.close()
        except Exception:
            pass

def remaining_ion9000_poll_seconds(deadline):
    if deadline is None:
        return None
    return deadline - time.monotonic()

def ion9000_request_timeout_seconds(device=None):
    if device and is_muaratawar_500kv_pqm(device):
        return float(PQM_ION9000_MUARATAWAR_REQUEST_TIMEOUT_DETIK)
    return float(PQM_ION9000_REQUEST_TIMEOUT_DETIK)

def ion9000_max_poll_seconds(device=None):
    if device and is_muaratawar_500kv_pqm(device):
        return float(PQM_ION9000_MUARATAWAR_MAX_POLL_DETIK)
    return float(PQM_ION9000_MAX_POLL_DETIK)

def ion9000_request_timeout(deadline=None, device=None):
    timeout = ion9000_request_timeout_seconds(device)
    remaining = remaining_ion9000_poll_seconds(deadline)
    if remaining is not None:
        if remaining <= 0:
            raise TimeoutError(
                f"Polling ION9000 melewati batas {ion9000_max_poll_seconds(device):.0f} detik."
            )
        timeout = min(timeout, max(1.0, remaining))
    return max(1.0, timeout)

def build_ion9000_base_url(device):
    ip_or_url = str(device.get("ip") or "").strip().rstrip("/")
    if ip_or_url.startswith(("http://", "https://")):
        return ip_or_url
    try:
        port = int(device.get("port") or 443)
    except (TypeError, ValueError):
        port = 443
    if port and port != 443 and ":" not in ip_or_url:
        return f"https://{ip_or_url}:{port}"
    return f"https://{ip_or_url}"

def normalize_pqm_device_address(address, pqm_type):
    device_type = normalize_pqm_type(pqm_type)
    value = str(address or "").strip().rstrip("/")
    if device_type == PQM_TYPE_ION9000:
        if value.startswith(("http://", "https://")):
            return value
        if value:
            return f"https://{value}"
    return value

def extract_hidden_input_value(page_html, input_name):
    patterns = [
        rf'<input[^>]*name=["\']{re.escape(input_name)}["\'][^>]*value=["\']([^"\']*)["\']',
        rf'<input[^>]*value=["\']([^"\']*)["\'][^>]*name=["\']{re.escape(input_name)}["\']',
    ]
    for pattern in patterns:
        match = re.search(pattern, page_html or "", re.IGNORECASE | re.DOTALL)
        if match:
            return html.unescape(match.group(1))
    return ""

def login_ion9000_session(session, base_url, timeout=None):
    login_url = f"{base_url}/web/login.html"
    timeout = max(1.0, float(timeout or PQM_ION9000_REQUEST_TIMEOUT_DETIK))
    response = session.get(
        login_url,
        verify=PQM_ION9000_VERIFY_SSL,
        timeout=timeout,
    )
    if response.status_code >= 400:
        raise RuntimeError(f"Login page ION9000 gagal dibuka ({response.status_code}).")

    nonce = extract_hidden_input_value(response.text, "nonce")
    return_url = extract_hidden_input_value(response.text, "URL") or "/"
    if not nonce:
        raise RuntimeError("Nonce login ION9000 tidak ditemukan.")

    login_response = session.post(
        login_url,
        data={
            "credentials": f"{PQM_ION9000_USERNAME}:{PQM_ION9000_PASSWORD}",
            "language": "English",
            "nonce": nonce,
            "URL": return_url,
        },
        verify=PQM_ION9000_VERIFY_SSL,
        timeout=timeout,
        allow_redirects=False,
    )
    if login_response.status_code >= 400:
        raise RuntimeError(f"Login ION9000 gagal ({login_response.status_code}).")
    if login_response.status_code not in {200, 201, 202, 204, 301, 302, 303, 307, 308}:
        raise RuntimeError(f"Login ION9000 mendapat status tak terduga ({login_response.status_code}).")

def get_ion9000_session(device, force_login=False, deadline=None):
    device_id = device["id"]
    base_url = build_ion9000_base_url(device)
    now = time.time()
    cached = PQM_ION9000_SESSION_CACHE.get(device_id)
    if (
        not force_login
        and cached
        and cached.get("base_url") == base_url
        and now - float(cached.get("logged_in_at") or 0) < PQM_ION9000_SESSION_TTL_DETIK
    ):
        return cached["session"], base_url

    if force_login:
        clear_ion9000_session(device_id)

    session = requests.Session()
    try:
        login_timeout = ion9000_request_timeout(deadline, device)
        login_ion9000_session(session, base_url, timeout=login_timeout)
        PQM_ION9000_SESSION_CACHE[device_id] = {
            "session": session,
            "base_url": base_url,
            "logged_in_at": time.time(),
        }
        return session, base_url
    except Exception:
        session.close()
        raise

def chunked_list(values, size):
    size = max(1, int(size or 1))
    for index in range(0, len(values), size):
        yield values[index:index + size]

def request_ion9000_register_values(device, names, deadline=None):
    unique_names = list(dict.fromkeys(name for name in names if str(name or "").strip()))
    if not unique_names:
        return {"result": []}

    last_error = None

    for attempt in range(2):
        try:
            remaining = remaining_ion9000_poll_seconds(deadline)
            if remaining is not None and remaining <= 0:
                raise TimeoutError(
                    f"Polling ION9000 melewati batas {ion9000_max_poll_seconds(device):.0f} detik."
                )

            session, base_url = get_ion9000_session(device, force_login=attempt > 0, deadline=deadline)
            merged_items = []
            for batch in chunked_list(unique_names, PQM_ION9000_REQUEST_BATCH_SIZE):
                batch_timeout = ion9000_request_timeout(deadline, device)
                response = session.post(
                    f"{base_url}/api/registerValues/getRegisterValues",
                    json={"names": batch},
                    headers={
                        "Accept": "application/json",
                    },
                    verify=PQM_ION9000_VERIFY_SSL,
                    timeout=batch_timeout,
                )
                content_type = response.headers.get("content-type", "").lower()
                looks_like_login_page = "text/html" in content_type and "login" in response.text.lower()
                if response.status_code in {401, 403} or looks_like_login_page:
                    last_error = "Sesi ION9000 tidak valid."
                    clear_ion9000_session(device["id"])
                    raise RuntimeError(last_error)

                if response.status_code != 200:
                    raise RuntimeError(f"API ION9000 mengembalikan status {response.status_code}.")

                try:
                    batch_payload = response.json()
                except ValueError as exc:
                    raise RuntimeError("Respons API ION9000 bukan JSON.") from exc

                batch_items = extract_ion9000_result_items(batch_payload)
                merged_items.extend(batch_items)

            return {"result": merged_items}
        except requests.exceptions.Timeout:
            clear_ion9000_session(device["id"])
            last_error = f"Timeout ION9000 setelah {ion9000_request_timeout_seconds(device):.1f} detik."
        except requests.exceptions.ConnectionError:
            clear_ion9000_session(device["id"])
            last_error = "Koneksi ke ION9000 terputus."
        except Exception as exc:
            if isinstance(exc, TimeoutError):
                clear_ion9000_session(device["id"])
            last_error = str(exc) or exc.__class__.__name__
            if attempt < 1:
                continue

    raise RuntimeError(last_error or "Gagal mengambil register ION9000.")

def should_fast_poll_muaratawar_ion9000(device):
    return bool(PQM_ION9000_MUARATAWAR_FAST_POLL and is_muaratawar_500kv_pqm(device))

def parse_pqm_registers(registers, start_address=147):
    required_count = PQM_MAIN_LAST_REGISTER - PQM_BASE_REGISTER - int(start_address) + 1
    if len(registers) < required_count:
        raise ValueError(f"Data register PQM tidak lengkap ({len(registers)} register).")

    metrics = {}
    for spec in PQM_MAIN_REGISTER_CATALOG:
        metrics[spec["key"]] = read_pqm_metric(
            registers,
            start_address,
            spec["address"],
            spec["format"],
            spec["scaling"],
        )
    metrics["phase_rev"] = int(metrics["phase_rev"])
    return metrics

def build_pqm_state(device, waktu, connected, status_message, metrics=None):
    metrics = metrics or empty_pqm_metrics(device.get("pqm_type"))
    return build_empty_pqm_state({
        **device,
        **metrics,
        "last_poll_time": waktu,
        "connected": 1 if connected else 0,
        "status_message": status_message,
        "raw_json": json.dumps(metrics),
    })

def pqm_db_value(value):
    return 0 if value is None else value

def pqm_state_to_reading(state):
    return {
        "device_id": state["id"],
        "waktu": state["last_poll_time"],
        "connected": 1 if state["connected"] else 0,
        "status_message": state["status_message"],
        "current_a": pqm_db_value(state["current_a"]),
        "current_b": pqm_db_value(state["current_b"]),
        "current_c": pqm_db_value(state["current_c"]),
        "current_avg": pqm_db_value(state["current_avg"]),
        "freq": pqm_db_value(state["freq"]),
        "v_unbal": pqm_db_value(state["v_unbal"]),
        "v_an": pqm_db_value(state["v_an"]),
        "v_bn": pqm_db_value(state["v_bn"]),
        "v_cn": pqm_db_value(state["v_cn"]),
        "v_ab": pqm_db_value(state["v_ab"]),
        "v_bc": pqm_db_value(state["v_bc"]),
        "v_ca": pqm_db_value(state["v_ca"]),
        "v_ll_avg": pqm_db_value(state["v_ll_avg"]),
        "kw_a": pqm_db_value(state["kw_a"]),
        "kw_b": pqm_db_value(state["kw_b"]),
        "kw_c": pqm_db_value(state["kw_c"]),
        "kw_total": pqm_db_value(state["kw_total"]),
        "kvar_total": pqm_db_value(state["kvar_total"]),
        "kva_total": pqm_db_value(state["kva_total"]),
        "raw_json": state["raw_json"],
    }

def read_modbus_registers(client, address, count, slave_id=1):
    try:
        return client.read_holding_registers(
            address=address,
            count=count,
            slave=slave_id,
        )
    except TypeError:
        try:
            return client.read_holding_registers(
                address=address,
                count=count,
                unit=slave_id,
            )
        except TypeError:
            return client.read_holding_registers(
                address=address,
                count=count,
            )

def read_modbus_register_chunks(client, address, count, slave_id=1, max_count=MODBUS_MAX_READ_REGISTERS):
    registers = []
    remaining = int(count)
    current_address = int(address)

    while remaining > 0:
        chunk_count = min(remaining, max_count)
        response = read_modbus_registers(
            client,
            address=current_address,
            count=chunk_count,
            slave_id=slave_id,
        )

        if response.isError():
            return response, registers

        chunk_registers = list(getattr(response, "registers", []) or [])
        if len(chunk_registers) != chunk_count:
            raise ValueError(
                f"Jumlah register PQM tidak sesuai di address {current_address}: "
                f"{len(chunk_registers)} dari {chunk_count}."
            )

        registers.extend(chunk_registers)
        current_address += chunk_count
        remaining -= chunk_count

    return None, registers

def parse_pqm_disturbance_counters(registers, counter_catalog=None):
    counter_catalog = counter_catalog or PQM_DISTURBANCE_COUNTERS
    counters = {}
    for counter in counter_catalog:
        index = counter["address"] - PQM_DISTURBANCE_COUNTER_START_REGISTER
        if index < 0 or index + 1 >= len(registers):
            raise ValueError(f"Counter {counter['name']} tidak lengkap.")
        counters[counter["name"]] = get_32bit_uint(registers, index)
    return counters

def pqm_counter_state_key(device_id):
    return f"pqm_disturbance_counters::{device_id}"

def pqm_counter_candidate_key(device_id):
    return f"pqm_disturbance_counter_candidate::{device_id}"

def record_pqm_disturbance_events(device, waktu, counters):
    previous_raw = db.get_setting(pqm_counter_state_key(device["id"]), "")
    previous_counters = safe_json_dict(previous_raw)

    if not previous_counters:
        db.set_setting(pqm_counter_state_key(device["id"]), json.dumps(counters))
        clear_notification_candidate(pqm_counter_candidate_key(device["id"]))
        return []

    has_counter_increase = any(
        int(current_value or 0) > int(previous_counters.get(counter_name, current_value) or 0)
        for counter_name, current_value in counters.items()
    )
    if not has_counter_increase:
        db.set_setting(pqm_counter_state_key(device["id"]), json.dumps(counters))
        clear_notification_candidate(pqm_counter_candidate_key(device["id"]))
        return []

    candidate_key = pqm_counter_candidate_key(device["id"])
    confirmed, seen_count = update_notification_candidate(
        candidate_key,
        "counters",
        counters,
        PQM_DISTURBANCE_CONFIRM_POLLS,
    )
    if not confirmed:
        print(
            f"[PQM DISTURBANCE HOLD] {device['nama_gi']} - {device['nama_bay']}: "
            f"kenaikan counter menunggu konfirmasi {seen_count}/{PQM_DISTURBANCE_CONFIRM_POLLS}."
        )
        return []

    counter_meta = {
        counter["name"]: counter
        for counter in get_pqm_disturbance_counter_catalog(device)
    }
    events = []
    for counter_name, current_value in counters.items():
        previous_value = int(previous_counters.get(counter_name, current_value) or 0)
        current_value = int(current_value or 0)
        if current_value <= previous_value:
            continue

        meta = counter_meta[counter_name]
        event = {
            "id": str(uuid.uuid4()),
            "waktu": waktu,
            "device_id": device["id"],
            "nama_gi": device["nama_gi"],
            "nama_bay": device["nama_bay"],
            "ip": device["ip"],
            "event_type": meta["event_type"],
            "event_label": meta["event_label"],
            "counter_name": counter_name,
            "address": meta["address"],
            "previous_value": previous_value,
            "current_value": current_value,
            "delta": current_value - previous_value,
        }
        db.insert_pqm_disturbance_event(event)
        events.append(event)
    db.set_setting(pqm_counter_state_key(device["id"]), json.dumps(counters))
    clear_notification_candidate(candidate_key)
    return events

def record_dc_alarm_event(waktu, nama, level, v_pg=0, v_ng=0):
    log_entry = {
        "id": str(uuid.uuid4()),
        "waktu": waktu,
        "nama": nama,
        "level": level,
        "v_pg": v_pg,
        "v_ng": v_ng,
    }
    db.insert_dc_alarm_event(log_entry)
    app_state["alarm_history"] = db.list_dc_alarm_events()
    return log_entry

def html_escape(value):
    return html.escape("" if value is None else str(value), quote=False)

def parse_wib_datetime(value):
    if isinstance(value, datetime):
        return value.astimezone(WIB_TZ)

    text = str(value or "").strip()
    for fmt in ("%Y-%m-%d %H:%M:%S", "%d-%m-%Y %H:%M:%S.%f", "%d-%m-%Y %H:%M:%S"):
        try:
            parsed = datetime.strptime(text, fmt)
            return parsed.replace(tzinfo=WIB_TZ)
        except ValueError:
            continue
    return wib_now()

def parse_ion_utc_datetime(value):
    text = str(value or "").strip()
    if not text:
        return None
    if text.endswith("Z"):
        text = text[:-1] + "+00:00"
    try:
        parsed = datetime.fromisoformat(text)
    except ValueError:
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(WIB_TZ)

def format_db_wib_datetime(value):
    parsed = parse_ion_utc_datetime(value)
    if parsed is None:
        parsed = wib_now()
    return parsed.strftime("%Y-%m-%d %H:%M:%S")

def format_notification_time(value):
    return parse_wib_datetime(value).strftime("%d-%m-%Y %H:%M:%S.000")

def format_notification_date(value):
    return parse_wib_datetime(value).strftime("%d-%m-%Y")

def notification_event_template(title, subtitle, waktu, module, status=None, ip=None, indikasi_lines=None):
    lines = [
        "=========================",
        html_escape(str(title or "-").upper()),
        html_escape(str(subtitle or "-").upper()),
        html_escape(format_notification_time(waktu)),
        "",
        f"MODUL    : {html_escape(module)}",
    ]
    if ip:
        lines.append(f"IP ALAT  : {html_escape(ip)}")
    if status:
        lines.append(f"STATUS   : {html_escape(status)}")

    indikasi_lines = [str(line) for line in (indikasi_lines or []) if str(line).strip()]
    if indikasi_lines:
        lines.append("INDIKASI :")
        lines.extend(html_escape(line) for line in indikasi_lines)

    lines.extend(["", "=========================", APP_BRAND_FOOTER])
    return "\n".join(lines)

def pqm_disturbance_type_label(event_type):
    return {
        "sag_dip": "Sag / Dip Tegangan",
        "swell": "Swell Tegangan",
        "interruption": "Interruption / Padam",
        "voltage_magnitude": "Magnitude Tegangan",
        "frequency": "Frequency",
        "flicker": "Flicker",
        "voltage_unbalance": "Voltage Unbalance",
        "mains_signaling": "Mains Signaling",
        "harmonic": "Harmonic",
        "interharmonic": "Interharmonic",
        "rvc": "Rapid Voltage Change",
    }.get(event_type, str(event_type or "-").replace("_", " ").title())

def build_pqm_disturbance_message(device, waktu, events):
    if not events:
        return ""

    grouped = {}
    for event in events:
        grouped.setdefault(event["event_type"], []).append(event)

    indication_lines = []
    ordered_event_types = [
        event_type for event_type in PQM_DISTURBANCE_TYPE_ORDER
        if grouped.get(event_type)
    ]
    ordered_event_types.extend(
        event_type for event_type in grouped
        if event_type not in ordered_event_types
    )

    for event_type in ordered_event_types:
        items = grouped.get(event_type, [])
        if not items:
            continue
        indication_lines.append(f"{pqm_disturbance_type_label(event_type).upper()} ({len(items)} COUNTER)")

    if not indication_lines:
        indication_lines.append("PARAMETER KUALITAS DAYA MELEBIHI BATAS")

    return notification_event_template(
        device.get("nama_gi", "-"),
        device.get("nama_bay", "-"),
        waktu,
        "PQM",
        status="GANGGUAN KUALITAS DAYA",
        indikasi_lines=indication_lines,
    )

DEFAULT_PME_PQM_SOURCE_IDS = {
    "gi-fajar-sw-trafo-5": ["9"],
}

PME_SOURCE_LABELS = {
    "8": "UPT_BEKASI.GI_CIKARANG",
    "9": "UPT_BEKASI.GI_FAJAR_SW",
    "12": "UPT_BEKASI.GI_JABABEKA_KTT",
    "13": "UPT_BEKASI.GI_JABABEKA_KIT",
    "14": "UPT_BEKASI.GI_RAJAPAKSI",
    "16": "UPT_BEKASI.GI_TAMBUN",
}
PME_SOURCE_SELECTOR_CLIENT_ID = (
    "ctl01_controlRepeater_ctl02_ctl00_m_ParameterControlHolder_ctl03_"
    "SourceSelectorPopup_SourceSelectorPopup"
)

def load_pme_pqm_source_map():
    mapping = dict(DEFAULT_PME_PQM_SOURCE_IDS)
    try:
        if os.path.exists(PQM_PME_REPORT_SOURCE_FILE):
            with open(PQM_PME_REPORT_SOURCE_FILE, "r", encoding="utf-8") as source_file:
                raw_mapping = json.load(source_file)
            if isinstance(raw_mapping, dict):
                for key, value in raw_mapping.items():
                    if isinstance(value, (list, tuple)):
                        source_ids = [str(item).strip() for item in value if str(item).strip()]
                    else:
                        source_ids = [str(value).strip()] if str(value).strip() else []
                    if source_ids:
                        mapping[str(key).strip().lower()] = source_ids
    except Exception as exc:
        print(f"[PME REPORT] Gagal membaca mapping source PME: {exc}")
    return mapping

def pme_device_lookup_keys(device):
    keys = []
    device_id = str(device.get("id") or "").strip().lower()
    if device_id:
        keys.append(device_id)
    nama_gi = str(device.get("nama_gi") or "").strip()
    nama_bay = str(device.get("nama_bay") or "").strip()
    if nama_gi and nama_bay:
        keys.append(f"{nama_gi}::{nama_bay}".lower())
        keys.append(f"{nama_gi}-{nama_bay}".lower().replace(" ", "-"))
    if nama_gi:
        keys.append(nama_gi.lower())
    return keys

def get_pme_source_ids_for_device(device):
    mapping = load_pme_pqm_source_map()
    for key in pme_device_lookup_keys(device):
        if key in mapping:
            return mapping[key]
    return []

def pme_report_attempt_key(device_id):
    return f"pqm_pme_report_attempt::{device_id}"

def pme_scan_seen_key(device_id):
    return f"pqm_pme_scan_seen::{device_id}"

def should_attempt_pme_report(device, events, now):
    if not PQM_PME_REPORT_ENABLED:
        return False
    if normalize_pqm_type(device.get("pqm_type")) != PQM_TYPE_ION7650:
        return False
    if not events:
        return False
    if not get_pme_source_ids_for_device(device):
        print(
            f"[PME REPORT] Source PME belum dimapping untuk "
            f"{device.get('nama_gi', '-')} - {device.get('nama_bay', '-')}."
        )
        return False
    has_cookie = bool(str(PQM_PME_REPORT_COOKIE or "").strip())
    has_login = bool(str(PQM_PME_REPORT_USERNAME or "").strip() and str(PQM_PME_REPORT_PASSWORD or ""))
    if not has_cookie and not has_login:
        print("[PME REPORT] Cookie atau credential PME belum dikonfigurasi.")
        return False

    key = pme_report_attempt_key(device.get("id", ""))
    last_attempt = float(db.get_setting(key, "0") or 0)
    if now - last_attempt < PQM_PME_REPORT_COOLDOWN_DETIK:
        remaining = PQM_PME_REPORT_COOLDOWN_DETIK - (now - last_attempt)
        print(
            "[PME REPORT] Cooldown report masih aktif untuk "
            f"{device.get('nama_bay', '-')} ({remaining:.0f} detik lagi)."
        )
        return False

    db.set_setting(key, str(now))
    return True

def extract_hidden_field(page_html, field_name):
    patterns = [
        rf'<input[^>]*(?:name|id)=["\']{re.escape(field_name)}["\'][^>]*value=["\']([^"\']*)["\']',
        rf'<input[^>]*value=["\']([^"\']*)["\'][^>]*(?:name|id)=["\']{re.escape(field_name)}["\']',
    ]
    for pattern in patterns:
        match = re.search(pattern, page_html or "", re.IGNORECASE | re.DOTALL)
        if match:
            return html.unescape(match.group(1))
    return ""

def decode_reportviewer_js_string(value):
    text = str(value or "")
    try:
        text = bytes(text, "utf-8").decode("unicode_escape")
    except Exception:
        pass
    return html.unescape(text)

def extract_export_url_base(viewer_html):
    match = re.search(r'"ExportUrlBase"\s*:\s*"([^"]+)"', viewer_html or "")
    if not match:
        return ""
    return decode_reportviewer_js_string(match.group(1))

def extract_pme_report_session_key(page_html):
    match = re.search(r'ReportSessionKey[\s\S]{0,120}?return\s+"([^"]+)"', page_html or "")
    return match.group(1) if match else ""

def extract_pme_source_selector_instance_id(page_html):
    match = re.search(r"SourceSelectorPopup_SourceSelectorPopup\.set_instanceIdentifier\('([^']+)'\)", page_html or "")
    if match:
        return match.group(1)
    match = re.search(r"set_instanceIdentifier\('([^']+)'\)", page_html or "")
    return match.group(1) if match else ""

def extract_pme_tree_state_instance_id(popup_html):
    matches = re.findall(r"NodeCheckChanged[\s\S]*?'([0-9a-f-]{36})'", popup_html or "", re.IGNORECASE)
    return matches[-1] if matches else ""

def extract_pme_popup_return_values(popup_html):
    match = re.search(
        r"var\s+retValArr\s*=\s*\[\s*'([^']*)'\s*,\s*'([^']*)'\s*,\s*'([^']*)'",
        popup_html or "",
        re.DOTALL,
    )
    if not match:
        return None
    return tuple(decode_reportviewer_js_string(item) for item in match.groups())

def build_absolute_pme_url(path_or_url):
    text = str(path_or_url or "").strip()
    if text.startswith(("http://", "https://")):
        return text
    return f"{PQM_PME_REPORT_BASE_URL.rstrip('/')}/{text.lstrip('/')}"

def build_pme_source_selector_popup_url(instance_id):
    query = urlencode({
        "rx": str(int(time.time() * 1000)),
        "InputControlPath": "~/controls/InputSourceSelector.ascx",
        "HelpFilePath": "",
        "SelectionTextSizeLimit": "50",
        "IsSelectionRequired": "False",
        "ClientID": f"{PME_SOURCE_SELECTOR_CLIENT_ID}{instance_id}",
        "ShowWaitMessage": "True",
    })
    return build_absolute_pme_url(f"/reporter/Core/PopupFramework/GenericPopupInputFramework.aspx?{query}")

def sanitize_pdf_label(value):
    text = str(value or "").strip()
    if "fajar" in text.lower():
        return "GIFajar"
    words = re.findall(r"[A-Za-z0-9]+", text)
    if not words:
        return "PQM"
    normalized = []
    for word in words:
        if word.upper() in {"GI", "GIS", "GITET", "SW"}:
            normalized.append(word.upper())
        else:
            normalized.append(word[:1].upper() + word[1:])
    return "".join(normalized)

def build_pme_pdf_filename(device, waktu):
    date_label = parse_wib_datetime(waktu).strftime("%d%m%Y")
    pqm_label = sanitize_pdf_label(device.get("nama_gi") or device.get("nama_bay") or device.get("id"))
    return f"{date_label}-PQM_{pqm_label}.pdf"

def build_pme_report_form(viewstate, viewstate_generator, source_ids, source_selection=None):
    short_desc = ""
    long_desc = ""
    serialized_value = json.dumps({
        "SelectedHierarchyID": "NoGrouping",
        "SelectedSourceIDList": [str(item) for item in source_ids],
    }, separators=(",", ":"))
    if source_selection:
        short_desc, long_desc, serialized_value = source_selection

    return {
        "__EVENTTARGET": "",
        "__EVENTARGUMENT": "",
        "__VIEWSTATE": viewstate,
        "__VIEWSTATEGENERATOR": viewstate_generator,
        "ReportGenerated": "false",
        "ctl01$controlRepeater$ctl01$ctl00$m_ParameterControlHolder$ctl03$textbox": "Power Quality",
        "ShortDesc_ctl01_controlRepeater_ctl02_ctl00_m_ParameterControlHolder_ctl03_SourceSelectorPopup_SourceSelectorPopup": short_desc,
        "LongDesc_ctl01_controlRepeater_ctl02_ctl00_m_ParameterControlHolder_ctl03_SourceSelectorPopup_SourceSelectorPopup": long_desc,
        "ctl01$controlRepeater$ctl02$ctl00$m_ParameterControlHolder$ctl03$SourceSelectorPopup$SourceSelectorPopup$ControlValid": "true",
        "ctl01$controlRepeater$ctl02$ctl00$m_ParameterControlHolder$ctl03$SourceSelectorPopup$SourceSelectorPopup$HiddenSerializedValue": serialized_value,
        "ctl01$controlRepeater$ctl03$ctl00$m_ParameterControlHolder$ctl03$list": str(PQM_PME_REPORT_INCIDENT_INTERVAL),
        "ctl01$controlRepeater$ctl04$ctl00$m_ParameterControlHolder$ctl03$m_DateRangeCtrl$dateRange$RelativeDateTimeDropDownList": str(PQM_PME_REPORT_PERIOD_CODE),
        "ctl01$controlRepeater$ctl04$ctl00$m_ParameterControlHolder$ctl03$m_DateRangeCtrl$inputTimezone$TimeZoneDropDown": str(PQM_PME_REPORT_TIMEZONE_CODE),
        "ctl01$controlRepeater$ctl05$ctl00$m_ParameterControlHolder$ctl03$list": "1",
        "ctl01$controlRepeater$ctl06$ctl00$m_ParameterControlHolder$ctl03$textbox": "en-US",
        "ctl01$controlRepeater$ctl07$ctl00$m_ParameterControlHolder$ctl03$textbox": "en",
        "ctl01$controlRepeater$ctl08$ctl00$m_ParameterControlHolder$ctl03$list": "#009530,#C3E5A0,#E6F2DA",
        "ctl01$controlRepeater$ctl09$ctl00$m_ParameterControlHolder$ctl03$boolean": "btnFalse",
        "ctl01$controlRepeater$ctl10$ctl00$m_ParameterControlHolder$ctl03$boolean": "btnFalse",
        "ctl01$controlRepeater$ctl11$ctl00$m_ParameterControlHolder$ctl03$boolean": "btnTrue",
        "ctl01$controlRepeater$ctl12$ctl00$m_ParameterControlHolder$ctl03$boolean": "btnFalse",
        "ctl01$controlRepeater$ctl13$ctl00$m_ParameterControlHolder$ctl03$list": str(PQM_PME_REPORT_Y_AXIS_MAX),
        "ctl01$controlRepeater$ctl14$ctl00$m_ParameterControlHolder$ctl03$list": "False",
        "ctl01$controlRepeater$ctl15$ctl00$m_ParameterControlHolder$ctl03$boolean": "btnTrue",
        "ctl01$AllParametersVisible": "false",
        "btnGenerateReport": "Generate Report",
    }

def prime_pme_source_selection(session, parameter_url, page_html, source_ids):
    instance_id = extract_pme_source_selector_instance_id(page_html)
    if not instance_id:
        raise RuntimeError("Instance source selector PME tidak ditemukan.")

    popup_url = build_pme_source_selector_popup_url(instance_id)
    popup = session.get(
        popup_url,
        headers={"Referer": parameter_url},
        timeout=PQM_PME_REPORT_TIMEOUT_DETIK,
    )
    if popup.status_code >= 400:
        raise RuntimeError(f"Popup source selector PME gagal dibuka ({popup.status_code}).")

    tree_instance_id = extract_pme_tree_state_instance_id(popup.text)
    if not tree_instance_id:
        raise RuntimeError("Instance tree source selector PME tidak ditemukan.")

    service_url = build_absolute_pme_url("/reporter/Core/Services/InputTreeControlStateService.asmx/NodeCheckChanged")
    for source_id in source_ids:
        source_text = str(source_id)
        response = session.post(
            service_url,
            json={
                "nodeBeadId": source_text,
                "nodeItemId": source_text,
                "nodeChecked": True,
                "checkChildNodes": True,
                "instanceId": tree_instance_id,
            },
            headers={
                "Referer": popup_url,
                "Origin": PQM_PME_REPORT_BASE_URL.rstrip("/"),
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/json; charset=UTF-8",
            },
            timeout=PQM_PME_REPORT_TIMEOUT_DETIK,
        )
        if response.status_code >= 400:
            raise RuntimeError(f"Pemilihan source PME gagal ({response.status_code}).")

    popup_form = {
        "__EVENTTARGET": "",
        "__EVENTARGUMENT": "",
        "__LASTFOCUS": "",
        "__VIEWSTATE": extract_hidden_field(popup.text, "__VIEWSTATE"),
        "__VIEWSTATEGENERATOR": extract_hidden_field(popup.text, "__VIEWSTATEGENERATOR"),
        "ctl01_TreeControl_TreeControl_TreeControl_ClientState": "",
        "OKButton": "OK",
    }
    if not popup_form["__VIEWSTATE"] or not popup_form["__VIEWSTATEGENERATOR"]:
        raise RuntimeError("VIEWSTATE popup source selector PME tidak ditemukan.")

    popup_ok = session.post(
        popup_url,
        data=popup_form,
        headers={"Referer": popup_url},
        timeout=PQM_PME_REPORT_TIMEOUT_DETIK,
        allow_redirects=True,
    )
    if popup_ok.status_code >= 400:
        raise RuntimeError(f"Konfirmasi source selector PME gagal ({popup_ok.status_code}).")

    source_selection = extract_pme_popup_return_values(popup_ok.text)
    if not source_selection:
        raise RuntimeError("Hasil pilihan source PME tidak ditemukan.")

    selected_text = source_selection[2]
    expected_ids = [str(item) for item in source_ids]
    try:
        selected_payload = json.loads(selected_text)
        selected_ids = [str(item) for item in selected_payload.get("SelectedSourceIDList", [])]
    except Exception:
        selected_ids = []
    if selected_ids != expected_ids:
        raise RuntimeError(
            "Pilihan source PME tidak sesuai. "
            f"Diharapkan {expected_ids}, terbaca {selected_ids}."
        )

    return source_selection

def pme_report_session():
    session = requests.Session()
    session.headers.update({
        "User-Agent": "Mozilla/5.0 VoltKraf PME Report Fetcher",
        "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
    })
    cookie_value = str(PQM_PME_REPORT_COOKIE or "").strip()
    if cookie_value and not (str(PQM_PME_REPORT_USERNAME or "").strip() and str(PQM_PME_REPORT_PASSWORD or "")):
        session.headers.update({"Cookie": cookie_value})
    return session

def pme_response_is_login_page(response_text):
    lowered = str(response_text or "").lower()
    return (
        "encodedpassword" in lowered
        and "username" in lowered
        and "password" in lowered
    )

def pme_login(session, target_url):
    username = str(PQM_PME_REPORT_USERNAME or "").strip()
    password = str(PQM_PME_REPORT_PASSWORD or "")
    if not username or not password:
        return None

    encoded_password = base64.b64encode(password.encode("utf-8")).decode("ascii")
    login_response = session.post(
        target_url,
        data={
            "UserName": username,
            "RedirectHashValue": "",
            "EncodedPassword": encoded_password,
        },
        headers={
            "Referer": target_url,
            "Origin": PQM_PME_REPORT_BASE_URL.rstrip("/"),
        },
        timeout=PQM_PME_REPORT_TIMEOUT_DETIK,
        allow_redirects=True,
    )
    return login_response

def pme_get_authenticated_page(session, target_url):
    page = session.get(target_url, timeout=PQM_PME_REPORT_TIMEOUT_DETIK, allow_redirects=True)
    if page.status_code >= 400:
        return page
    if not pme_response_is_login_page(page.text):
        return page

    login_response = pme_login(session, page.url or target_url)
    if login_response is None:
        return page
    if login_response.status_code >= 400:
        return login_response
    if not pme_response_is_login_page(login_response.text):
        return login_response

    return session.get(target_url, timeout=PQM_PME_REPORT_TIMEOUT_DETIK, allow_redirects=True)

def generate_pme_power_quality_pdf(device, waktu):
    source_ids = get_pme_source_ids_for_device(device)
    if not source_ids:
        raise RuntimeError("Source PME untuk PQM ini belum dimapping.")

    report_id = str(PQM_PME_REPORT_ID or "91").strip() or "91"
    parameter_url = build_absolute_pme_url(f"/reporter/reporter/ParameterCollectionPage.aspx?ReportID={quote(report_id)}")
    session = pme_report_session()

    page = pme_get_authenticated_page(session, parameter_url)
    if page.status_code >= 400:
        raise RuntimeError(f"Halaman parameter PME gagal dibuka ({page.status_code}).")
    if pme_response_is_login_page(page.text):
        raise RuntimeError("Session/login PME tidak valid atau sudah logout.")

    viewstate = extract_hidden_field(page.text, "__VIEWSTATE")
    viewstate_generator = extract_hidden_field(page.text, "__VIEWSTATEGENERATOR")
    if not viewstate or not viewstate_generator:
        raise RuntimeError("VIEWSTATE report PME tidak ditemukan.")

    source_selection = prime_pme_source_selection(session, parameter_url, page.text, source_ids)
    form_data = build_pme_report_form(viewstate, viewstate_generator, source_ids, source_selection)
    viewer = session.post(
        parameter_url,
        data=form_data,
        headers={"Referer": parameter_url},
        timeout=PQM_PME_REPORT_TIMEOUT_DETIK,
        allow_redirects=True,
    )
    if viewer.status_code >= 400:
        raise RuntimeError(f"Generate report PME gagal ({viewer.status_code}).")

    export_base = extract_export_url_base(viewer.text)
    if not export_base:
        report_session_key = extract_pme_report_session_key(viewer.text)
        if report_session_key:
            viewer_url = build_absolute_pme_url(
                "/reporter/reporter/EemReportViewer.aspx"
                f"?ReportSessionKey={report_session_key}&ClearReport=0&BrowserID={uuid.uuid4()}"
            )
            viewer = session.get(
                viewer_url,
                headers={"Referer": parameter_url},
                timeout=PQM_PME_REPORT_TIMEOUT_DETIK,
            )
            if viewer.status_code >= 400:
                raise RuntimeError(f"Viewer report PME gagal dibuka ({viewer.status_code}).")
            export_base = extract_export_url_base(viewer.text)
    if not export_base:
        viewer_text = str(viewer.text or "").lower()
        if "none selected" in viewer_text or "require a valid value" in viewer_text:
            raise RuntimeError(
                "PME menolak pilihan source report; source menjadi None Selected. "
                "Report ditahan agar tidak salah kirim."
            )
        raise RuntimeError("ExportUrlBase report PME tidak ditemukan.")

    export_url = build_absolute_pme_url(export_base + "PDF")
    time.sleep(2)
    pdf_response = session.get(
        export_url,
        headers={"Referer": viewer.url},
        timeout=PQM_PME_REPORT_TIMEOUT_DETIK,
    )
    content_type = str(pdf_response.headers.get("content-type") or "").lower()
    if pdf_response.status_code >= 400:
        raise RuntimeError(f"Export PDF PME gagal ({pdf_response.status_code}).")
    if "pdf" not in content_type and not pdf_response.content.startswith(b"%PDF"):
        raise RuntimeError("Respons export PME bukan PDF.")

    Path(PQM_PME_REPORT_DIR).mkdir(parents=True, exist_ok=True)
    pdf_path = Path(PQM_PME_REPORT_DIR) / build_pme_pdf_filename(device, waktu)
    pdf_path.write_bytes(pdf_response.content)
    validate_pme_pdf_source(pdf_path, source_ids)
    return str(pdf_path)

def extract_pdf_text(pdf_path):
    pdftotext_path = shutil.which("pdftotext")
    if not pdftotext_path:
        return ""
    try:
        completed = subprocess_run(
            [pdftotext_path, "-layout", str(pdf_path), "-"],
            timeout=15,
        )
        return completed.stdout or ""
    except Exception as exc:
        print(f"[PME REPORT] Gagal membaca teks PDF PME: {exc}")
        return ""

def subprocess_run(args, timeout=15):
    import subprocess
    return subprocess.run(
        args,
        capture_output=True,
        text=True,
        timeout=timeout,
        errors="replace",
    )

def normalize_pme_pdf_text(value):
    return re.sub(r"\s+", "", str(value or "")).upper()

def expected_pme_source_labels(source_ids):
    labels = []
    for source_id in source_ids or []:
        label = PME_SOURCE_LABELS.get(str(source_id).strip())
        if label:
            labels.append(label)
    return labels

def validate_pme_pdf_source(pdf_path, source_ids):
    expected_labels = expected_pme_source_labels(source_ids)
    if not expected_labels:
        print(f"[PME REPORT] Label source PME belum dikenal untuk ID: {source_ids}.")
        return True

    text = extract_pdf_text(pdf_path)
    if not text:
        raise RuntimeError("Teks PDF PME tidak bisa dibaca; report ditahan agar tidak salah kirim.")

    normalized_text = normalize_pme_pdf_text(text)
    for label in expected_labels:
        if normalize_pme_pdf_text(label) in normalized_text:
            return True

    source_lines = [
        re.sub(r"\s+", " ", line).strip()
        for line in text.splitlines()
        if "source" in line.lower() or "upt_" in line.lower()
    ][:3]
    detail = f" Terbaca: {' | '.join(source_lines)}" if source_lines else ""
    raise RuntimeError(
        "Source PDF PME tidak sesuai. "
        f"Diharapkan: {', '.join(expected_labels)}.{detail}"
    )

def parse_pme_pdf_incidents(pdf_path):
    text = extract_pdf_text(pdf_path)
    if not text:
        return []

    section = text
    start_index = text.find("Worst Disturbance per Incident")
    if start_index >= 0:
        section = text[start_index:]
        end_index = section.find("Incident Statistics")
        if end_index >= 0:
            section = section[:end_index]

    matches = list(re.finditer(
        r"^\s*(\d+)\s+(\d{1,2}/\d{1,2}/\d{4}\s+\d{1,2}:\d{2}:\d{2}\s+[AP]M)\b",
        section,
        re.MULTILINE,
    ))
    incidents = []
    seen_signatures = set()
    for index, match in enumerate(matches):
        incident_id = match.group(1)
        timestamp = match.group(2)
        end_pos = matches[index + 1].start() if index + 1 < len(matches) else min(len(section), match.end() + 500)
        chunk = section[match.start():end_pos]
        type_match = re.search(
            r"\b(Transient|Sag|Swell|Undervoltage|Overvoltage|Interruption)\b",
            chunk,
            re.IGNORECASE,
        )
        incident_type = type_match.group(1).title() if type_match else "Power Quality"
        signature = f"{timestamp}|{incident_type}"
        if signature in seen_signatures:
            continue
        seen_signatures.add(signature)
        incidents.append({
            "id": incident_id,
            "timestamp": timestamp,
            "type": incident_type,
            "signature": signature,
        })
    return incidents

def mark_pme_pdf_incidents_seen(device, pdf_path):
    incidents = parse_pme_pdf_incidents(pdf_path)
    if not incidents:
        return []
    signatures = [incident["signature"] for incident in incidents]
    db.set_setting(
        pme_scan_seen_key(device.get("id", "")),
        json.dumps({
            "date": format_notification_date(time.strftime("%Y-%m-%d %H:%M:%S")),
            "signatures": signatures,
            "updated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        }),
    )
    return incidents

def pme_pdf_new_incidents(device, pdf_path):
    incidents = parse_pme_pdf_incidents(pdf_path)
    if not incidents:
        return [], []

    previous_payload = safe_json_dict(db.get_setting(pme_scan_seen_key(device.get("id", "")), ""))
    previous_signatures = set(previous_payload.get("signatures") or [])
    if not previous_signatures:
        return incidents, incidents

    new_incidents = [
        incident for incident in incidents
        if incident["signature"] not in previous_signatures
    ]
    return incidents, new_incidents

def pme_pdf_contains_incident(pdf_path):
    text = extract_pdf_text(pdf_path)
    if not text:
        return True
    lowered = text.lower()
    if "no power quality incidents found" in lowered:
        return False
    match = re.search(r"number\s+of\s+incidents\s+(\d+)", lowered)
    if match and int(match.group(1) or 0) <= 0:
        return False
    return True

def build_pme_pdf_caption(device, waktu, events):
    event_labels = []
    seen_types = set()
    for event in events or []:
        event_type = event.get("event_type")
        if event_type in seen_types:
            continue
        seen_types.add(event_type)
        event_labels.append(pqm_disturbance_type_label(event_type))
    if not event_labels:
        event_labels.append("Gangguan kualitas daya")

    return (
        "*PME POWER QUALITY REPORT*\n"
        f"GI: {device.get('nama_gi', '-')}\n"
        f"Bay: {device.get('nama_bay', '-')}\n"
        f"Waktu deteksi: {format_notification_time(waktu)}\n"
        f"Incident interval: {PQM_PME_REPORT_INCIDENT_INTERVAL} seconds\n"
        f"Indikasi: {', '.join(event_labels)}"
    )

def generate_and_send_pme_report_for_pqm(device, waktu, events):
    try:
        now = time.time()
        if not should_attempt_pme_report(device, events, now):
            return

        pdf_path = generate_pme_power_quality_pdf(device, waktu)
        incidents, new_incidents = pme_pdf_new_incidents(device, pdf_path)
        if not incidents:
            print(
                f"[PME REPORT] PDF PME untuk {device.get('nama_gi', '-')} - "
                f"{device.get('nama_bay', '-')} tidak berisi incident; tidak dikirim."
            )
            return
        if not new_incidents:
            print(
                f"[PME REPORT] Alarm terdeteksi, tetapi tidak ada incident PME baru untuk "
                f"{device.get('nama_gi', '-')} - {device.get('nama_bay', '-')}; PDF tidak dikirim."
            )
            return

        caption = build_pme_pdf_caption(device, waktu, events)
        signature_digest = hashlib.sha256("|".join(incident["signature"] for incident in new_incidents).encode("utf-8")).hexdigest()[:16]
        dedupe_key = f"pme-pqm::{device.get('id', '')}::{signature_digest}"
        if send_whatsapp_document(pdf_path, caption, dedupe_key=dedupe_key):
            mark_pme_pdf_incidents_seen(device, pdf_path)
            print(f"[PME REPORT] PDF PME terkirim ke WhatsApp: {os.path.basename(pdf_path)}")
        else:
            print(f"[PME REPORT] PDF PME belum terkirim ke WhatsApp: {os.path.basename(pdf_path)}")
    except Exception as exc:
        print(
            f"[PME REPORT FAILED] {device.get('nama_gi', '-')} - "
            f"{device.get('nama_bay', '-')}: {exc}"
        )

def queue_pme_report_for_pqm(device, waktu, events):
    safe_device = dict(device)
    safe_events = [dict(event) for event in (events or [])]
    threading.Thread(
        target=generate_and_send_pme_report_for_pqm,
        args=(safe_device, waktu, safe_events),
        daemon=True,
    ).start()

def build_pme_scan_caption(device, new_incidents):
    incident_lines = []
    for incident in (new_incidents or [])[:5]:
        incident_lines.append(
            f"- {incident.get('timestamp', '-')} | {incident.get('type', 'Power Quality')}"
        )
    remaining = len(new_incidents or []) - len(incident_lines)
    if remaining > 0:
        incident_lines.append(f"- +{remaining} incident lain")

    return "\n".join([
        "*PME POWER QUALITY REPORT*",
        f"GI: {device.get('nama_gi', '-')}",
        f"Bay: {device.get('nama_bay', '-')}",
        "Trigger: Scan PME berkala/backfill",
        f"Incident baru: {len(new_incidents or [])}",
        "Daftar incident:",
        *incident_lines,
    ])

def scan_pme_report_for_device(device, first_run=False):
    source_ids = get_pme_source_ids_for_device(device)
    if not source_ids:
        return

    pdf_path = generate_pme_power_quality_pdf(device, time.strftime("%Y-%m-%d %H:%M:%S"))
    incidents = parse_pme_pdf_incidents(pdf_path)
    key = pme_scan_seen_key(device.get("id", ""))
    previous_payload = safe_json_dict(db.get_setting(key, ""))
    previous_signatures = set(previous_payload.get("signatures") or [])
    current_signatures = [incident["signature"] for incident in incidents]

    if not incidents:
        db.set_setting(
            key,
            json.dumps({
                "date": time.strftime("%Y-%m-%d"),
                "signatures": [],
                "updated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            }),
        )
        print(f"[PME SCAN] Tidak ada incident PME: {device.get('nama_gi', '-')} - {device.get('nama_bay', '-')}")
        return

    if not previous_payload and not PQM_PME_SCAN_FIRST_RUN_SEND:
        db.set_setting(
            key,
            json.dumps({
                "date": time.strftime("%Y-%m-%d"),
                "signatures": current_signatures,
                "updated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            }),
        )
        print(
            f"[PME SCAN] Baseline incident tersimpan untuk "
            f"{device.get('nama_gi', '-')} - {device.get('nama_bay', '-')} ({len(incidents)} incident)."
        )
        return

    new_incidents = [
        incident for incident in incidents
        if incident["signature"] not in previous_signatures
    ]
    if not new_incidents:
        db.set_setting(
            key,
            json.dumps({
                "date": time.strftime("%Y-%m-%d"),
                "signatures": current_signatures,
                "updated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            }),
        )
        print(f"[PME SCAN] Belum ada incident PME baru: {device.get('nama_gi', '-')} - {device.get('nama_bay', '-')}")
        return

    # Bypass pengiriman dokumen WhatsApp sesuai permintaan, cukup simpan sebagai log
    db.set_setting(
        key,
        json.dumps({
            "date": time.strftime("%Y-%m-%d"),
            "signatures": current_signatures,
            "updated_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        }),
    )
    print(
        f"[PME SCAN] Incident PME baru tercatat (dokumen dinonaktifkan): "
        f"{device.get('nama_gi', '-')} - {device.get('nama_bay', '-')} ({len(new_incidents)} incident baru)."
    )

def scan_pme_reports_once(first_run=False):
    if not PQM_PME_SCAN_ENABLED:
        return
    if not app_locks["pme_report_scan"].acquire(blocking=False):
        return

    try:
        devices = [
            device for device in db.get_pqm_devices()
            if device.get("enabled", 1)
            and normalize_pqm_type(device.get("pqm_type")) == PQM_TYPE_ION7650
            and get_pme_source_ids_for_device(device)
        ]
        for device in devices:
            try:
                scan_pme_report_for_device(device, first_run=first_run)
            except Exception as exc:
                print(
                    f"[PME SCAN FAILED] {device.get('nama_gi', '-')} - "
                    f"{device.get('nama_bay', '-')}: {exc}"
                )
    finally:
        app_locks["pme_report_scan"].release()

def pme_report_scan_worker():
    first_run = True
    while True:
        scan_pme_reports_once(first_run=first_run)
        first_run = False
        for _ in range(PQM_PME_SCAN_INTERVAL_DETIK):
            time.sleep(1)

def pqm_voltage_alarm_state_key(device_id):
    return f"pqm_voltage_alarm_state::{device_id}"

def pqm_voltage_alarm_attempt_key(device_id):
    return f"pqm_voltage_alarm_attempt::{device_id}"

def pqm_voltage_alarm_candidate_key(device_id):
    return f"pqm_voltage_alarm_candidate::{device_id}"

def pqm_muaratawar_load_state_key(device_id):
    return f"pqm_muaratawar_load_state::{device_id}"

def pqm_gi_fajar_load_state_key(device_id):
    return f"pqm_gi_fajar_load_state::{device_id}"

def format_pqm_voltage_value(value):
    try:
        numeric = float(value or 0)
    except (TypeError, ValueError):
        numeric = 0
    if numeric <= 0:
        return "-"
    return f"{numeric / 1000:.2f} kV"

def format_pqm_current_value(value):
    try:
        numeric = float(value or 0)
    except (TypeError, ValueError):
        numeric = 0.0
    return f"{numeric:.2f} A"

def is_muaratawar_500kv_pqm(device_or_state):
    text = " ".join([
        str((device_or_state or {}).get("id") or ""),
        str((device_or_state or {}).get("nama_gi") or ""),
        str((device_or_state or {}).get("nama_bay") or ""),
    ]).upper()
    return "MUARATAWAR" in text

def is_gi_fajar_trafo5_pqm(device_or_state):
    text = " ".join([
        str((device_or_state or {}).get("id") or ""),
        str((device_or_state or {}).get("nama_gi") or ""),
        str((device_or_state or {}).get("nama_bay") or ""),
    ]).upper()
    normalized = text.replace("-", " ").replace("_", " ")
    return (
        "FAJAR" in normalized
        and ("TRAFO 5" in normalized or "TRAFO5" in normalized)
    )

def get_pqm_load_currents(state):
    phase_values = []
    currents = {}
    for key in ("current_a", "current_b", "current_c"):
        try:
            value = float(state.get(key) or 0)
        except (TypeError, ValueError):
            value = 0.0
        currents[key] = value
        phase_values.append(value)

    phase_average = sum(phase_values) / len(phase_values) if phase_values else 0.0
    try:
        reported_average = float(state.get("current_avg") or 0)
    except (TypeError, ValueError):
        reported_average = 0.0
    average = reported_average if reported_average > 0 or phase_average <= 0 else phase_average
    currents["current_avg"] = average
    return currents

def get_pqm_load_state(state):
    currents = get_pqm_load_currents(state)
    average = float(currents.get("current_avg") or 0)
    load_state = "berbeban" if average > PQM_MUARATAWAR_LOAD_THRESHOLD_AMPERE else "tidak_berbeban"
    return load_state, currents

def get_pqm_load_state_with_threshold(state, threshold_ampere):
    currents = get_pqm_load_currents(state)
    average = float(currents.get("current_avg") or 0)
    load_state = "berbeban" if average > float(threshold_ampere or 0) else "tidak_berbeban"
    return load_state, currents

def build_pqm_muaratawar_load_message(device, state, waktu, load_state, currents):
    is_loaded = load_state == "berbeban"
    status = "BERBEBAN" if is_loaded else "TIDAK BERBEBAN"
    indication_lines = [
        "PQM terpantau berbeban." if is_loaded else "PQM terpantau tidak berbeban.",
        f"BATAS BERBEBAN = > {format_pqm_current_value(PQM_MUARATAWAR_LOAD_THRESHOLD_AMPERE)}",
        f"ARUS R = {format_pqm_current_value(currents.get('current_a'))}",
        f"ARUS S = {format_pqm_current_value(currents.get('current_b'))}",
        f"ARUS T = {format_pqm_current_value(currents.get('current_c'))}",
        f"ARUS AVG = {format_pqm_current_value(currents.get('current_avg'))}",
    ]
    return notification_event_template(
        device.get("nama_gi", "-"),
        device.get("nama_bay", "-"),
        waktu,
        "PQM LOAD MONITORING",
        status=status,
        ip=device.get("ip", ""),
        indikasi_lines=indication_lines,
    )

def handle_pqm_muaratawar_load_notification(device, state, waktu):
    if not state.get("connected"):
        return
    if not is_muaratawar_500kv_pqm(device):
        return

    load_state, currents = get_pqm_load_state(state)
    setting_key = pqm_muaratawar_load_state_key(device["id"])
    previous_payload = safe_json_dict(db.get_setting(setting_key, ""))
    previous_state = previous_payload.get("state")
    payload = {
        "state": load_state,
        "current_a": currents.get("current_a", 0.0),
        "current_b": currents.get("current_b", 0.0),
        "current_c": currents.get("current_c", 0.0),
        "current_avg": currents.get("current_avg", 0.0),
        "threshold_ampere": PQM_MUARATAWAR_LOAD_THRESHOLD_AMPERE,
        "updated_at": waktu,
    }

    if not previous_state:
        db.set_setting(setting_key, json.dumps(payload, ensure_ascii=True))
        print(
            f"[PQM MUARATAWAR LOAD BASELINE] {device['nama_gi']} - {device['nama_bay']}: "
            f"{load_state.replace('_', ' ').upper()} "
            f"({format_pqm_current_value(currents.get('current_avg'))}); notifikasi awal tidak dikirim."
        )
        return

    if previous_state == load_state:
        db.set_setting(setting_key, json.dumps(payload, ensure_ascii=True))
        return

    message = build_pqm_muaratawar_load_message(device, state, waktu, load_state, currents)
    if send_whatsapp_notification(message):
        db.set_setting(setting_key, json.dumps(payload, ensure_ascii=True))
        print(
            f"[PQM MUARATAWAR LOAD] {device['nama_gi']} - {device['nama_bay']}: "
            f"{previous_state.replace('_', ' ').upper()} -> {load_state.replace('_', ' ').upper()} "
            f"terkirim ke WA/Telegram."
        )
    else:
        print(
            f"[PQM MUARATAWAR LOAD FAILED] {device['nama_gi']} - {device['nama_bay']}: "
            f"perubahan {previous_state.replace('_', ' ').upper()} -> "
            f"{load_state.replace('_', ' ').upper()} belum terkirim."
        )

def get_pqm_gi_fajar_load_state(state):
    currents = get_pqm_load_currents(state)
    average = float(currents.get("current_avg") or 0)
    if average <= PQM_GI_FAJAR_TRIP_CURRENT_AMPERE:
        return "beban_trip", currents
    if average >= PQM_GI_FAJAR_HIGH_LOAD_THRESHOLD_AMPERE:
        return "beban_tinggi", currents
    return "berbeban", currents

def build_pqm_gi_fajar_load_message(device, state, waktu, load_state, currents):
    if load_state == "beban_trip":
        status = "BEBAN TRIP / ARUS 0 A"
        summary = "Arus average terbaca 0 A, indikasi beban trip/kosong."
    elif load_state == "beban_tinggi":
        status = "BEBAN TINGGI"
        summary = (
            "Arus average mencapai atau melewati "
            f"{format_pqm_current_value(PQM_GI_FAJAR_HIGH_LOAD_THRESHOLD_AMPERE)}."
        )
    else:
        status = "BERBEBAN NORMAL / KONSUMEN MASUK"
        summary = (
            "Arus average terpantau di atas 0 A dan masih di bawah batas beban tinggi."
        )

    indication_lines = [
        summary,
        f"BATAS TRIP = {format_pqm_current_value(PQM_GI_FAJAR_TRIP_CURRENT_AMPERE)}",
        f"BATAS BEBAN TINGGI = {format_pqm_current_value(PQM_GI_FAJAR_HIGH_LOAD_THRESHOLD_AMPERE)}",
        f"ARUS R = {format_pqm_current_value(currents.get('current_a'))}",
        f"ARUS S = {format_pqm_current_value(currents.get('current_b'))}",
        f"ARUS T = {format_pqm_current_value(currents.get('current_c'))}",
        f"ARUS AVG = {format_pqm_current_value(currents.get('current_avg'))}",
    ]
    return notification_event_template(
        device.get("nama_gi", "-"),
        device.get("nama_bay", "-"),
        waktu,
        "PQM LOAD MONITORING",
        status=status,
        ip=device.get("ip", ""),
        indikasi_lines=indication_lines,
    )

def handle_pqm_gi_fajar_load_notification(device, state, waktu):
    if not state.get("connected"):
        return
    if not is_gi_fajar_trafo5_pqm(device):
        return

    load_state, currents = get_pqm_gi_fajar_load_state(state)
    setting_key = pqm_gi_fajar_load_state_key(device["id"])
    previous_payload = safe_json_dict(db.get_setting(setting_key, ""))
    previous_state = previous_payload.get("state")
    payload = {
        "state": load_state,
        "current_a": currents.get("current_a", 0.0),
        "current_b": currents.get("current_b", 0.0),
        "current_c": currents.get("current_c", 0.0),
        "current_avg": currents.get("current_avg", 0.0),
        "trip_current_ampere": PQM_GI_FAJAR_TRIP_CURRENT_AMPERE,
        "high_load_threshold_ampere": PQM_GI_FAJAR_HIGH_LOAD_THRESHOLD_AMPERE,
        "updated_at": waktu,
    }

    if not previous_state:
        db.set_setting(setting_key, json.dumps(payload, ensure_ascii=True))
        print(
            f"[PQM GI FAJAR LOAD BASELINE] {device['nama_gi']} - {device['nama_bay']}: "
            f"{load_state.replace('_', ' ').upper()} "
            f"({format_pqm_current_value(currents.get('current_avg'))}); notifikasi awal tidak dikirim."
        )
        return

    if previous_state == load_state:
        db.set_setting(setting_key, json.dumps(payload, ensure_ascii=True))
        return

    message = build_pqm_gi_fajar_load_message(device, state, waktu, load_state, currents)
    if send_whatsapp_notification(message):
        db.set_setting(setting_key, json.dumps(payload, ensure_ascii=True))
        print(
            f"[PQM GI FAJAR LOAD] {device['nama_gi']} - {device['nama_bay']}: "
            f"{previous_state.replace('_', ' ').upper()} -> {load_state.replace('_', ' ').upper()} "
            f"terkirim ke WA/Telegram."
        )
    else:
        print(
            f"[PQM GI FAJAR LOAD FAILED] {device['nama_gi']} - {device['nama_bay']}: "
            f"perubahan {previous_state.replace('_', ' ').upper()} -> "
            f"{load_state.replace('_', ' ').upper()} belum terkirim."
        )

def get_pqm_nominal_ln_voltage(device_or_state):
    for key in ("nominal_ln_voltage", "nominal_voltage_ln", "nominal_voltage"):
        try:
            value = float((device_or_state or {}).get(key) or 0)
        except (TypeError, ValueError):
            value = 0
        if value > 0:
            return value

    if is_muaratawar_500kv_pqm(device_or_state):
        return float(PQM_MUARATAWAR_500KV_NOMINAL_LN_VOLTAGE)
    return float(PQM_NOMINAL_LN_VOLTAGE)

def get_pqm_voltage_alarm_state(state):
    phases = [
        ("V_AN", float(state.get("v_an") or 0)),
        ("V_BN", float(state.get("v_bn") or 0)),
        ("V_CN", float(state.get("v_cn") or 0)),
    ]
    valid_phases = [(label, value) for label, value in phases if value > 0]
    if not valid_phases:
        return "unknown", []

    nominal_voltage = get_pqm_nominal_ln_voltage(state)
    undervoltage_limit = nominal_voltage * PQM_UNDERVOLTAGE_RATIO
    overvoltage_limit = nominal_voltage * PQM_OVERVOLTAGE_RATIO

    low_phases = [(label, value) for label, value in valid_phases if value < undervoltage_limit]
    high_phases = [(label, value) for label, value in valid_phases if value > overvoltage_limit]

    if low_phases:
        return "undervoltage", low_phases
    if high_phases:
        return "overvoltage", high_phases
    return "normal", []

def build_pqm_voltage_alarm_message(device, state, voltage_state, abnormal_phases, waktu):
    nominal_voltage = get_pqm_nominal_ln_voltage(device)
    if voltage_state == "undervoltage":
        status = "UNDERVOLTAGE AKTIF"
        threshold_line = (
            "BATAS BAWAH = "
            f"{format_pqm_voltage_value(nominal_voltage * PQM_UNDERVOLTAGE_RATIO)} "
            f"({PQM_UNDERVOLTAGE_RATIO * 100:.0f}% NOMINAL)"
        )
    else:
        status = "OVERVOLTAGE AKTIF"
        threshold_line = (
            "BATAS ATAS = "
            f"{format_pqm_voltage_value(nominal_voltage * PQM_OVERVOLTAGE_RATIO)} "
            f"({PQM_OVERVOLTAGE_RATIO * 100:.0f}% NOMINAL)"
        )

    indication_lines = [
        f"NOMINAL L-N = {format_pqm_voltage_value(nominal_voltage)}",
        threshold_line,
        f"V_AN = {format_pqm_voltage_value(state.get('v_an'))}",
        f"V_BN = {format_pqm_voltage_value(state.get('v_bn'))}",
        f"V_CN = {format_pqm_voltage_value(state.get('v_cn'))}",
    ]
    if abnormal_phases:
        indication_lines.append(
            "PHASE TERDETEKSI = "
            + ", ".join(f"{label} {format_pqm_voltage_value(value)}" for label, value in abnormal_phases)
        )

    return notification_event_template(
        device.get("nama_gi", "-"),
        device.get("nama_bay", "-"),
        waktu,
        "PQM",
        status=status,
        indikasi_lines=indication_lines,
    )

def build_pqm_voltage_pme_event(device, state, voltage_state, abnormal_phases, waktu):
    return {
        "id": str(uuid.uuid4()),
        "waktu": waktu,
        "device_id": device.get("id", ""),
        "nama_gi": device.get("nama_gi", ""),
        "nama_bay": device.get("nama_bay", ""),
        "ip": device.get("ip", ""),
        "event_type": voltage_state,
        "event_label": voltage_state.replace("_", " ").title(),
        "counter_name": "live_voltage",
        "previous_value": 0,
        "current_value": 1,
        "delta": 1,
        "phases": [
            {"label": label, "value": value}
            for label, value in (abnormal_phases or [])
        ],
        "v_an": state.get("v_an"),
        "v_bn": state.get("v_bn"),
        "v_cn": state.get("v_cn"),
    }

def handle_pqm_voltage_alarm_notification(device, state, waktu):
    if not state.get("connected"):
        return

    voltage_state, abnormal_phases = get_pqm_voltage_alarm_state(state)
    setting_key = pqm_voltage_alarm_state_key(device["id"])
    previous_state = db.get_setting(setting_key, "normal")
    candidate_key = pqm_voltage_alarm_candidate_key(device["id"])

    if is_gi_fajar_trafo5_pqm(device):
        clear_notification_candidate(candidate_key)
        db.delete_setting(pqm_voltage_alarm_attempt_key(device["id"]))
        if previous_state != voltage_state:
            db.set_setting(setting_key, voltage_state)
            print(
                f"[PQM VOLTAGE SKIPPED] {device['nama_gi']} - {device['nama_bay']}: "
                "notifikasi tegangan live dimatikan khusus GI Fajar Trafo 5; "
                "gangguan mengikuti incident PME."
            )
        return

    if voltage_state == "unknown":
        clear_notification_candidate(candidate_key)
        if previous_state in {"undervoltage", "overvoltage"}:
            print(
                f"[PQM VOLTAGE UNKNOWN HOLD] {device['nama_gi']} - {device['nama_bay']}: "
                "data tegangan tidak lengkap, state alarm aktif dipertahankan."
            )
        return

    if voltage_state == previous_state:
        clear_notification_candidate(candidate_key)
        return

    confirm_polls = PQM_VOLTAGE_ALARM_CONFIRM_POLLS
    if voltage_state == "normal" and previous_state in {"undervoltage", "overvoltage"}:
        confirm_polls = PQM_VOLTAGE_RECOVERY_CONFIRM_POLLS

    confirmed, seen_count = update_notification_candidate(
        candidate_key,
        "state",
        voltage_state,
        confirm_polls,
    )
    if not confirmed:
        if voltage_state == "normal" and previous_state in {"undervoltage", "overvoltage"}:
            print(
                f"[PQM VOLTAGE RECOVERY HOLD] {device['nama_gi']} - {device['nama_bay']}: "
                f"NORMAL menunggu konfirmasi {seen_count}/{confirm_polls}."
            )
        else:
            print(
                f"[PQM VOLTAGE HOLD] {device['nama_gi']} - {device['nama_bay']}: "
                f"{voltage_state.upper()} menunggu konfirmasi "
                f"{seen_count}/{confirm_polls}."
            )
        return

    if voltage_state in {"undervoltage", "overvoltage"}:
        attempt_key = pqm_voltage_alarm_attempt_key(device["id"])
        last_attempt = float(db.get_setting(attempt_key, "0") or 0)
        now = time.time()
        if now - last_attempt < PQM_VOLTAGE_ALARM_RETRY_DETIK:
            return

        db.set_setting(attempt_key, str(now))
        pme_event = build_pqm_voltage_pme_event(device, state, voltage_state, abnormal_phases, waktu)
        queue_pme_report_for_pqm(device, waktu, [pme_event])
        sent = send_whatsapp_notification(
            build_pqm_voltage_alarm_message(device, state, voltage_state, abnormal_phases, waktu)
        )
        if sent:
            db.set_setting(setting_key, voltage_state)
            clear_notification_candidate(candidate_key)
            print(
                f"[PQM VOLTAGE ALARM] {device['nama_gi']} - {device['nama_bay']}: "
                f"{voltage_state.upper()} terkirim ke WhatsApp."
            )
        else:
            print(
                f"[PQM VOLTAGE ALARM FAILED] {device['nama_gi']} - {device['nama_bay']}: "
                f"{voltage_state.upper()} belum terkirim. Akan dicoba lagi setelah jeda aman."
            )
    elif previous_state in {"undervoltage", "overvoltage"}:
        db.set_setting(setting_key, voltage_state)
        db.delete_setting(pqm_voltage_alarm_attempt_key(device["id"]))
        clear_notification_candidate(candidate_key)
        print(f"[PQM RECOVERY] Tegangan PQM normal tercatat: {device['nama_gi']} - {device['nama_bay']}")
    else:
        db.set_setting(setting_key, voltage_state)

def pqm_itic_pdf_attempt_key(device_id, phase_name, event_type):
    return f"pqm_itic_pdf_attempt::{device_id}::{phase_name}::{event_type}"

def should_attempt_pqm_itic_pdf(device, incident, duration_seconds, phase_name, now):
    if not PQM_ITIC_PDF_ENABLED:
        print("[PQM ITIC PDF] Pengiriman PDF ITIC sedang dimatikan.")
        return False

    if duration_seconds < PQM_ITIC_PDF_MIN_DURATION_DETIK:
        print(
            "[PQM ITIC PDF] Durasi event terlalu pendek untuk kirim PDF "
            f"({duration_seconds:.3f} s < {PQM_ITIC_PDF_MIN_DURATION_DETIK:.3f} s)."
        )
        return False

    event_type = str(incident.get("event_type") or "Unknown")
    key = pqm_itic_pdf_attempt_key(device.get("id", ""), phase_name, event_type)
    last_attempt = float(db.get_setting(key, "0") or 0)
    if now - last_attempt < PQM_ITIC_PDF_COOLDOWN_DETIK:
        remaining = PQM_ITIC_PDF_COOLDOWN_DETIK - (now - last_attempt)
        print(
            "[PQM ITIC PDF] Cooldown dokumen masih aktif untuk "
            f"{device.get('nama_bay', '-')} {phase_name} {event_type} ({remaining:.0f} detik lagi)."
        )
        return False

    db.set_setting(key, str(now))
    return True

def generate_and_send_itic_pdf(device, incident, duration_seconds, phase_name, now):
    try:
        if not should_attempt_pqm_itic_pdf(device, incident, duration_seconds, phase_name, now):
            return

        pdf_path = itic_pdf_generator.generate_pqm_pdf_report(device, incident, duration_seconds, phase_name, now)
        if pdf_path and os.path.exists(pdf_path):
            caption = (
                f"*ITIC INCIDENT REPORT*\n"
                f"GI: {device.get('nama_gi', '-')}\n"
                f"Bay: {device.get('nama_bay', '-')}\n"
                f"Type: {incident['event_type']}\n"
                f"Phase: {phase_name}\n"
                f"Magnitude: {incident['extreme_magnitude']:.2f}%\n"
                f"Duration: {duration_seconds:.3f} s"
            )
            dedupe_key = (
                f"pqm-itic::{device.get('id', '')}::{phase_name}::"
                f"{incident.get('event_type', '')}::{incident.get('start_time', '')}"
            )
            if send_whatsapp_document(pdf_path, caption, dedupe_key=dedupe_key):
                print(f"[PQM ITIC PDF] Sent PDF to WhatsApp for {device['nama_bay']}")
            else:
                print(f"[PQM ITIC PDF] PDF tercatat tetapi tidak dikirim karena pengaman WhatsApp.")
    except Exception as e:
        print(f"[PQM ITIC PDF] Error generating or sending PDF: {e}")

def handle_pqm_itic_recording(device, state, waktu):
    if not state.get("connected"):
        return

    nominal_voltage = get_pqm_nominal_ln_voltage(device)
    if nominal_voltage <= 0:
        return

    now = time.time()
    phases = [
        ("V1", float(state.get("v_an") or 0)),
        ("V2", float(state.get("v_bn") or 0)),
        ("V3", float(state.get("v_cn") or 0)),
    ]

    for phase_name, value in phases:
        if value <= 0:
            continue
            
        percent_nominal = (value / nominal_voltage) * 100
        
        if percent_nominal > 110:
            condition = "Swell"
        elif percent_nominal < 10:
            condition = "Interruption"
        elif percent_nominal < 90:
            condition = "Sag"
        else:
            condition = "Normal"
            
        incident_key = f"pqm_itic_{device['id']}_{phase_name}"
        active_incident_str = db.get_setting(incident_key)
        
        if condition != "Normal":
            if not active_incident_str:
                new_incident = {
                    "start_time": now,
                    "event_type": condition,
                    "extreme_magnitude": percent_nominal
                }
                db.set_setting(incident_key, json.dumps(new_incident))
            else:
                try:
                    incident = json.loads(active_incident_str)
                    if incident["event_type"] == "Swell":
                        incident["extreme_magnitude"] = max(incident["extreme_magnitude"], percent_nominal)
                    else:
                        incident["extreme_magnitude"] = min(incident["extreme_magnitude"], percent_nominal)
                        
                    if condition == "Interruption" and incident["event_type"] == "Sag":
                        incident["event_type"] = "Interruption"
                        
                    db.set_setting(incident_key, json.dumps(incident))
                except Exception:
                    pass
        else:
            if active_incident_str:
                try:
                    incident = json.loads(active_incident_str)
                    duration_seconds = now - float(incident["start_time"])
                    
                    if duration_seconds > 0:
                        db.insert_pqm_itic_event({
                            "device_id": device["id"],
                            "waktu_mulai": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(incident["start_time"])),
                            "waktu_selesai": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(now)),
                            "nama_gi": device["nama_gi"],
                            "nama_bay": device["nama_bay"],
                            "ip": device["ip"],
                            "event_type": incident["event_type"],
                            "phase": phase_name,
                            "duration_seconds": round(duration_seconds, 3),
                            "magnitude_percent": round(incident["extreme_magnitude"], 2)
                        })
                        generate_and_send_itic_pdf(device, incident, duration_seconds, phase_name, now)
                except Exception as e:
                    print(f"Error recording ITIC event: {e}")
                
                db.delete_setting(incident_key)

def get_pqm_failure_count(device_id):
    return int(app_state.setdefault("pqm_failure_counts", {}).get(device_id, 0) or 0)

def set_pqm_failure_count(device_id, value):
    app_state.setdefault("pqm_failure_counts", {})[device_id] = max(0, int(value or 0))

def get_last_pqm_state(device):
    for state in app_state.get("pqm_devices", []):
        if state.get("id") == device["id"]:
            return state
    return build_empty_pqm_state(device)

def handle_pqm_poll_failure(device, waktu, message):
    failure_count = get_pqm_failure_count(device["id"]) + 1
    set_pqm_failure_count(device["id"], failure_count)

    if failure_count < PQM_FAIL_THRESHOLD:
        state = {
            **get_last_pqm_state(device),
            "last_poll_time": waktu,
            "status_message": (
                f"{message} Gangguan sementara "
                f"({failure_count}/{PQM_FAIL_THRESHOLD}). Data terakhir dipertahankan."
            ),
        }
        db.insert_pqm_reading(pqm_state_to_reading(state))
        print(f"[PQM WARNING] {device['nama_gi']} - {device['nama_bay']}: {state['status_message']}")
        return state

    state = build_pqm_state(device, waktu, False, message, empty_pqm_metrics(device.get("pqm_type")))
    db.insert_pqm_reading(pqm_state_to_reading(state))
    print(f"[PQM OFFLINE] {device['nama_gi']} - {device['nama_bay']}: {message}")
    return state

def wib_now():
    return datetime.now(WIB_TZ)

def format_wib(dt_value):
    return dt_value.astimezone(WIB_TZ).strftime("%Y-%m-%d %H:%M:%S")

def dc_notification_state_key(nama_gi):
    return f"dc_notification_state::{nama_gi}"

def build_dc_state(status_gi, alarm_level):
    if status_gi == "online":
        return f"online:{alarm_level}"
    return str(status_gi or "offline").lower()

def dc_state_is_normal(state):
    return state == "online:normal"

def dc_state_is_voltage_abnormal(state):
    return state in {"online:warning", "online:critical"}

def get_dc_notification_state(nama_gi):
    return db.get_setting(dc_notification_state_key(nama_gi), "online:normal")

def set_dc_notification_state(nama_gi, state):
    db.set_setting(dc_notification_state_key(nama_gi), state)

def build_dc_anomaly_message(waktu, item, batas_warning=0, batas_critical=0):
    status_label = (
        "CRITICAL (TEGANGAN TIDAK NORMAL)"
        if item.get("alarm_level") == "critical"
        else "WARNING (TEGANGAN TIDAK NORMAL)"
    )
    return notification_event_template(
        item.get("nama", "-"),
        "SUPLAI DC 110V",
        waktu,
        "DC MONITORING",
        status=status_label,
        indikasi_lines=[
            f"V_PG = {item.get('v_pg', 0)} V",
            f"V_NG = {item.get('v_ng', 0)} V",
        ],
    )

def build_dc_recovery_message(waktu, item):
    return notification_event_template(
        item.get("nama", "-"),
        "SUPLAI DC 110V",
        waktu,
        "DC MONITORING",
        status="ONLINE / NORMAL",
        indikasi_lines=[
            f"V_PG = {item.get('v_pg', 0)} V",
            f"V_NG = {item.get('v_ng', 0)} V",
        ],
    )

def build_annunciator_alarm_message(source, alarm, waktu):
    return notification_event_template(
        source.get("source_name", "-"),
        source.get("bay_name", "-"),
        waktu,
        "ANNUNCIATOR SYSTEM",
        ip=source.get("ip", ""),
        indikasi_lines=[
            f"PORT {alarm.get('port', '-')}: {alarm.get('nama_alat', 'ALARM TANPA NAMA')}",
        ],
    )

def build_annunciator_recovery_message(source, alarm, waktu):
    return notification_event_template(
        source.get("source_name", "-"),
        source.get("bay_name", "-"),
        waktu,
        "ANNUNCIATOR SYSTEM",
        status="NORMAL / RESET",
        ip=source.get("ip", ""),
        indikasi_lines=[
            f"PORT {alarm.get('port', '-')}: {alarm.get('nama_alat', 'ALARM TANPA NAMA')}",
            "KONDISI = ALARM SUDAH NORMAL",
        ],
    )

def handle_dc_notification_state(waktu, item, batas_warning=0, batas_critical=0):
    current_state = build_dc_state(item["status"], item["alarm_level"])
    previous_state = get_dc_notification_state(item["nama"])

    if current_state == previous_state:
        return

    previous_abnormal = dc_state_is_voltage_abnormal(previous_state)
    current_abnormal = dc_state_is_voltage_abnormal(current_state)

    if item["status"] != "online":
        if previous_abnormal:
            print(
                f"[INFO] DC {item['nama']} {item['status']} tercatat tanpa notifikasi. "
                "Status alarm tegangan sebelumnya dipertahankan sampai pembacaan normal."
            )
        else:
            set_dc_notification_state(item["nama"], current_state)
            print(f"[INFO] DC {item['nama']} {item['status']} tercatat tanpa notifikasi.")
            
        if previous_state.startswith("online"):
            record_dc_alarm_event(waktu, item["nama"], "offline", 0, 0)
        return

    if dc_state_is_normal(current_state):
        set_dc_notification_state(item["nama"], current_state)
        if previous_abnormal:
            send_whatsapp_notification(build_dc_recovery_message(waktu, item))
            print(f"[RECOVERY] DC normal terkirim untuk {item['nama']}.")
            record_dc_alarm_event(waktu, item["nama"], "normal", item["v_pg"], item["v_ng"])
        else:
            print(f"[RECOVERY] DC {item['nama']} normal tercatat tanpa notifikasi karena status sebelumnya bukan over-limit.")
            if not previous_state.startswith("online"):
                record_dc_alarm_event(waktu, item["nama"], "online", item["v_pg"], item["v_ng"])
        return

    if current_abnormal:
        set_dc_notification_state(item["nama"], current_state)
        if previous_abnormal:
            print(
                f"[INFO] DC {item['nama']} masih tidak normal "
                f"({item['alarm_level']}); notifikasi WA tidak dikirim ulang."
            )
            return

        record_dc_alarm_event(waktu, item["nama"], item["alarm_level"], item["v_pg"], item["v_ng"])
        send_whatsapp_notification(build_dc_anomaly_message(waktu, item, batas_warning, batas_critical))
        print(f"[ALARM] DC tegangan tidak normal terkirim untuk {item['nama']} ({item['alarm_level']})")

def annunciator_connection_state_key(source_id):
    return f"annunciator_connection_state::{source_id}"

def annunciator_recovery_pending_key(source_id, port):
    return f"annunciator_recovery_pending::{source_id}::{port}"

def annunciator_recovery_attempt_key(source_id, port):
    return f"annunciator_recovery_attempt::{source_id}::{port}"

def annunciator_alarm_pending_key(source_id, port):
    return f"annunciator_alarm_pending::{source_id}::{port}"

def annunciator_alarm_attempt_key(source_id, port):
    return f"annunciator_alarm_attempt::{source_id}::{port}"

def annunciator_change_candidate_key(source_id):
    return f"annunciator_change_candidate::{source_id}"

def clear_pending_annunciator_alarm(source_id, port):
    db.delete_setting(annunciator_alarm_pending_key(source_id, port))
    db.delete_setting(annunciator_alarm_attempt_key(source_id, port))

def clear_annunciator_pending_prefixes(source_id, pending_prefix_name, attempt_prefix_name, reason=""):
    pending_prefix = f"{pending_prefix_name}::{source_id}::"
    attempt_prefix = f"{attempt_prefix_name}::{source_id}::"
    cleared_count = 0
    for key, _value in db.list_settings(pending_prefix):
        db.delete_setting(key)
        cleared_count += 1
    for key, _value in db.list_settings(attempt_prefix):
        db.delete_setting(key)
    if cleared_count:
        suffix = f" {reason}" if reason else ""
        print(f"[ANNUNCIATOR PENDING CLEARED] {source_id}: {cleared_count} pending lama dibersihkan.{suffix}")
    return cleared_count

def annunciator_alarm_should_notify(source, alarm):
    return True

def send_annunciator_alarm_notification(source, alarm, waktu):
    port = str(alarm.get("port", "-"))
    pending_key = annunciator_alarm_pending_key(source["id"], port)
    attempt_key = annunciator_alarm_attempt_key(source["id"], port)
    last_attempt = float(db.get_setting(attempt_key, "0") or 0)
    now = time.time()
    if now - last_attempt < ANNUNCIATOR_ALARM_RETRY_DETIK:
        return False

    db.set_setting(attempt_key, str(now))
    pending_payload = {
        "source": {
            "id": source.get("id"),
            "source_name": source.get("source_name", "-"),
            "bay_name": source.get("bay_name", "-"),
            "ip": source.get("ip", ""),
        },
        "alarm": {
            "port": port,
            "nama_alat": alarm.get("nama_alat", "Alarm tanpa nama"),
        },
        "waktu": waktu,
    }
    if ANNUNCIATOR_RETRY_PENDING_NOTIFICATIONS:
        db.set_setting(pending_key, json.dumps(pending_payload))
    else:
        db.delete_setting(pending_key)

    sent = send_whatsapp_notification(build_annunciator_alarm_message(source, alarm, waktu))
    if sent:
        clear_pending_annunciator_alarm(source["id"], port)
        print(
            f"[ANNUNCIATOR ALARM] {source['source_name']} {source['bay_name']} "
            f"Port {port}: {alarm.get('nama_alat', 'Alarm tanpa nama')} terkirim ke WhatsApp."
        )
        return True

    print(
        f"[ANNUNCIATOR ALARM FAILED] {source['source_name']} {source['bay_name']} "
        f"Port {port}: {alarm.get('nama_alat', 'Alarm tanpa nama')} belum terkirim. "
        + (
            "Akan dicoba lagi setelah jeda aman sebagai riwayat kejadian."
            if ANNUNCIATOR_RETRY_PENDING_NOTIFICATIONS
            else "Tidak disimpan untuk retry agar kejadian lama tidak terkirim ulang."
        )
    )
    return False

def retry_pending_annunciator_alarms(source, _current_states):
    if not ANNUNCIATOR_RETRY_PENDING_NOTIFICATIONS:
        clear_annunciator_pending_prefixes(
            source["id"],
            "annunciator_alarm_pending",
            "annunciator_alarm_attempt",
            "Retry pending dimatikan.",
        )
        return

    # FIX: Jika current_states kosong, tidak bisa tahu state sebenarnya
    # Hapus semua pending alarm karena tidak ada informasi valid
    if not _current_states:
        prefix = f"annunciator_alarm_pending::{source['id']}::"
        for key, _ in db.list_settings(prefix):
            db.delete_setting(key)
        prefix = f"annunciator_alarm_attempt::{source['id']}::"
        for key, _ in db.list_settings(prefix):
            db.delete_setting(key)
        print(
            f"[ANNUNCIATOR ALARM STALE] {source['source_name']} {source['bay_name']}: "
            "current_states kosong, semua pending alarm dibatalkan."
        )
        return

    prefix = f"annunciator_alarm_pending::{source['id']}::"
    for key, raw_payload in db.list_settings(prefix):
        try:
            payload = json.loads(raw_payload)
        except Exception:
            db.delete_setting(key)
            continue

        alarm = payload.get("alarm") or {}
        port = str(alarm.get("port", ""))

        # FIX: Check apakah port ada di current_states
        # Jika port tidak ada di current_states, hapus pending
        if port not in _current_states:
            db.delete_setting(key)
            db.delete_setting(annunciator_alarm_attempt_key(source["id"], port))
            print(
                f"[ANNUNCIATOR ALARM CLEARED] {source['source_name']} {source['bay_name']}: "
                f"Port {port} tidak ada di current_states, pending alarm dihapus."
            )
            continue

        # Jika port tidak aktif, hapus pending karena alarm sudah recover
        if not _current_states.get(port, False):
            db.delete_setting(key)
            db.delete_setting(annunciator_alarm_attempt_key(source["id"], port))
            print(
                f"[ANNUNCIATOR ALARM CLEARED] {source['source_name']} {source['bay_name']}: "
                f"Port {port} tidak aktif, pending alarm dihapus."
            )
            continue

        alarm_source = {**source, **(payload.get("source") or {})}
        send_annunciator_alarm_notification(
            alarm_source,
            alarm,
            payload.get("waktu") or time.strftime("%Y-%m-%d %H:%M:%S"),
        )

def send_annunciator_recovery_notification(source, alarm, waktu):
    port = str(alarm.get("port", "-"))
    pending_key = annunciator_recovery_pending_key(source["id"], port)
    attempt_key = annunciator_recovery_attempt_key(source["id"], port)
    last_attempt = float(db.get_setting(attempt_key, "0") or 0)
    now = time.time()
    if now - last_attempt < ANNUNCIATOR_RECOVERY_RETRY_DETIK:
        return False

    db.set_setting(attempt_key, str(now))
    pending_payload = {
        "source": {
            "id": source.get("id"),
            "source_name": source.get("source_name", "-"),
            "bay_name": source.get("bay_name", "-"),
            "ip": source.get("ip", ""),
        },
        "alarm": {
            "port": port,
            "nama_alat": alarm.get("nama_alat", "Alarm tanpa nama"),
        },
        "waktu": waktu,
    }
    if ANNUNCIATOR_RETRY_PENDING_NOTIFICATIONS:
        db.set_setting(pending_key, json.dumps(pending_payload))
    else:
        db.delete_setting(pending_key)

    sent = send_whatsapp_notification(build_annunciator_recovery_message(source, alarm, waktu))
    if sent:
        db.delete_setting(pending_key)
        db.delete_setting(attempt_key)
        print(
            f"[ANNUNCIATOR RECOVERY] {source['source_name']} {source['bay_name']} "
            f"Port {port}: {alarm.get('nama_alat', 'Alarm tanpa nama')} terkirim ke WhatsApp."
        )
        return True

    print(
        f"[ANNUNCIATOR RECOVERY FAILED] {source['source_name']} {source['bay_name']} "
        f"Port {port}: {alarm.get('nama_alat', 'Alarm tanpa nama')} belum terkirim. "
        + (
            "Akan dicoba lagi setelah jeda aman."
            if ANNUNCIATOR_RETRY_PENDING_NOTIFICATIONS
            else "Tidak disimpan untuk retry agar kejadian lama tidak terkirim ulang."
        )
    )
    return False

def retry_pending_annunciator_recoveries(source, current_states):
    if not ANNUNCIATOR_RETRY_PENDING_NOTIFICATIONS:
        clear_annunciator_pending_prefixes(
            source["id"],
            "annunciator_recovery_pending",
            "annunciator_recovery_attempt",
            "Retry pending dimatikan.",
        )
        return

    # FIX: Jika current_states kosong, tidak bisa tahu state sebenarnya
    # Hapus semua pending recovery karena tidak ada informasi valid
    if not current_states:
        prefix = f"annunciator_recovery_pending::{source['id']}::"
        for key, _ in db.list_settings(prefix):
            db.delete_setting(key)
        prefix = f"annunciator_recovery_attempt::{source['id']}::"
        for key, _ in db.list_settings(prefix):
            db.delete_setting(key)
        print(
            f"[ANNUNCIATOR RECOVERY STALE] {source['source_name']} {source['bay_name']}: "
            "current_states kosong, semua pending recovery dibatalkan."
        )
        return

    prefix = f"annunciator_recovery_pending::{source['id']}::"
    for key, raw_payload in db.list_settings(prefix):
        try:
            payload = json.loads(raw_payload)
        except Exception:
            db.delete_setting(key)
            continue

        alarm = payload.get("alarm") or {}
        port = str(alarm.get("port", ""))

        # FIX: Check apakah port ada di current_states
        # Jika port tidak ada di current_states (alias tidak aktif), hapus pending
        if port not in current_states:
            db.delete_setting(key)
            db.delete_setting(annunciator_recovery_attempt_key(source["id"], port))
            print(
                f"[ANNUNCIATOR RECOVERY CLEARED] {source['source_name']} {source['bay_name']}: "
                f"Port {port} tidak ada di current_states, pending recovery dihapus."
            )
            continue

        # Jika port masih aktif, hapus pending karena alarm sedang aktif
        if current_states.get(port, False):
            db.delete_setting(key)
            db.delete_setting(annunciator_recovery_attempt_key(source["id"], port))
            print(
                f"[ANNUNCIATOR RECOVERY CLEARED] {source['source_name']} {source['bay_name']}: "
                f"Port {port} masih aktif, pending recovery dihapus."
            )
            continue

        # Port tidak aktif dan ada di current_states, cek retry cooldown
        recovery_source = {**source, **(payload.get("source") or {})}
        send_annunciator_recovery_notification(
            recovery_source,
            alarm,
            payload.get("waktu") or time.strftime("%Y-%m-%d %H:%M:%S"),
        )

def handle_annunciator_connection_state(source, connected, waktu, status_message=""):
    current_state = "connected" if connected else "disconnected"
    previous_state = db.get_setting(annunciator_connection_state_key(source["id"]), "connected")

    if current_state == previous_state:
        return

    db.set_setting(annunciator_connection_state_key(source["id"]), current_state)
    source_label = f"{source['source_name']} - {source['bay_name']}"

    if connected:
        print(f"[RECOVERY] Announciator normal tercatat tanpa notifikasi: {source_label}")
        return

    print(f"[INFO] Announciator terputus tercatat tanpa notifikasi: {source_label} - {status_message}")

def get_annunciator_failure_count(source_id):
    return int(app_state.setdefault("annunciator_failure_counts", {}).get(source_id, 0) or 0)

def set_annunciator_failure_count(source_id, value):
    app_state.setdefault("annunciator_failure_counts", {})[source_id] = max(0, int(value or 0))

def handle_annunciator_poll_failure(source, waktu, message):
    source_id = source["id"]
    failure_count = get_annunciator_failure_count(source_id) + 1
    set_annunciator_failure_count(source_id, failure_count)
    previous_state = app_state["annunciators"].get(source_id) or build_empty_annunciator_state(source)

    if failure_count < ANNUNCIATOR_FAIL_THRESHOLD:
        state = {
            **previous_state,
            "last_poll_time": waktu,
            "status_message": (
                f"{message} Gangguan sementara "
                f"({failure_count}/{ANNUNCIATOR_FAIL_THRESHOLD})."
            ),
        }
        app_state["annunciators"][source_id] = state
        if source_id == DEFAULT_ANNUNCIATOR_SOURCE_ID:
            app_state["annunciator"] = state
        print(f"[{time.strftime('%H:%M:%S')}] {source['bay_name']}: {state['status_message']}")
        return state

    state = {
        **previous_state,
        "connected": False,
        "last_poll_time": waktu,
        "status_message": message,
        "active_alarms": [],
        "channels": [],
        "target_alarm": None,
        "channel_count": 0,
    }
    app_state["annunciators"][source_id] = state
    app_state["annunciator_active_ports"][source_id] = []
    if source_id == DEFAULT_ANNUNCIATOR_SOURCE_ID:
        app_state["annunciator"] = state
    handle_annunciator_connection_state(source, False, waktu, message)
    print(f"[{time.strftime('%H:%M:%S')}] {source['bay_name']}: {message}")
    return state

def get_dc_thresholds(nama_gi):
    if nama_gi == "GITET Muaratawar":
        return 160.0, 187.0
    return 80.0, 90.0

def calculate_dc_alarm_level(nama_gi, status_gi, v_pg, v_ng):
    if status_gi != "online":
        return "normal", 0.0, 0.0

    batas_warning, batas_critical = get_dc_thresholds(nama_gi)
    max_v = max(abs(v_pg), abs(v_ng))
    if max_v > batas_critical:
        return "critical", batas_warning, batas_critical
    if max_v > batas_warning:
        return "warning", batas_warning, batas_critical
    return "normal", batas_warning, batas_critical

def read_dc_device(nama_gi, ip_gi):
    last_status = "offline"
    last_message = ""
    
    configs = db.get_dc_registers_by_ip(ip_gi)
    if not configs:
        configs = [
            {"channel": 1, "sinyal": "V_PN", "register_address": 0},
            {"channel": 1, "sinyal": "Arus", "register_address": 6},
            {"channel": 1, "sinyal": "V_PG", "register_address": 12},
            {"channel": 1, "sinyal": "V_NG", "register_address": 14},
        ]
        
    channels = {}
    for c in configs:
        ch = c["channel"]
        if ch not in channels:
            channels[ch] = {}
        channels[ch][c["sinyal"]] = c["register_address"]

    for attempt in range(1, DC_MODBUS_RETRY_COUNT + 1):
        client_modbus = ModbusTcpClient(ip_gi, port=502, timeout=DC_MODBUS_TIMEOUT_DETIK)
        try:
            if not client_modbus.connect():
                last_status = "offline"
                last_message = "TCP port 502 tidak merespons."
            else:
                results = []
                
                # read signal by signal to avoid reading unmapped gaps which causes timeouts
                for ch, signals in channels.items():
                    ch_result = {
                        "v_pn": 0.0,
                        "arus": 0.0,
                        "v_pg": 0.0,
                        "v_ng": 0.0,
                        "channel": ch,
                        "status": "online",
                        "status_message": f"Data DC berhasil dibaca. Channel {ch}"
                    }
                    
                    ch_success = True
                    for sinyal_name, addr in signals.items():
                        response = read_modbus_registers(
                            client_modbus,
                            address=addr,
                            count=2,
                            slave_id=DC_MODBUS_SLAVE_ID,
                        )
                        if response.isError():
                            ch_success = False
                            ch_result["status"] = "timeout"
                            ch_result["status_message"] = f"Gagal membaca register {addr} pada CH {ch}."
                            break
                        else:
                            val = round(gabung_ke_float(response.registers[0], response.registers[1]), 2)
                            key = sinyal_name.lower()
                            if key in ch_result:
                                ch_result[key] = val
                                
                    results.append(ch_result)

                final_results = []
                for res in results:
                    ch = res["channel"]
                    suffix = f" (CH{ch})" if len(channels) > 1 else ""
                    final_results.append({
                        "nama": f"{nama_gi}{suffix}",
                        "ip": ip_gi,
                        "status": res["status"],
                        "status_message": res["status_message"],
                        "channel": ch,
                        "v_pn": res["v_pn"],
                        "arus": res["arus"],
                        "v_pg": res["v_pg"],
                        "v_ng": res["v_ng"],
                    })
                client_modbus.close()
                return final_results
                    
        except Exception as exc:
            last_status = "timeout"
            last_message = str(exc) or exc.__class__.__name__
        finally:
            client_modbus.close()
            
        time.sleep(1)

    # If all retries failed, return offline readings for all configured channels
    results = []
    for ch in channels.keys():
        suffix = f" (CH{ch})" if len(channels) > 1 else ""
        results.append({
            "nama": f"{nama_gi}{suffix}",
            "ip": ip_gi,
            "status": last_status,
            "status_message": last_message,
            "v_pn": 0.0,
            "arus": 0.0,
            "v_pg": 0.0,
            "v_ng": 0.0,
            "channel": ch
        })
    return results

def build_dc_data_items(gi, waktu_sekarang):
    nama_gi = gi["nama"]
    ip_gi = gi["ip"]
    readings = read_dc_device(nama_gi, ip_gi)
    
    results = []
    for reading in readings:
        channel = reading.get("channel", 1)
        suffix = f" - CH {channel}" if channel > 1 else ""
        item_nama = f"{nama_gi}{suffix}"
        
        status_gi = reading["status"]
        v_pg = reading["v_pg"]
        v_ng = reading["v_ng"]
        alarm_level, batas_warning, batas_critical = calculate_dc_alarm_level(
            item_nama,
            status_gi,
            v_pg,
            v_ng,
        )

        item = {
            "waktu": waktu_sekarang,
            "nama": item_nama,
            "ip": ip_gi,
            "v_pn": reading["v_pn"],
            "arus": reading["arus"],
            "v_pg": v_pg,
            "v_ng": v_ng,
            "status": status_gi,
            "status_message": reading.get("status_message", ""),
            "alarm_level": alarm_level,
            "channel": channel
        }
        results.append((item, batas_warning, batas_critical))
        
    return results

def scan_modbus_devices(save_to_sheets: bool = False):
    """Fungsi inti untuk membaca data dari Modbus dan menyimpannya ke SQL."""
    if not app_locks["dc_scan"].acquire(blocking=False):
        return app_state["last_scan_data"]

    try:
        if app_state["is_scanning"]:
            return app_state["last_scan_data"]

        app_state["is_scanning"] = True
        scan_started_at = time.time()
        waktu_sekarang = time.strftime('%Y-%m-%d %H:%M:%S')
        hasil_scan = []

        print(f"--- Memulai Polling: {waktu_sekarang} ---")
        app_state["daftar_gi"] = db.get_gi_devices()

        polling_results = []
        if app_state["daftar_gi"]:
            max_workers = min(DC_POLL_WORKERS, len(app_state["daftar_gi"]))
            with ThreadPoolExecutor(max_workers=max_workers) as executor:
                future_map = {
                    executor.submit(build_dc_data_items, gi, waktu_sekarang): gi
                    for gi in app_state["daftar_gi"]
                }
                for future in as_completed(future_map):
                    gi = future_map[future]
                    try:
                        results_list = future.result()
                        polling_results.extend(results_list)
                    except Exception as exc:
                        print(f"[DC Poll] {gi['nama']} ({gi['ip']}) gagal tidak terduga: {exc}")
                        polling_results.append((
                            {
                                "waktu": waktu_sekarang,
                                "nama": gi["nama"],
                                "ip": gi["ip"],
                                "v_pn": 0.0,
                                "arus": 0.0,
                                "v_pg": 0.0,
                                "v_ng": 0.0,
                                "status": "timeout",
                                "alarm_level": "normal",
                            },
                            0.0,
                            0.0,
                        ))

        order_index = {
            gi["nama"]: index
            for index, gi in enumerate(app_state["daftar_gi"])
        }
        polling_results.sort(key=lambda item: order_index.get(item[0]["nama"], 9999))

        for data_item, batas_warning, batas_critical in polling_results:
            nama_gi = data_item["nama"]
            status_gi = data_item["status"]
            hasil_scan.append(data_item)
            db.insert_dc_reading(data_item)

            # Kirim hanya saat transisi normal -> anomali, lalu recovery saat anomali -> normal.
            handle_dc_notification_state(waktu_sekarang, data_item, batas_warning, batas_critical)

            if status_gi == "online":
                if nama_gi not in app_state["trend_data"]:
                    app_state["trend_data"][nama_gi] = []

                jam_menit = time.strftime('%H:%M')
                trend_list = app_state["trend_data"][nama_gi]
                
                # Merekam saat mulai polling & hanya simpan jika menit berubah (1 data per menit)
                if not trend_list or trend_list[-1]["waktu"] != jam_menit:
                    trend_list.append({
                        "waktu": jam_menit,
                        "v_pn": data_item["v_pn"],
                        "arus": data_item["arus"],
                        "v_pg": data_item["v_pg"],
                        "v_ng": data_item["v_ng"],
                    })

                    # Biar tetap rapi selama 24 jam (24 * 60 menit = 1440 titik maksimum)
                    if len(trend_list) > 1440:
                        trend_list.pop(0)

        app_state["last_scan_data"] = hasil_scan
        app_state["last_scan_time"] = waktu_sekarang
        app_state["last_scan_duration_seconds"] = round(time.time() - scan_started_at, 2)
        print(f"--- Selesai Polling ({app_state['last_scan_duration_seconds']} detik) ---")
        return hasil_scan
    finally:
        app_state["is_scanning"] = False
        app_locks["dc_scan"].release()

# === BACKGROUND WORKER THREAD ===
def polling_worker():
    """Fungsi yang berjalan di latar belakang terus-menerus."""
    while True:
        if app_state["auto_polling_active"]:
            scan_modbus_devices(save_to_sheets=False)
            # Sleep in small chunks to allow quick interruption if needed
            for _ in range(INTERVAL_DETIK):
                if not app_state["auto_polling_active"]:
                    break
                time.sleep(1)
        else:
            time.sleep(1) # Cek lagi setiap 1 detik jika mati

def poll_pqm_ion7650_device(device, waktu_sekarang):
    last_error_message = "Gagal terhubung ke PQM."

    for attempt in range(1, PQM_RETRY_COUNT + 1):
        metrics = empty_pqm_metrics()
        client = ModbusTcpClient(device["ip"], port=device.get("port", 502), timeout=PQM_TIMEOUT_DETIK)
        try:
            if not client.connect():
                raise ConnectionError("Koneksi ke PQM gagal.")

            start_address = int(device.get("start_address", 147))
            configured_count = int(device.get("count") or 0)
            main_register_count = max(
                configured_count,
                PQM_MAIN_LAST_REGISTER - PQM_BASE_REGISTER - start_address + 1,
            )
            response_error, main_registers = read_modbus_register_chunks(
                client,
                address=start_address,
                count=main_register_count,
                slave_id=device.get("slave_id", 1),
            )
            if response_error:
                raise RuntimeError("Error saat membaca register utama PQM.")

            metrics = parse_pqm_registers(
                main_registers,
                start_address=start_address,
            )
            status_message = "Data PQM berhasil dibaca."
            events = []

            counter_response, counter_registers = read_modbus_register_chunks(
                client,
                address=PQM_DISTURBANCE_COUNTER_START_ADDRESS,
                count=PQM_DISTURBANCE_COUNTER_COUNT,
                slave_id=device.get("slave_id", 1),
            )
            if not counter_response:
                counters = parse_pqm_disturbance_counters(counter_registers)
                events = record_pqm_disturbance_events(device, waktu_sekarang, counters)
                metrics["pq_counters"] = counters
                metrics["pq_counter_summary"] = summarize_pqm_counters(counters)
                metrics["new_disturbance_count"] = len(events)
            else:
                status_message = "Data utama PQM berhasil, tetapi counter gangguan gagal dibaca."
            if events:
                status_message = f"Data PQM berhasil dibaca. {len(events)} gangguan PQ baru terekam."
                if is_gi_fajar_trafo5_pqm(device):
                    print(
                        f"[PQM GI FAJAR PME ONLY] {device['nama_gi']} - {device['nama_bay']}: "
                        "counter gangguan terdeteksi; notifikasi teks langsung dilewati, "
                        "menunggu validasi incident PME."
                    )
                else:
                    send_whatsapp_notification(
                        build_pqm_disturbance_message(device, waktu_sekarang, events)
                    )
                queue_pme_report_for_pqm(device, waktu_sekarang, events)

            set_pqm_failure_count(device["id"], 0)
            state = build_pqm_state(device, waktu_sekarang, True, status_message, metrics)
            db.insert_pqm_reading(pqm_state_to_reading(state))
            return state
        except Exception as exc:
            last_error_message = str(exc) or exc.__class__.__name__
            if not last_error_message.startswith(("Koneksi", "Error")):
                last_error_message = f"Error PQM: {last_error_message}"
        finally:
            client.close()

        if attempt < PQM_RETRY_COUNT and PQM_RETRY_DELAY_DETIK:
            print(
                f"[PQM RETRY] {device['nama_gi']} - {device['nama_bay']}: "
                f"{last_error_message} Retry {attempt}/{PQM_RETRY_COUNT}."
            )
            time.sleep(PQM_RETRY_DELAY_DETIK)

    return handle_pqm_poll_failure(device, waktu_sekarang, last_error_message)

def poll_pqm_ion9000_device(device, waktu_sekarang):
    last_error_message = "Gagal terhubung ke ION9000."
    request_names = [name for _key, name in PQM_ION9000_MAIN_FIELD_SPECS]
    fast_poll_muaratawar = should_fast_poll_muaratawar_ion9000(device)
    if not fast_poll_muaratawar:
        request_names.extend(counter["name"] for counter in PQM_ION9000_DISTURBANCE_COUNTERS)
    max_poll_seconds = ion9000_max_poll_seconds(device)
    poll_deadline = time.monotonic() + max_poll_seconds

    for attempt in range(1, PQM_RETRY_COUNT + 1):
        remaining = remaining_ion9000_poll_seconds(poll_deadline)
        if remaining is not None and remaining <= 0:
            last_error_message = (
                f"Timeout ION9000: polling melebihi batas "
                f"{max_poll_seconds:.0f} detik."
            )
            break

        try:
            payload = request_ion9000_register_values(device, request_names, deadline=poll_deadline)
            value_map = build_ion9000_value_map(payload)
            metrics = parse_ion9000_metrics(value_map)
            if fast_poll_muaratawar:
                counters = {}
                events = []
            else:
                counters = parse_ion9000_disturbance_counters(value_map)
                events = record_pqm_disturbance_events(device, waktu_sekarang, counters)
            metrics["pq_counters"] = counters
            metrics["pq_counter_summary"] = summarize_pqm_counters(counters, device)
            metrics["new_disturbance_count"] = len(events)

            status_message = "Data ION9000 berhasil dibaca."
            if fast_poll_muaratawar:
                status_message = "Data ION9000 berhasil dibaca (fast poll Muaratawar, counter gangguan live dilewati)."
            if events:
                status_message = f"Data ION9000 berhasil dibaca. {len(events)} gangguan PQ baru terekam."
                if is_gi_fajar_trafo5_pqm(device):
                    print(
                        f"[PQM GI FAJAR PME ONLY] {device['nama_gi']} - {device['nama_bay']}: "
                        "counter gangguan ION9000 terdeteksi; notifikasi teks langsung dilewati."
                    )
                else:
                    send_whatsapp_notification(
                        build_pqm_disturbance_message(device, waktu_sekarang, events)
                    )

            set_pqm_failure_count(device["id"], 0)
            state = build_pqm_state(device, waktu_sekarang, True, status_message, metrics)
            db.insert_pqm_reading(pqm_state_to_reading(state))
            return state
        except Exception as exc:
            last_error_message = str(exc) or exc.__class__.__name__
            if not last_error_message.startswith(("Koneksi", "Error", "Gagal", "Timeout")):
                last_error_message = f"Error ION9000: {last_error_message}"

        if attempt < PQM_RETRY_COUNT and PQM_RETRY_DELAY_DETIK:
            remaining = remaining_ion9000_poll_seconds(poll_deadline)
            if remaining is not None and remaining <= 0:
                break
            sleep_seconds = PQM_RETRY_DELAY_DETIK
            if remaining is not None:
                sleep_seconds = min(sleep_seconds, max(0.0, remaining))
            print(
                f"[PQM RETRY] {device['nama_gi']} - {device['nama_bay']}: "
                f"{last_error_message} Retry {attempt}/{PQM_RETRY_COUNT}."
            )
            time.sleep(sleep_seconds)

    return handle_pqm_poll_failure(device, waktu_sekarang, last_error_message)

def poll_pqm_device(device, waktu_sekarang):
    device_type = normalize_pqm_type(device.get("pqm_type"))
    try:
        ensure_device_endpoint_allowed(
            device.get("ip", ""),
            device.get("port", 443 if device_type == PQM_TYPE_ION9000 else 502),
            "PQM",
        )
    except HTTPException as exc:
        return handle_pqm_poll_failure(device, waktu_sekarang, str(exc.detail))

    if device_type == PQM_TYPE_ION9000:
        return poll_pqm_ion9000_device(device, waktu_sekarang)
    return poll_pqm_ion7650_device(device, waktu_sekarang)

def poll_pqm_once():
    if not app_locks["pqm_scan"].acquire(blocking=False):
        return app_state["pqm_devices"]

    try:
        if app_state["pqm_is_scanning"]:
            return app_state["pqm_devices"]

        app_state["pqm_is_scanning"] = True
        waktu_sekarang = time.strftime("%Y-%m-%d %H:%M:%S")
        hasil_scan = []
        devices = db.get_pqm_devices()
        for device in devices:
            if not device.get("enabled", 1):
                state = build_empty_pqm_state(device)
                state["connected"] = False
                state["status_message"] = "Polling PQM dimatikan."
                hasil_scan.append(state)
            else:
                state = poll_pqm_device(device, waktu_sekarang)
                handle_pqm_itic_recording(device, state, waktu_sekarang)
                handle_pqm_voltage_alarm_notification(device, state, waktu_sekarang)
                handle_pqm_muaratawar_load_notification(device, state, waktu_sekarang)
                handle_pqm_gi_fajar_load_notification(device, state, waktu_sekarang)
                hasil_scan.append(state)

        app_state["pqm_devices"] = hasil_scan
        app_state["pqm_last_scan_time"] = waktu_sekarang
        print(f"[{waktu_sekarang}] PQM polling selesai: {len(hasil_scan)} device.")
        return hasil_scan
    finally:
        app_state["pqm_is_scanning"] = False
        app_locks["pqm_scan"].release()

def pqm_worker():
    while True:
        poll_pqm_once()
        for _ in range(PQM_INTERVAL_DETIK):
            time.sleep(1)

annunciator_session = requests.Session()

def compact_alarm_name(value):
    return " ".join(str(value or "").replace(".", " ").replace("(", " ").replace(")", " ").split()).lower()

def annunciator_signal_is_active(value):
    return str(value or "").strip().lower() in {"1", "true", "active", "alarm", "operated", "on"}

def annunciator_change_confirm_polls(source):
    explicit_value = source.get("change_confirm_polls")
    if explicit_value not in (None, ""):
        try:
            return max(1, int(explicit_value))
        except (TypeError, ValueError):
            pass
    if str(source.get("type") or "").strip().lower() == "qualitrol":
        return 1
    return ANNUNCIATOR_CHANGE_CONFIRM_POLLS

def annunciator_source_signature_key(source_id):
    return f"annunciator_source_signature::{source_id}"

def annunciator_source_signature(source):
    return json.dumps({
        "api_url": str(source.get("api_url") or ""),
        "ip": str(source.get("ip") or ""),
        "target_alarm": str(source.get("target_alarm") or ""),
        "type": str(source.get("type") or "das"),
    }, sort_keys=True)

def ensure_annunciator_source_baseline_current(source):
    source_id = source["id"]
    key = annunciator_source_signature_key(source_id)
    current_signature = annunciator_source_signature(source)
    previous_signature = db.get_setting(key, "")

    if not previous_signature and source_id == "gi-cikarang-rajapaksi-2":
        existing_states = db.get_annunciator_channel_map(source_id)
        if existing_states:
            deleted_channels = db.delete_annunciator_channels(source_id)
            clear_notification_candidate(annunciator_change_candidate_key(source_id))
            clear_annunciator_pending_prefixes(
                source_id,
                ANNUNCIATOR_PENDING_ALARM_PREFIX,
                ANNUNCIATOR_PENDING_ALARM_ATTEMPT_PREFIX,
                "baseline awal DAS Rajapaksi 2",
            )
            clear_annunciator_pending_prefixes(
                source_id,
                ANNUNCIATOR_PENDING_RECOVERY_PREFIX,
                ANNUNCIATOR_PENDING_RECOVERY_ATTEMPT_PREFIX,
                "baseline awal DAS Rajapaksi 2",
            )
            db.set_setting(key, current_signature)
            print(
                f"[ANNUNCIATOR BASELINE RESET] {source['source_name']} {source['bay_name']}: "
                f"baseline awal DAS 172.20.17.155, {deleted_channels} channel lama dibersihkan. "
                "Polling berikutnya menjadi baseline tanpa kirim WA/Telegram lama."
            )
            return True

    if previous_signature and previous_signature != current_signature:
        deleted_channels = db.delete_annunciator_channels(source_id)
        clear_notification_candidate(annunciator_change_candidate_key(source_id))
        clear_annunciator_pending_prefixes(
            source_id,
            ANNUNCIATOR_PENDING_ALARM_PREFIX,
            ANNUNCIATOR_PENDING_ALARM_ATTEMPT_PREFIX,
            "sumber Annunciator berubah",
        )
        clear_annunciator_pending_prefixes(
            source_id,
            ANNUNCIATOR_PENDING_RECOVERY_PREFIX,
            ANNUNCIATOR_PENDING_RECOVERY_ATTEMPT_PREFIX,
            "sumber Annunciator berubah",
        )
        db.set_setting(key, current_signature)
        print(
            f"[ANNUNCIATOR BASELINE RESET] {source['source_name']} {source['bay_name']}: "
            f"konfigurasi sumber berubah, {deleted_channels} channel lama dibersihkan. "
            "Polling berikutnya menjadi baseline tanpa kirim WA/Telegram lama."
        )
        return True

    if previous_signature != current_signature:
        db.set_setting(key, current_signature)

    return False

import xml.etree.ElementTree as ET

def extract_qualitrol_items(xml_string, mapping):
    items = []
    try:
        root = ET.fromstring(xml_string)
        val_0 = 0
        val_1 = 0
        for el in root.findall(".//digitalinputs"):
            idx = el.get("index")
            text_val = el.text.strip() if el.text else "0"
            if not text_val:
                text_val = "0"
            try:
                val = int(text_val)
            except ValueError:
                val = 0
            if idx == "0":
                val_0 = val
            elif idx == "1":
                val_1 = val

        for port, label in mapping.items():
            if port <= 32:
                is_active = (val_0 & (1 << (port - 1))) != 0
            else:
                is_active = (val_1 & (1 << (port - 33))) != 0
            
            items.append({
                "nama_alat": label,
                "port": str(port),
                "kondisi": "1" if is_active else "0",
                "flag": "1",
                "flag_kondisi": "0",
                "is_active": is_active
            })
    except Exception as e:
        print(f"Error parsing qualitrol XML: {e}")
    return items

def extract_annunciator_items(payload):
    if isinstance(payload, list):
        return payload
    if isinstance(payload, dict):
        for key in ("value", "data", "items", "result"):
            items = payload.get(key)
            if isinstance(items, list):
                return items
    raise ValueError("Format data announciator tidak berisi list alarm.")

def normalize_annunciator_item(item, source):
    nama_alat = " ".join(str(item.get("nama_alat", "")).split()) or "Alarm tanpa nama"
    port = item.get("port", "-")
    kondisi = str(item.get("kondisi", "0")).strip()
    flag = str(item.get("flag", "0")).strip()
    flag_kondisi = str(item.get("flag_kondisi", "0")).strip()
    is_active = (
        annunciator_signal_is_active(kondisi)
        or annunciator_signal_is_active(flag_kondisi)
    )
    return {
        "id": str(item.get("id", port)),
        "source_id": source["id"],
        "nama_alat": nama_alat,
        "port": str(port),
        "kondisi": kondisi,
        "flag": flag,
        "flag_kondisi": flag_kondisi,
        "is_active": is_active,
        "detail": str(item.get("detail", "")).strip(),
        "device_name": str(item.get("nama", "")).strip(),
        "nama_gi": str(item.get("nama_gi", "")).strip(),
        "source_name": source["source_name"],
        "bay_name": source["bay_name"],
        "ip": source["ip"],
        "raw": item,
    }

def poll_annunciator_source(source):
    """Membaca channel DAS Announciator satu GI/Bay dan menyimpan event alarm aktif."""
    waktu_sekarang = time.strftime("%Y-%m-%d %H:%M:%S")
    source_id = source["id"]
    last_error_message = "Polling announciator gagal."

    for attempt in range(1, ANNUNCIATOR_RETRY_COUNT + 1):
        try:
            response = annunciator_session.get(
                source["api_url"],
                timeout=ANNUNCIATOR_TIMEOUT_DETIK,
            )
            if response.status_code != 200:
                last_error_message = f"Status code announciator {response.status_code}."
                raise RuntimeError(last_error_message)

            if source.get("type") == "qualitrol":
                mapping = source.get("qualitrol_mapping", {})
                normalized_data = extract_qualitrol_items(response.text, mapping)
                # Ensure is_active is populated via our extract_qualitrol_items
            else:
                data = extract_annunciator_items(response.json())
                normalized_data = [normalize_annunciator_item(item, source) for item in data]
                
            active_alarms = [item for item in normalized_data if item.get("is_active")]
            source_config_changed = ensure_annunciator_source_baseline_current(source)
            previous_states = {} if source_config_changed else db.get_annunciator_channel_map(source_id)
            current_states = {
                item["port"]: item["is_active"]
                for item in normalized_data
            }
            target_name = source.get("target_alarm")
            target_alarm = next(
                (
                    item for item in normalized_data
                    if target_name and compact_alarm_name(item["nama_alat"]) == compact_alarm_name(target_name)
                ),
                None,
            )
            current_ports = sorted({item["port"] for item in active_alarms})
            new_ports = [
                port for port, is_active in current_states.items()
                if is_active and not previous_states.get(port, False)
            ]
            cleared_ports = [
                port for port, was_active in previous_states.items()
                if was_active and not current_states.get(port, False)
            ]
            change_candidate_key = annunciator_change_candidate_key(source_id)
            should_update_annunciator_channels = True
            if not previous_states and normalized_data:
                new_ports = []
                cleared_ports = []
                clear_notification_candidate(change_candidate_key)
                print(
                    f"[ANNUNCIATOR BASELINE] {source['source_name']} {source['bay_name']}: "
                    "baseline channel tersimpan, WA/Telegram tidak dikirim saat startup/perubahan sumber."
                )
            elif not new_ports and not cleared_ports:
                clear_notification_candidate(change_candidate_key)
            else:
                confirm_polls = annunciator_change_confirm_polls(source)
                confirmed, seen_count = update_notification_candidate(
                    change_candidate_key,
                    "states",
                    current_states,
                    confirm_polls,
                )
                if not confirmed:
                    print(
                        f"[ANNUNCIATOR CHANGE HOLD] {source['source_name']} {source['bay_name']}: "
                        f"perubahan channel menunggu konfirmasi "
                        f"{seen_count}/{confirm_polls}."
                    )
                    new_ports = []
                    cleared_ports = []
                    should_update_annunciator_channels = False

            if new_ports:
                for alarm in active_alarms:
                    if alarm["port"] not in new_ports:
                        continue
                    nama_alat = alarm.get("nama_alat", "Alarm tanpa nama")
                    # FIX: Jangan kirim notification jika nama_alat adalah "Alarm tanpa nama"
                    # Ini mengindikasikan port tidak memiliki mapping yang valid
                    if nama_alat == "Alarm tanpa nama":
                        print(
                            f"[ANNUNCIATOR SKIP] {source['source_name']} {source['bay_name']}: "
                            f"Port {alarm['port']} tidak memiliki nama valid, alarm notification diabaikan."
                        )
                        continue
                    event = {
                        "id": str(uuid.uuid4()),
                        "waktu": waktu_sekarang,
                        "source_id": source_id,
                        "source_name": source["source_name"],
                        "bay_name": source["bay_name"],
                        "ip": source["ip"],
                        "port": alarm["port"],
                        "nama_alat": nama_alat,
                        "level": "active",
                    }
                    app_state["annunciator_history"].append(event)
                    db.insert_annunciator_event(event)
                    send_annunciator_alarm_notification(source, alarm, waktu_sekarang)

            retry_pending_annunciator_alarms(source, current_states)

            if cleared_ports:
                cleared_items = {
                    item["port"]: item
                    for item in normalized_data
                }
                for port in cleared_ports:
                    # FIX: Jika port tidak ada di normalized_data (API response tidak punya port ini),
                    # skip notification karena tidak ada informasi valid dari device
                    if port not in cleared_items:
                        print(
                            f"[ANNUNCIATOR SKIP] {source['source_name']} {source['bay_name']}: "
                            f"Port {port} tidak ada di API response, notification diabaikan."
                        )
                        continue
                    alarm = cleared_items.get(port, {"nama_alat": "Alarm tanpa nama", "port": port})
                    nama_alat = alarm.get("nama_alat", "Alarm tanpa nama")
                    # FIX: Jangan kirim notification jika nama_alat adalah "Alarm tanpa nama"
                    # Ini mengindikasikan port tidak memiliki mapping yang valid
                    if nama_alat == "Alarm tanpa nama":
                        print(
                            f"[ANNUNCIATOR SKIP] {source['source_name']} {source['bay_name']}: "
                            f"Port {port} tidak memiliki nama valid, notification diabaikan."
                        )
                        continue
                    event = {
                        "id": str(uuid.uuid4()),
                        "waktu": waktu_sekarang,
                        "source_id": source_id,
                        "source_name": source["source_name"],
                        "bay_name": source["bay_name"],
                        "ip": source["ip"],
                        "port": str(port),
                        "nama_alat": nama_alat,
                        "level": "normal",
                    }
                    app_state["annunciator_history"].append(event)
                    db.insert_annunciator_event(event)
                    send_annunciator_recovery_notification(source, alarm, waktu_sekarang)
            if new_ports or cleared_ports:
                clear_notification_candidate(change_candidate_key)

            retry_pending_annunciator_recoveries(source, current_states)
            if should_update_annunciator_channels:
                db.upsert_annunciator_channels(source_id, normalized_data, waktu_sekarang)
            app_state["annunciator_history"] = db.list_annunciator_events()

            set_annunciator_failure_count(source_id, 0)
            app_state["annunciator_active_ports"][source_id] = current_ports
            state = {
                "source_id": source_id,
                "connected": True,
                "last_poll_time": waktu_sekarang,
                "status_message": (
                    f"{len(active_alarms)} alarm aktif."
                    if active_alarms
                    else "Kondisi normal. Tidak ada alarm trip."
                ),
                "active_alarms": active_alarms,
                "channels": normalized_data,
                "target_alarm": target_alarm,
                "channel_count": len(normalized_data),
                "api_url": source["api_url"],
                "source_name": source["source_name"],
                "bay_name": source["bay_name"],
                "ip": source["ip"],
                "target_alarm_name": target_name,
            }
            app_state["annunciators"][source_id] = state
            if source_id == DEFAULT_ANNUNCIATOR_SOURCE_ID:
                app_state["annunciator"] = state
            handle_annunciator_connection_state(source, True, waktu_sekarang)

            if active_alarms:
                print(f"[{waktu_sekarang}] WARNING! {len(active_alarms)} ALARM ANNOUNCIATOR AKTIF - {source['bay_name']}:")
                for alarm in active_alarms:
                    print(f"   [!] Port {alarm['port']}: {alarm['nama_alat']}")
            else:
                print(f"[{waktu_sekarang}] Announciator normal - {source['bay_name']}. Tidak ada alarm trip.")

            return state

        except requests.exceptions.Timeout:
            last_error_message = "Alat lambat merespons (timeout)."
        except requests.exceptions.ConnectionError:
            last_error_message = "Jaringan ke alat announciator terputus."
        except Exception as e:
            last_error_message = f"Error sistem announciator: {e}"

        if attempt < ANNUNCIATOR_RETRY_COUNT and ANNUNCIATOR_RETRY_DELAY_DETIK:
            print(
                f"[{time.strftime('%H:%M:%S')}] {source['bay_name']}: "
                f"{last_error_message} Retry {attempt}/{ANNUNCIATOR_RETRY_COUNT}."
            )
            time.sleep(ANNUNCIATOR_RETRY_DELAY_DETIK)

    return handle_annunciator_poll_failure(source, waktu_sekarang, last_error_message)

def poll_annunciator_once():
    if not app_locks["annunciator_scan"].acquire(blocking=False):
        return app_state["annunciator"]
    try:
        latest = None
        for source in ANNUNCIATOR_SOURCES:
            state = poll_annunciator_source(source)
            if source["id"] == DEFAULT_ANNUNCIATOR_SOURCE_ID:
                latest = state
        return latest or app_state["annunciator"]
    finally:
        app_locks["annunciator_scan"].release()

def get_daily_recap_window(now=None):
    now = now or wib_now()
    recap_end = now.replace(hour=DAILY_RECAP_HOUR_WIB, minute=0, second=0, microsecond=0)
    if now < recap_end:
        recap_end -= timedelta(days=1)
    recap_start = recap_end - timedelta(days=1)
    return recap_start, recap_end

def build_daily_recap_message(now=None):
    now = now or wib_now()
    recap_start, recap_end = get_daily_recap_window(now)
    start_text = format_wib(recap_start)
    end_text = format_wib(recap_end)
    period_text = f"{format_notification_date(recap_start)} s.d {format_notification_date(recap_end)}"

    dc_items = app_state.get("last_scan_data") or []
    registered_gi = app_state.get("daftar_gi") or db.get_gi_devices()
    dc_online = len([item for item in dc_items if item.get("status") == "online"])
    dc_not_online = len([item for item in dc_items if item.get("status") != "online"])
    dc_warning = len([item for item in dc_items if item.get("alarm_level") == "warning"])
    dc_critical = len([item for item in dc_items if item.get("alarm_level") == "critical"])
    dc_abnormal = [
        item for item in dc_items
        if item.get("status") != "online" or item.get("alarm_level") in {"warning", "critical"}
    ]
    dc_events = db.list_dc_alarm_events_between(start_text, end_text, limit=1000)

    annunciator_states = list((app_state.get("annunciators") or {}).values())
    annunciator_connected = len([state for state in annunciator_states if state.get("connected")])
    annunciator_disconnected = len(annunciator_states) - annunciator_connected
    annunciator_active = []
    for state in annunciator_states:
        for alarm in state.get("active_alarms") or []:
            annunciator_active.append(
                {
                    "source_name": state.get("source_name", "-"),
                    "bay_name": state.get("bay_name", "-"),
                    "ip": state.get("ip", "-"),
                    "port": alarm.get("port", "-"),
                    "nama_alat": alarm.get("nama_alat", "Alarm tanpa nama"),
                }
            )
    annunciator_events = db.list_annunciator_events_between(start_text, end_text, limit=1000)
    annunciator_active_events = len([event for event in annunciator_events if event.get("level") == "active"])

    pqm_states = app_state.get("pqm_devices") or []
    if not pqm_states:
        pqm_states = [build_empty_pqm_state(device) for device in db.get_pqm_devices_with_latest_reading()]
    pqm_connected = len([device for device in pqm_states if device.get("connected")])
    pqm_disconnected = len(pqm_states) - pqm_connected

    dc_anomaly_lines = []
    for item in dc_abnormal:
        nama = str(item.get("nama", "-"))
        if item.get("status") != "online":
            status = str(item.get("status", "-")).upper()
        else:
            status = str(item.get("alarm_level", "-")).upper()
        dc_anomaly_lines.append(f"- {html_escape(nama)} ({html_escape(status)})")

    annunciator_anomaly_lines = []
    for alarm in annunciator_active[:8]:
        source_label = f"{alarm['source_name']} {alarm['bay_name']}"
        annunciator_anomaly_lines.append(
            f"- {html_escape(source_label)} (ALARM AKTIF: Port {html_escape(alarm['port'])})"
        )
    for state in annunciator_states:
        if state.get("connected"):
            continue
        source_label = f"{state.get('source_name', '-')} {state.get('bay_name', '-')}"
        annunciator_anomaly_lines.append(f"- {html_escape(source_label)} (DISCONNECTED)")

    pqm_anomaly_lines = [
        f"- {html_escape(device.get('nama_gi', '-'))} {html_escape(device.get('nama_bay', '-'))} (OFFLINE)"
        for device in pqm_states
        if not device.get("connected")
    ]

    data_quality_alerts = 1 if not dc_items else 0
    total_anomalies = (
        len(dc_abnormal)
        + len(annunciator_active)
        + annunciator_disconnected
        + pqm_disconnected
        + data_quality_alerts
    )
    overall_status = "NORMAL" if total_anomalies == 0 else "PERLU PERHATIAN"
    dc_status_line = (
        f"{dc_online}/{len(dc_items)} Online"
        if dc_items
        else "Belum ada data scan DC"
    )
    annunciator_status_line = f"{annunciator_connected}/{len(annunciator_states)} Connected"
    pqm_status_line = f"{pqm_connected}/{len(pqm_states)} Connected" if pqm_states else "0/0 Connected"

    anomaly_sections = []
    if dc_anomaly_lines:
        anomaly_sections.append("DC MONITORING:\n" + "\n".join(dc_anomaly_lines))
    if annunciator_anomaly_lines:
        anomaly_sections.append("ANNUNCIATOR:\n" + "\n".join(annunciator_anomaly_lines))
    if pqm_anomaly_lines:
        anomaly_sections.append("PQM:\n" + "\n".join(pqm_anomaly_lines))
    if not dc_items:
        anomaly_sections.append("DATA QUALITY:\n- Data scan DC belum tersedia saat rekap dibuat.")
    if not anomaly_sections:
        anomaly_sections.append("Tidak ada anomali aktif saat rekap dibuat.")

    return (
        "=========================\n"
        f"LAPORAN HARIAN {APP_BRAND_NAME}\n"
        f"PERIODE : {html_escape(period_text)}\n"
        f"STATUS  : {html_escape(overall_status)}\n"
        "=========================\n\n"
        "[1] RINGKASAN SISTEM\n"
        f"Total Anomali Aktif : {total_anomalies}\n"
        f"Kondisi DC Monitor  : {html_escape(dc_status_line)}\n"
        f"Kondisi Annunciator : {html_escape(annunciator_status_line)}\n"
        f"Kondisi PQM         : {html_escape(pqm_status_line)}\n\n"
        "[2] STATUS DC MONITORING\n"
        f"Online              : {dc_online}\n"
        f"Offline             : {dc_not_online}\n"
        f"Critical            : {dc_critical}\n"
        f"Warning             : {dc_warning}\n\n"
        "[3] STATUS ANNUNCIATOR\n"
        f"Connected           : {annunciator_connected}\n"
        f"Disconnected        : {annunciator_disconnected}\n"
        f"Alarm Aktif         : {len(annunciator_active)}\n"
        f"Event Aktif 24 Jam  : {annunciator_active_events}\n\n"
        "[4] DAFTAR ANOMALI AKTIF\n"
        + "\n\n".join(anomaly_sections)
        + "\n\n=========================\n"
        + APP_BRAND_FOOTER
    )

def send_daily_recap_if_due():
    now = wib_now()
    scheduled_today = now.replace(hour=DAILY_RECAP_HOUR_WIB, minute=0, second=0, microsecond=0)
    if now < scheduled_today:
        return False

    recap_date = scheduled_today.strftime("%Y-%m-%d")
    if db.get_setting(DAILY_RECAP_SETTING_KEY, "") == recap_date:
        return False

    message = build_daily_recap_message(now)
    db.set_setting(DAILY_RECAP_SETTING_KEY, recap_date)
    sent = send_whatsapp_notification(message)
    if sent:
        print(f"[DAILY RECAP] Rekap harian WhatsApp terkirim untuk {recap_date} 07:00 WIB.")
    else:
        print(
            f"[DAILY RECAP] Rekap harian {recap_date} sudah diproses sekali; "
            "tidak akan diulang hari ini walaupun WhatsApp belum terkirim."
        )
    return sent

def skip_overdue_daily_recap_after_whatsapp_recovery(now=None):
    now = now or wib_now()
    scheduled_today = now.replace(hour=DAILY_RECAP_HOUR_WIB, minute=0, second=0, microsecond=0)
    if now < scheduled_today:
        return False

    recap_date = scheduled_today.strftime("%Y-%m-%d")
    if db.get_setting(DAILY_RECAP_SETTING_KEY, "") == recap_date:
        return False

    db.set_setting(DAILY_RECAP_SETTING_KEY, recap_date)
    print(
        "[DAILY RECAP SKIPPED] Rekap harian yang sudah lewat jadwal dilewati "
        "setelah gateway WA pulih, agar tidak menambah pesan recovery."
    )
    return True

def format_recap_number(value, unit=""):
    if value is None or value == "":
        return "-"
    if isinstance(value, float):
        text = f"{value:.2f}".rstrip("0").rstrip(".")
    else:
        text = str(value)
    return f"{text} {unit}".strip()

def build_current_system_recap_message(reason="WA/SERVER ONLINE"):
    waktu = format_wib(wib_now())
    dc_items = app_state.get("last_scan_data") or []
    pqm_states = app_state.get("pqm_devices") or []
    avr_states = app_state.get("avr_devices") or []
    annunciator_states = list((app_state.get("annunciators") or {}).values())

    dc_lines = []
    if dc_items:
        for item in dc_items[:10]:
            if item.get("status") == "online":
                status = str(item.get("alarm_level", "normal")).upper()
                detail = f"V_PG {format_recap_number(item.get('v_pg'), 'V')} | V_NG {format_recap_number(item.get('v_ng'), 'V')}"
            else:
                status = str(item.get("status", "-")).upper()
                detail = "data terakhir tidak online"
            dc_lines.append(f"- {html_escape(item.get('nama', '-'))}: {html_escape(status)} ({html_escape(detail)})")
        if len(dc_items) > 10:
            dc_lines.append(f"- ... {len(dc_items) - 10} DC lainnya")
    else:
        dc_lines.append("- Belum ada data scan DC terbaru")

    pqm_lines = []
    for state in pqm_states[:8]:
        status = "ONLINE" if state.get("connected") else "OFFLINE"
        detail = f"Freq {format_recap_number(state.get('freq'), 'Hz')} | Event baru {state.get('new_disturbance_count', 0)}"
        pqm_lines.append(
            f"- {html_escape(state.get('nama_gi', '-'))} {html_escape(state.get('nama_bay', '-'))}: "
            f"{status} ({html_escape(detail)})"
        )
    if len(pqm_states) > 8:
        pqm_lines.append(f"- ... {len(pqm_states) - 8} PQM lainnya")
    if not pqm_lines:
        pqm_lines.append("- Belum ada data PQM terbaru")

    avr_lines = []
    for state in avr_states[:8]:
        status = "ONLINE" if state.get("connected") else "OFFLINE"
        active_count = len(state.get("active_alarms") or []) + len(state.get("active_leds") or [])
        main_values = []
        for point in (state.get("measurement_points") or [])[:3]:
            if point.get("value") is not None:
                main_values.append(
                    f"{point.get('label', point.get('key', '-'))} {format_recap_number(point.get('value'), point.get('unit', ''))}"
                )
        detail = " | ".join(main_values[:2]) or state.get("status_message", "-")
        avr_lines.append(
            f"- {html_escape(state.get('nama_gi', '-'))} {html_escape(state.get('nama_bay', '-'))}: "
            f"{status}, indikasi aktif {active_count} ({html_escape(detail)})"
        )
    if len(avr_states) > 8:
        avr_lines.append(f"- ... {len(avr_states) - 8} AVR lainnya")
    if not avr_lines:
        avr_lines.append("- Belum ada data AVR terbaru")

    annunciator_lines = []
    for state in annunciator_states[:8]:
        status = "ONLINE" if state.get("connected") else "OFFLINE"
        active_alarms = state.get("active_alarms") or []
        detail = f"alarm aktif {len(active_alarms)}"
        if active_alarms:
            first_alarm = active_alarms[0]
            detail += f", port {first_alarm.get('port', '-')}: {first_alarm.get('nama_alat', '-')}"
        annunciator_lines.append(
            f"- {html_escape(state.get('source_name', '-'))} {html_escape(state.get('bay_name', '-'))}: "
            f"{status} ({html_escape(detail)})"
        )
    if len(annunciator_states) > 8:
        annunciator_lines.append(f"- ... {len(annunciator_states) - 8} Annunciator lainnya")
    if not annunciator_lines:
        annunciator_lines.append("- Belum ada data Annunciator terbaru")

    return (
        "=========================\n"
        f"REKAP PEMULIHAN {APP_BRAND_NAME}\n"
        f"WAKTU  : {html_escape(waktu)} WIB\n"
        f"ALASAN : {html_escape(reason)}\n"
        "=========================\n\n"
        "DC MONITORING:\n" + "\n".join(dc_lines) + "\n\n"
        "PQM:\n" + "\n".join(pqm_lines) + "\n\n"
        "AVR:\n" + "\n".join(avr_lines) + "\n\n"
        "ANNUNCIATOR:\n" + "\n".join(annunciator_lines) + "\n\n"
        "=========================\n"
        + APP_BRAND_FOOTER
    )

def build_whatsapp_recovery_notice_message(reason="WA/SERVER ONLINE", discarded_count=0):
    waktu = format_wib(wib_now())
    indication_lines = [
        "Gateway WhatsApp sudah terhubung.",
        "Antrean pesan lama tidak dikirim ulang untuk mencegah spam.",
        "Notifikasi berikutnya hanya dikirim untuk anomali atau perubahan baru.",
    ]
    if int(discarded_count or 0) > 0:
        indication_lines.insert(1, f"{int(discarded_count)} pesan tertunda lama dilewati.")

    return notification_event_template(
        APP_BRAND_NAME,
        "WHATSAPP GATEWAY",
        waktu,
        "WA",
        status=str(reason or "TERHUBUNG"),
        indikasi_lines=indication_lines,
    )

def send_whatsapp_recovery_recap_if_pending(reason="WA/SERVER ONLINE"):
    persisted_pending = db.get_setting(WHATSAPP_RECOVERY_RECAP_PENDING_KEY, "0") == "1"
    if not persisted_pending:
        app_state["whatsapp_recovery_recap_pending"] = False
        app_state["whatsapp_recovery_recap_not_before"] = 0
        return False

    pending = is_whatsapp_recovery_recap_pending()
    if not pending or not is_whatsapp_configured():
        return False
    not_before = float(app_state.get("whatsapp_recovery_recap_not_before") or 0)
    if time.monotonic() < not_before:
        return False

    discarded_count = discard_pending_whatsapp_outbox("Gateway WA pulih; antrean lama tidak dikirim ulang.")
    message = build_whatsapp_recovery_notice_message(reason, discarded_count)
    sent = send_whatsapp_notification(
        message,
        allow_recovery_recap=False,
        enqueue_on_failure=False,
        fanout_secondary=False,
    )
    if sent:
        dispatch_notification_side_channels(message)
        app_state["whatsapp_recovery_recap_pending"] = False
        db.set_setting(WHATSAPP_RECOVERY_RECAP_PENDING_KEY, "0")
        db.set_setting(WHATSAPP_CONNECTION_STATE_KEY, "online")
        app_state["whatsapp_recovery_notice_sent_this_run"] = True
        skip_overdue_daily_recap_after_whatsapp_recovery()
        print("[WHATSAPP RECOVERY NOTICE] Notifikasi gateway WA pulih terkirim.")
    return sent

def daily_recap_worker():
    while True:
        try:
            recovery_sent = send_whatsapp_recovery_recap_if_pending()
            if recovery_sent or is_whatsapp_recovery_recap_pending():
                pass
            else:
                process_whatsapp_outbox_once()
                send_daily_recap_if_due()
        except Exception as exc:
            print(f"[DAILY RECAP FAILED] {exc}")

        for _ in range(WHATSAPP_RECOVERY_CHECK_SECONDS):
            time.sleep(1)

def check_tcp_endpoint(ip, port, timeout_seconds):
    try:
        with socket.create_connection((ip, int(port)), timeout=timeout_seconds):
            return True, ""
    except Exception as exc:
        return False, str(exc)

def describe_avr_mms_error(exc):
    message = str(exc) or exc.__class__.__name__
    spdu_match = re.search(r"SPDU ID:\s*0x[0-9A-Fa-f]+", message)
    if spdu_match:
        return (
            f"ISO negotiation error ({spdu_match.group(0)}). TCP port sudah terbuka, "
            "tetapi negosiasi MMS/ISO belum diterima IED. Cek parameter komunikasi "
            "IEC 61850 di gateway/IED, terutama OSI selector/AP-title sesuai SCD."
        )
    if "SPDU ID" in message or "ISO" in message or "MMS" in message:
        return (
            f"{message}. TCP port sudah terbuka, tetapi negosiasi MMS/ISO belum diterima IED. "
            "Cek parameter komunikasi IEC 61850 di gateway/IED, terutama OSI selector/AP-title sesuai SCD."
        )
    return message

def get_avr_failure_count(device_id):
    return int(app_state.setdefault("avr_failure_counts", {}).get(device_id, 0) or 0)

def set_avr_failure_count(device_id, value):
    app_state.setdefault("avr_failure_counts", {})[device_id] = max(0, int(value or 0))

def get_last_avr_state(device):
    for state in app_state.get("avr_devices", []):
        if state.get("id") == device["id"]:
            return state
    return build_empty_avr_state(device)

def get_kapasitor_failure_count(device_id):
    return int(app_state.setdefault("kapasitor_failure_counts", {}).get(device_id, 0) or 0)

def set_kapasitor_failure_count(device_id, value):
    app_state.setdefault("kapasitor_failure_counts", {})[device_id] = max(0, int(value or 0))

def get_last_kapasitor_state(device):
    for state in app_state.get("kapasitor_devices", []):
        if state.get("id") == device["id"]:
            return state
    return build_empty_kapasitor_state(device)

def handle_kapasitor_poll_failure(device, waktu, message, tcp_connected=False):
    failure_count = get_kapasitor_failure_count(device["id"]) + 1
    set_kapasitor_failure_count(device["id"], failure_count)

    if failure_count < KAPASITOR_FAIL_THRESHOLD:
        previous_state = get_last_kapasitor_state(device)
        state = {
            **previous_state,
            "tcp_connected": bool(tcp_connected or previous_state.get("tcp_connected")),
            "communication_status": previous_state.get("communication_status", "mms_online"),
            "last_poll_time": waktu,
            "status_message": (
                f"{message} Gangguan sementara "
                f"({failure_count}/{KAPASITOR_FAIL_THRESHOLD}). Data terakhir dipertahankan."
            ),
        }
        print(f"[KAPASITOR WARNING] {device['nama_gi']} - {device['nama_bay']}: {state['status_message']}")
        return state

    state = build_empty_kapasitor_state(
        device,
        connected=False,
        tcp_connected=tcp_connected,
        last_poll_time=waktu,
        status_message=message,
        point_groups=build_avr_error_point_groups(device, message),
    )
    print(f"[KAPASITOR OFFLINE] {device['nama_gi']} - {device['nama_bay']}: {message}")
    return state

def handle_avr_poll_failure(device, waktu, message):
    failure_count = get_avr_failure_count(device["id"]) + 1
    set_avr_failure_count(device["id"], failure_count)

    if failure_count < AVR_FAIL_THRESHOLD:
        state = {
            **get_last_avr_state(device),
            "last_poll_time": waktu,
            "status_message": (
                f"{message} Gangguan sementara "
                f"({failure_count}/{AVR_FAIL_THRESHOLD}). Data terakhir dipertahankan."
            ),
        }
        print(f"[AVR WARNING] {device['nama_gi']} - {device['nama_bay']}: {state['status_message']}")
        return state

    state = build_empty_avr_state(
        device,
        connected=False,
        last_poll_time=waktu,
        status_message=message,
        point_groups=build_avr_error_point_groups(device, message),
    )
    print(f"[AVR OFFLINE] {device['nama_gi']} - {device['nama_bay']}: {message}")
    return state

def poll_avr_device(device):
    waktu_sekarang = time.strftime("%Y-%m-%d %H:%M:%S")
    try:
        ensure_device_endpoint_allowed(device.get("ip", ""), device.get("port", 102), "AVR")
    except HTTPException as exc:
        status_message = str(exc.detail)
        return build_empty_avr_state(
            device,
            connected=False,
            last_poll_time=waktu_sekarang,
            status_message=status_message,
            point_groups=build_avr_error_point_groups(device, status_message),
        )

    connected, error_message = check_tcp_endpoint(
        device["ip"],
        device.get("port", 102),
        AVR_TIMEOUT_DETIK,
    )

    if not connected:
        status_message = f"Port 102 IEC 61850 belum terhubung: {error_message}"
        return handle_avr_poll_failure(device, waktu_sekarang, status_message)

    try:
        point_groups, read_count, total_count, error_count = asyncio.run(read_avr_mms_points(device))
        if error_count:
            status_message = f"Port 102 terhubung. Data MMS terbaca {read_count}/{total_count} point, {error_count} gagal."
        else:
            status_message = f"Data AVR IEC 61850 MMS berhasil dibaca ({read_count}/{total_count} point)."

        state = build_empty_avr_state(
            device,
            connected=read_count > 0,
            last_poll_time=waktu_sekarang,
            status_message=status_message,
            point_groups=point_groups,
        )
        if read_count > 0:
            set_avr_failure_count(device["id"], 0)
        handle_avr_point_notifications(device, state, waktu_sekarang)
        return state
    except Exception as exc:
        mms_error = describe_avr_mms_error(exc)
        status_message = (
            "Port 102 IEC 61850 terhubung, tetapi baca MMS live gagal: "
            f"{mms_error}"
        )
        return handle_avr_poll_failure(device, waktu_sekarang, status_message)

def poll_avr_once():
    if not app_locks["avr_scan"].acquire(blocking=False):
        return app_state["avr_devices"]

    try:
        if app_state["avr_is_scanning"]:
            return app_state["avr_devices"]
        app_state["avr_is_scanning"] = True
        states = [poll_avr_device(device) for device in get_avr_devices()]
        app_state["avr_devices"] = states
        app_state["avr_last_scan_time"] = time.strftime("%Y-%m-%d %H:%M:%S")
        return states
    finally:
        app_state["avr_is_scanning"] = False
        app_locks["avr_scan"].release()

def get_kapasitor_payload():
    return {
        "devices": app_state["kapasitor_devices"],
        "last_scan_time": app_state["kapasitor_last_scan_time"],
        "is_scanning": app_state["kapasitor_is_scanning"],
        "auto_polling_active": app_state["kapasitor_auto_polling_active"],
        "poll_interval_seconds": KAPASITOR_INTERVAL_DETIK,
        "timeout_seconds": KAPASITOR_TIMEOUT_DETIK,
        "default_device_id": DEFAULT_KAPASITOR_DEVICES[0]["id"] if DEFAULT_KAPASITOR_DEVICES else "",
    }

def kapasitor_cb_snapshot_key(device_id):
    return f"kapasitor_cb_snapshot::{device_id}"

def kapasitor_cb_candidate_key(device_id):
    return f"kapasitor_cb_candidate::{device_id}"

def kapasitor_point_by_key(state, group_name, key):
    for point in state.get(group_name, []) or []:
        if point.get("key") == key:
            return point
    return {}

def kapasitor_point_raw_value(point):
    if not point:
        return None
    return point.get("value") if point.get("value") is not None else point.get("configured_value")

def kapasitor_numeric_value(point):
    if not point or point.get("quality") == "invalid":
        return None
    value = kapasitor_point_raw_value(point)
    if value in (None, ""):
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return None

def kapasitor_cb_state(value):
    if value in (None, ""):
        return ""
    if isinstance(value, bool):
        return "close" if value else "open"
    if isinstance(value, (int, float)):
        number = int(value)
        if number in {2, 8}:
            return "close"
        if number in {0, 1}:
            return "open"
        return ""
    text = str(value).strip().lower()
    if text in {"2", "8", "true", "on", "close", "closed", "cb close"}:
        return "close"
    if text in {"0", "1", "false", "off", "open", "opened", "cb open"}:
        return "open"
    return ""

def kapasitor_phase_voltage_snapshot(state):
    voltages = {}
    for key in ("v_rs", "v_st", "v_tr"):
        value = kapasitor_numeric_value(kapasitor_point_by_key(state, "metering_points", key))
        if value is not None:
            voltages[key] = value
    return voltages

def kapasitor_highest_phase(voltages):
    if not voltages:
        return ""
    return max(voltages.items(), key=lambda item: item[1])[0]

def format_kapasitor_voltage(value):
    try:
        number = float(value)
    except (TypeError, ValueError):
        return "-"
    text = f"{number:.1f}".rstrip("0").rstrip(".")
    return f"{text} kV"

def kapasitor_cb_status_label(cb_state):
    if cb_state == "close":
        return "CB 150kV Close"
    if cb_state == "open":
        return "CB 150kV Open"
    return "CB 150kV"

def build_kapasitor_cb_message(state, cb_state, before_voltage, after_voltage, waktu):
    return notification_event_template(
        state.get("nama_gi", "-"),
        state.get("nama_bay", "-"),
        waktu,
        "KAPASITOR",
        ip=state.get("ip", ""),
        status=kapasitor_cb_status_label(cb_state),
        indikasi_lines=[
            f"Tegangan : {format_kapasitor_voltage(before_voltage)} -> {format_kapasitor_voltage(after_voltage)}",
        ],
    )

def kapasitor_state_snapshot(state):
    cb_point = kapasitor_point_by_key(state, "status_points", "cb_q50")
    cb = kapasitor_cb_state(kapasitor_point_raw_value(cb_point))
    voltages = kapasitor_phase_voltage_snapshot(state)
    if not cb or not voltages:
        return {}
    return {
        "cb": cb,
        "voltages": voltages,
    }

def handle_kapasitor_cb_notification(state, waktu):
    device_id = state.get("id") or ""
    if not device_id:
        return False

    snapshot = kapasitor_state_snapshot(state)
    if not snapshot:
        print(
            f"[KAPASITOR NOTIFICATION HOLD] {state.get('nama_gi', '-') } - {state.get('nama_bay', '-')}: "
            "snapshot CB/tegangan belum valid."
        )
        return False

    snapshot_key = kapasitor_cb_snapshot_key(device_id)
    previous_snapshot = safe_json_dict(db.get_setting(snapshot_key, ""))
    if not previous_snapshot:
        db.set_setting(snapshot_key, json.dumps(snapshot, ensure_ascii=True))
        clear_notification_candidate(kapasitor_cb_candidate_key(device_id))
        print(
            f"[KAPASITOR BASELINE] {state.get('nama_gi', '-') } - {state.get('nama_bay', '-')}: "
            "baseline CB dan tegangan tersimpan."
        )
        return False

    if previous_snapshot.get("cb") == snapshot.get("cb"):
        db.set_setting(snapshot_key, json.dumps(snapshot, ensure_ascii=True))
        clear_notification_candidate(kapasitor_cb_candidate_key(device_id))
        return False

    candidate_key = kapasitor_cb_candidate_key(device_id)
    candidate_payload = {
        "previous": previous_snapshot,
        "current": snapshot,
    }
    confirmed, seen_count = update_notification_candidate(
        candidate_key,
        "transition",
        candidate_payload,
        KAPASITOR_CB_NOTIFICATION_CONFIRM_POLLS,
    )
    if not confirmed:
        print(
            f"[KAPASITOR CHANGE HOLD] {state.get('nama_gi', '-') } - {state.get('nama_bay', '-')}: "
            f"perubahan CB menunggu konfirmasi {seen_count}/{KAPASITOR_CB_NOTIFICATION_CONFIRM_POLLS}."
        )
        return False

    before_voltages = previous_snapshot.get("voltages") or {}
    after_voltages = snapshot.get("voltages") or {}
    locked_phase = kapasitor_highest_phase(before_voltages)
    before_voltage = before_voltages.get(locked_phase)
    after_voltage = after_voltages.get(locked_phase)
    if locked_phase == "" or before_voltage is None or after_voltage is None:
        db.set_setting(snapshot_key, json.dumps(snapshot, ensure_ascii=True))
        clear_notification_candidate(candidate_key)
        print(
            f"[KAPASITOR NOTIFICATION SKIPPED] {state.get('nama_gi', '-') } - {state.get('nama_bay', '-')}: "
            "tegangan sebelum/sesudah pada fasa yang sama belum valid."
        )
        return False

    sent = send_whatsapp_notification(
        build_kapasitor_cb_message(state, snapshot.get("cb"), before_voltage, after_voltage, waktu)
    )
    db.set_setting(snapshot_key, json.dumps(snapshot, ensure_ascii=True))
    clear_notification_candidate(candidate_key)
    if sent:
        print(
            f"[KAPASITOR NOTIFICATION] {state.get('nama_gi', '-') } - {state.get('nama_bay', '-')}: "
            f"{kapasitor_cb_status_label(snapshot.get('cb'))} terkirim ke WhatsApp."
        )
    else:
        print(
            f"[KAPASITOR NOTIFICATION FAILED] {state.get('nama_gi', '-') } - {state.get('nama_bay', '-')}: "
            "perubahan CB belum terkirim ke WhatsApp."
        )
    return sent

def poll_kapasitor_device(device):
    waktu_sekarang = time.strftime("%Y-%m-%d %H:%M:%S")
    try:
        ensure_device_endpoint_allowed(device.get("ip", ""), device.get("port", 102), "Kapasitor")
    except HTTPException as exc:
        status_message = str(exc.detail)
        return handle_kapasitor_poll_failure(device, waktu_sekarang, status_message)

    connected, error_message = check_tcp_endpoint(
        device["ip"],
        device.get("port", 102),
        KAPASITOR_TIMEOUT_DETIK,
    )
    if not connected:
        status_message = f"Port 102 IEC 61850 belum terhubung: {error_message}"
        return handle_kapasitor_poll_failure(device, waktu_sekarang, status_message)

    try:
        point_groups, read_count, total_count, error_count = asyncio.run(read_avr_mms_points({
            **device,
            "point_group_names": KAPASITOR_POINT_GROUPS,
        }))
        if error_count:
            status_message = f"Port 102 terhubung. Data kapasitor terbaca {read_count}/{total_count} point, {error_count} gagal."
        else:
            status_message = f"Data kapasitor IEC 61850 MMS berhasil dibaca ({read_count}/{total_count} point)."
        if read_count <= 0:
            return handle_kapasitor_poll_failure(device, waktu_sekarang, status_message, tcp_connected=True)
        state = build_empty_kapasitor_state(
            device,
            connected=read_count > 0,
            tcp_connected=True,
            last_poll_time=waktu_sekarang,
            status_message=status_message,
            point_groups=point_groups,
        )
        set_kapasitor_failure_count(device["id"], 0)
        return state
    except Exception as exc:
        mms_error = describe_avr_mms_error(exc)
        status_message = f"Port 102 IEC 61850 terhubung, tetapi baca MMS kapasitor gagal: {mms_error}"
        return handle_kapasitor_poll_failure(device, waktu_sekarang, status_message, tcp_connected=True)

def poll_kapasitor_once():
    if not app_locks["kapasitor_scan"].acquire(blocking=False):
        return app_state["kapasitor_devices"]

    try:
        if app_state["kapasitor_is_scanning"]:
            return app_state["kapasitor_devices"]
        app_state["kapasitor_is_scanning"] = True
        states = [poll_kapasitor_device(device) for device in get_kapasitor_devices()]
        app_state["kapasitor_devices"] = states
        app_state["kapasitor_last_scan_time"] = time.strftime("%Y-%m-%d %H:%M:%S")
        for state in states:
            handle_kapasitor_cb_notification(state, app_state["kapasitor_last_scan_time"])
        return states
    finally:
        app_state["kapasitor_is_scanning"] = False
        app_locks["kapasitor_scan"].release()


def reset_ar_state_from_config():
    app_state["ar_devices"] = [build_empty_ar_state(device) for device in get_ar_devices()]

def get_ar_payload():
    configured_devices = get_ar_devices()
    configured_ids = [device.get("id") for device in configured_devices]
    current_ids = [device.get("id") for device in app_state.get("ar_devices", [])]
    if configured_ids != current_ids and not app_state["ar_is_scanning"]:
        reset_ar_state_from_config()
    
    return {
        "devices": app_state["ar_devices"],
        "events": app_state.get("ar_events", []),
        "last_scan_time": app_state["ar_last_scan_time"],
        "is_scanning": app_state["ar_is_scanning"],
        "auto_polling_active": app_state["ar_auto_polling_active"],
        "poll_interval_seconds": AR_INTERVAL_DETIK,
        "timeout_seconds": AR_TIMEOUT_DETIK,
        "notification_confirm_polls": AR_EVENT_CONFIRM_POLLS,
        "default_device_id": configured_ids[0] if configured_ids else "",
    }

def poll_ar_device(device):
    import time
    waktu_sekarang = time.strftime("%Y-%m-%d %H:%M:%S")
    try:
        ensure_device_endpoint_allowed(device.get("ip", ""), device.get("port", 102), "AR")
    except HTTPException as exc:
        status_message = str(exc.detail)
        return build_empty_ar_state(
            device,
            connected=False,
            last_poll_time=waktu_sekarang,
            status_message=status_message,
            point_groups=build_ar_error_point_groups(device, status_message),
        )

    connected, error_message = check_tcp_endpoint(
        device["ip"],
        device.get("port", 102),
        AR_TIMEOUT_DETIK,
    )
    
    if not connected:
        status_message = f"Port 102 IEC 61850 belum terhubung: {error_message}"
        return build_empty_ar_state(
            device,
            connected=False,
            last_poll_time=waktu_sekarang,
            status_message=status_message,
            point_groups=build_ar_error_point_groups(device, status_message),
        )

    points_to_read = []
    for group in AR_POINT_GROUPS:
        points_to_read.extend(device.get(group, []))
    
    if not points_to_read:
        return build_empty_ar_state(device, connected=True, last_poll_time=waktu_sekarang, status_message="Tidak ada tag AR yang dikonfigurasi.")
        
    try:
        point_groups, read_count, total_count, error_count = asyncio.run(read_avr_mms_points({
            **device,
            "point_group_names": AR_POINT_GROUPS,
        }))

        return build_empty_ar_state(
            device,
            connected=True,
            last_poll_time=waktu_sekarang,
            status_message=f"Data AR IEC 61850 MMS berhasil dibaca ({read_count}/{total_count} point).",
            point_groups=point_groups,
        )

    except Exception as exc:
        mms_error = describe_avr_mms_error(exc)
        status_message = f"Port 102 IEC 61850 terhubung, tetapi baca MMS live gagal: {mms_error}"
        return build_empty_ar_state(
            device,
            connected=False,
            last_poll_time=waktu_sekarang,
            status_message=status_message,
            point_groups=build_ar_error_point_groups(device, status_message),
        )

def poll_ar_once():
    import time
    if not app_locks["ar_scan"].acquire(blocking=False):
        return app_state["ar_devices"]

    try:
        if app_state["ar_is_scanning"]:
            return app_state["ar_devices"]
        app_state["ar_is_scanning"] = True
        states = [poll_ar_device(device) for device in get_ar_devices()]
        for state in states:
            if state.get("connected"):
                record_ar_state_events(state)
        app_state["ar_devices"] = states
        app_state["ar_events"] = db.list_ar_events(limit=300)
        app_state["ar_last_scan_time"] = time.strftime("%Y-%m-%d %H:%M:%S")
        return states
    finally:
        app_state["ar_is_scanning"] = False
        app_locks["ar_scan"].release()

def ar_worker():
    import time
    while True:
        if app_state["ar_auto_polling_active"]:
            poll_ar_once()
            for _ in range(int(AR_INTERVAL_DETIK)):
                if not app_state["ar_auto_polling_active"]:
                    break
                time.sleep(1)
        else:
            time.sleep(1)

def dfr_notification_state_key(device_id):
    return f"dfr_notification_state::{device_id}"

def build_dfr_notification_message(device_state, previous_status, current_status, waktu):
    ram = device_state.get("ram") or {}
    storage = device_state.get("storage") or []
    storage_lines = []
    for item in storage[:4]:
        percent = item.get("used_percent")
        percent_text = "-" if percent is None else f"{float(percent):.1f}%"
        available = item.get("available_kb")
        available_text = "-" if available is None else f"{int(available):,} KB".replace(",", ".")
        storage_lines.append(f"{item.get('mount', '-')}: {percent_text} terpakai, free {available_text}")
    if not storage_lines:
        storage_lines.append(device_state.get("status_message") or "Storage DFR tidak terbaca.")

    ram_percent = ram.get("used_percent")
    ram_text = "-" if ram_percent is None else f"{float(ram_percent):.1f}%"
    return notification_event_template(
        "DFR",
        f"{device_state.get('nama_gi', '-')} {device_state.get('nama_bay', '-')}",
        waktu,
        "DFR MEMORY STORAGE",
        status=f"{str(previous_status or 'baseline').upper()} -> {str(current_status or '-').upper()}",
        ip=device_state.get("ip"),
        indikasi_lines=[
            f"GI       : {device_state.get('nama_gi', '-')}",
            f"BAY      : {device_state.get('nama_bay', '-')}",
            f"MERK     : {device_state.get('merk_tipe', '-')}",
            f"RAM USED : {ram_text}",
            f"BATAS STORAGE WARNING  : >= {DFR_STORAGE_WARNING_PERCENT:.0f}%",
            f"BATAS STORAGE CRITICAL : >= {DFR_STORAGE_CRITICAL_PERCENT:.0f}%",
            "STORAGE:",
            *storage_lines,
        ],
    )

def handle_dfr_notification_state(device_state, waktu):
    device_id = device_state.get("id")
    current_status = device_state.get("status") or "offline"
    key = dfr_notification_state_key(device_id)
    previous_status = db.get_setting(key, "")
    if not previous_status:
        db.set_setting(key, current_status)
        return
    if previous_status == current_status:
        return
    db.set_setting(key, current_status)
    if current_status in {"warning", "critical", "offline"} or previous_status in {"warning", "critical", "offline"}:
        send_whatsapp_notification(
            build_dfr_notification_message(device_state, previous_status, current_status, waktu)
        )

def poll_dfr_device(device):
    waktu = time.strftime("%Y-%m-%d %H:%M:%S")
    state = build_empty_dfr_state(device)
    state["last_poll_time"] = waktu
    if not device.get("enabled", True):
        state["status"] = "disabled"
        state["status_message"] = "Polling DFR dimatikan."
        return state

    try:
        response = dfr_session.get(device["diag_url"], timeout=DFR_TIMEOUT_DETIK)
        if response.status_code != 200:
            raise RuntimeError(f"Status HTTP {response.status_code}.")
        parsed = parse_dfr_diagnostic_report(response.text)
        ram = parsed.get("ram") or {}
        storage = parsed.get("storage") or []
        status = classify_dfr_state(True, ram, storage)
        state.update({
            "connected": status != "unsupported",
            "status": status,
            "status_message": "Diagnostic DFR terbaca." if status != "unsupported" else "Endpoint diagnostic tidak berisi data storage/memory.",
            "station_name": parsed.get("station_name") or "",
            "device_name": parsed.get("device_name") or "",
            "board_type": parsed.get("board_type") or "",
            "ram": ram,
            "storage": storage,
        })
        return state
    except Exception as exc:
        state["connected"] = False
        state["status"] = "offline"
        state["status_message"] = f"DFR tidak terbaca: {exc}"
        return state

def poll_dfr_once():
    if not app_locks["dfr_scan"].acquire(blocking=False):
        return app_state["dfr_devices"]
    try:
        app_state["dfr_is_scanning"] = True
        devices = get_dfr_devices()
        if not devices:
            app_state["dfr_devices"] = []
            app_state["dfr_last_scan_time"] = time.strftime("%Y-%m-%d %H:%M:%S")
            return []

        states = []
        max_workers = max(1, min(DFR_POLL_WORKERS, len(devices)))
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            futures = {executor.submit(poll_dfr_device, device): device for device in devices}
            for future in as_completed(futures):
                states.append(future.result())

        order = {device["id"]: index for index, device in enumerate(devices)}
        states.sort(key=lambda item: order.get(item.get("id"), 9999))
        waktu = time.strftime("%Y-%m-%d %H:%M:%S")
        for state in states:
            handle_dfr_notification_state(state, waktu)
        app_state["dfr_devices"] = states
        app_state["dfr_last_scan_time"] = waktu
        return states
    finally:
        app_state["dfr_is_scanning"] = False
        app_locks["dfr_scan"].release()

def build_dfr_summary(devices):
    counts = {"total": len(devices), "normal": 0, "warning": 0, "critical": 0, "offline": 0, "unsupported": 0, "disabled": 0}
    for device in devices:
        status = str(device.get("status") or "offline").lower()
        counts[status if status in counts else "offline"] += 1
    return counts

def build_dfr_payload():
    devices = app_state.get("dfr_devices") or [build_empty_dfr_state(device) for device in get_dfr_devices()]
    return {
        "devices": devices,
        "summary": build_dfr_summary(devices),
        "last_scan_time": app_state.get("dfr_last_scan_time"),
        "is_scanning": app_state.get("dfr_is_scanning"),
        "auto_polling_active": app_state.get("dfr_auto_polling_active"),
        "poll_interval_seconds": DFR_INTERVAL_DETIK,
        "timeout_seconds": DFR_TIMEOUT_DETIK,
        "poll_workers": DFR_POLL_WORKERS,
        "source": "dfr_devices.json",
        "filter": "ULTG BEKASI",
        "thresholds": {
            "storage_warning_percent": DFR_STORAGE_WARNING_PERCENT,
            "storage_critical_percent": DFR_STORAGE_CRITICAL_PERCENT,
            "ram_warning_percent": DFR_RAM_WARNING_PERCENT,
            "ram_critical_percent": DFR_RAM_CRITICAL_PERCENT,
        },
    }

def dfr_worker():
    while True:
        if app_state["dfr_auto_polling_active"]:
            poll_dfr_once()
            for _ in range(int(DFR_INTERVAL_DETIK)):
                if not app_state["dfr_auto_polling_active"]:
                    break
                time.sleep(1)
        else:
            time.sleep(1)

def avr_worker():
    while True:
        if app_state["avr_auto_polling_active"]:
            poll_avr_once()
            for _ in range(AVR_INTERVAL_DETIK):
                if not app_state["avr_auto_polling_active"]:
                    break
                time.sleep(1)
        else:
            time.sleep(1)

def kapasitor_worker():
    while True:
        if app_state["kapasitor_auto_polling_active"]:
            poll_kapasitor_once()
            for _ in range(KAPASITOR_INTERVAL_DETIK):
                if not app_state["kapasitor_auto_polling_active"]:
                    break
                time.sleep(1)
        else:
            time.sleep(1)

def annunciator_worker():
    while True:
        if app_state["annunciator_auto_polling_active"]:
            poll_annunciator_once()
            for _ in range(ANNUNCIATOR_INTERVAL_DETIK):
                if not app_state["annunciator_auto_polling_active"]:
                    break
                time.sleep(1)
        else:
            time.sleep(1)

background_threads_started = False
background_threads_lock = threading.Lock()
background_thread_registry = {}
last_windows_cpu_times = None

def get_background_thread_specs():
    return [
        ("dc-polling", polling_worker),
        ("annunciator-polling", annunciator_worker),
        ("pqm-polling", pqm_worker),
        ("pme-report-scan", pme_report_scan_worker),
        ("dfr-polling", dfr_worker),
        ("daily-recap", daily_recap_worker),
    ]

def run_background_thread(thread_name, target):
    while True:
        try:
            target()
            print(f"[WORKER STOPPED] {thread_name} selesai tanpa error. Worker akan dijalankan ulang.")
        except Exception:
            print(f"[WORKER ERROR] {thread_name} crash:\n{traceback.format_exc()}")
        time.sleep(5)

def ensure_background_thread_unlocked(thread_name, target):
    thread = background_thread_registry.get(thread_name)
    if thread and thread.is_alive():
        return thread

    thread = threading.Thread(
        target=run_background_thread,
        args=(thread_name, target),
        daemon=True,
        name=thread_name,
    )
    background_thread_registry[thread_name] = thread
    thread.start()
    print(f"[WORKER START] {thread_name} aktif.")
    return thread

def ensure_background_thread(thread_name):
    targets = dict(get_background_thread_specs())
    target = targets.get(thread_name)
    if target is None:
        return None
    with background_threads_lock:
        return ensure_background_thread_unlocked(thread_name, target)

def start_background_threads():
    global background_threads_started
    with background_threads_lock:
        for thread_name, target in get_background_thread_specs():
            ensure_background_thread_unlocked(thread_name, target)
        background_threads_started = True

# === API ENDPOINTS ===

class LoginData(BaseModel):
    username: str
    password: str

class ServerNotificationTestData(BaseModel):
    channel: str = Field(default="all")

def verify_csrf_request(request: Request):
    if request.method.upper() not in {"POST", "PUT", "PATCH", "DELETE"}:
        return
    if request.headers.get(CSRF_HEADER_NAME) != "1":
        raise HTTPException(status_code=403, detail="CSRF header dashboard tidak valid.")

def require_admin_session(
    request: Request,
    session_token: str = Cookie(default="", alias=SESSION_COOKIE_NAME),
):
    pass # Auth bypassed for internal microservice
    return True

def login_rate_key(request: Request, username: str):
    client_host = getattr(request.client, "host", "") if request and request.client else ""
    return f"{client_host}:{str(username or '').strip().lower()}"

def check_login_rate_limit(request: Request, username: str):
    key = login_rate_key(request, username)
    now = time.time()
    with app_locks["auth"]:
        record = app_state["login_rate_limits"].get(key)
        if not record:
            return key

        locked_until = float(record.get("locked_until") or 0)
        if locked_until > now:
            wait_seconds = int(max(1, locked_until - now))
            raise HTTPException(status_code=429, detail=f"Terlalu banyak percobaan login. Coba lagi sekitar {wait_seconds} detik.")

        first_attempt = float(record.get("first_attempt") or now)
        if now - first_attempt > LOGIN_RATE_LIMIT_WINDOW_DETIK:
            app_state["login_rate_limits"].pop(key, None)
        return key

def record_login_failure(rate_key):
    now = time.time()
    with app_locks["auth"]:
        record = app_state["login_rate_limits"].get(rate_key) or {"first_attempt": now, "count": 0, "locked_until": 0}
        first_attempt = float(record.get("first_attempt") or now)
        if now - first_attempt > LOGIN_RATE_LIMIT_WINDOW_DETIK:
            record = {"first_attempt": now, "count": 0, "locked_until": 0}
        record["count"] = int(record.get("count") or 0) + 1
        if record["count"] >= LOGIN_RATE_LIMIT_MAX_ATTEMPTS:
            record["locked_until"] = now + LOGIN_RATE_LIMIT_LOCK_DETIK
        app_state["login_rate_limits"][rate_key] = record

def clear_login_failures(rate_key):
    with app_locks["auth"]:
        app_state["login_rate_limits"].pop(rate_key, None)

def require_pandu_gi_api_key(
    x_api_key: str = Header(default="", alias="X-API-Key"),
    authorization: str = Header(default="", alias="Authorization"),
):
    provided_key = str(x_api_key or "").strip()
    authorization_value = str(authorization or "").strip()

    if not provided_key and authorization_value.lower().startswith("bearer "):
        provided_key = authorization_value[7:].strip()

    if not PANDU_GI_API_KEY or not secrets.compare_digest(provided_key, PANDU_GI_API_KEY):
        raise HTTPException(status_code=401, detail="API key PANDU-GI tidak valid.")

    return True

def build_annunciator_sources_status():
    return [
        {
            "id": source["id"],
            "source_name": source["source_name"],
            "bay_name": source["bay_name"],
            "ip": source["ip"],
            "connected": app_state["annunciators"][source["id"]]["connected"],
            "active_count": len(app_state["annunciators"][source["id"]]["active_alarms"]),
            "channel_count": app_state["annunciators"][source["id"]]["channel_count"],
            "last_poll_time": app_state["annunciators"][source["id"]]["last_poll_time"],
            "status_message": app_state["annunciators"][source["id"]]["status_message"],
        }
        for source in ANNUNCIATOR_SOURCES
    ]

def resolve_local_path(path_value):
    path_text = str(path_value or "").strip()
    if not path_text:
        return ""
    if os.path.isabs(path_text):
        return path_text
    return os.path.join(BASE_DIR, path_text)

def safe_file_info(path_value):
    path = resolve_local_path(path_value)
    try:
        stat = os.stat(path)
        return {
            "path": path,
            "exists": True,
            "size_bytes": int(stat.st_size),
            "modified_time": datetime.fromtimestamp(stat.st_mtime).strftime("%Y-%m-%d %H:%M:%S"),
        }
    except OSError:
        return {
            "path": path,
            "exists": False,
            "size_bytes": 0,
            "modified_time": None,
        }

def get_windows_memory_metrics():
    if os.name != "nt":
        return None
    try:
        import ctypes

        class MEMORYSTATUSEX(ctypes.Structure):
            _fields_ = [
                ("dwLength", ctypes.c_ulong),
                ("dwMemoryLoad", ctypes.c_ulong),
                ("ullTotalPhys", ctypes.c_ulonglong),
                ("ullAvailPhys", ctypes.c_ulonglong),
                ("ullTotalPageFile", ctypes.c_ulonglong),
                ("ullAvailPageFile", ctypes.c_ulonglong),
                ("ullTotalVirtual", ctypes.c_ulonglong),
                ("ullAvailVirtual", ctypes.c_ulonglong),
                ("sullAvailExtendedVirtual", ctypes.c_ulonglong),
            ]

        memory = MEMORYSTATUSEX()
        memory.dwLength = ctypes.sizeof(MEMORYSTATUSEX)
        if not ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(memory)):
            return None
        used = int(memory.ullTotalPhys - memory.ullAvailPhys)
        total = int(memory.ullTotalPhys)
        return {
            "total_bytes": total,
            "used_bytes": used,
            "available_bytes": int(memory.ullAvailPhys),
            "percent": round((used / total) * 100, 1) if total else None,
        }
    except Exception:
        return None

def get_windows_cpu_percent():
    if os.name != "nt":
        return None
    try:
        import ctypes
        from ctypes import wintypes

        class FILETIME(ctypes.Structure):
            _fields_ = [
                ("dwLowDateTime", wintypes.DWORD),
                ("dwHighDateTime", wintypes.DWORD),
            ]

        def filetime_to_int(filetime):
            return (int(filetime.dwHighDateTime) << 32) + int(filetime.dwLowDateTime)

        def read_cpu_times():
            idle_time = FILETIME()
            kernel_time = FILETIME()
            user_time = FILETIME()
            if not ctypes.windll.kernel32.GetSystemTimes(
                ctypes.byref(idle_time),
                ctypes.byref(kernel_time),
                ctypes.byref(user_time),
            ):
                return None
            return (
                filetime_to_int(idle_time),
                filetime_to_int(kernel_time),
                filetime_to_int(user_time),
            )

        global last_windows_cpu_times
        current_times = read_cpu_times()
        if not current_times:
            return None

        previous_times = last_windows_cpu_times
        if previous_times is None:
            time.sleep(0.08)
            previous_times = current_times
            current_times = read_cpu_times()
            if not current_times:
                return None

        last_windows_cpu_times = current_times
        idle_delta = current_times[0] - previous_times[0]
        kernel_delta = current_times[1] - previous_times[1]
        user_delta = current_times[2] - previous_times[2]
        total_delta = kernel_delta + user_delta
        if total_delta <= 0:
            return None
        busy_delta = max(0, total_delta - idle_delta)
        return round((busy_delta / total_delta) * 100, 1)
    except Exception:
        return None

def get_system_resource_metrics():
    disk_usage = shutil.disk_usage(BASE_DIR)
    resources = {
        "cpu": {
            "percent": None,
            "available": False,
        },
        "memory": {
            "total_bytes": None,
            "used_bytes": None,
            "available_bytes": None,
            "percent": None,
            "available": False,
        },
        "disk": {
            "path": BASE_DIR,
            "total_bytes": int(disk_usage.total),
            "used_bytes": int(disk_usage.used),
            "free_bytes": int(disk_usage.free),
            "percent": round((disk_usage.used / disk_usage.total) * 100, 1) if disk_usage.total else None,
        },
    }

    if psutil:
        try:
            cpu_percent = psutil.cpu_percent(interval=0.1)
            memory = psutil.virtual_memory()
            resources["cpu"] = {
                "percent": round(float(cpu_percent), 1),
                "available": True,
            }
            resources["memory"] = {
                "total_bytes": int(memory.total),
                "used_bytes": int(memory.used),
                "available_bytes": int(memory.available),
                "percent": round(float(memory.percent), 1),
                "available": True,
            }
            return resources
        except Exception:
            pass

    memory = get_windows_memory_metrics()
    if memory:
        resources["memory"] = {**memory, "available": True}
    cpu_percent = get_windows_cpu_percent()
    if cpu_percent is not None:
        resources["cpu"] = {
            "percent": cpu_percent,
            "available": True,
        }
    return resources

def count_table_rows(table_name):
    allowed_tables = {
        "gi_devices",
        "dc_readings",
        "dc_alarm_events",
        "pqm_devices",
        "pqm_readings",
        "pqm_disturbance_events",
        "pqm_itic_events",
        "annunciator_sources",
        "annunciator_events",
        "ar_events",
        "whatsapp_outbox",
    }
    if table_name not in allowed_tables:
        return 0
    try:
        with db.get_connection() as conn:
            row = conn.execute(f"SELECT COUNT(*) AS total FROM {table_name}").fetchone()
            return int(row["total"] if row else 0)
    except Exception:
        return 0

def build_storage_health():
    db_file = resolve_local_path(getattr(db, "DB_FILE", "VoltKraf.db"))
    db_info = safe_file_info(db_file)
    wal_info = safe_file_info(f"{db_file}-wal")
    shm_info = safe_file_info(f"{db_file}-shm")
    return {
        "database": db_info,
        "wal": wal_info,
        "shm": shm_info,
        "records": {
            "gi_devices": count_table_rows("gi_devices"),
            "dc_readings": count_table_rows("dc_readings"),
            "dc_alarm_events": count_table_rows("dc_alarm_events"),
            "pqm_devices": count_table_rows("pqm_devices"),
            "pqm_readings": count_table_rows("pqm_readings"),
            "pqm_disturbance_events": count_table_rows("pqm_disturbance_events"),
            "pqm_itic_events": count_table_rows("pqm_itic_events"),
            "annunciator_events": count_table_rows("annunciator_events"),
            "ar_events": count_table_rows("ar_events"),
            "whatsapp_outbox": count_table_rows("whatsapp_outbox"),
        },
    }

def worker_status(worker_id, label, thread_name, auto_active, is_scanning, last_success_time, interval_seconds, device_count, connected_count=None, failure_count=0):
    running_threads = {
        thread.name
        for thread in threading.enumerate()
        if thread.is_alive()
    }
    thread_alive = thread_name in running_threads
    if is_scanning:
        status = "scanning"
    elif not auto_active:
        status = "paused"
    elif thread_alive:
        status = "running"
    else:
        status = "stopped"
    return {
        "id": worker_id,
        "label": label,
        "thread_name": thread_name,
        "thread_alive": thread_alive,
        "auto_active": bool(auto_active),
        "is_scanning": bool(is_scanning),
        "status": status,
        "last_success_time": last_success_time,
        "interval_seconds": int(interval_seconds or 0),
        "device_count": int(device_count or 0),
        "connected_count": None if connected_count is None else int(connected_count or 0),
        "failure_count": int(failure_count or 0),
    }

def build_worker_health():
    dc_items = app_state.get("last_scan_data") or []
    pqm_items = app_state.get("pqm_devices") or []
    avr_items = app_state.get("avr_devices") or []
    kapasitor_items = app_state.get("kapasitor_devices") or []
    ar_items = app_state.get("ar_devices") or []
    dfr_items = app_state.get("dfr_devices") or []
    annunciator_sources = build_annunciator_sources_status()
    return [
        worker_status(
            "dc",
            "DC Monitoring",
            "dc-polling",
            app_state.get("auto_polling_active"),
            app_state.get("is_scanning"),
            app_state.get("last_scan_time"),
            INTERVAL_DETIK,
            len(app_state.get("daftar_gi") or []),
            len([item for item in dc_items if item.get("status") == "online"]),
        ),
        worker_status(
            "annunciator",
            "Annunciator",
            "annunciator-polling",
            app_state.get("annunciator_auto_polling_active"),
            app_locks["annunciator_scan"].locked(),
            max((source.get("last_poll_time") for source in annunciator_sources if source.get("last_poll_time")), default=None),
            ANNUNCIATOR_INTERVAL_DETIK,
            len(annunciator_sources),
            len([source for source in annunciator_sources if source.get("connected")]),
            sum(app_state.get("annunciator_failure_counts", {}).values()),
        ),
        worker_status(
            "pqm",
            "PQM",
            "pqm-polling",
            True,
            app_state.get("pqm_is_scanning"),
            app_state.get("pqm_last_scan_time"),
            PQM_INTERVAL_DETIK,
            len(pqm_items),
            len([item for item in pqm_items if item.get("connected")]),
            sum(app_state.get("pqm_failure_counts", {}).values()),
        ),
        worker_status(
            "avr",
            "AVR",
            "avr-polling",
            app_state.get("avr_auto_polling_active"),
            app_state.get("avr_is_scanning"),
            app_state.get("avr_last_scan_time"),
            AVR_INTERVAL_DETIK,
            len(avr_items),
            len([item for item in avr_items if item.get("connected")]),
            sum(app_state.get("avr_failure_counts", {}).values()),
        ),
        worker_status(
            "kapasitor",
            "Kapasitor",
            "kapasitor-polling",
            app_state.get("kapasitor_auto_polling_active"),
            app_state.get("kapasitor_is_scanning"),
            app_state.get("kapasitor_last_scan_time"),
            KAPASITOR_INTERVAL_DETIK,
            len(kapasitor_items),
            len([item for item in kapasitor_items if item.get("connected")]),
            sum(app_state.get("kapasitor_failure_counts", {}).values()),
        ),
        worker_status(
            "ar",
            "AR",
            "ar-polling",
            app_state.get("ar_auto_polling_active"),
            app_state.get("ar_is_scanning"),
            app_state.get("ar_last_scan_time"),
            AR_INTERVAL_DETIK,
            len(ar_items),
            len([item for item in ar_items if item.get("connected")]),
        ),
        worker_status(
            "dfr",
            "DFR",
            "dfr-polling",
            app_state.get("dfr_auto_polling_active"),
            app_state.get("dfr_is_scanning"),
            app_state.get("dfr_last_scan_time"),
            DFR_INTERVAL_DETIK,
            len(dfr_items),
            len([item for item in dfr_items if item.get("connected")]),
        ),
    ]

def build_integration_health():
    whatsapp_state = db.get_setting(WHATSAPP_CONNECTION_STATE_KEY, "unknown")
    return {
        "whatsapp": {
            "configured": is_whatsapp_configured(),
            "gateway_mode": whatsapp_gateway_mode(),
            "connection_state": whatsapp_state,
            "target": mask_identifier(WAHA_CHAT_ID if is_whatsapp_waha_gateway() else WHATSAPP_GROUP_NUMBER),
            "base_url": WAHA_BASE_URL if is_whatsapp_waha_gateway() else WHATSAPP_ENDPOINT_URL,
            "outbox_pending": db.count_pending_whatsapp_messages(),
        },
        "telegram": {
            "configured": is_telegram_configured(),
            "target": mask_identifier(TELEGRAM_CHAT_ID),
            "api_base_url": TELEGRAM_API_BASE_URL,
        },
        "supabase": {
            "configured": is_supabase_configured(),
            "edge_configured": is_supabase_edge_configured(),
            "url": SUPABASE_URL,
            "table": SUPABASE_NOTIFICATIONS_TABLE,
        },
    }

def build_server_health_payload():
    start_background_threads()
    uptime_seconds = max(0, int(time.time() - APP_STARTED_AT))
    workers = build_worker_health()
    stopped_workers = [
        worker
        for worker in workers
        if worker["status"] == "stopped"
    ]
    return {
        "generated_at": datetime.now(WIB_TZ).strftime("%Y-%m-%d %H:%M:%S"),
        "application": {
            "service": APP_BRAND_NAME,
            "status": "warning" if stopped_workers else "ok",
            "uptime_seconds": uptime_seconds,
            "started_at": APP_STARTED_AT_TEXT,
            "base_dir": BASE_DIR,
        },
        "resources": get_system_resource_metrics(),
        "storage": build_storage_health(),
        "workers": workers,
        "integrations": build_integration_health(),
    }

def build_server_test_message(channel):
    return (
        f"[{APP_BRAND_NAME} Server Health]\n"
        f"Test notifikasi {str(channel or 'all').upper()} berhasil dipicu dari dashboard.\n"
        f"Waktu server: {datetime.now(WIB_TZ).strftime('%Y-%m-%d %H:%M:%S')}"
    )

@app.post("/api/auth/login")
def login(auth: LoginData, response: Response, request: Request):
    username = auth.username.strip()
    password = auth.password
    rate_key = check_login_rate_limit(request, username)
    valid_username = secrets.compare_digest(username, ADMIN_CREDENTIALS["username"])
    valid_password = verify_admin_password(password, ADMIN_CREDENTIALS)

    if not (valid_username and valid_password):
        record_login_failure(rate_key)
        raise HTTPException(status_code=401, detail="Username atau password salah.")

    clear_login_failures(rate_key)
    session_token, _expires_at = register_session(username)
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=session_token,
        max_age=SESSION_TTL_SECONDS,
        httponly=True,
        samesite="lax",
        secure=env_bool_any(("VoltKraf_SECURE_COOKIE", "VOLTCRAFT_SECURE_COOKIE"), False),
    )
    return {"authenticated": True, "username": username}

@app.get("/api/auth/session")
def get_auth_session(session_token: str = Cookie(default="", alias=SESSION_COOKIE_NAME)):
    return {"authenticated": is_session_valid(session_token)}

@app.post("/api/auth/logout")
def logout(response: Response, request: Request, session_token: str = Cookie(default="", alias=SESSION_COOKIE_NAME)):
    verify_csrf_request(request)
    revoke_session(session_token)
    response.delete_cookie(key=SESSION_COOKIE_NAME)
    return {"authenticated": False}

@app.get("/api/health")
def get_health():
    return {"status": "ok", "service": APP_BRAND_NAME}


class DCRegisterData(BaseModel):
    ip_gi: str
    nama_gi: str
    channel: int
    sinyal: str
    register_address: int

class DCRegisterConfig(BaseModel):
    ip_gi: str
    nama_gi: str
    channels: list
    custom_regs: dict = None

@app.get("/api/dc/registers")
def get_dc_registers():
    return db.get_dc_registers()

@app.post("/api/dc/registers/add")
def add_dc_register(data: DCRegisterConfig):
    db.add_gi_device(data.nama_gi, data.ip_gi)
    defaults = data.custom_regs or {
        "1": {"V_PN": 0, "Arus": 6, "V_PG": 12, "V_NG": 14},
        "2": {"V_PN": 20, "Arus": 26, "V_PG": 32, "V_NG": 34}
    }
    for ch_str in map(str, data.channels):
        if ch_str in defaults:
            for sinyal, addr in defaults[ch_str].items():
                db.add_dc_register(data.ip_gi, data.nama_gi, int(ch_str), sinyal, addr)
                
    app_state["daftar_gi"] = db.get_gi_devices()
    
    # Inject placeholder agar langsung muncul di UI Monitoring
    waktu_sekarang = time.strftime('%Y-%m-%d %H:%M:%S')
    for ch_val in data.channels:
        ch = int(ch_val)
        suffix = f" - CH {ch}" if ch > 1 else ""
        item_nama = f"{data.nama_gi}{suffix}"
        
        exists = any(item.get("nama") == item_nama for item in app_state["last_scan_data"])
        if not exists:
            app_state["last_scan_data"].append({
                "waktu": waktu_sekarang,
                "nama": item_nama,
                "ip": data.ip_gi,
                "v_pn": 0.0,
                "arus": 0.0,
                "v_pg": 0.0,
                "v_ng": 0.0,
                "status": "menunggu",
                "alarm_level": "normal"
            })
            
    return {"status": "success", "message": "Peralatan berhasil ditambahkan"}

class DCDynamicEdit(BaseModel):
    id: int
    register_address: int

@app.post("/api/dc/registers/edit")
def edit_dc_register(data: DCDynamicEdit):
    db.update_dc_register(data.id, data.register_address)
    return {"status": "success", "message": "Register berhasil diubah"}

@app.delete("/api/dc/registers/{ip}")
def delete_dc_registers(ip: str):
    db.delete_dc_registers_by_ip(ip)
    return {"status": "success"}

@app.get("/api/status", dependencies=[Depends(require_admin_session)])
def get_status():
    return {
        "auto_polling_active": app_state["auto_polling_active"],
        "last_scan_time": app_state["last_scan_time"],
        "is_scanning": app_state["is_scanning"],
        "data": app_state["last_scan_data"],
        "interval_seconds": INTERVAL_DETIK,
        "modbus_timeout_seconds": DC_MODBUS_TIMEOUT_DETIK,
        "modbus_retry_count": DC_MODBUS_RETRY_COUNT,
        "modbus_slave_id": DC_MODBUS_SLAVE_ID,
        "dc_poll_workers": DC_POLL_WORKERS,
        "last_scan_duration_seconds": app_state["last_scan_duration_seconds"],
        "whatsapp_outbox_pending_count": db.count_pending_whatsapp_messages(),
    }

@app.get("/api/server/health", dependencies=[Depends(require_admin_session)])
def get_server_health():
    return build_server_health_payload()

@app.get("/api/dfr", dependencies=[Depends(require_admin_session)])
def get_dfr_status():
    return build_dfr_payload()

@app.post("/api/dfr/refresh", dependencies=[Depends(require_admin_session)])
def refresh_dfr_status():
    poll_dfr_once()
    return build_dfr_payload()

class DfrCleanRequest(BaseModel):
    device_id: str
    ip: str
    username: str
    password: str

def run_dfr_clean_task(task_id: str, req: DfrCleanRequest):
    tasks = app_state["dfr_clean_tasks"]
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        tasks[task_id]["status"] = f"Menghubungkan SSH ke {req.ip}..."
        ssh.connect(req.ip, username=req.username, password=req.password, timeout=15)
        
        folders_to_clean = ["logs", "pq", "ddrt", "dfr", "css"]
        for folder in folders_to_clean:
            tasks[task_id]["status"] = f"Sedang membersihkan /home/{folder}..."
            _, stdout, stderr = ssh.exec_command(f"rm -rf /home/{folder}/*")
            # Wait for command to finish
            stdout.channel.recv_exit_status()
            
        tasks[task_id]["status"] = "Sedang proses rebooting..."
        ssh.exec_command("reboot")
        
        ssh.close()
        tasks[task_id]["status"] = "Selesai (Rebooting)."
        tasks[task_id]["done"] = True
    except Exception as e:
        tasks[task_id]["status"] = f"Error: {str(e)}"
        tasks[task_id]["error"] = True
        tasks[task_id]["done"] = True

@app.post("/api/dfr/clean", dependencies=[Depends(require_admin_session)])
def start_dfr_clean(req: DfrCleanRequest, background_tasks: BackgroundTasks):
    task_id = str(uuid.uuid4())
    if "dfr_clean_tasks" not in app_state:
        app_state["dfr_clean_tasks"] = {}
    
    app_state["dfr_clean_tasks"][task_id] = {
        "status": "Memulai...",
        "done": False,
        "error": False
    }
    background_tasks.add_task(run_dfr_clean_task, task_id, req)
    return {"task_id": task_id}

@app.get("/api/dfr/clean/status/{task_id}", dependencies=[Depends(require_admin_session)])
def get_dfr_clean_status(task_id: str):
    tasks = app_state.get("dfr_clean_tasks", {})
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    return tasks[task_id]

@app.post("/api/server/test-notification", dependencies=[Depends(require_admin_session)])
def test_server_notification(data: ServerNotificationTestData):
    channel = str(data.channel or "all").strip().lower()
    allowed_channels = {"all", "whatsapp", "telegram", "supabase"}
    if channel not in allowed_channels:
        raise HTTPException(status_code=400, detail="Channel test notifikasi tidak dikenal.")

    results = {}
    message = build_server_test_message(channel)
    if channel in {"all", "whatsapp"}:
        results["whatsapp"] = send_whatsapp_notification(
            message,
            allow_recovery_recap=False,
            enqueue_on_failure=False,
            respect_duplicate=False,
            fanout_secondary=False,
        )
    if channel in {"all", "telegram"}:
        results["telegram"] = send_telegram_notification(message)
    if channel in {"all", "supabase"}:
        supabase_results = {}
        if is_supabase_edge_configured():
            supabase_results["edge"] = send_supabase_edge_notification_text(
                message,
                source="server-health",
                sender="dashboard",
            )
        if is_supabase_configured():
            supabase_results["table"] = send_supabase_notification_event(
                build_supabase_notification_payload(
                    message,
                    channel="server-health",
                    title=f"{APP_BRAND_NAME} Server Health",
                    subtitle="Test notifikasi dashboard",
                    module="server",
                    status="test",
                    payload={"triggered_at": datetime.now(WIB_TZ).strftime("%Y-%m-%d %H:%M:%S")},
                )
            )
        results["supabase"] = supabase_results or False

    return {
        "message": "Test notifikasi selesai diproses.",
        "channel": channel,
        "results": results,
        "health": build_server_health_payload(),
    }

@app.get("/api/alarms", dependencies=[Depends(require_admin_session)])
def get_alarms():
    # Mengembalikan daftar alarm terbalik (paling baru di atas)
    app_state["alarm_history"] = db.list_dc_alarm_events()
    return app_state["alarm_history"]

@app.get("/api/annunciator", dependencies=[Depends(require_admin_session)])
def get_annunciator_status():
    sources = build_annunciator_sources_status()
    return {
        **app_state["annunciator"],
        "history": db.list_annunciator_events(),
        "sources": sources,
        "devices": app_state["annunciators"],
        "default_source_id": DEFAULT_ANNUNCIATOR_SOURCE_ID,
        "poll_interval_seconds": ANNUNCIATOR_INTERVAL_DETIK,
        "timeout_seconds": ANNUNCIATOR_TIMEOUT_DETIK,
        "retry_count": ANNUNCIATOR_RETRY_COUNT,
        "failure_threshold": ANNUNCIATOR_FAIL_THRESHOLD,
        "change_confirm_polls": ANNUNCIATOR_CHANGE_CONFIRM_POLLS,
        "auto_polling_active": app_state["annunciator_auto_polling_active"],
    }

@app.post("/api/annunciator/refresh", dependencies=[Depends(require_admin_session)])
def refresh_annunciator_status():
    data = poll_annunciator_once()
    sources = build_annunciator_sources_status()
    return {
        **data,
        "history": db.list_annunciator_events(),
        "sources": sources,
        "devices": app_state["annunciators"],
        "default_source_id": DEFAULT_ANNUNCIATOR_SOURCE_ID,
        "poll_interval_seconds": ANNUNCIATOR_INTERVAL_DETIK,
        "timeout_seconds": ANNUNCIATOR_TIMEOUT_DETIK,
        "retry_count": ANNUNCIATOR_RETRY_COUNT,
        "failure_threshold": ANNUNCIATOR_FAIL_THRESHOLD,
        "auto_polling_active": app_state["annunciator_auto_polling_active"],
    }

@app.get("/api/integrations/pandu-gi/alarm-center")
def get_pandu_gi_alarm_center(
    source_id: str = "",
    history_limit: int = 100,
    _authorized: bool = Depends(require_pandu_gi_api_key),
):
    source_id = source_id.strip()
    source_ids = {source["id"] for source in ANNUNCIATOR_SOURCES}
    if source_id and source_id not in source_ids:
        raise HTTPException(status_code=404, detail="Source announciator tidak ditemukan.")

    history_limit = max(1, min(history_limit, 500))
    sources = build_annunciator_sources_status()
    selected_sources = [
        source for source in sources
        if not source_id or source["id"] == source_id
    ]
    selected_source_ids = {source["id"] for source in selected_sources}
    active_alarms = []

    for source in selected_sources:
        state = app_state["annunciators"][source["id"]]
        for alarm in state["active_alarms"]:
            active_alarms.append(
                {
                    "source_id": source["id"],
                    "source_name": source["source_name"],
                    "bay_name": source["bay_name"],
                    "ip": source["ip"],
                    "port": alarm["port"],
                    "nama_alat": alarm["nama_alat"],
                    "kondisi": alarm.get("kondisi", ""),
                    "flag": alarm.get("flag", ""),
                    "flag_kondisi": alarm.get("flag_kondisi", ""),
                    "is_active": bool(alarm.get("is_active")),
                    "last_poll_time": state["last_poll_time"],
                }
            )

    history_query_limit = 1000 if source_id else history_limit
    history = [
        event for event in db.list_annunciator_events(limit=history_query_limit)
        if not selected_source_ids or event.get("source_id") in selected_source_ids
    ][:history_limit]

    return {
        "service": APP_BRAND_NAME,
        "integration": "PANDU-GI",
        "menu": "Alarm Center",
        "generated_at": format_wib(wib_now()),
        "summary": {
            "source_count": len(selected_sources),
            "connected_count": len([source for source in selected_sources if source["connected"]]),
            "active_alarm_count": len(active_alarms),
            "history_count": len(history),
            "auto_polling_active": app_state["annunciator_auto_polling_active"],
            "poll_interval_seconds": ANNUNCIATOR_INTERVAL_DETIK,
        },
        "sources": selected_sources,
        "active_alarms": active_alarms,
        "history": history,
    }

@app.post("/api/annunciator/start", dependencies=[Depends(require_admin_session)])
def start_annunciator_polling():
    app_state["annunciator_auto_polling_active"] = True
    db.set_setting("annunciator_auto_polling_active", "1")
    return {
        "message": "Auto-polling announciator started",
        "auto_polling_active": app_state["annunciator_auto_polling_active"],
        "poll_interval_seconds": ANNUNCIATOR_INTERVAL_DETIK,
        "timeout_seconds": ANNUNCIATOR_TIMEOUT_DETIK,
        "retry_count": ANNUNCIATOR_RETRY_COUNT,
        "failure_threshold": ANNUNCIATOR_FAIL_THRESHOLD,
    }

@app.post("/api/annunciator/stop", dependencies=[Depends(require_admin_session)])
def stop_annunciator_polling():
    app_state["annunciator_auto_polling_active"] = False
    db.set_setting("annunciator_auto_polling_active", "0")
    return {
        "message": "Auto-polling announciator stopped",
        "auto_polling_active": app_state["annunciator_auto_polling_active"],
        "poll_interval_seconds": ANNUNCIATOR_INTERVAL_DETIK,
        "timeout_seconds": ANNUNCIATOR_TIMEOUT_DETIK,
        "retry_count": ANNUNCIATOR_RETRY_COUNT,
        "failure_threshold": ANNUNCIATOR_FAIL_THRESHOLD,
    }

@app.delete("/api/annunciator/events/{event_id}", dependencies=[Depends(require_admin_session)])
def delete_annunciator_event(event_id: str):
    if db.delete_annunciator_event(event_id):
        app_state["annunciator_history"] = db.list_annunciator_events()
        return {"message": "Announciator event deleted successfully"}

    raise HTTPException(status_code=404, detail="Announciator event not found")

@app.get("/api/trend/{nama_gi}", dependencies=[Depends(require_admin_session)])
def get_trend(nama_gi: str):
    return db.get_dc_trend(nama_gi, limit=DC_TREND_MAX_POINTS)

@app.get("/api/dc/export.csv", dependencies=[Depends(require_admin_session)])
def export_dc_readings_csv(
    nama: str = Query(default="", description="Filter nama GI DC, kosongkan untuk semua GI."),
    limit: int = Query(default=10000, ge=1, le=100000),
):
    rows = db.list_dc_readings_for_export(nama.strip() or None, limit=limit)
    output = io.StringIO()
    writer = csv.DictWriter(
        output,
        fieldnames=[
            "id",
            "waktu",
            "nama",
            "ip",
            "v_pn",
            "arus",
            "v_pg",
            "v_ng",
            "status",
            "alarm_level",
        ],
        extrasaction="ignore",
    )
    writer.writeheader()
    writer.writerows(rows)

    suffix = slugify_token(nama, "semua-gi") if nama.strip() else "semua-gi"
    filename = f"dc-monitoring-{suffix}-{time.strftime('%Y%m%d-%H%M%S')}.csv"
    return Response(
        content=output.getvalue(),
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )

@app.delete("/api/alarms/{log_id}", dependencies=[Depends(require_admin_session)])
def delete_alarm(log_id: str):
    if log_id == "all":
        db.delete_all_dc_alarm_events()
        app_state["alarm_history"] = db.list_dc_alarm_events()
        return {"message": "All alarm logs deleted successfully"}
        
    if db.delete_dc_alarm_event(log_id):
        app_state["alarm_history"] = db.list_dc_alarm_events()
        return {"message": "Alarm log deleted successfully"}
    raise HTTPException(status_code=404, detail="Log not found")

@app.post("/api/start", dependencies=[Depends(require_admin_session)])
def start_polling():
    if not app_state["auto_polling_active"]:
        app_state["auto_polling_active"] = True
        db.set_setting("dc_auto_polling_active", "1")
        return {"message": "Auto-polling started"}
    return {"message": "Auto-polling is already active"}

@app.post("/api/stop", dependencies=[Depends(require_admin_session)])
def stop_polling():
    if app_state["auto_polling_active"]:
        app_state["auto_polling_active"] = False
        db.set_setting("dc_auto_polling_active", "0")
    return {"message": "Auto-polling dihentikan"}

class GIData(BaseModel):
    nama: str
    ip: str

class PQMData(BaseModel):
    nama_gi: str
    nama_bay: str
    ip: str
    pqm_type: str = PQM_TYPE_ION7650

class PQMToggleData(BaseModel):
    enabled: bool

class PQMIticXmlImportData(BaseModel):
    xml_path: str
    device_id: str = ""
    persist: bool = True

class AVRPointData(BaseModel):
    group: str = "measurement_points"
    key: str = ""
    label: str = ""
    reference: str
    fc: str = ""
    cdc: str = ""
    unit: str = ""
    value_type: str = ""
    scale_multiplier: Any = None
    scale_divisor: Any = None
    normal_value: Any = None
    severity: str = "warning"
    whatsapp: bool = True

class AVRDeviceData(BaseModel):
    nama_gi: str
    nama_bay: str
    ip: str
    port: int = 102
    ied_name: str = ""
    access_point: str = "P1"
    logical_device: str = ""
    vendor: str = ""
    model: str = ""
    software_revision: str = ""
    config_revision: str = ""
    source_file: str = "Manual Dashboard Mapping"
    points: List[AVRPointData] = Field(default_factory=list)

class AVRMmsBrowserRequest(BaseModel):
    device_id: str = ""
    nama_gi: str = ""
    nama_bay: str = ""
    ip: str = ""
    port: int = 102
    ied_name: str = ""
    access_point: str = "P1"
    logical_device: str = ""
    vendor: str = ""
    model: str = ""
    source_file: str = ""
    refresh: bool = False

def get_pqm_device_or_404(device_id):
    device = next((item for item in db.get_pqm_devices() if item["id"] == device_id), None)
    if not device:
        raise HTTPException(status_code=404, detail="PQM tidak ditemukan.")
    return device

def resolve_ion_xml_path(xml_path):
    if not str(xml_path or "").strip():
        raise HTTPException(status_code=400, detail="Path file XML wajib diisi.")

    try:
        path = Path(str(xml_path).strip()).expanduser().resolve()
    except OSError:
        raise HTTPException(status_code=400, detail="Path file XML tidak valid.")

    if path.suffix.lower() != ".xml":
        raise HTTPException(status_code=400, detail="File import harus berformat .xml.")
    if not path.exists() or not path.is_file():
        raise HTTPException(status_code=404, detail="File XML tidak ditemukan.")
    if path.stat().st_size > PQM_ION_XML_MAX_BYTES:
        raise HTTPException(status_code=400, detail="File XML terlalu besar untuk diimport.")
    return path

def build_pqm_itic_import_row(device, event):
    return {
        "device_id": device["id"],
        "waktu_mulai": format_db_wib_datetime(event.get("waktu_mulai_utc") or event.get("record_timestamp_utc")),
        "waktu_selesai": format_db_wib_datetime(event.get("waktu_selesai_utc") or event.get("record_timestamp_utc")),
        "nama_gi": device["nama_gi"],
        "nama_bay": device["nama_bay"],
        "ip": device["ip"],
        "event_type": event.get("event_type") or "Unknown",
        "phase": event.get("phase") or "-",
        "duration_seconds": round(float(event.get("duration_seconds") or 0.0), 3),
        "magnitude_percent": round(float(event.get("magnitude_percent") or 0.0), 2),
    }

def import_pqm_itic_events_from_ion_xml(device, xml_bytes, persist=True):
    parsed = pqm_ion_xml.extract_ion7650_itic_events(
        xml_bytes,
        nominal_voltage=get_pqm_nominal_ln_voltage(device),
        nominal_frequency=50.0,
        undervoltage_ratio=PQM_UNDERVOLTAGE_RATIO,
        overvoltage_ratio=PQM_OVERVOLTAGE_RATIO,
    )

    rows = [
        build_pqm_itic_import_row(device, event)
        for event in parsed.get("events", [])
        if float(event.get("duration_seconds") or 0.0) > 0
    ]

    inserted = 0
    skipped_duplicate = 0
    if persist:
        for row in rows:
            if db.pqm_itic_event_exists(row):
                skipped_duplicate += 1
                continue
            db.insert_pqm_itic_event(row)
            inserted += 1

    return {
        "identity": parsed.get("identity", {}),
        "waveform_summary": parsed.get("waveform_summary", []),
        "event_count": len(rows),
        "inserted": inserted,
        "skipped_duplicate": skipped_duplicate,
        "persisted": bool(persist),
        "events": rows[:200],
    }

def get_pqm_payload():
    devices = [build_empty_pqm_state(device) for device in db.get_pqm_devices_with_latest_reading()]
    app_state["pqm_devices"] = devices
    return {
        "devices": devices,
        "disturbance_events": db.list_pqm_disturbance_events(limit=200),
        "itic_events": db.list_pqm_itic_events(limit=200),
        "disturbance_counter_catalog": PQM_DISTURBANCE_COUNTERS,
        "disturbance_counter_catalog_by_type": {
            PQM_TYPE_ION7650: PQM_DISTURBANCE_COUNTERS,
            PQM_TYPE_ION9000: PQM_ION9000_DISTURBANCE_COUNTERS,
        },
        "last_scan_time": app_state["pqm_last_scan_time"],
        "is_scanning": app_state["pqm_is_scanning"],
        "poll_interval_seconds": PQM_INTERVAL_DETIK,
        "voltage_alarm_confirm_polls": PQM_VOLTAGE_ALARM_CONFIRM_POLLS,
        "disturbance_confirm_polls": PQM_DISTURBANCE_CONFIRM_POLLS,
        "default_device_id": devices[0]["id"] if devices else "",
    }

def pqm_trend_number(row, raw_payload, key, default=0.0):
    value = raw_payload.get(key, row.get(key, default))
    if value is None:
        return None
    try:
        return float(value)
    except (TypeError, ValueError):
        return default

def format_pqm_chart_time(value):
    text = str(value or "")
    try:
        return parse_wib_datetime(text).strftime("%H:%M:%S")
    except Exception:
        return text[11:19] if len(text) >= 19 else text

def build_pqm_trend_payload(device_id, limit=180):
    device = next((item for item in db.get_pqm_devices() if item["id"] == device_id), None)
    if not device:
        raise HTTPException(status_code=404, detail="PQM tidak ditemukan.")

    safe_limit = max(20, min(int(limit or 180), 1000))
    readings = []
    for row in db.list_pqm_readings(device_id, limit=safe_limit):
        raw_payload = safe_json_dict(row.get("raw_json"))
        v_thd_values = [
            pqm_trend_number(row, raw_payload, key, None)
            for key in ("v1_thd_max", "v2_thd_max", "v3_thd_max")
        ]
        i_thd_values = [
            pqm_trend_number(row, raw_payload, key, None)
            for key in ("i1_thd_max", "i2_thd_max", "i3_thd_max")
        ]
        readings.append({
            "waktu": row.get("waktu", ""),
            "time_label": format_pqm_chart_time(row.get("waktu")),
            "connected": bool(row.get("connected")),
            "freq": pqm_trend_number(row, raw_payload, "freq"),
            "v_ll_avg": pqm_trend_number(row, raw_payload, "v_ll_avg"),
            "v_ln_avg": pqm_trend_number(row, raw_payload, "v_ln_avg"),
            "v_unbal": pqm_trend_number(row, raw_payload, "v_unbal"),
            "i_unbal": pqm_trend_number(row, raw_payload, "i_unbal"),
            "current_avg": pqm_trend_number(row, raw_payload, "current_avg"),
            "kw_total": pqm_trend_number(row, raw_payload, "kw_total"),
            "v_thd_max": max([value for value in v_thd_values if value is not None], default=None),
            "i_thd_max": max([value for value in i_thd_values if value is not None], default=None),
        })

    return {
        "device": build_empty_pqm_state({
            **device,
            "last_poll_time": "",
            "connected": 0,
            "status_message": "",
            "raw_json": "",
        }),
        "readings": readings,
    }

@app.get("/api/pqm", dependencies=[Depends(require_admin_session)])
def get_pqm_status():
    return get_pqm_payload()

@app.get("/api/pqm/{device_id}/trend", dependencies=[Depends(require_admin_session)])
def get_pqm_trend(device_id: str, limit: int = Query(default=180, ge=20, le=1000)):
    return build_pqm_trend_payload(device_id, limit)

@app.post("/api/pqm/refresh", dependencies=[Depends(require_admin_session)])
def refresh_pqm_status():
    poll_pqm_once()
    return get_pqm_payload()

@app.post("/api/pqm/itic/import-ion-xml", dependencies=[Depends(require_admin_session)])
def import_pqm_itic_ion_xml(data: PQMIticXmlImportData):
    device_id = str(data.device_id or "").strip()
    if not device_id:
        raise HTTPException(status_code=400, detail="device_id PQM wajib diisi agar event ITIC masuk ke peralatan yang benar.")

    device = get_pqm_device_or_404(device_id)
    if normalize_pqm_type(device.get("pqm_type")) != PQM_TYPE_ION7650:
        raise HTTPException(status_code=400, detail="Import XML ION Setup saat ini hanya untuk PQM ION7650.")

    xml_path = resolve_ion_xml_path(data.xml_path)
    try:
        result = import_pqm_itic_events_from_ion_xml(
            device,
            xml_path.read_bytes(),
            persist=bool(data.persist),
        )
    except ET.ParseError:
        raise HTTPException(status_code=400, detail="File XML tidak bisa dibaca. Pastikan export berasal dari ION Setup.")
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))

    return {
        "message": "Import ITIC dari XML selesai.",
        "device": {
            "id": device["id"],
            "nama_gi": device["nama_gi"],
            "nama_bay": device["nama_bay"],
            "ip": device["ip"],
        },
        "source_file": str(xml_path),
        **result,
        **get_pqm_payload(),
    }

@app.post("/api/pqm", dependencies=[Depends(require_admin_session)])
def add_pqm_device(pqm: PQMData):
    nama_gi = pqm.nama_gi.strip()
    nama_bay = pqm.nama_bay.strip()
    pqm_type = normalize_pqm_type(pqm.pqm_type)
    ip = normalize_pqm_device_address(pqm.ip, pqm_type)

    if not nama_gi or not nama_bay or not ip:
        raise HTTPException(status_code=400, detail="Nama GI, nama bay, dan IP/URL wajib diisi.")

    pqm_port = 443 if pqm_type == PQM_TYPE_ION9000 else 502
    ensure_device_endpoint_allowed(ip, pqm_port, "PQM")

    for item in db.get_pqm_devices():
        existing_type = normalize_pqm_type(item.get("pqm_type"))
        existing_ip = normalize_pqm_device_address(item.get("ip"), existing_type)
        if existing_ip == ip:
            raise HTTPException(status_code=400, detail="PQM dengan IP/URL ini sudah ada.")
        if item["nama_gi"].lower() == nama_gi.lower() and item["nama_bay"].lower() == nama_bay.lower():
            raise HTTPException(status_code=400, detail="PQM dengan nama GI dan bay ini sudah ada.")

    db.add_pqm_device(
        str(uuid.uuid4()),
        nama_gi,
        nama_bay,
        ip,
        pqm_type=pqm_type,
        port=pqm_port,
        start_address=0 if pqm_type == PQM_TYPE_ION9000 else 147,
        count=PQM_MAIN_REGISTER_COUNT,
    )
    return {"message": "PQM berhasil ditambahkan", **get_pqm_payload()}

@app.delete("/api/pqm/{device_id}", dependencies=[Depends(require_admin_session)])
def delete_pqm_device(device_id: str):
    if db.delete_pqm_device(device_id):
        return {"message": "PQM berhasil dihapus", **get_pqm_payload()}

    raise HTTPException(status_code=404, detail="PQM tidak ditemukan.")

@app.patch("/api/pqm/{device_id}/toggle", dependencies=[Depends(require_admin_session)])
def toggle_pqm_device(device_id: str, data: PQMToggleData):
    if not db.toggle_pqm_device(device_id, data.enabled):
        raise HTTPException(status_code=404, detail="PQM tidak ditemukan.")
    poll_pqm_once()
    return get_pqm_payload()

def get_avr_payload():
    if app_state.get("avr_auto_polling_active"):
        ensure_background_thread("avr-polling")
    configured_devices = get_avr_devices()
    configured_ids = [device["id"] for device in configured_devices]
    current_ids = [device.get("id") for device in app_state.get("avr_devices", [])]
    if configured_ids != current_ids and not app_state["avr_is_scanning"]:
        reset_avr_state_from_config()

    return {
        "devices": app_state["avr_devices"],
        "last_scan_time": app_state["avr_last_scan_time"],
        "is_scanning": app_state["avr_is_scanning"],
        "auto_polling_active": app_state["avr_auto_polling_active"],
        "poll_interval_seconds": AVR_INTERVAL_DETIK,
        "timeout_seconds": AVR_TIMEOUT_DETIK,
        "mms_request_timeout_seconds": AVR_MMS_REQUEST_TIMEOUT_DETIK,
        "failure_threshold": AVR_FAIL_THRESHOLD,
        "notification_confirm_polls": AVR_POINT_NOTIFICATION_CONFIRM_POLLS,
        "mms_library_available": IEC61850_AVAILABLE,
        "default_device_id": configured_devices[0]["id"] if configured_devices else "",
        "point_groups": [
            {"value": "measurement_points", "label": "Data Utama", "default_fc": "MX", "default_value_type": "float"},
            {"value": "setting_points", "label": "Setting", "default_fc": "MX", "default_value_type": "float"},
            {"value": "status_points", "label": "Status Operasi", "default_fc": "ST", "default_value_type": "bool"},
            {"value": "alarm_points", "label": "Alarm AVR", "default_fc": "ST", "default_value_type": "bool"},
            {"value": "led_points", "label": "LED Indikasi", "default_fc": "ST", "default_value_type": "bool"},
        ],
    }

@app.get("/api/avr", dependencies=[Depends(require_admin_session)])
def get_avr_status():
    return get_avr_payload()

@app.post("/api/avr/refresh", dependencies=[Depends(require_admin_session)])
def refresh_avr_status():
    poll_avr_once()
    return get_avr_payload()

@app.post("/api/avr/mms-browser", dependencies=[Depends(require_admin_session)])
def get_avr_mms_browser(request: AVRMmsBrowserRequest):
    device = build_avr_browser_device(request.dict())
    ensure_device_endpoint_allowed(device.get("ip", ""), int(device.get("port") or 102), "AVR")
    try:
        return asyncio.run(browse_avr_mms_structure(device, refresh=request.refresh))
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=502, detail=client_error_message("Browse MMS AVR", exc))

@app.post("/api/avr", dependencies=[Depends(require_admin_session)])
def add_avr_device(avr_device: AVRDeviceData):
    payload = avr_device.dict()
    candidate = build_manual_avr_device_from_payload(payload)
    manual_devices = get_manual_avr_devices()
    ensure_unique_avr_device(candidate, get_avr_devices())
    manual_devices.append(candidate)
    save_manual_avr_devices(manual_devices)
    reset_avr_state_from_config()
    return {"message": "AVR berhasil ditambahkan", **get_avr_payload()}

@app.put("/api/avr/{device_id}", dependencies=[Depends(require_admin_session)])
def update_avr_device(device_id: str, avr_device: AVRDeviceData):
    manual_devices = get_manual_avr_devices()
    existing_index = next((index for index, item in enumerate(manual_devices) if item.get("id") == device_id), None)
    if existing_index is None and not configured_avr_device_exists(device_id):
        raise HTTPException(status_code=404, detail="AVR tidak ditemukan.")

    candidate = build_manual_avr_device_from_payload(avr_device.dict(), device_id=device_id)
    ensure_unique_avr_device(candidate, get_avr_devices(), editing_id=device_id)
    if existing_index is None:
        manual_devices.append(candidate)
    else:
        manual_devices[existing_index] = candidate
    save_manual_avr_devices(manual_devices)
    reset_avr_state_from_config()
    return {"message": "AVR berhasil diperbarui. Mapping akan dibaca otomatis pada polling berikutnya.", **get_avr_payload()}

@app.delete("/api/avr/{device_id}", dependencies=[Depends(require_admin_session)])
def delete_avr_device(device_id: str):
    manual_devices = get_manual_avr_devices()
    remaining_devices = [item for item in manual_devices if item.get("id") != device_id]
    if len(remaining_devices) == len(manual_devices):
        raise HTTPException(status_code=404, detail="AVR manual tidak ditemukan atau tidak bisa dihapus.")

    save_manual_avr_devices(remaining_devices)
    reset_avr_state_from_config()
    return {"message": "Mapping AVR manual berhasil dihapus", **get_avr_payload()}

@app.post("/api/avr/start", dependencies=[Depends(require_admin_session)])
def start_avr_polling():
    app_state["avr_auto_polling_active"] = True
    db.set_setting("avr_auto_polling_active", "1")
    ensure_background_thread("avr-polling")
    return get_avr_payload()

@app.post("/api/avr/stop", dependencies=[Depends(require_admin_session)])
def stop_avr_polling():
    app_state["avr_auto_polling_active"] = False
    db.set_setting("avr_auto_polling_active", "0")
    return get_avr_payload()

@app.get("/api/kapasitor", dependencies=[Depends(require_admin_session)])
def get_kapasitor_status():
    return get_kapasitor_payload()

@app.post("/api/kapasitor/refresh", dependencies=[Depends(require_admin_session)])
def refresh_kapasitor_status():
    poll_kapasitor_once()
    return get_kapasitor_payload()

@app.post("/api/kapasitor/start", dependencies=[Depends(require_admin_session)])
def start_kapasitor_polling():
    app_state["kapasitor_auto_polling_active"] = True
    db.set_setting("kapasitor_auto_polling_active", "1")
    return get_kapasitor_payload()

@app.post("/api/kapasitor/stop", dependencies=[Depends(require_admin_session)])
def stop_kapasitor_polling():
    app_state["kapasitor_auto_polling_active"] = False
    db.set_setting("kapasitor_auto_polling_active", "0")
    return get_kapasitor_payload()


# === AR API ROUTES ===
@app.get("/api/ar", dependencies=[Depends(require_admin_session)])
def get_ar_status():
    return get_ar_payload()

@app.post("/api/ar/refresh", dependencies=[Depends(require_admin_session)])
def force_refresh_ar():
    states = poll_ar_once()
    return {"message": "AR diperbarui", "devices": states}

@app.put("/api/ar/auto-polling", dependencies=[Depends(require_admin_session)])
def toggle_ar_auto_polling(active: bool = Body(..., embed=True)):
    app_state["ar_auto_polling_active"] = active
    db.set_setting("ar_auto_polling_active", "1" if active else "0")
    return {"message": f"Auto-polling AR {'diaktifkan' if active else 'dimatikan'}", "active": active}

class ARDeviceData(BaseModel):
    nama_gi: str
    nama_bay: str
    ip: str
    port: Optional[int] = 102
    ied_name: Optional[str] = "MANUAL"
    logical_device: Optional[str] = ""
    vendor: Optional[str] = ""
    model: Optional[str] = ""
    software_revision: Optional[str] = ""
    config_revision: Optional[str] = ""
    source_file: Optional[str] = ""
    access_point: Optional[str] = "P1"
    points: List[Dict[str, Any]]

class ARMmsBrowserRequest(AVRMmsBrowserRequest):
    pass

def build_ar_browser_device(payload):
    base_device = {}
    device_id = str(payload.get("device_id") or "").strip()
    if device_id:
        base_device = next((device for device in get_ar_devices() if device.get("id") == device_id), {}) or {}

    port_value = payload.get("port", base_device.get("port", 102))
    try:
        port = int(port_value or 102)
    except (TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Port AR harus berupa angka.")
    if port < 1 or port > 65535:
        raise HTTPException(status_code=400, detail="Port AR harus berada di rentang 1-65535.")

    device = {
        **base_device,
        "id": device_id or base_device.get("id") or f"ar-browser-{slugify_token(payload.get('ip') or base_device.get('ip'))}",
        "nama_gi": str(payload.get("nama_gi") or base_device.get("nama_gi") or "").strip() or "Manual",
        "nama_bay": str(payload.get("nama_bay") or base_device.get("nama_bay") or "").strip() or "AR",
        "ip": str(payload.get("ip") or base_device.get("ip") or "").strip(),
        "port": port,
        "ied_name": str(payload.get("ied_name") or base_device.get("ied_name") or "").strip(),
        "logical_device": str(payload.get("logical_device") or base_device.get("logical_device") or "").strip(),
        "access_point": str(payload.get("access_point") or base_device.get("access_point") or "P1").strip(),
        "vendor": str(payload.get("vendor") or base_device.get("vendor") or "IEC 61850").strip(),
        "model": str(payload.get("model") or base_device.get("model") or "Auto-Recloser 500kV").strip(),
        "source_file": str(payload.get("source_file") or base_device.get("source_file") or "").strip(),
        "point_group_names": AR_POINT_GROUPS,
    }
    if not device["ip"]:
        raise HTTPException(status_code=400, detail="IP Relay AR wajib diisi sebelum browse MMS.")
    return device

def build_manual_ar_device_from_payload(payload, device_id=None):
    nama_gi = str(payload.get("nama_gi") or "").strip()
    nama_bay = str(payload.get("nama_bay") or "").strip()
    ip = str(payload.get("ip") or "").strip()
    ied_name = str(payload.get("ied_name") or "").strip() or "MANUAL"
    logical_device = str(payload.get("logical_device") or "").strip()
    if not nama_gi or not nama_bay or not ip:
        raise HTTPException(status_code=400, detail="Nama GI, nama bay, dan IP AR wajib diisi.")

    try:
        port = int(payload.get("port") or 102)
    except (TypeError, ValueError):
        raise HTTPException(status_code=400, detail="Port AR harus berupa angka.")
    if port < 1 or port > 65535:
        raise HTTPException(status_code=400, detail="Port AR harus berada di rentang 1-65535.")
    ensure_device_endpoint_allowed(ip, port, "AR")

    raw_points = payload.get("points") or []
    if not isinstance(raw_points, list) or not raw_points:
        raise HTTPException(status_code=400, detail="Minimal satu tag AR wajib dimapping.")

    point_groups = {group_name: [] for group_name in AR_POINT_GROUPS}
    used_keys = {group_name: set() for group_name in AR_POINT_GROUPS}
    
    for index, raw_point in enumerate(raw_points):
        if not isinstance(raw_point, dict):
            continue
            
        group_name = str(raw_point.get("group") or "rrec_points").strip()
        if group_name not in AR_POINT_GROUPS:
            group_name = "rrec_points"
            
        key = str(raw_point.get("key") or f"tag_{index}").strip()
        if key in used_keys[group_name]:
            key = f"{key}_{index}"
        used_keys[group_name].add(key)
        
        point = {
            "key": key,
            "label": str(raw_point.get("label") or key).strip(),
            "reference": normalize_avr_reference(str(raw_point.get("reference") or ""), ied_name, logical_device),
            "fc": str(raw_point.get("fc") or AR_POINT_GROUP_DEFAULTS.get(group_name, {}).get("fc", "ST")).strip().upper(),
            "cdc": str(raw_point.get("cdc") or "").strip().upper(),
            "unit": str(raw_point.get("unit") or "").strip(),
            "value_type": str(raw_point.get("value_type") or AR_POINT_GROUP_DEFAULTS.get(group_name, {}).get("value_type", "bool")).strip().lower(),
            "normal_value": str(raw_point.get("normal_value") or "false").strip(),
            "severity": str(raw_point.get("severity") or "info").strip().lower(),
            "whatsapp": ar_bool_setting(raw_point.get("whatsapp"), False),
            "readiness_required": ar_bool_setting(raw_point.get("readiness_required"), key in AR_READINESS_REQUIRED_KEYS),
        }
        point_groups[group_name].append(point)

    import uuid
    safe_id = device_id or f"manual-ar-{slugify_token(nama_gi)}-{slugify_token(nama_bay)}-{uuid.uuid4().hex[:8]}"
    return {
        "id": safe_id,
        "nama_gi": nama_gi,
        "nama_bay": nama_bay,
        "ip": ip,
        "port": port,
        "ied_name": ied_name,
        "access_point": str(payload.get("access_point") or "").strip() or "P1",
        "logical_device": logical_device,
        "vendor": str(payload.get("vendor") or "").strip() or "Manual",
        "model": str(payload.get("model") or "").strip() or "Custom AR",
        "source_file": str(payload.get("source_file") or "").strip() or "Manual Dashboard Mapping",
        "source": "manual",
        "is_manual": True,
        "point_group_names": AR_POINT_GROUPS,
        **point_groups,
    }

@app.post("/api/ar/mms-browser", dependencies=[Depends(require_admin_session)])
def get_ar_mms_browser(request: ARMmsBrowserRequest):
    device = build_ar_browser_device(request.dict())
    ensure_device_endpoint_allowed(device.get("ip", ""), int(device.get("port") or 102), "AR")
    try:
        return asyncio.run(browse_avr_mms_structure(device, refresh=request.refresh))
    except HTTPException:
        raise
    except Exception as exc:
        live_error = describe_avr_mms_error(exc)
        try:
            scd_payload = browse_avr_mms_structure_from_scd(device, live_error=live_error)
            if scd_payload:
                return scd_payload
        except Exception as scd_exc:
            print(f"[Browse MMS AR] fallback SCD gagal: {scd_exc.__class__.__name__}: {scd_exc}")
        raise HTTPException(status_code=502, detail=client_error_message("Browse MMS AR", exc))

@app.post("/api/ar", dependencies=[Depends(require_admin_session)])
def add_ar_device(ar_device: ARDeviceData):
    payload = ar_device.dict()
    new_device = build_manual_ar_device_from_payload(payload)
    manual_devices = get_manual_ar_devices()
    ensure_unique_ar_device(new_device, get_ar_devices())

    manual_devices.append(new_device)
    save_manual_ar_devices(manual_devices)
    reset_ar_state_from_config()
    return {"message": "AR berhasil ditambahkan", **get_ar_payload()}

@app.put("/api/ar/{device_id}", dependencies=[Depends(require_admin_session)])
def update_ar_device(device_id: str, ar_device: ARDeviceData):
    payload = ar_device.dict()
    manual_devices = get_manual_ar_devices()
    
    device_index = next((i for i, d in enumerate(manual_devices) if d.get("id") == device_id), -1)
    if device_index == -1 and not configured_ar_device_exists(device_id):
        raise HTTPException(status_code=404, detail="Perangkat AR tidak ditemukan.")

    updated_device = build_manual_ar_device_from_payload(payload, device_id=device_id)
    ensure_unique_ar_device(updated_device, get_ar_devices(), editing_id=device_id)
    if device_index == -1:
        manual_devices.append(updated_device)
    else:
        manual_devices[device_index] = updated_device
    save_manual_ar_devices(manual_devices)
    reset_ar_state_from_config()
    return {"message": "AR berhasil diperbarui", **get_ar_payload()}

@app.delete("/api/ar/{device_id}", dependencies=[Depends(require_admin_session)])
def delete_ar_device(device_id: str):
    manual_devices = get_manual_ar_devices()
    new_devices = [d for d in manual_devices if d.get("id") != device_id]
    
    if len(new_devices) == len(manual_devices):
        raise HTTPException(status_code=404, detail="Perangkat AR tidak ditemukan.")

    save_manual_ar_devices(new_devices)
    reset_ar_state_from_config()
    return {"message": "AR berhasil dihapus", **get_ar_payload()}

@app.delete("/api/ar/events/{event_id}", dependencies=[Depends(require_admin_session)])
def delete_ar_event(event_id: str):
    if db.delete_ar_event(event_id):
        app_state["ar_events"] = db.list_ar_events(limit=300)
        return {"message": "AR event deleted successfully", **get_ar_payload()}
    raise HTTPException(status_code=404, detail="AR event tidak ditemukan.")

@app.post("/api/ar/start", dependencies=[Depends(require_admin_session)])
def start_ar_polling():
    app_state["ar_auto_polling_active"] = True
    db.set_setting("ar_auto_polling_active", "1")
    return {"message": "Auto-polling AR diaktifkan."}

@app.post("/api/ar/stop", dependencies=[Depends(require_admin_session)])
def stop_ar_polling():
    app_state["ar_auto_polling_active"] = False
    db.set_setting("ar_auto_polling_active", "0")
    return {"message": "Auto-polling AR dimatikan."}

@app.get("/api/gi", dependencies=[Depends(require_admin_session)])
def get_gi():
    app_state["daftar_gi"] = db.get_gi_devices()
    return app_state["daftar_gi"]

@app.post("/api/gi", dependencies=[Depends(require_admin_session)])
def add_gi(gi: GIData):
    ensure_device_endpoint_allowed(gi.ip, 502, "DC/Modbus")
    # Cek apakah sudah ada
    app_state["daftar_gi"] = db.get_gi_devices()
    for item in app_state["daftar_gi"]:
        if item["nama"].lower() == gi.nama.lower():
            raise HTTPException(status_code=400, detail="GI dengan nama ini sudah ada.")
        if item["ip"] == gi.ip:
            raise HTTPException(status_code=400, detail="GI dengan IP ini sudah ada.")
            
    db.add_gi_device(gi.nama, gi.ip)
    app_state["daftar_gi"] = db.get_gi_devices()
    return {"message": "GI berhasil ditambahkan", "data": app_state["daftar_gi"]}

@app.delete("/api/gi/{nama_gi}", dependencies=[Depends(require_admin_session)])
def delete_gi(nama_gi: str):
    if db.delete_gi_device(nama_gi):
        app_state["daftar_gi"] = db.get_gi_devices()
        return {"message": "GI berhasil dihapus", "data": app_state["daftar_gi"]}

    raise HTTPException(status_code=404, detail="GI tidak ditemukan.")

# === JALANKAN SERVER ===
# uvicorn api:app --reload --host 0.0.0.0 --port 8000

@app.post("/api/refresh", dependencies=[Depends(require_admin_session)])
def force_refresh():
    if app_state["is_scanning"]:
        raise HTTPException(status_code=400, detail="Scan already in progress")
    
    data = scan_modbus_devices(save_to_sheets=False)
    return {
        "message": "Refresh completed",
        "data": data
    }

# === SERVE FRONTEND (REACT BUILD) ===
from fastapi.staticfiles import StaticFiles
DIST_DIR = os.path.join(BASE_DIR, "dashboard-ui", "dist")

class NoCacheStaticFiles(StaticFiles):
    def file_response(self, full_path, stat_result, scope, status_code=200):
        response = super().file_response(full_path, stat_result, scope, status_code)
        path = str(scope.get("path") or "")
        if path == "/" or path.endswith(".html") or path.startswith("/assets/"):
            response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
            response.headers["Pragma"] = "no-cache"
            response.headers["Expires"] = "0"
        return response

Path(PQM_PME_REPORT_DIR).mkdir(parents=True, exist_ok=True)
app.mount(PQM_PME_REPORT_ROUTE, StaticFiles(directory=PQM_PME_REPORT_DIR), name="pme_pdf")

if os.path.exists(DIST_DIR):
    app.mount("/", NoCacheStaticFiles(directory=DIST_DIR, html=True), name="static")
else:
    print("WARNING: Folder 'dashboard-ui/dist' tidak ditemukan. Jalankan 'npm run build' di folder dashboard-ui.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)

