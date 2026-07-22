import zipfile
import xml.etree.ElementTree as ET

z = zipfile.ZipFile(r'C:\Users\rhard\Documents\Monitoring Program Proteksi\Program LM, ABO & Peningkatan Keandalan Proteksi 2026.xlsx')
strings = []
for node in ET.fromstring(z.read('xl/sharedStrings.xml')).iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t'):
    strings.append(node.text or '')

wb = ET.fromstring(z.read('xl/workbook.xml'))
rels_root = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
rels_map = {rel.attrib['Id']: rel.attrib['Target'] for rel in rels_root}

ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main', 'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}

for s in wb.findall('.//ns:sheet', ns):
    sname = s.attrib['name']
    if 'def' in sname.lower() or 'dc' in sname.lower() or 'buspro' in sname.lower():
        rid = s.attrib['{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id']
        target = rels_map[rid]
        sheet_xml = ET.fromstring(z.read('xl/' + target))
        print(f"\n=== Sheet: {sname} ===")
        bekasi_rows = []
        all_rows = []
        for row in sheet_xml.findall('.//ns:row', ns):
            vals = []
            for c in row.findall('ns:c', ns):
                v_el = c.find('ns:v', ns)
                if v_el is not None:
                    if c.attrib.get('t') == 's':
                        vals.append(strings[int(v_el.text)])
                    else:
                        vals.append(v_el.text)
                else:
                    vals.append('')
            line_str = " | ".join(vals)
            if 'bekasi' in line_str.lower():
                bekasi_rows.append(line_str)
            if len(all_rows) < 5:
                all_rows.append(line_str)
        print("Total Bekasi rows found:", len(bekasi_rows))
        for br in bekasi_rows[:10]:
            print("  ->", br)
