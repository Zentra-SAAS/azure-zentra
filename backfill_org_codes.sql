-- Backfill missing Organization Codes and Passkeys

-- Update existing shops that have null code or passkey
-- We use a portion of the UUID to ensure uniqueness without complex random functions
UPDATE shops
SET 
  org_code = 'ORG-' || upper(substring(id::text from 1 for 8)),
  passkey = 'PASS-' || upper(substring(id::text from 25 for 8))
WHERE org_code IS NULL OR passkey IS NULL;
