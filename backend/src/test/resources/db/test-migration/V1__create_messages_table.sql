-- Create messages table
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    content VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on created_at for sorting
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
