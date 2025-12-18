DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS conversations;

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
    FOREIGN KEY(conversation_id) REFERENCES conversations(id)
);
