import database
import api

print("DB configs:", database.get_dc_registers_by_ip('172.20.22.52'))

configs = database.get_dc_registers_by_ip('172.20.22.52')
channels = {}
for c in configs:
    ch = c["channel"]
    if ch not in channels:
        channels[ch] = {}
    channels[ch][c["sinyal"]] = c["register_address"]
    
print("Channels Dict:", channels)
