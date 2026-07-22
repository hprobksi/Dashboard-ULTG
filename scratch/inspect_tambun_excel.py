import zipfile
import xml.etree.ElementTree as ET

z = zipfile.ZipFile(r'DATA_PERALATAN_ULTG_BEKASI.xlsx')
strings = []
for node in ET.fromstring(z.read('xl/sharedStrings.xml')).iter('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t'):
    strings.append(node.text or '')

wb = ET.fromstring(z.read('xl/workbook.xml'))
rels_root = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
rels_map = {rel.attrib['Id']: rel.attrib['Target'] for rel in rels_root}

ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main', 'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}

for s in wb.findall('.//ns:sheet', ns):
    sname = s.attrib['name']
    if 'TAMBUN' in sname.upper():
        rid = s.attrib['{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id']
        target = rels_map[rid]
        sheet_xml = ET.fromstring(z.read('xl/' + target))
        
        gis_in_sheet = set()
        row_count = 0
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
            if len(vals) > 3 and vals[3]:
                gis_in_sheet.add(vals[3])
            row_count += 1
        print(f"Sheet: {sname} (Total rows: {row_count})")
        print("  GIs found in column 3 (index 3):", gis_in_sheet)
