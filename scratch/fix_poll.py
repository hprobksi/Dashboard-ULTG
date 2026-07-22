import re

api_path = r"C:\Users\rhard\Documents\DASHBOARD_AI\server\python_backend\api.py"
with open(api_path, 'r', encoding='utf-8') as f:
    api_content = f.read()

old_build = """def build_dc_data_items(gi, waktu_sekarang):
    nama_gi = gi["nama"]
    ip_gi = gi["ip"]
    reading = read_dc_device(nama_gi, ip_gi)
    status_gi = reading["status"]
    v_pg = reading["v_pg"]
    v_ng = reading["v_ng"]
    alarm_level, batas_warning, batas_critical = calculate_dc_alarm_level(
        nama_gi,
        status_gi,
        v_pg,
        v_ng,
    )

    return (
        {
            "waktu": waktu_sekarang,
            "nama": nama_gi,
            "ip": ip_gi,
            "v_pn": reading["v_pn"],
            "arus": reading["arus"],
            "v_pg": v_pg,
            "v_ng": v_ng,
            "status": status_gi,
            "status_message": reading.get("status_message", ""),
            "alarm_level": alarm_level,
        },
        batas_warning,
        batas_critical,
    )"""

new_build = """def build_dc_data_items(gi, waktu_sekarang):
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
        
    return results"""
api_content = api_content.replace(old_build, new_build)

old_scan = """                future_map = {
                    executor.submit(build_dc_data_item, gi, waktu_sekarang): gi
                    for gi in app_state["daftar_gi"]
                }
                for future in as_completed(future_map):
                    gi = future_map[future]
                    try:
                        polling_results.append(future.result())
                    except Exception as exc:"""

new_scan = """                future_map = {
                    executor.submit(build_dc_data_items, gi, waktu_sekarang): gi
                    for gi in app_state["daftar_gi"]
                }
                for future in as_completed(future_map):
                    gi = future_map[future]
                    try:
                        results_list = future.result()
                        polling_results.extend(results_list)
                    except Exception as exc:"""
api_content = api_content.replace(old_scan, new_scan)

with open(api_path, 'w', encoding='utf-8') as f:
    f.write(api_content)
print("Polling logic patched.")
