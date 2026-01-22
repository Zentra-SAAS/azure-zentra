-- FINAL FIX FOR JOIN FLOW
-- Run this in Supabase SQL Editor

-- 1. Fix the Trigger Function to handle Email Conflicts gracefully
-- This prevents "Database error saving new user" when email already exists
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', 'New User'),
    COALESCE(new.raw_user_meta_data->>'role', 'manager')
  )
  ON CONFLICT (email) DO NOTHING; -- Key fix: Don't crash if email exists
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Fix claim_employee_profile to handle "Shell Users"
-- This ensures we can link the new Auth ID to the existing placeholder profile
CREATE OR REPLACE FUNCTION claim_employee_profile(
  p_user_code TEXT,
  p_new_auth_id UUID,
  p_email TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_shop_id UUID;
BEGIN
  -- Find the user by code
  SELECT id, organization_id INTO v_user_id, v_shop_id
  FROM users
  WHERE user_code = p_user_code;

  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'Invalid user code');
  END IF;

  -- Handle Shell User created by Trigger
  -- If the trigger inserted a row (because email didn't exist yet but user is new), 
  -- we need to remove it to allow the placeholder to take this ID.
  IF EXISTS (SELECT 1 FROM users WHERE id = p_new_auth_id) THEN
     DELETE FROM users WHERE id = p_new_auth_id;
  END IF;

  -- Perform the Update (Primary Key Update)
  UPDATE users
  SET 
    id = p_new_auth_id,
    email = p_email,
    user_code = NULL, -- Clear code so it can't be reused
    updated_at = now()
  WHERE user_code = p_user_code;

  RETURN jsonb_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'message', SQLERRM);
END;
$$;
