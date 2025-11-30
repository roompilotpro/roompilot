-- Create users table for Google OAuth authentication
-- This table stores user information from Google OAuth 2.0 and role-based access control

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    google_id VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    profile_picture_url TEXT,
    phone VARCHAR(50),
    role VARCHAR(20) CHECK (role IN ('HOST', 'RESIDENT', 'ADMIN')),
    is_dev_user BOOLEAN NOT NULL DEFAULT FALSE, -- Flag for users created via development auth endpoint
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP -- Soft delete support
);

-- Create indexes for performance
CREATE INDEX idx_users_google_id ON users(google_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_dev_user ON users(is_dev_user);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);

-- Add comments for documentation
COMMENT ON TABLE users IS 'Users table for Google OAuth 2.0 authentication and role-based access control';
COMMENT ON COLUMN users.google_id IS 'Unique identifier from Google OAuth (sub claim)';
COMMENT ON COLUMN users.email IS 'User email from Google account';
COMMENT ON COLUMN users.full_name IS 'User full name from Google profile';
COMMENT ON COLUMN users.profile_picture_url IS 'URL to user profile picture from Google';
COMMENT ON COLUMN users.role IS 'User role: HOST (property manager), RESIDENT (tenant), or ADMIN (platform admin)';
COMMENT ON COLUMN users.is_dev_user IS 'Flag indicating user was created via development auth endpoint (for testing only)';
COMMENT ON COLUMN users.deleted_at IS 'Soft delete timestamp - user is considered deleted if this is not null';
