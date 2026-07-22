import os
import re

filepath = r"C:\Users\rhard\Documents\DASHBOARD_AI\server\python_backend\api.py"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add new endpoints for DC Registers
endpoints_code = """
class DCRegisterData(BaseModel):
    ip_gi: str
    nama_gi: str
    channel: int
    sinyal: str
    register_address: int

class DCRegisterConfig(BaseModel):
    ip_gi: str
    nama_gi: str
    channels: list  # e.g. [1, 2]

@app.get("/api/dc/registers")
def get_dc_registers():
    return db.get_dc_registers()

@app.post("/api/dc/registers/add")
def add_dc_register(data: DCRegisterConfig):
    # Add gi_devices if not exist
    db.add_gi_device(data.nama_gi, data.ip_gi)
    
    # Default registers
    defaults = {
        1: {"V_PN": 0, "Arus": 6, "V_PG": 12, "V_NG": 14},
        2: {"V_PN": 20, "Arus": 26, "V_PG": 32, "V_NG": 34} # sensible defaults
    }
    
    for ch in data.channels:
        if ch in defaults:
            for sinyal, addr in defaults[ch].items():
                db.add_dc_register(data.ip_gi, data.nama_gi, ch, sinyal, addr)
                
    app_state["daftar_gi"] = db.get_gi_devices()
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
    # Also optionally delete from gi_devices if needed, but we can leave it
    return {"status": "success"}

"""

if "def get_dc_registers()" not in content:
    # insert before @app.get("/api/status")
    content = content.replace('@app.get("/api/status")', endpoints_code + '\n@app.get("/api/status")')

# 2. Refactor read_dc_device
# First, let's find read_dc_device implementation and replace it entirely.
# It starts around def read_dc_device(nama_gi, ip_gi): and ends at return { "status": last_status... }

import ast

new_read_dc_device = """def read_dc_device(nama_gi, ip_gi):
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
        
    min_reg = min(c["register_address"] for c in configs)
    max_reg = max(c["register_address"] for c in configs) + 1
    count_to_read = max_reg - min_reg + 1

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
                response = read_modbus_registers(
                    client_modbus,
                    address=min_reg,
                    count=count_to_read,
                    slave_id=DC_MODBUS_SLAVE_ID,
                )
                if not response.isError():
                    regs = response.registers
                    results = []
                    
                    for ch, signals in channels.items():
                        def get_val(sinyal_name):
                            if sinyal_name not in signals:
                                return 0.0
                            addr = signals[sinyal_name]
                            idx = addr - min_reg
                            if idx >= 0 and idx + 1 < len(regs):
                                return round(gabung_ke_float(regs[idx], regs[idx+1]), 2)
                            return 0.0
                            
                        suffix = f" (CH{ch})" if len(channels) > 1 else ""
                        display_name = f"{nama_gi}{suffix}"
                        
                        results.append({
                            "nama": display_name,
                            "ip": ip_gi,
                            "status": "online",
                            "status_message": f"Data DC berhasil dibaca. Channel {ch}",
                            "v_pn": get_val("V_PN"),
                            "arus": get_val("Arus"),
                            "v_pg": get_val("V_PG"),
                            "v_ng": get_val("V_NG"),
                        })
                    return results

                last_status = "error"
                last_message = f"Modbus response error: {response}"
        except Exception as exc:
            last_status = "timeout"
            last_message = str(exc) or exc.__class__.__name__
        finally:
            client_modbus.close()

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
        })
    return results
"""

# Replace old read_dc_device. We'll use regex to find the block.
# It starts with def read_dc_device(nama_gi, ip_gi):
# and ends right before def build_dc_data_item(gi, waktu_sekarang):

pattern_read = re.compile(r'def read_dc_device\(nama_gi, ip_gi\):.*?def build_dc_data_item', re.DOTALL)
if pattern_read.search(content):
    content = pattern_read.sub(new_read_dc_device + '\ndef build_dc_data_items', content)

# 3. Refactor build_dc_data_item -> build_dc_data_items
# old starts with def build_dc_data_items(gi, waktu_sekarang): (since we just replaced it above)
# and ends right before def notifikasi_worker():

new_build_dc_data_items = """def build_dc_data_items(gi, waktu_sekarang):
    nama_gi = gi["nama"]
    ip_gi = gi["ip"]
    readings = read_dc_device(nama_gi, ip_gi)
    
    items = []
    for reading in readings:
        status_gi = reading["status"]
        v_pg = reading["v_pg"]
        v_ng = reading["v_ng"]
        
        batas_warning = float(app_state["settings"].get("dc_ground_warning_threshold", 60.0))
        batas_critical = float(app_state["settings"].get("dc_ground_critical_threshold", 100.0))

        alarm_level = "normal"
        if status_gi == "online":
            vpg_abs = abs(v_pg)
            vng_abs = abs(v_ng)
            max_v = max(vpg_abs, vng_abs)
            if max_v >= batas_critical:
                alarm_level = "critical"
            elif max_v >= batas_warning:
                alarm_level = "warning"

            if alarm_level in ["warning", "critical"]:
                msg_level = "CRITICAL" if alarm_level == "critical" else "WARNING"
                db.insert_dc_alarm_event(waktu_sekarang, reading["nama"], msg_level, v_pg, v_ng)
                tambah_pesan_telegram(f"[{msg_level}] GROUND FAULT DC PROTEKSI\\nGI: {reading['nama']}\\nV_PG: {v_pg} V\\nV_NG: {v_ng} V")
                tambah_pesan_whatsapp(f"[{msg_level}] GROUND FAULT DC PROTEKSI\\nGI: {reading['nama']}\\nV_PG: {v_pg} V\\nV_NG: {v_ng} V")

        items.append((
            {
                "waktu": waktu_sekarang,
                "nama": reading["nama"],
                "ip": reading["ip"],
                "v_pn": reading["v_pn"],
                "arus": reading["arus"],
                "v_pg": reading["v_pg"],
                "v_ng": reading["v_ng"],
                "status": reading["status"],
                "status_message": reading.get("status_message", ""),
                "alarm_level": alarm_level,
            },
            batas_warning,
            batas_critical,
        ))
    return items
"""

