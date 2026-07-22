import sqlite3
import os

db_path = r"C:\Users\rhard\Documents\DASHBOARD_AI\server\python_backend\voltkraf.db"

def migrate():
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Check if we have gi_devices
    cursor.execute("SELECT nama, ip FROM gi_devices")
    gi_list = cursor.fetchall()
    
    defaults = {
        "V_PN": 0,
        "Arus": 6,
        "V_PG": 12,
        "V_NG": 14
    }
    
    inserted = 0
    for nama_gi, ip_gi in gi_list:
        # check if ip_gi already exists in dc_register_config
        cursor.execute("SELECT count(*) FROM dc_register_config WHERE ip_gi = ?", (ip_gi,))
        count = cursor.fetchone()[0]
        
        if count == 0:
            # insert channel 1 defaults
            for sinyal, addr in defaults.items():
                cursor.execute("""
                    INSERT INTO dc_register_config (ip_gi, nama_gi, channel, sinyal, register_address)
                    VALUES (?, ?, ?, ?, ?)
                """, (ip_gi, nama_gi, 1, sinyal, addr))
            inserted += 1
            
    conn.commit()
    conn.close()
    print(f"Migrasi selesai. {inserted} peralatan lama ditambahkan ke dc_register_config.")

if __name__ == "__main__":
    migrate()
