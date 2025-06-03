-- Create a function to sync user data from auth.users to profiles
CREATE OR REPLACE FUNCTION sync_user_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Get the user's email from auth.users
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
      INSERT INTO public.profiles (id, username, display_name, last_sign_in)
      VALUES (
        NEW.id,
        user_email,
        COALESCE(
          user_metadata->>'full_name',
          user_metadata->>'name',
          user_email
        ),
        NEW.last_sign_in_at
      );
    ELSE
      -- Update existing profile
      UPDATE public.profiles
      SET
        -- Use email as username if username is null
        username = COALESCE(profiles.username, user_email),
        -- Use display_name from metadata if available and display_name is null
        display_name = COALESCE(profiles.display_name, 
          CASE 
            WHEN user_metadata->>'full_name' IS NOT NULL THEN user_metadata->>'full_name'
            WHEN user_metadata->>'name' IS NOT NULL THEN user_metadata->>'name'
            ELSE user_email
          END
        ),
        -- Update last_sign_in
        last_sign_in = COALESCE(profiles.last_sign_in, NEW.last_sign_in_at)
      WHERE id = NEW.id;
    END IF;

    RETURN NEW;
  END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to run the sync function after insert or update on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_data();

-- Create a trigger to run the sync function after insert on profiles
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_data(); 