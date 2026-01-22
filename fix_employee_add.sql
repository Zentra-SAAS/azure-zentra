-- Fix Employee Creation Issues

-- 1. Enable RLS on users table (if not already)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 2. Drop Foreign Key to auth.users if it exists (to allow placeholder users)
-- We attempt to drop standard named constraints.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'users_id_fkey') THEN
    ALTER TABLE users DROP CONSTRAINT users_id_fkey;
  END IF;
  -- Also check for common other names or rely on the fact that if it exists, we need to remove it.
  -- Supabase often names it users_id_fkey.
END $$;

-- 3. Ensure users.id has a default value definition
ALTER TABLE users ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 4. RLS Policies

-- Allow users to read members of their own organization
DROP POLICY IF EXISTS "users_read_own_org" ON users;
CREATE POLICY "users_read_own_org" ON users FOR SELECT
TO authenticated
USING (
  organization_id IN (
    SELECT organization_id FROM users WHERE id = auth.uid()
  )
  OR id = auth.uid() -- Allow reading own profile even if org is null (rare)
);

-- Allow Admins/Managers to INSERT new employees into their organization
DROP POLICY IF EXISTS "users_insert_admin" ON users;
CREATE POLICY "users_insert_admin" ON users FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users AS requesting_user
    WHERE requesting_user.id = auth.uid()
    AND requesting_user.role IN ('admin', 'manager')
    AND requesting_user.organization_id = users.organization_id
  )
);

-- Allow Admins/Managers to UPDATE employees in their organization
DROP POLICY IF EXISTS "users_update_admin" ON users;
CREATE POLICY "users_update_admin" ON users FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users AS requesting_user
    WHERE requesting_user.id = auth.uid()
    AND requesting_user.role IN ('admin', 'manager')
    AND requesting_user.organization_id = users.organization_id
  )
);

-- Allow Admins/Managers to DELETE employees in their organization
DROP POLICY IF EXISTS "users_delete_admin" ON users;
CREATE POLICY "users_delete_admin" ON users FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users AS requesting_user
    WHERE requesting_user.id = auth.uid()
    AND requesting_user.role IN ('admin', 'manager')
    AND requesting_user.organization_id = users.organization_id
  )
);

-- 5. Fix potential recursion in policies
-- The above policies query `users` table while checking permissions on `users`.
-- This can cause infinite recursion.
-- Solutions:
-- A) Use a helper function with SECURITY DEFINER to fetch access level.
-- B) rely on JWT metadata if available (not using custom claims yet).
-- C) Be careful. `using (organization_id in ...)` is recursive.

-- Let's create a secure function to check permission to avoid direct table recursion if possible,
-- or Supabase usually handles simple self-reference if careful.
-- However, "users_read_own_org" checking "users" can loop.

-- BETTER APPROACH: Use a function to get the current user's org and role without RLS interference.

CREATE OR REPLACE FUNCTION get_auth_user_role()
RETURNS TABLE (organization_id UUID, role TEXT)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT organization_id, role FROM users WHERE id = auth.uid();
$$;

-- PROPER POLICIES USING THE FUNCTION

DROP POLICY IF EXISTS "users_read_own_org" ON users;
CREATE POLICY "users_read_own_org" ON users FOR SELECT
TO authenticated
USING (
  organization_id = (SELECT organization_id FROM get_auth_user_role())
  OR id = auth.uid()
);

DROP POLICY IF EXISTS "users_insert_admin" ON users;
CREATE POLICY "users_insert_admin" ON users FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT role FROM get_auth_user_role()) IN ('admin', 'manager')
  AND
  organization_id = (SELECT organization_id FROM get_auth_user_role())
);

DROP POLICY IF EXISTS "users_update_admin" ON users;
CREATE POLICY "users_update_admin" ON users FOR UPDATE
TO authenticated
USING (
  (SELECT role FROM get_auth_user_role()) IN ('admin', 'manager')
  AND
  organization_id = (SELECT organization_id FROM get_auth_user_role())
);

DROP POLICY IF EXISTS "users_delete_admin" ON users;
CREATE POLICY "users_delete_admin" ON users FOR DELETE
TO authenticated
USING (
  (SELECT role FROM get_auth_user_role()) IN ('admin', 'manager')
  AND
  organization_id = (SELECT organization_id FROM get_auth_user_role())
);
