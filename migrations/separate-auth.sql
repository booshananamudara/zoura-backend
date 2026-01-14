-- Migration: Separate User and Vendor Authentication
-- This migration removes the relationship between users and vendors
-- and makes vendors a completely independent authentication entity

-- Step 1: Delete all existing data (already done via psql)
-- DELETE FROM products;
-- DELETE FROM vendors;
-- DELETE FROM users;

-- Step 2: Drop user-vendor relationship
ALTER TABLE vendors DROP CONSTRAINT IF EXISTS "FK_vendors_users";
ALTER TABLE vendors DROP COLUMN IF EXISTS "userId";
ALTER TABLE users DROP COLUMN IF EXISTS "vendorId";

-- Step 3: Add vendor auth fields
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS password VARCHAR(255);
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS name VARCHAR(255);

-- Step 4: Add unique constraint on vendor email
ALTER TABLE vendors DROP CONSTRAINT IF EXISTS "UQ_vendors_email";
ALTER TABLE vendors ADD CONSTRAINT "UQ_vendors_email" UNIQUE (email);

-- Step 5: Make vendor auth fields NOT NULL (after they exist)
-- We'll set these in code after initial migration

-- Step 6: Remove role from users table
ALTER TABLE users DROP COLUMN IF EXISTS role;

-- Step 7: Verify schema
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'vendors' 
ORDER BY ordinal_position;
