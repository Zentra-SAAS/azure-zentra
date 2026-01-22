-- Migration: Add Join Flow Columns and RPC

-- 1. Add columns to shops
ALTER TABLE shops 
ADD COLUMN IF NOT EXISTS org_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS passkey TEXT;

-- 2. Add columns to users
ALTER TABLE users
ADD COLUMN IF NOT EXISTS user_code TEXT UNIQUE;

-- 3. Function to generate random codes (optional utility, but good for defaults)
-- We will handle generation in frontend for now to avoid complexity, 
-- but we need to ensure uniqueness.

-- 4. RPC to claim profile
-- This function updates the placeholder user with the new Auth ID
CREATE OR REPLACE FUNCTION claim_employee_profile(
  p_user_code TEXT,
  p_new_auth_id UUID,
  p_email TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with superuser privileges to update ID
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

  -- Verify p_new_auth_id doesn't already exist in users (sanity check)
  IF EXISTS (SELECT 1 FROM users WHERE id = p_new_auth_id) THEN
     -- If the auth user was just created and inserted by a trigger, we might need to handle merge.
     -- Assuming NO trigger inserts into public.users on signup yet.
     RETURN jsonb_build_object('success', false, 'message', 'User ID already exists');
  END IF;

  -- Perform the Update (Primary Key Update)
  -- Note: Updating PK can be risky if FKs exist. 
  -- Ensure no bills/logs exist for this placeholder user yet.
  -- Since they haven't joined, they shouldn't have activity.
  
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
