-- Migration: Create resident_profiles table for resident user profile completion
-- This table stores bio, employment status, and optional phone for RESIDENT users

CREATE TABLE resident_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

COMMENT ON TABLE resident_profiles IS 'Stores profile completion data for RESIDENT users including bio and employment information';
COMMENT ON COLUMN resident_profiles.bio IS 'User bio/about section (50-1000 characters)';
COMMENT ON COLUMN resident_profiles.employment_status IS 'Current employment status for rental application review';
COMMENT ON COLUMN resident_profiles.phone IS 'Optional phone number for contact purposes';
COMMENT ON COLUMN resident_profiles.profile_completed IS 'Flag indicating if the resident has completed their profile';
