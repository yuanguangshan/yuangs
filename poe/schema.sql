-- Database Schema

CREATE TABLE conversations (
    id TEXT PRIMARY KEY,
    title TEXT,
    model TEXT,
    created_at INTEGER
);

CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id TEXT,
    role TEXT,
    content TEXT,
    raw_content TEXT,
    timestamp INTEGER,
    model TEXT,
    is_large_file BOOLEAN DEFAULT 0,
    ai_summary TEXT,
    file_original_size INTEGER,
    line_count INTEGER DEFAULT 0,
    r2_key TEXT,
    FOREIGN KEY(conversation_id) REFERENCES conversations(id),
    UNIQUE(conversation_id, role, timestamp)
);

CREATE TABLE api_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id TEXT,
    path TEXT,
    method TEXT,
    timestamp INTEGER
);