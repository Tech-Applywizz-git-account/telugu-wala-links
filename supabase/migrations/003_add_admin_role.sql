-- Add role column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Create index for role
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Set specific user as admin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'krishna@applywizz.com';

-- Comment
COMMENT ON COLUMN profiles.role IS 'User role: user, admin';
