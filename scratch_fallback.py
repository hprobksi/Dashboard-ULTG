import json
import zipfile
import xml.etree.ElementTree as ET
import os

excel_path = r'C:\Users\rhard\Documents\Monitoring Program Proteksi\Program LM, ABO & Peningkatan Keandalan Proteksi 2026.xlsx'
if not os.path.exists(excel_path):
    print("Excel not found")
    exit(1)

z = zipfile.ZipFile(excel_path)
strings = []
for node in ET.fromstring(z.read('xl/sharedStrings.xml')).iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t'):
    strings.append(node.text or '')

wb = ET.fromstring(z.read('xl/workbook.xml'))
rels_root = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
rels_map = {rel.attrib['Id']: rel.attrib['Target'] for rel in rels_root}

ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}

# Pemetaan GID berdasar nama sheet
GID_MAP = {
    "866246403": "Program 2026",
    "192097731": "Monitoring ABO",
    "227705731": "Komitmen ABO TSJ",
    "1899478806": "Komitmen UPT",
    "118702841": "Rekap UPT",
    "2063187007": "Rekap ULTG",
    "1231275643": "Check Kesiapan DFR",
    "1917331484": "Evaluasi IL1",
    "2074467115": "Checklist Pemeliharaan",
    "269053465": "Aktivasi Buspro",
    "1259193272": "Implementasi Standarisasi Setting",
    "2029809148": "Rekomisioning",
    "193568899": "Penambahan DC Redundant",
    "1434996009": "Kesiapan Genset",
    "523493952": "Program Upskilling",
    "145485171": "Penyempurnaan Desain Tripping",
    "1505752840": "Penggantian Relay Obsolete",
    "1800611315": "Pemasangan dan Integrasi DC",
    "1863506266": "Check Point Implementasi Setting",
    "1965289726": "Aktivasi Aided DEF",
    "1110236436": "Migrasi Desain REF",
    "968176590": "Non Cascade Trafo",
    "1008313149": "Pemasangan dan Integrasi E-WARS",
    "714770632": "Penanganan DC Ground Fault",
    "1188750864": "Reposisi CTN LV",
    "477650982": "Scanning Rangkaian SF6",
    "214739093": "Implementasi Remote Reading"
}

fallback_db = {}

for s in wb.findall('.//ns:sheet', ns):
    sname = s.attrib['name']
    rid = s.attrib['{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id']
    target = rels_map[rid]
    sheet_xml = ET.fromstring(z.read('xl/' + target))
    
    rows_data = []
    for row in sheet_xml.findall('.//ns:row', ns):
        row_vals = []
        for c in row.findall('ns:c', ns):
            v_el = c.find('ns:v', ns)
            if v_el is not None:
                if c.attrib.get('t') == 's':
                    row_vals.append(strings[int(v_el.text)])
                else:
                    row_vals.append(v_el.text)
            else:
                row_vals.append('')
        # Bersihkan trailing empty cells
        while len(row_vals) > 0 and row_vals[-1] == '':
            row_vals.pop()
        if len(row_vals) > 0:
            rows_data.append(row_vals)
            
    # Cari GID yang pas
    matched_gid = None
    for gid, keyname in GID_MAP.items():
        if keyname.lower()[:10] in sname.lower() or sname.lower()[:10] in keyname.lower():
            matched_gid = gid
            break
            
    if matched_gid:
        fallback_db[matched_gid] = {
            "sheetName": sname,
            "rows": rows_data
        }

out_file = r'c:\Users\rhard\Documents\DASHBOARD_AI\public\fallback_master.json'
with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(fallback_db, f, ensure_ascii=False)

print("Generated fallback db with sheets count:", len(fallback_db))
