-- Migration: Add branch_id to users table for RBAC isolation
-- Links a user (employee) to a specific shop (branch)

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS branch_id UUID REFERENCES shops(id) ON DELETE SET NULL;

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_users_branch ON users(branch_id);

-- Explicit comment explaining the field
COMMENT ON COLUMN users.branch_id IS 'The specific shop/branch this employee is assigned to. If NULL, they might be an Owner or floating staff.';

-- Update Role Constraint to support "Inventory" and "Staff"
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('admin', 'manager', 'accountant', 'cashier', 'inventory', 'staff'));
