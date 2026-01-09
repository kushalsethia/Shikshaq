-- Fix role selection for Google Auth users
-- Remove default role assignment so users are prompted to select their role

-- Update the handle_new_user function to NOT set a default role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert or update profile with Google auth data, but leave role NULL
  INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url',
    NULL -- Don't set a default role - user must select
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = COALESCE(EXCLUDED.email, profiles.email),
    full_name = COALESCE(
      EXCLUDED.full_name,
      profiles.full_name,
      COALESCE(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name')
    ),
    avatar_url = COALESCE(
      EXCLUDED.avatar_url,
      profiles.avatar_url,
      new.raw_user_meta_data ->> 'avatar_url'
    ),
    updated_at = now();
  
  RETURN new;
END;
$$;

-- Update sync function to also not set default role
CREATE OR REPLACE FUNCTION sync_auth_updates_to_profiles()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update profile when auth user metadata changes (e.g., Google OAuth sign-in)
  UPDATE public.profiles
  SET 
    full_name = COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      profiles.full_name
    ),
    avatar_url = COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      profiles.avatar_url
    ),
    email = COALESCE(NEW.email, profiles.email),
    updated_at = now()
  WHERE id = NEW.id;
  
  -- If profile doesn't exist, create it WITHOUT a role
  IF NOT FOUND THEN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
      NEW.raw_user_meta_data->>'avatar_url',
      NULL -- Don't set a default role - user must select
    )
    ON CONFLICT (id) DO UPDATE
    SET
      email = COALESCE(EXCLUDED.email, profiles.email),
      full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
      avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
      updated_at = now();
  END IF;
  
  RETURN NEW;
END;
$$;

