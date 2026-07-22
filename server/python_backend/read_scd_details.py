import xml.etree.ElementTree as ET
import sys

f = sys.argv[1]
tree = ET.parse(f)
root = tree.getroot()

ns = {'scl': root.tag.split('}')[0].strip('{')} if '}' in root.tag else {'scl': ''}

targets = ['RREC', 'XCBR', 'RSYN', 'LPHD', 'PTRC', 'LCCH']

for ied in root.findall('.//scl:IED', ns):
    print(f'\n=== IED: {ied.get("name")} ===')
    for ld in ied.findall('.//scl:LDevice', ns):
        ldInst = ld.get('inst')
        for ln in ld.findall('.//scl:LN', ns) + ld.findall('.//scl:LN0', ns):
            lnClass = ln.get('lnClass')
            if lnClass in targets:
                prefix = ln.get('prefix') or ''
                lnInst = ln.get('inst') or ''
                print(f'\n  LDevice: {ldInst} | LN: {prefix}{lnClass}{lnInst}')
                for doi in ln.findall('.//scl:DOI', ns):
                    print(f'    - DO: {doi.get("name")}')
