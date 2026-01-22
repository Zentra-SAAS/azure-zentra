-- ZENTRA FINAL DATABASE SCHEMA
-- Phase 1 Implementation

-- 1. Update Users Table for New Roles
ALTER TABLE users 
DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users 
ADD CONSTRAINT users_role_check 
CHECK (role IN ('admin', 'manager', 'accountant', 'cashier'));

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  cost_price DECIMAL(10,2) DEFAULT 0, -- For profit calculation
  sku TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  category TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Bills (Sales) Table
CREATE TABLE IF NOT EXISTS bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE NOT NULL,
  cashier_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_name TEXT,
  customer_phone TEXT,
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'cash', -- cash, card, upi
  status TEXT DEFAULT 'completed', -- completed, refunded
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Bill Items Table
CREATE TABLE IF NOT EXISTS bill_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_id UUID REFERENCES bills(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_sale DECIMAL(10,2) NOT NULL, -- Snapshot of price at time of sale
  subtotal DECIMAL(10,2) GENERATED ALWAYS AS (quantity * price_at_sale) STORED
);

-- 5. Create Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE bill_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies (Simplified for Phase 1)

-- PRODUCTS Policies
CREATE POLICY "products_read_all" ON products FOR SELECT
  TO authenticated USING (true); -- Optimize later for multi-tenant strictness

CREATE POLICY "products_manage_admin_manager" ON products FOR ALL
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'manager')
      AND users.organization_id = products.shop_id
    )
  );

-- BILLS Policies
CREATE POLICY "bills_read_all_staff" ON bills FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "bills_insert_cashier" ON bills FOR INSERT
  TO authenticated WITH CHECK (true); -- Allow creation by authenticated users

-- 8. Indexes for Performance
CREATE INDEX idx_products_shop ON products(shop_id);
CREATE INDEX idx_bills_shop ON bills(shop_id);
CREATE INDEX idx_bills_date ON bills(created_at);
