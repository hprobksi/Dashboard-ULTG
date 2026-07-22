import zipfile
import xml.etree.ElementTree as ET

z = zipfile.ZipFile(r'DATA_PERALATAN_ULTG_BEKASI.xlsx')
wb = ET.fromstring(z.read('xl/workbook.xml'))
ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}

print("Sheets in DATA_PERALATAN_ULTG_BEKASI.xlsx:")
for s in wb.findall('.//ns:sheet', ns):
    print(" -", s.attrib['name'])
