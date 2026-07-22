import re

api_path = r"C:\Users\rhard\Documents\DASHBOARD_AI\server\python_backend\api.py"
with open(api_path, 'r', encoding='utf-8') as f:
    api_content = f.read()

# I will replace the entire read_dc_device function
old_func = """def read_dc_device(nama_gi, ip_gi):
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
                            
                        results.append({
                            "v_pn": get_val("V_PN"),
                            "arus": get_val("Arus"),
                            "v_pg": get_val("V_PG"),
                            "v_ng": get_val("V_NG"),
                            "status": "online",
                            "status_message": f"Data DC berhasil dibaca. Channel {ch}",
                            "channel": ch
                        })
                    
                    client_modbus.close()
                    return results
                else:
                    last_status = "timeout"
                    last_message = "Gagal membaca register (Modbus Exception)."
        except Exception as e:
            last_status = "timeout"
            last_message = f"Error: {e}"
        finally:
            client_modbus.close()
            
        time.sleep(1)

    fail_results = []
    for ch in channels.keys():
        fail_results.append({
            "status": last_status,
            "status_message": last_message,
            "v_pn": 0.0,
            "arus": 0.0,
            "v_pg": 0.0,
            "v_ng": 0.0,
            "channel": ch
        })
    return fail_results"""

# Wait, let me double check the old_func exact text from my previous grep/view_file to avoid mismatch.
