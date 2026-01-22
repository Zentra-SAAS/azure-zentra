import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'staff' | 'accountant' | 'cashier' | 'inventory';
  avatar_url?: string;
  organization_id?: string;
  branch_id?: string; // Specific shop/branch assignment
  user_code?: string; // For joining an organization
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  org_code: string;
  passkey: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
}

export interface AuthUser extends User {
  organization?: Organization;
}