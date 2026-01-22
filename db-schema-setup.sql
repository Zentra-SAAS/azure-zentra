-- COMPLETE DATABASE SCHEMA FOR ZENTRA
-- This file should be run in Supabase SQL Editor

-- 1. Drop and recreate tables fresh
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS shops CASCADE;

-- 2. Create shops table (organizations)
CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  manager_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'manager', 'staff')),
  avatar_url TEXT,
  organization_id UUID REFERENCES shops(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable RLS
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for shops
CREATE POLICY "shops_select" ON shops FOR SELECT
  TO authenticated USING (manager_id = auth.uid());

CREATE POLICY "shops_insert" ON shops FOR INSERT
  TO authenticated WITH CHECK (manager_id = auth.uid());

CREATE POLICY "shops_update" ON shops FOR UPDATE
  TO authenticated USING (manager_id = auth.uid())
  WITH CHECK (manager_id = auth.uid());

CREATE POLICY "shops_delete" ON shops FOR DELETE
  TO authenticated USING (manager_id = auth.uid());

-- 6. Create RLS policies for users
CREATE POLICY "users_select" ON users FOR SELECT
  TO authenticated USING (auth.uid() = id);

CREATE POLICY "users_insert" ON users FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "users_update" ON users FOR UPDATE
  TO authenticated USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_delete" ON users FOR DELETE
  TO authenticated USING (auth.uid() = id);

-- 7. Create indexes
CREATE INDEX idx_shops_manager_id ON shops(manager_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization_id ON users(organization_id);

-- 8. Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Create triggers
CREATE TRIGGER shops_updated_at
  BEFORE UPDATE ON shops FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
