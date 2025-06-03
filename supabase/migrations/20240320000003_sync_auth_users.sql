-- Add any missing columns to profiles table
DO $$ 
BEGIN
    -- Add username if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'profiles' AND column_name = 'username') THEN
        ALTER TABLE public.profiles ADD COLUMN username TEXT;
    END IF;

    -- Add display_name if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'profiles' AND column_name = 'display_name') THEN
        ALTER TABLE public.profiles ADD COLUMN display_name TEXT;
    END IF;

    -- Add is_admin if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'profiles' AND column_name = 'is_admin') THEN
        ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT false;
    END IF;

    -- Add last_sign_in if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'profiles' AND column_name = 'last_sign_in') THEN
        ALTER TABLE public.profiles ADD COLUMN last_sign_in TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Sync essential data from auth.users to profiles
INSERT INTO public.profiles (id, username, display_name, last_sign_in, created_at, updated_at)
SELECT 
    au.id,
    au.email as username,
    COALESCE(au.raw_user_meta_data->>'full_name', au.email) as display_name,
    au.last_sign_in_at as last_sign_in,
    au.created_at,
    au.updated_at
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
ON CONFLICT (id) DO UPDATE
SET 
    username = EXCLUDED.username,
    display_name = EXCLUDED.display_name,
    last_sign_in = EXCLUDED.last_sign_in,
    updated_at = EXCLUDED.updated_at; 