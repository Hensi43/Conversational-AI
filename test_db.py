import sqlite3
print("Connecting to DB...")
try:
    conn = sqlite3.connect("backend/users.db")
    print("Connected.")
    cursor = conn.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY)")
    print("Table created.")
    conn.close()
    print("Closed.")
except Exception as e:
    print(f"Error: {e}")
