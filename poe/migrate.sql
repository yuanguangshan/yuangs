-- Migration script to ensure database schema is up to date

-- Add missing columns to messages table
ALTER TABLE messages ADD COLUMN is_large_file BOOLEAN DEFAULT 0;
ALTER TABLE messages ADD COLUMN file_original_size INTEGER;
ALTER TABLE messages ADD COLUMN line_count INTEGER DEFAULT 0;
ALTER TABLE messages ADD COLUMN r2_key TEXT;
ALTER TABLE messages ADD COLUMN ai_summary TEXT;