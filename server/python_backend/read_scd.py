import xml.etree.ElementTree as ET
import sys

f = sys.argv[1]
tree = ET.parse(f)
root = tree.getroot()

ns = {'scl': root.tag.split('}')[0].strip('{')} if '}' in root.tag else {'scl': ''}

for ied in root.findall('.//scl:IED', ns):
    print(f'IED: {ied.get("name")}')
    for ld in ied.findall('.//scl:LDevice', ns):
        print(f'  LDevice: {ld.get("inst")}')
        for ln in ld.findall('.//scl:LN', ns):
            prefix = ln.get('prefix') or ''
            lnInst = ln.get('inst') or ''
            print(f'    LN: {prefix}{ln.get("lnClass")}{lnInst}')
