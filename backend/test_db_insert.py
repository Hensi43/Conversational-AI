import sqlite3
from src.auth import get_password_hash

DB_NAME = "users.db"

def test_insert():
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        
        username = "manual_test_user"
        password = "password123"
        hashed_password = get_password_hash(password)
        
        print(f"Attempting to insert user: {username}")
        cursor.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", (username, hashed_password))
        conn.commit()
        print("User inserted successfully.")
        
        cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
        user = cursor.fetchone()
        print(f"Retrieved user: {user}")
        
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_insert()
