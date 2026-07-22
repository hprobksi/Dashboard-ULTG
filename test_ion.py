import sys, json, requests
sys.path.append(r'C:\Users\rhard\Documents\DASHBOARD_AI\server\python_backend')
from api import *
device = {
    'id': '8e608e99-78e0-4a1e-b784-e30e3c2b312d', 
    'nama_gi': 'GITET MUARATAWAR', 
    'nama_bay': 'GT 3.1/3.2', 
    'ip': 'https://172.20.141.7', 
    'port': 443,
    'pqm_type': 'ion9000'
}
requests.packages.urllib3.disable_warnings()
try:
    session, base_url = get_ion9000_session(device, force_login=True)
    request_names = [name for _key, name in PQM_ION9000_MAIN_FIELD_SPECS] + [counter['name'] for counter in PQM_ION9000_DISTURBANCE_COUNTERS]
    res = request_ion9000_register_values(device, request_names)
    with open('ion_raw.json', 'w') as f:
        json.dump(res, f, indent=2)
    print("SUCCESS")
except Exception as e:
    print("ERROR", e)
