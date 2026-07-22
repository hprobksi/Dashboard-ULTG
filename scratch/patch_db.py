import os

filepath = r"C:\Users\rhard\Documents\DASHBOARD_AI\server\python_backend\database.py"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Insert CREATE TABLE dc_register_config
gi_devices_sql = """            CREATE TABLE IF NOT EXISTS gi_devices (
                nama TEXT PRIMARY KEY,
                ip TEXT NOT NULL UNIQUE,
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            );"""

dc_register_sql = gi_devices_sql + """\n
            CREATE TABLE IF NOT EXISTS dc_register_config (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ip_gi TEXT NOT NULL,
                nama_gi TEXT NOT NULL,
                channel INTEGER NOT NULL DEFAULT 1,
                sinyal TEXT NOT NULL,
                register_address INTEGER NOT NULL,
                UNIQUE(ip_gi, channel, sinyal)
            );"""

content = content.replace(gi_devices_sql, dc_register_sql)

# 2. Add CRUD functions at the end of the file
crud_functions = """

def get_dc_registers():
    with _DB_LOCK, get_connection() as conn:
        rows = conn.execute("SELECT * FROM dc_register_config ORDER BY ip_gi, channel, sinyal").fetchall()
        return [row_to_dict(row) for row in rows]

def get_dc_registers_by_ip(ip_gi):
    with _DB_LOCK, get_connection() as conn:
        rows = conn.execute("SELECT * FROM dc_register_config WHERE ip_gi = ? ORDER BY channel, sinyal", (ip_gi,)).fetchall()
        return [row_to_dict(row) for row in rows]

def add_dc_register(ip_gi, nama_gi, channel, sinyal, register_address):
    with _DB_LOCK, get_connection() as conn:
        conn.execute(
            '''INSERT OR REPLACE INTO dc_register_config (ip_gi, nama_gi, channel, sinyal, register_address)
               VALUES (?, ?, ?, ?, ?)''',
            (ip_gi, nama_gi, channel, sinyal, register_address)
        )
        conn.commit()

def update_dc_register(id, register_address):
    with _DB_LOCK, get_connection() as conn:
        conn.execute(
            "UPDATE dc_register_config SET register_address = ? WHERE id = ?",
            (register_address, id)
        )
        conn.commit()

def delete_dc_registers_by_ip(ip_gi):
    with _DB_LOCK, get_connection() as conn:
        conn.execute("DELETE FROM dc_register_config WHERE ip_gi = ?", (ip_gi,))
        conn.commit()
"""

if "def get_dc_registers" not in content:
    content += crud_functions

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("database.py patched successfully.")
