-- Add has_password column to profiles table
-- This tracks whether a user has set a password (true) or only uses OAuth (false)

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS has_password BOOLEAN DEFAULT false;

-- Add comment
COMMENT ON COLUMN public.profiles.has_password IS 
'Indicates whether the user has set a password. True if password exists, false if user only uses OAuth (like Google Auth).';

-- Update existing profiles based on whether they have a password in auth.users
-- Users with OAuth only will have encrypted_password = NULL
-- Users with password will have encrypted_password set
UPDATE public.profiles p
SET has_password = (
  SELECT CASE 
    WHEN au.encrypted_password IS NOT NULL AND au.encrypted_password != '' THEN true
    ELSE false
  END
  FROM auth.users au
  WHERE au.id = p.id
);

-- Create function to check and update has_password when password is set
CREATE OR REPLACE FUNCTION public.update_has_password_on_password_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- When password is set or changed, update has_password to true
  IF NEW.encrypted_password IS NOT NULL AND NEW.encrypted_password != '' THEN
    UPDATE public.profiles
    SET has_password = true
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to update has_password when password changes in auth.users
DROP TRIGGER IF EXISTS on_auth_user_password_change ON auth.users;
CREATE TRIGGER on_auth_user_password_change
  AFTER UPDATE OF encrypted_password ON auth.users
  FOR EACH ROW
  WHEN (NEW.encrypted_password IS DISTINCT FROM OLD.encrypted_password)
  EXECUTE FUNCTION public.update_has_password_on_password_change();

-- Also update on INSERT if password is set during signup
CREATE OR REPLACE FUNCTION public.set_has_password_on_user_creation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If user is created with a password, set has_password to true
  IF NEW.encrypted_password IS NOT NULL AND NEW.encrypted_password != '' THEN
    UPDATE public.profiles
    SET has_password = true
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to set has_password when user is created with password
DROP TRIGGER IF EXISTS on_auth_user_created_with_password ON auth.users;
CREATE TRIGGER on_auth_user_created_with_password
  AFTER INSERT ON auth.users
  FOR EACH ROW
  WHEN (NEW.encrypted_password IS NOT NULL AND NEW.encrypted_password != '')
  EXECUTE FUNCTION public.set_has_password_on_user_creation();

-- Create function to check has_password by email (for client-side use)
CREATE OR REPLACE FUNCTION public.check_has_password_by_email(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_has_password BOOLEAN;
BEGIN
  SELECT COALESCE(p.has_password, false) INTO user_has_password
  FROM public.profiles p
  INNER JOIN auth.users au ON au.id = p.id
  WHERE au.email = user_email
  LIMIT 1;
  
  RETURN COALESCE(user_has_password, false);
END;
$$;

-- Grant execute permission to authenticated and anon users
GRANT EXECUTE ON FUNCTION public.check_has_password_by_email(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_has_password_by_email(TEXT) TO anon;

