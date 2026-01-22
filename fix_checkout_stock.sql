-- Fix for Checkout Issue: Add decrement_stock RPC

-- This function allows authenticated users (including cashiers) to decrement stock
-- It runs with SECURITY DEFINER to bypass RLS checks on the products table for the update
-- but ensures the user can only decrement stock if available.

CREATE OR REPLACE FUNCTION decrement_stock(row_id UUID, quantity INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_stock INTEGER;
BEGIN
  -- Check current stock
  SELECT stock_quantity INTO current_stock
  FROM products
  WHERE id = row_id;

  IF current_stock IS NULL THEN
    RAISE EXCEPTION 'Product not found';
  END IF;

  IF current_stock < quantity THEN
    RAISE EXCEPTION 'Insufficient stock';
  END IF;

  -- Update stock
  UPDATE products
  SET stock_quantity = stock_quantity - quantity,
      updated_at = now()
  WHERE id = row_id;
END;
$$;
