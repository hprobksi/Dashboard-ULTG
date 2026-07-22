import re

with open('api.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace nama_gi and nama_bay for DEFAULT_AR_DEVICES
# It looks like:
#         "nama_gi": "GITET New Tambun",
#         "nama_bay": bay_name,
# We want it to be:
#         "nama_gi": "Bekasi",
#         "nama_bay": f"GISTET New Tambun {bay_name}",

content = content.replace('"nama_gi": "GITET New Tambun",', '"nama_gi": "Bekasi",')
content = content.replace('"nama_bay": bay_name,', '"nama_bay": f"GISTET New Tambun {bay_name}",')

with open('api.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated api.py")
