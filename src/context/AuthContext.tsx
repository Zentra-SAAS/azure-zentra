import React, { createContext, useContext, useState, useEffect } from 'react';
import { azureAuth, AuthUser } from '../lib/api';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isOwner: boolean;
  isManager: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedUser = azureAuth.getStoredUser();
    const token = azureAuth.getToken();
    if (storedUser && token) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const { data, error } = await azureAuth.login(email, password);
      if (error || !data) {
        return { success: false, error: error || 'Login failed. Please try again.' };
      }
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Network error. Please check your connection.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    azureAuth.logout();
    setUser(null);
  };

  const isOwner = user?.role === 'admin';
  const isManager = user?.role === 'manager';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isOwner, isManager }}>
      {children}
    </AuthContext.Provider>
  );
};