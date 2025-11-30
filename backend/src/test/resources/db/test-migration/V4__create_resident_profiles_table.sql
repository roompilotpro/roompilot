-- Create resident_profiles table for resident user profile completion (H2-compatible version for tests)
-- This table stores bio, employment status, and optional phone for RESIDENT users
-- Note: DEFAULT must come before PRIMARY KEY for H2 compatibility

CREATE TABLE resident_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT NOT NULL,
    employment_status VARCHAR(30) NOT NULL CHECK (employment_status IN (
        'EMPLOYED',
        'SELF_EMPLOYED',
        'PART_TIME',
        'CONTRACTOR',
        'STUDENT',
        'RETIRED',
        'DISABLED',
        'UNEMPLOYED',
        'OTHER'
    )),
    phone VARCHAR(50),
    profile_completed BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Add constraint for bio length (50-1000 characters)
ALTER TABLE resident_profiles
ADD CONSTRAINT chk_bio_length CHECK (char_length(bio) >= 50 AND char_length(bio) <= 1000);

-- Indexes for common queries
CREATE INDEX idx_resident_profiles_user_id ON resident_profiles(user_id);
CREATE INDEX idx_resident_profiles_employment_status ON resident_profiles(employment_status);
CREATE INDEX idx_resident_profiles_profile_completed ON resident_profiles(profile_completed);
