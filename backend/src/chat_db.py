import sqlite3
import uuid
from datetime import datetime
from typing import List, Dict, Optional

DB_NAME = "users.db"

def init_chat_db():
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.executescript('''
        CREATE TABLE IF NOT EXISTS chat_sessions (
            id TEXT PRIMARY KEY,
            title TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS chat_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT NOT NULL,
            role TEXT NOT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES chat_sessions (id) ON DELETE CASCADE
        );
    ''')
    conn.commit()
    conn.close()

def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def create_session(title: str = "New Chat") -> str:
    session_id = str(uuid.uuid4())
    conn = get_db_connection()
    conn.execute('INSERT INTO chat_sessions (id, title) VALUES (?, ?)', (session_id, title))
    conn.commit()
    conn.close()
    return session_id

def get_all_sessions() -> List[Dict]:
    conn = get_db_connection()
    sessions = conn.execute('SELECT * FROM chat_sessions ORDER BY created_at DESC').fetchall()
    conn.close()
    return [dict(s) for s in sessions]

def get_session(session_id: str) -> Optional[Dict]:
    conn = get_db_connection()
    session = conn.execute('SELECT * FROM chat_sessions WHERE id = ?', (session_id,)).fetchone()
    conn.close()
    return dict(session) if session else None

def delete_session(session_id: str):
    conn = get_db_connection()
    conn.execute('DELETE FROM chat_sessions WHERE id = ?', (session_id,))
    conn.commit()
    conn.close()

def add_message(session_id: str, role: str, content: str):
    conn = get_db_connection()
    conn.execute('INSERT INTO chat_messages (session_id, role, content) VALUES (?, ?, ?)', 
                 (session_id, role, content))
    conn.commit()
    conn.close()

def get_messages_by_session(session_id: str) -> List[Dict]:
    conn = get_db_connection()
    messages = conn.execute('SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC', (session_id,)).fetchall()
    conn.close()
    return [dict(m) for m in messages]

# Initialize tables on import
init_chat_db()
