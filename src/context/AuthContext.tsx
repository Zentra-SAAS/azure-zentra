import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, AuthUser } from '../lib/supabase';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
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

  const fetchUserProfile = async (supabaseUser: SupabaseUser): Promise<AuthUser | null> => {
    try {
      // Fetch user profile from users table
      const { data: userProfile, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (userError) {
        console.error('Error fetching user profile:', userError);
        return null;
      }

      // Explicitly log branch_id for debugging
      if (userProfile?.branch_id) {
        console.log('User assigned to branch:', userProfile.branch_id);
      }

      // Fetch organization details based on the user's link or role
      let organization = null;

      // 1. Primary Check: If user has an organization_id, fetch that specific shop
      if (userProfile.organization_id) {
        const { data: orgData, error: orgError } = await supabase
          .from('shops')
          .select('*')
          .eq('id', userProfile.organization_id)
          .single();

        if (!orgError && orgData) {
          organization = {
            id: orgData.id,
            name: orgData.name,
            org_code: orgData.org_code,
            passkey: orgData.passkey,
            owner_id: orgData.manager_id, // The manager_id of the shop is the owner
            created_at: orgData.created_at,
            updated_at: orgData.updated_at
          };
        }
      }

      // 2. Fallback for Admins (Owners): If no organization_id is set (legacy or glitch),
      // try to find the shop they own via manager_id
      if (!organization && userProfile.role === 'admin') {
        const { data: orgData, error: orgError } = await supabase
          .from('shops')
          .select('*')
          .eq('manager_id', userProfile.id)
          .single();

        if (!orgError && orgData) {
          organization = {
            id: orgData.id,
            name: orgData.name,
            org_code: orgData.org_code,
            passkey: orgData.passkey,
            owner_id: userProfile.id,
            created_at: orgData.created_at,
            updated_at: orgData.updated_at
          };
        }
      }

      return {
        ...userProfile,
        organization
      };
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    console.log('Login started for:', email);
    try {
      setLoading(true);

      // Authenticate with Supabase
      console.log('Calling signInWithPassword...');
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      console.log('signInWithPassword result:', { authData, authError });

      if (authError) {
        return {
          success: false,
          error: 'Invalid login credentials. Please check your email and password.'
        };
      }

      if (!authData.user) {
        console.error('No user in authData');
        return {
          success: false,
          error: 'Authentication failed. Please try again.'
        };
      }

      // Fetch user profile and check role
      console.log('Fetching user profile...');
      const userProfile = await fetchUserProfile(authData.user);
      console.log('fetchUserProfile result:', userProfile);

      if (!userProfile) {
        console.error('UserProfile is null, signing out.');
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'Unable to load user profile. Please contact support.'
        };
      }

      // Check if user has a valid role
      const validRoles = ['admin', 'manager', 'accountant', 'cashier'];
      if (!validRoles.includes(userProfile.role)) {
        console.warn('User role not authorized:', userProfile.role);
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'Invalid login credentials or insufficient permissions.'
        };
      }

      setUser(userProfile);
      return { success: true };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.'
      };
    } finally {
      console.log('Login finally block - setting loading false');
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    // Helper to safely set user and loading
    const handleSession = async (session: any) => {
      console.log('AuthContext: Handling session update', session ? 'Session exists' : 'No session');

      try {
        if (!session?.user) {
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }

        const userProfile = await fetchUserProfile(session.user);

        if (mounted) {
          if (userProfile && (userProfile.role === 'admin' || userProfile.role === 'manager' || userProfile.role === 'staff' || userProfile.role === 'accountant' || userProfile.role === 'cashier')) {
            // Note: We're allowing all roles now, though UI might restrict access.
            // Logic check: Is this context only for Owners (admins)?
            // The LoginPage says "Owner Login" but we just added Join flow for employees.
            // If this context is global, we should allow all valid roles.
            // Previously it strictly checked 'admin'.
            // We should allow the user to be set, and let pages decide access.

            setUser(userProfile);
          } else {
            console.warn('AuthContext: User profile invalid or role mismatch', userProfile);
            // Only sign out if truly invalid? Or just don't set user?
            // If we just joined as an employee, we want to be logged in.
            setUser(userProfile); // Trust fetchUserProfile return
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('AuthContext: handleSession error', err);
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    };

    // Initialize
    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        await handleSession(session);
      } catch (err) {
        console.error('AuthContext: init error', err);
        if (mounted) setLoading(false);
      }
    };

    init();

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('AuthContext: onAuthStateChange', event);
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION' || event === 'SIGNED_OUT') {
        handleSession(session);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const isOwner = user?.role === 'admin';
  const isManager = user?.role === 'manager';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isOwner, isManager }}>
      {children}
    </AuthContext.Provider>
  );
};