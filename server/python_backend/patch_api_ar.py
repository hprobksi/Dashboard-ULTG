import os
import re

API_FILE = "api.py"

with open(API_FILE, "r", encoding="utf-8") as f:
    content = f.read()

ar_constants = """
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
"""
content = content.replace('AVR_TIMEOUT_DETIK = 2.0', 'AVR_TIMEOUT_DETIK = 2.0\n' + ar_constants)

ar_db_funcs = """
def get_manual_ar_devices():
    try:
        val = db.get_setting("ar_manual_devices_v1", "[]")
        return json.loads(val)
    except Exception as exc:
        print(f"[AR] Gagal parse manual devices: {exc}")
        return []

def save_manual_ar_devices(devices):
    db.save_setting("ar_manual_devices_v1", json.dumps(devices))

def get_ar_devices():
    manual_devices = get_manual_ar_devices()
    return manual_devices
"""

if "def get_manual_ar_devices" not in content:
    content = content.replace('def get_manual_avr_devices():', ar_db_funcs + '\ndef get_manual_avr_devices():')

ar_state_init = """
    "ar_devices": [build_empty_ar_state(device) for device in get_ar_devices()],
    "ar_last_scan_time": None,
    "ar_is_scanning": False,
    "ar_auto_polling_active": db.get_setting("ar_auto_polling_active", "1") == "1",
"""
if "ar_devices" not in content:
    # We must place build_empty_ar_state before this initialization!
    # Wait, in Python, if app_state is initialized at the module level, build_empty_ar_state MUST be defined before it.
    pass
