-- schema.sql
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id TEXT NOT NULL,
  endpoint TEXT NOT NULL UNIQUE,
  auth TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS reminders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  device_id TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  due_at INTEGER NOT NULL,             -- ms since epoch
  nudge_sent INTEGER NOT NULL DEFAULT 0,
  delivered_at INTEGER,                -- ms since epoch
  deleted INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  pushdeer INTEGER NOT NULL DEFAULT 0  -- 是否推送至Pushdeer
);

CREATE INDEX IF NOT EXISTS idx_reminders_device ON reminders(device_id);
CREATE INDEX IF NOT EXISTS idx_reminders_due ON reminders(due_at);
CREATE INDEX IF NOT EXISTS idx_reminders_pending ON reminders(device_id, due_at, nudge_sent, delivered_at, deleted);
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_endpoint ON subscriptions(endpoint);