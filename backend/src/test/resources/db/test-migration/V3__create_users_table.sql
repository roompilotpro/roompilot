-- Create users table for Google OAuth authentication (H2-compatible version for tests)
-- This table stores user information from Google OAuth 2.0 and role-based access control
-- Note: DEFAULT must come before PRIMARY KEY for H2 compatibility

CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    google_id VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    profile_picture_url TEXT,
    phone VARCHAR(50),
    role VARCHAR(20) CHECK (role IN ('HOST', 'RESIDENT', 'ADMIN')),
    is_dev_user BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_dev_user ON users(is_dev_user);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);
