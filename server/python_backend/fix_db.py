import sqlite3

def fix():
    c = sqlite3.connect('VoltKraf.db')
    c.execute("UPDATE dc_register_config SET register_address = 2 WHERE ip_gi='172.20.22.52' AND channel=2 AND sinyal='V_PN'")
    c.execute("UPDATE dc_register_config SET register_address = 8 WHERE ip_gi='172.20.22.52' AND channel=2 AND sinyal='Arus'")
    c.execute("UPDATE dc_register_config SET register_address = 16 WHERE ip_gi='172.20.22.52' AND channel=2 AND sinyal='V_PG'")
    c.execute("UPDATE dc_register_config SET register_address = 18 WHERE ip_gi='172.20.22.52' AND channel=2 AND sinyal='V_NG'")
    c.commit()
    print("Fixed database!")

if __name__ == '__main__':
    fix()
