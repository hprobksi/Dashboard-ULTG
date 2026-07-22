import json
import os
import struct
import time

import database as db
from pymodbus.client import ModbusTcpClient


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


INTERVAL_DETIK = env_int("DC_POLL_INTERVAL_SECONDS", 30)
DC_MODBUS_TIMEOUT_DETIK = env_float("DC_MODBUS_TIMEOUT_SECONDS", 4.0, 0.5)
DC_MODBUS_RETRY_COUNT = env_int("DC_MODBUS_RETRY_COUNT", 2)
DC_MODBUS_RETRY_DELAY_DETIK = env_float("DC_MODBUS_RETRY_DELAY_SECONDS", 0.5, 0.0)
DC_MODBUS_SLAVE_ID = env_int("DC_MODBUS_SLAVE_ID", 1, 0)
DAFTAR_GI_FILE = "daftar_gi.json"


def gabung_ke_float(reg_awal, reg_akhir):
    byte_data = struct.pack('>HH', reg_awal, reg_akhir)
    return struct.unpack('>f', byte_data)[0]


def read_dc_holding_registers(client, address, count):
    try:
        return client.read_holding_registers(
            address=address,
            count=count,
            slave=DC_MODBUS_SLAVE_ID,
        )
    except TypeError:
        try:
            return client.read_holding_registers(
                address=address,
                count=count,
                unit=DC_MODBUS_SLAVE_ID,
            )
        except TypeError:
            return client.read_holding_registers(address=address, count=count)


def build_dc_state(status_gi, alarm_level):
    if status_gi == "online":
        return f"online:{alarm_level}"
    return str(status_gi or "offline").lower()


def dc_state_is_normal(state):
    return state == "online:normal"


def logger_state_key(nama_gi):
    return f"dc_standalone_logger_state::{nama_gi}"


def get_dc_thresholds(nama_gi):
    if nama_gi == "GITET Muaratawar":
        return 160.0, 187.0
    return 80.0, 90.0


def calculate_dc_alarm_level(nama_gi, status_gi, v_pg, v_ng):
    if status_gi != "online":
        return "normal"

    batas_warning, batas_critical = get_dc_thresholds(nama_gi)
    max_v = max(abs(v_pg), abs(v_ng))
    if max_v > batas_critical:
        return "critical"
    if max_v > batas_warning:
        return "warning"
    return "normal"


def read_dc_device(nama_gi, ip_gi):
    last_status = "offline"
    last_message = "Koneksi Modbus belum berhasil."

    for attempt in range(1, DC_MODBUS_RETRY_COUNT + 1):
        client_modbus = ModbusTcpClient(ip_gi, port=502, timeout=DC_MODBUS_TIMEOUT_DETIK)
        try:
            if not client_modbus.connect():
                last_status = "offline"
                last_message = "TCP port 502 tidak merespons."
            else:
                response = read_dc_holding_registers(client_modbus, address=0, count=40)
                if not response.isError():
                    regs = response.registers
                    return {
                        "status": "online",
                        "status_message": f"Data DC berhasil dibaca. Slave ID {DC_MODBUS_SLAVE_ID}.",
                        "v_pn": round(gabung_ke_float(regs[0], regs[1]), 2),
                        "arus": round(gabung_ke_float(regs[6], regs[7]), 2),
                        "v_pg": round(gabung_ke_float(regs[12], regs[13]), 2),
                        "v_ng": round(gabung_ke_float(regs[14], regs[15]), 2),
                    }

                last_status = "error"
                last_message = f"Modbus response error: {response}"
        except Exception as exc:
            last_status = "timeout"
            last_message = str(exc) or exc.__class__.__name__
        finally:
            client_modbus.close()

        if attempt < DC_MODBUS_RETRY_COUNT and DC_MODBUS_RETRY_DELAY_DETIK:
            time.sleep(DC_MODBUS_RETRY_DELAY_DETIK)

    print(
        f"[DC Poll] {nama_gi} ({ip_gi}) gagal setelah "
        f"{DC_MODBUS_RETRY_COUNT} percobaan: {last_message}"
    )
    return {
        "status": last_status,
        "status_message": last_message,
        "v_pn": 0.0,
        "arus": 0.0,
        "v_pg": 0.0,
        "v_ng": 0.0,
    }


def load_daftar_gi_legacy():
    if os.path.exists(DAFTAR_GI_FILE):
        try:
            with open(DAFTAR_GI_FILE, "r") as f:
                return json.load(f)
        except Exception as exc:
            print(f"Gagal membaca {DAFTAR_GI_FILE}: {exc}")
            return []
    return []


def seed_gi_to_sql():
    db.init_database()
    existing = db.get_gi_devices()
    if existing:
        return existing

    legacy = load_daftar_gi_legacy()
    for item in legacy:
        nama = item.get("nama")
        ip = item.get("ip")
        if nama and ip:
            try:
                db.add_gi_device(nama, ip)
            except Exception as exc:
                print(f"Gagal migrasi GI {nama}: {exc}")
    return db.get_gi_devices()


def jalankan_logger():
    daftar_gi = seed_gi_to_sql()
    print(f"Memulai Auto-Logger SQL untuk {len(daftar_gi)} Gardu Induk...")

    while True:
        waktu_sekarang = time.strftime('%Y-%m-%d %H:%M:%S')
        print(f"--- Memulai Siklus Polling: {waktu_sekarang} ---")

        daftar_gi = db.get_gi_devices()

        for gi in daftar_gi:
            nama_gi = gi["nama"]
            ip_gi = gi["ip"]

            reading = read_dc_device(nama_gi, ip_gi)
            status_gi = reading["status"]
            v_pn = reading["v_pn"]
            arus = reading["arus"]
            v_pg = reading["v_pg"]
            v_ng = reading["v_ng"]
            alarm_level = calculate_dc_alarm_level(nama_gi, status_gi, v_pg, v_ng)

            db.insert_dc_reading({
                "waktu": waktu_sekarang,
                "nama": nama_gi,
                "ip": ip_gi,
                "v_pn": v_pn,
                "arus": arus,
                "v_pg": v_pg,
                "v_ng": v_ng,
                "status": status_gi,
                "alarm_level": alarm_level,
            })

            current_state = build_dc_state(status_gi, alarm_level)
            previous_state = db.get_setting(logger_state_key(nama_gi), "online:normal")
            db.set_setting(logger_state_key(nama_gi), current_state)

            if not dc_state_is_normal(current_state) and dc_state_is_normal(previous_state):
                db.insert_dc_alarm_event({
                    "id": f"{nama_gi}-{waktu_sekarang}",
                    "waktu": waktu_sekarang,
                    "nama": nama_gi,
                    "level": alarm_level if status_gi == "online" else status_gi,
                    "v_pg": v_pg,
                    "v_ng": v_ng,
                })
                level = alarm_level if status_gi == "online" else status_gi
                print(f"[ALARM] {nama_gi} {level.upper()}")
            elif dc_state_is_normal(current_state) and not dc_state_is_normal(previous_state):
                print(f"[RECOVERY] {nama_gi} kembali NORMAL")

        print(f"--- Siklus Selesai. Menunggu {INTERVAL_DETIK} detik... ---\n")
        time.sleep(INTERVAL_DETIK)


if __name__ == "__main__":
    jalankan_logger()
