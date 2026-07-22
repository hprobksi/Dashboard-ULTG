import os
import re

API_FILE = "server/python_backend/api.py"

with open(API_FILE, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add FL_DEVICES_FILE near DFR_DEVICES_FILE
if "FL_DEVICES_FILE" not in content:
    content = content.replace(
        'DFR_DEVICES_FILE = os.path.join(BASE_DIR, "dfr_devices.json")',
        'DFR_DEVICES_FILE = os.path.join(BASE_DIR, "dfr_devices.json")\nFL_DEVICES_FILE = os.path.join(BASE_DIR, "fl_devices.json")'
    )

# 2. Add save_dfr_devices, get_fl_devices, save_fl_devices near get_dfr_devices
# We'll insert this right before get_dfr_devices
helper_funcs = """def save_dfr_devices(devices):
    try:
        with open(DFR_DEVICES_FILE, "w", encoding="utf-8") as file:
            json.dump({"devices": devices}, file, indent=2)
    except Exception as exc:
        print(f"[DFR CONFIG] Gagal menyimpan {DFR_DEVICES_FILE}: {exc}")

def get_fl_devices():
    try:
        with open(FL_DEVICES_FILE, "r", encoding="utf-8") as file:
            payload = json.load(file)
    except Exception as exc:
        print(f"[FL CONFIG] Gagal membaca {FL_DEVICES_FILE}: {exc}")
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

def save_fl_devices(devices):
    try:
        with open(FL_DEVICES_FILE, "w", encoding="utf-8") as file:
            json.dump({"devices": devices}, file, indent=2)
    except Exception as exc:
        print(f"[FL CONFIG] Gagal menyimpan {FL_DEVICES_FILE}: {exc}")

def get_dfr_devices():"""

if "def save_dfr_devices" not in content:
    content = content.replace("def get_dfr_devices():", helper_funcs, 1)

# 3. Add FL API endpoints and DFR edit endpoint near DFR endpoints
api_endpoints = """@app.put("/api/dfr/devices/{device_id}", dependencies=[Depends(require_admin_session)])
def update_dfr_device(device_id: str, request: Request):
    payload = asyncio.run(request.json())
    new_nama_bay = payload.get("nama_bay", "").strip()
    
    try:
        with open(DFR_DEVICES_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)
    except:
        data = {"devices": []}
        
    updated = False
    for dev in data.get("devices", []):
        if dev.get("id") == device_id:
            dev["nama_bay"] = new_nama_bay
            updated = True
            break
            
    if updated:
        save_dfr_devices(data.get("devices", []))
        return {"message": "Berhasil mengupdate DFR"}
    raise HTTPException(status_code=404, detail="Device not found")

@app.get("/api/fl", dependencies=[Depends(require_admin_session)])
def get_fl():
    return app_state.get("fl_devices", {})

@app.put("/api/fl/devices/{device_id}", dependencies=[Depends(require_admin_session)])
def update_fl_device(device_id: str, request: Request):
    payload = asyncio.run(request.json())
    new_nama_bay = payload.get("nama_bay", "").strip()
    
    try:
        with open(FL_DEVICES_FILE, "r", encoding="utf-8") as file:
            data = json.load(file)
    except:
        data = {"devices": []}
        
    updated = False
    for dev in data.get("devices", []):
        if dev.get("id") == device_id:
            dev["nama_bay"] = new_nama_bay
            updated = True
            break
            
    if updated:
        save_fl_devices(data.get("devices", []))
        return {"message": "Berhasil mengupdate FL"}
    raise HTTPException(status_code=404, detail="Device not found")

@app.post("/api/fl/clean/{device_id}", dependencies=[Depends(require_admin_session)])
def clean_fl_device(device_id: str):
    devices = get_fl_devices()
    target = next((d for d in devices if d["id"] == device_id), None)
    if not target:
        raise HTTPException(status_code=404, detail="FL device not found")
        
    # Same clean URL as DFR
    clean_url = dfr_clean_url(target["ip"])
    try:
        # Use dfr_session because it's the exact same interface
        response = dfr_session.get(clean_url, timeout=DFR_TIMEOUT_DETIK)
        if response.status_code == 200:
            return {"message": "FL Clean up initiated."}
        raise HTTPException(status_code=500, detail=f"HTTP {response.status_code}")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Clean up failed: {exc}")

@app.get("/api/dfr","""

if "@app.put(\"/api/dfr/devices/{device_id}\"" not in content:
    content = content.replace('@app.get("/api/dfr",', api_endpoints, 1)


# 4. Add FL worker logic near DFR worker logic
fl_worker_logic = """def poll_fl_device(device):
    waktu = time.strftime("%Y-%m-%d %H:%M:%S")
    state = build_empty_dfr_state(device)
    state["last_poll_time"] = waktu
    if not device.get("enabled", True):
        state["status"] = "disabled"
        state["status_message"] = "Polling FL dimatikan."
        return state

    try:
        # Using dfr_session because FL is also IDM/Qualitrol
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
            "status_message": "Diagnostic FL terbaca." if status != "unsupported" else "Endpoint diagnostic tidak berisi data storage/memory.",
            "station_name": parsed.get("station_name") or "",
            "device_name": parsed.get("device_name") or "",
            "board_type": parsed.get("board_type") or "",
            "ram": ram,
            "storage": storage,
        })
    except Exception as exc:
        state["status_message"] = f"FL tidak terbaca: {exc}"
        state["connected"] = False
        state["status"] = "offline"

    return state

def poll_fl_once():
    waktu_sekarang = time.strftime("%Y-%m-%d %H:%M:%S")
    devices = get_fl_devices()
    result_dict = {}

    if not devices:
        return result_dict

    try:
        max_workers = max(1, min(DFR_POLL_WORKERS, len(devices)))
        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_device = {executor.submit(poll_fl_device, d): d for d in devices}
            for future in concurrent.futures.as_completed(future_to_device):
                device = future_to_device[future]
                try:
                    result_dict[device["id"]] = future.result()
                except Exception as exc:
                    st = build_empty_dfr_state(device)
                    st.update({
                        "last_poll_time": waktu_sekarang,
                        "status_message": f"Crash: {exc}",
                    })
                    result_dict[device["id"]] = st
    except Exception as exc:
        print(f"[FL POLLER] Gagal polling paralel: {exc}")

    return result_dict

def fl_worker(shutdown_event: threading.Event):
    # Tunggu sebentar agar tidak tabrakan start-nya dengan DFR
    shutdown_event.wait(5.0)
    
    while not shutdown_event.is_set():
        waktu_sekarang = time.strftime("%Y-%m-%d %H:%M:%S")
        app_state["fl_devices"] = poll_fl_once()
        app_state["fl_metadata"] = {
            "last_updated": waktu_sekarang,
            "poll_interval_seconds": DFR_INTERVAL_DETIK,
            "timeout_seconds": DFR_TIMEOUT_DETIK,
            "poll_workers": DFR_POLL_WORKERS,
            "thresholds": {
                "storage_warning_percent": DFR_STORAGE_WARNING_PERCENT,
                "storage_critical_percent": DFR_STORAGE_CRITICAL_PERCENT,
                "ram_warning_percent": DFR_RAM_WARNING_PERCENT,
                "ram_critical_percent": DFR_RAM_CRITICAL_PERCENT,
            }
        }

        try:
            for _ in range(int(DFR_INTERVAL_DETIK)):
                if shutdown_event.is_set():
                    break
                time.sleep(1)
        except Exception:
            break

def dfr_worker"""

if "def poll_fl_device(device):" not in content:
    content = content.replace("def dfr_worker", fl_worker_logic, 1)

# 5. Add fl_worker to get_background_thread_specs
if '"target": fl_worker' not in content:
    fl_thread_spec = """        {
            "name": "DFR",
            "target": dfr_worker,
            "interval": DFR_INTERVAL_DETIK,
        },
        {
            "name": "FL",
            "target": fl_worker,
            "interval": DFR_INTERVAL_DETIK,
        },"""
    content = content.replace("""        {
            "name": "DFR",
            "target": dfr_worker,
            "interval": DFR_INTERVAL_DETIK,
        },""", fl_thread_spec, 1)

# Write back
with open(API_FILE, "w", encoding="utf-8") as f:
    f.write(content)
print("api.py patched successfully!")
