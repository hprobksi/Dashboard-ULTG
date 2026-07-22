import os

API_FILE = "api.py"

with open(API_FILE, "r", encoding="utf-8") as f:
    content = f.read()

ar_api_routes = """
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

@app.post("/api/ar/start", dependencies=[Depends(require_admin_session)])
def start_ar_polling():
    app_state["ar_auto_polling_active"] = True
    db.save_setting("ar_auto_polling_active", "1")
    return {"message": "Auto-polling AR diaktifkan."}

@app.post("/api/ar/stop", dependencies=[Depends(require_admin_session)])
def stop_ar_polling():
    app_state["ar_auto_polling_active"] = False
    db.save_setting("ar_auto_polling_active", "0")
    return {"message": "Auto-polling AR dimatikan."}
"""

if "@app.get(\"/api/ar\"" not in content:
    idx = content.find('@app.get("/api/gi",')
    if idx != -1:
        content = content[:idx] + ar_api_routes + "\n" + content[idx:]
        print("Injected AR API routes before /api/gi")

with open(API_FILE, "w", encoding="utf-8") as f:
    f.write(content)
