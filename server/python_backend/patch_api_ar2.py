import os
import re

API_FILE = "api.py"

with open(API_FILE, "r", encoding="utf-8") as f:
    content = f.read()

ar_definitions = """
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
    db.save_setting("ar_manual_devices_v1", json.dumps(devices))

def get_ar_devices():
    manual_devices = get_manual_ar_devices()
    return manual_devices

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
                    "value_type": point.get("value_type", AR_POINT_GROUP_DEFAULTS.get(group, {}).get("value_type", "bool")),
                    "normal_value": point.get("normal_value", "false"),
                    "severity": point.get("severity", "info"),
                })
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
                "value_type": point.get("value_type", AR_POINT_GROUP_DEFAULTS.get(group, {}).get("value_type", "bool")),
                "normal_value": point.get("normal_value", "false"),
                "severity": point.get("severity", "info"),
                "error": status_message
            })
    return groups
"""

if "AR_POINT_GROUPS" not in content:
    content = content.replace('AVR_POINT_GROUPS =', ar_definitions + '\nAVR_POINT_GROUPS =')

ar_state_init = """
    "ar_devices": [build_empty_ar_state(device) for device in get_ar_devices()],
    "ar_last_scan_time": None,
    "ar_is_scanning": False,
    "ar_auto_polling_active": db.get_setting("ar_auto_polling_active", "1") == "1",
"""
if "ar_devices" not in content:
    content = content.replace('"avr_auto_polling_active": db.get_setting("avr_auto_polling_active", "1") == "1",', 
                              '"avr_auto_polling_active": db.get_setting("avr_auto_polling_active", "1") == "1",\n' + ar_state_init)

ar_logic = """
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
        "last_scan_time": app_state["ar_last_scan_time"],
        "is_scanning": app_state["ar_is_scanning"],
        "auto_polling_active": app_state["ar_auto_polling_active"],
        "poll_interval_seconds": AR_INTERVAL_DETIK,
        "timeout_seconds": AR_TIMEOUT_DETIK,
        "default_device_id": configured_ids[0] if configured_ids else "",
    }

def poll_ar_device(device):
    import time
    waktu_sekarang = time.strftime("%Y-%m-%d %H:%M:%S")
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
        from modbus import read_avr_mms_points
        results = read_avr_mms_points(device, points_to_read)
        
        point_groups = {group: [] for group in AR_POINT_GROUPS}
        for group in AR_POINT_GROUPS:
            for point in device.get(group, []):
                ref = point.get("reference", "")
                result = results.get(ref, {})
                
                point_groups[group].append({
                    "key": point.get("key"),
                    "label": point.get("label"),
                    "reference": ref,
                    "value": result.get("value", "-"),
                    "value_type": point.get("value_type", AR_POINT_GROUP_DEFAULTS.get(group, {}).get("value_type", "bool")),
                    "normal_value": point.get("normal_value", "false"),
                    "severity": point.get("severity", "info"),
                    "error": result.get("error", "")
                })

        return build_empty_ar_state(
            device,
            connected=True,
            last_poll_time=waktu_sekarang,
            status_message="Data AR IEC 61850 MMS berhasil dibaca",
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
    if app_state["ar_is_scanning"]:
        return app_state["ar_devices"]

    app_state["ar_is_scanning"] = True
    try:
        states = [poll_ar_device(device) for device in get_ar_devices()]
        app_state["ar_devices"] = states
        app_state["ar_last_scan_time"] = time.strftime("%Y-%m-%d %H:%M:%S")
        return states
    finally:
        app_state["ar_is_scanning"] = False

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
"""

if "def poll_ar_once" not in content:
    content = content.replace('def avr_worker():', ar_logic + '\ndef avr_worker():')

ar_api_routes = """
# === AR API ROUTES ===
@app.get("/api/ar")
def get_ar_status():
    return get_ar_payload()

@app.post("/api/ar/refresh")
def force_refresh_ar():
    states = poll_ar_once()
    return {"message": "AR diperbarui", "devices": states}

@app.put("/api/ar/auto-polling", dependencies=[Depends(require_admin_session)])
def toggle_ar_auto_polling(active: bool = Body(..., embed=True)):
    app_state["ar_auto_polling_active"] = active
    db.save_setting("ar_auto_polling_active", "1" if active else "0")
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
            "whatsapp": bool(raw_point.get("whatsapp")),
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
        "source": "manual",
        "is_manual": True,
        **point_groups,
    }

@app.post("/api/ar", dependencies=[Depends(require_admin_session)])
def add_ar_device(ar_device: ARDeviceData):
    payload = ar_device.dict()
    new_device = build_manual_ar_device_from_payload(payload)
    manual_devices = get_manual_ar_devices()
    
    for existing in manual_devices:
        if existing.get("ip") == new_device["ip"] and existing.get("nama_gi") == new_device["nama_gi"] and existing.get("nama_bay") == new_device["nama_bay"]:
            raise HTTPException(status_code=400, detail="Perangkat AR dengan IP, GI, dan Bay yang sama sudah ada.")

    manual_devices.append(new_device)
    save_manual_ar_devices(manual_devices)
    reset_ar_state_from_config()
    return {"message": "AR berhasil ditambahkan", **get_ar_payload()}

@app.put("/api/ar/{device_id}", dependencies=[Depends(require_admin_session)])
def update_ar_device(device_id: str, ar_device: ARDeviceData):
    payload = ar_device.dict()
    manual_devices = get_manual_ar_devices()
    
    device_index = next((i for i, d in enumerate(manual_devices) if d.get("id") == device_id), -1)
    if device_index == -1:
        raise HTTPException(status_code=404, detail="Perangkat AR tidak ditemukan.")

    updated_device = build_manual_ar_device_from_payload(payload, device_id=device_id)
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
"""

if "@app.get(\"/api/ar\")" not in content:
    content = content.replace('# === ALARM ANNUNCIATOR API ROUTES ===', ar_api_routes + '\n# === ALARM ANNUNCIATOR API ROUTES ===')

ar_thread = """
    threading.Thread(target=ar_worker, daemon=True, name="ARPollingThread").start()
"""
if "ARPollingThread" not in content:
    content = content.replace('threading.Thread(target=avr_worker, daemon=True, name="AVRPollingThread").start()', 
                              'threading.Thread(target=avr_worker, daemon=True, name="AVRPollingThread").start()\n' + ar_thread)

with open(API_FILE, "w", encoding="utf-8") as f:
    f.write(content)

print("Patch applied.")
