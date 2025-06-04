-- Drop all existing triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;

-- Drop existing functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_user_sign_in();
DROP FUNCTION IF EXISTS public.sync_user_data();

-- Create a single function to handle all user-related operations
CREATE OR REPLACE FUNCTION public.handle_user_operations()
RETURNS TRIGGER AS $$
DECLARE
    user_email TEXT;
    user_metadata JSONB;
    profile_exists BOOLEAN;
BEGIN
    -- Get email and metadata from auth.users
    SELECT email, raw_user_meta_data INTO user_email, user_metadata
    FROM auth.users
    WHERE id = NEW.id;

    -- Check if profile exists
    SELECT EXISTS (
        SELECT 1 FROM public.profiles WHERE id = NEW.id
    ) INTO profile_exists;

    IF NOT profile_exists THEN
        -- Insert new profile if it doesn't exist
        INSERT INTO public.profiles (
            id,
            username,
            display_name,
            is_admin,
            last_sign_in,
            created_at,
            updated_at
        )
        VALUES (
            NEW.id,
            user_email,
            COALESCE(
                user_metadata->>'full_name',
                user_metadata->>'name',
                user_email
            ),
            false,
            NEW.last_sign_in_at,
            NEW.created_at,
            NEW.updated_at
        );
    ELSE
        -- Update existing profile
        UPDATE public.profiles
        SET
            username = COALESCE(profiles.username, user_email),
            display_name = COALESCE(
                profiles.display_name,
                user_metadata->>'full_name',
                user_metadata->>'name',
                user_email
            ),
            last_sign_in = COALESCE(profiles.last_sign_in, NEW.last_sign_in_at),
            updated_at = timezone('utc'::text, now())
        WHERE id = NEW.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a single trigger for all user operations
CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_user_operations();

-- Ensure the profiles table has all required columns
DO $$ 
BEGIN
    -- Add display_name if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'profiles' AND column_name = 'display_name') THEN
        ALTER TABLE public.profiles ADD COLUMN display_name TEXT;
    END IF;

    -- Add last_sign_in if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'profiles' AND column_name = 'last_sign_in') THEN
        ALTER TABLE public.profiles ADD COLUMN last_sign_in TIMESTAMP WITH TIME ZONE;
    END IF;
END $$; 