pattern_build = re.compile(r'def build_dc_data_items\(gi, waktu_sekarang\):.*?def dc_poll_worker', re.DOTALL)
if pattern_build.search(content):
    content = pattern_build.sub(new_build_dc_data_items + '\ndef dc_poll_worker', content)


# 4. Refactor dc_poll_worker to use build_dc_data_items
# old: data_item, batas_w, batas_c = build_dc_data_item(gi, waktu_sekarang)
# new: for data_item, batas_w, batas_c in build_dc_data_items(gi, waktu_sekarang):

old_loop = """            data_item, batas_w, batas_c = build_dc_data_item(gi, waktu_sekarang)

            hasil_scan.append(data_item)
            
            db.insert_dc_reading(
                waktu_sekarang, 
                data_item["nama"], 
                data_item["ip"], 
                data_item["v_pn"], 
                data_item["arus"], 
                data_item["v_pg"], 
                data_item["v_ng"], 
                data_item["status"], 
                data_item["alarm_level"]
            )
            
            nama_gi = data_item["nama"]
            if data_item["status"] == "online":
                jam_menit = waktu_sekarang.split(" ")[1][:5]
                
                if nama_gi not in app_state["trend_data"]:
                    app_state["trend_data"][nama_gi] = []
                    
                app_state["trend_data"][nama_gi].append({
                    "waktu": jam_menit,
                    "v_pn": data_item["v_pn"],
                    "v_pg": data_item["v_pg"],
                    "v_ng": data_item["v_ng"],
                })
                
                if len(app_state["trend_data"][nama_gi]) > DC_TREND_MAX_POINTS:
                    app_state["trend_data"][nama_gi].pop(0)"""


new_loop = """            items = build_dc_data_items(gi, waktu_sekarang)
            for data_item, batas_w, batas_c in items:
                hasil_scan.append(data_item)
                
                db.insert_dc_reading(
                    waktu_sekarang, 
                    data_item["nama"], 
                    data_item["ip"], 
                    data_item["v_pn"], 
                    data_item["arus"], 
                    data_item["v_pg"], 
                    data_item["v_ng"], 
                    data_item["status"], 
                    data_item["alarm_level"]
                )
                
                nama_gi = data_item["nama"]
                if data_item["status"] == "online":
                    jam_menit = waktu_sekarang.split(" ")[1][:5]
                    
                    if nama_gi not in app_state["trend_data"]:
                        app_state["trend_data"][nama_gi] = []
                        
                    app_state["trend_data"][nama_gi].append({
                        "waktu": jam_menit,
                        "v_pn": data_item["v_pn"],
                        "v_pg": data_item["v_pg"],
                        "v_ng": data_item["v_ng"],
                    })
                    
                    if len(app_state["trend_data"][nama_gi]) > DC_TREND_MAX_POINTS:
                        app_state["trend_data"][nama_gi].pop(0)"""

content = content.replace(old_loop, new_loop)

# Also fix the fallback in dc_poll_worker if worker thread times out
old_timeout_fallback = """                        try:
                            hasil_scan.append({
                                "waktu": waktu_sekarang,
                                "nama": gi["nama"],
                                "ip": gi["ip"],
                                "v_pn": 0.0,
                                "arus": 0.0,
                                "v_pg": 0.0,
                                "v_ng": 0.0,
                                "status": "timeout",
                                "alarm_level": "normal",
                            })"""

new_timeout_fallback = """                        try:
                            # if timeout, try to append entries for all channels
                            configs = db.get_dc_registers_by_ip(gi["ip"])
                            channels = {c["channel"] for c in configs} if configs else {1}
                            for ch in channels:
                                suffix = f" (CH{ch})" if len(channels) > 1 else ""
                                hasil_scan.append({
                                    "waktu": waktu_sekarang,
                                    "nama": f"{gi['nama']}{suffix}",
                                    "ip": gi["ip"],
                                    "v_pn": 0.0,
                                    "arus": 0.0,
                                    "v_pg": 0.0,
                                    "v_ng": 0.0,
                                    "status": "timeout",
                                    "alarm_level": "normal",
                                })"""
content = content.replace(old_timeout_fallback, new_timeout_fallback)

# 5. Fix `test_dc_modbus()` to also use dynamic registers
# it has `response = read_modbus_registers(client, address=0, count=40, slave_id=DC_MODBUS_SLAVE_ID)`
# we'll just let it be, or update it minimally if needed, but it's just a test API.
# Let's skip test_dc_modbus as it doesn't affect main loop.

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("api.py patched successfully.")
