import sqlite3

db_path = r"C:\Users\rhard\Documents\DASHBOARD_AI\server\python_backend\voltkraf.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = cursor.fetchall()
print("Tables:", tables)

for table in tables:
    table_name = table[0]
    cursor.execute(f"PRAGMA table_info({table_name});")
    print(f"\nSchema for {table_name}:")
    for row in cursor.fetchall():
        print(row)
        
conn.close()
