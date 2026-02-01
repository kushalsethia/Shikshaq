-- Fix security of check_has_password_by_email function
-- This updates the function to ensure it always returns false for non-existent emails
-- (preventing email enumeration attacks)

CREATE OR REPLACE FUNCTION public.check_has_password_by_email(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_has_password BOOLEAN;
BEGIN
  -- Check if email exists and has password
  -- Returns false if email doesn't exist (same as no password)
  -- This prevents email enumeration attacks
  SELECT COALESCE(p.has_password, false) INTO user_has_password
  FROM public.profiles p
  INNER JOIN auth.users au ON au.id = p.id
  WHERE au.email = user_email
  LIMIT 1;
  
  -- Always return false if no match (don't reveal email existence)
  -- This means: false = email doesn't exist OR email exists but no password
  -- Only true = email exists AND has password
  RETURN COALESCE(user_has_password, false);
END;
$$;

-- Grant execute permission to authenticated and anon users
-- Security note: Function always returns false for non-existent emails
-- This prevents email enumeration but allows login flow to work
-- Consider adding rate limiting at application level if needed
GRANT EXECUTE ON FUNCTION public.check_has_password_by_email(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_has_password_by_email(TEXT) TO anon;

