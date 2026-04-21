// Azure API Client — replaces Supabase
// All calls go to Azure Functions via /api/* routes

const API_BASE = '/api';
const TOKEN_KEY = 'zentra_token';
const USER_KEY = 'zentra_user';

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStoredUser(user: AuthUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  params?: Record<string, string>
): Promise<{ data: T | null; error: string | null }> {
  try {
    let url = `${API_BASE}${path}`;
    if (params) {
      const qs = new URLSearchParams(params).toString();
      url += `?${qs}`;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    const json = await response.json();

    if (!response.ok) {
      return { data: null, error: json.error || `Request failed with status ${response.status}` };
    }

    return { data: json as T, error: null };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Network error';
    return { data: null, error: message };
  }
}

// ─── Database Types ──────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'staff' | 'accountant' | 'cashier' | 'inventory';
  avatar_url?: string;
  organization_id?: string;
  branch_id?: string;
  user_code?: string;
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

export interface Product {
  id: string;
  shop_id: string;
  name: string;
  description?: string;
  price: number;
  cost_price?: number;
  sku?: string;
  stock_quantity: number;
  low_stock_threshold?: number;
  category?: string;
  created_at: string;
  updated_at: string;
}

export interface Bill {
  id: string;
  shop_id: string;
  cashier_id?: string;
  customer_name?: string;
  customer_phone?: string;
  total_amount: number;
  payment_method: string;
  status: string;
  created_at: string;
  items?: BillItem[];
}

export interface BillItem {
  id: string;
  bill_id: string;
  product_id?: string;
  product_name?: string;
  quantity: number;
  price_at_sale: number;
  subtotal: number;
}

export interface AnalyticsData {
  sales: {
    total_bills: string;
    total_revenue: string;
    monthly_revenue: string;
    weekly_revenue: string;
  };
  low_stock: { low_stock_count: string };
  sales_trend: Array<{ date: string; revenue: string; bill_count: string }>;
  payment_breakdown: Array<{ payment_method: string; count: string; total: string }>;
  top_products: Array<{ name: string; units_sold: string; revenue: string }>;
  employees: { employee_count: string };
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const azureAuth = {
  async signup(email: string, password: string, name: string, shopName: string) {
    const result = await request<{ token: string; user: AuthUser }>('POST', '/auth/signup', {
      email, password, name, shopName
    });
    if (result.data) {
      setToken(result.data.token);
      setStoredUser(result.data.user);
    }
    return result;
  },

  async login(email: string, password: string) {
    const result = await request<{ token: string; user: AuthUser }>('POST', '/auth/login', {
      email, password
    });
    if (result.data) {
      setToken(result.data.token);
      setStoredUser(result.data.user);
    }
    return result;
  },

  async joinOrganization(orgCode: string, passkey: string, userCode: string, email: string, password: string) {
    const result = await request<{ token: string; user: AuthUser }>('POST', '/auth/join', {
      org_code: orgCode, passkey, user_code: userCode, email, password
    });
    if (result.data) {
      setToken(result.data.token);
      setStoredUser(result.data.user);
    }
    return result;
  },

  logout() {
    clearSession();
  },

  getStoredUser,
  getToken,
  isAuthenticated: () => !!getToken()
};

// ─── Data API ────────────────────────────────────────────────────────────────

export const azureApi = {
  // Shops
  getShops: () => request<Organization[]>('GET', '/shops'),
  createShop: (name: string) => request<Organization>('POST', '/shops', { name }),
  updateShop: (id: string, name: string) => request<Organization>('PUT', '/shops', { id, name }),
  deleteShop: (id: string) => request<{ success: boolean }>('DELETE', '/shops', undefined, { id }),

  // Users/Employees
  getUsers: (orgId: string) => request<User[]>('GET', '/users', undefined, { org_id: orgId }),
  createUser: (data: Partial<User> & { org_id: string }) => request<User>('POST', '/users', data),
  updateUser: (data: Partial<User> & { id: string }) => request<User>('PUT', '/users', data),
  deleteUser: (id: string) => request<{ success: boolean }>('DELETE', '/users', undefined, { id }),

  // Products
  getProducts: (shopId: string) => request<Product[]>('GET', '/products', undefined, { shop_id: shopId }),
  createProduct: (data: Partial<Product> & { shop_id: string }) => request<Product>('POST', '/products', data),
  updateProduct: (data: Partial<Product> & { id: string }) => request<Product>('PUT', '/products', data),
  deleteProduct: (id: string) => request<{ success: boolean }>('DELETE', '/products', undefined, { id }),

  // Bills
  getBills: (shopId: string, limit = 50) =>
    request<Bill[]>('GET', '/bills', undefined, { shop_id: shopId, limit: String(limit) }),
  createBill: (data: {
    shop_id: string; cashier_id?: string; customer_name?: string; customer_phone?: string;
    total_amount: number; payment_method: string;
    items: Array<{ product_id: string; quantity: number; price_at_sale: number }>;
  }) => request<Bill>('POST', '/bills', data),

  // Analytics
  getAnalytics: (orgId: string) =>
    request<AnalyticsData>('GET', '/analytics', undefined, { org_id: orgId })
};
