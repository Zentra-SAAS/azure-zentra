-- Securely verify organization credentials
-- This avoids exposing the 'shops' table or passkeys to the public via RLS

CREATE OR REPLACE FUNCTION verify_organization_credentials(
  p_org_code TEXT,
  p_passkey TEXT
)
RETURNS TABLE (id UUID, name TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT s.id, s.name
  FROM shops s
  WHERE s.org_code = p_org_code
  AND s.passkey = p_passkey;
END;
$$;

CREATE OR REPLACE FUNCTION verify_user_code(
  p_user_code TEXT,
  p_org_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE user_code = p_user_code
    AND organization_id = p_org_id
  );
END;
$$;
