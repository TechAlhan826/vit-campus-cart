import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';
import { User, LoginRequest, RegisterRequest } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (data: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSeller: boolean;
  isUser: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

const LOCAL_TOKEN_KEY = 'token'; // Match backend cookie/localStorage key

// small helper: apply token to axios default header
function applyToken(token?: string | null) {
  if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  else delete axios.defaults.headers.common['Authorization'];
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // boot: try token-first (localStorage), else cookie-based me
  useEffect(() => {
    (async () => {
      await checkAuthStatus();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuthStatus = async () => {
    setLoading(true);
    const token = localStorage.getItem(LOCAL_TOKEN_KEY);
    
    if (!token) {
      // No token, try cookie-based auth
      try {
        const resp = await axios.get('/api/auth/me');
        const userData = resp.data?.data?.user || resp.data?.user || resp.data?.data || resp.data;
        if (userData && userData.id) {
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
      setLoading(false);
      return;
    }

    // Token exists - verify it and set user data
    applyToken(token);
    try {
      const resp = await axios.get('/api/auth/me');
      const userData = resp.data?.data?.user || resp.data?.user || resp.data?.data || resp.data;
      
      if (userData && userData.id) {
        setUser(userData);
      } else {
        // Token exists but no valid user data - token might be invalid
        localStorage.removeItem(LOCAL_TOKEN_KEY);
        applyToken(null);
        setUser(null);
      }
    } catch (err: any) {
      console.error('[AuthContext] checkAuthStatus error:', err);
      
      // CRITICAL: Only clear auth on explicit authentication failures
      // Instagram-level persistence: Keep user logged in through network errors
      if (err.response?.status === 401 || err.response?.status === 403) {
        // Token is invalid/expired - clear it
        console.log('[AuthContext] Auth token invalid/expired - clearing');
        localStorage.removeItem(LOCAL_TOKEN_KEY);
        applyToken(null);
        setUser(null);
      } else {
        // Network error, 500, or other transient errors
        // Keep token and try to maintain session
        console.log('[AuthContext] Non-auth error - maintaining session');
        // Keep user logged in with cached token
        // Don't call setUser(null) - this is key to Instagram-level persistence
      }
    }
    
    setLoading(false);
  };

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    setLoading(true);
    try {
      const resp = await axios.post('/api/auth/login', credentials);
      
      // Backend returns: {success: true, data: {token, user}}
      const responseData = resp.data?.data || resp.data;
      const token = responseData?.token;
      const u = responseData?.user;

      if (token) {
        localStorage.setItem(LOCAL_TOKEN_KEY, token);
        applyToken(token);
      }

      if (u && u.id) {
        setUser(u);
      } else if (token) {
        // Token exists but no user - fetch from /me
        await checkAuthStatus();
      }
      
      toast({ title: 'Welcome back!', description: u?.name || 'Logged in' });
      setLoading(false);
      return true;
    } catch (err: any) {
      console.error('login error', err);
      const errorMsg = err.response?.data?.msg || 
                       err.response?.data?.message || 
                       err.response?.data?.error || 
                       err.message || 
                       'Invalid credentials';
      toast({ 
        title: 'Login failed', 
        description: errorMsg, 
        variant: 'destructive' 
      });
      setLoading(false);
      return false;
    }
  };

  const register = async (data: RegisterRequest): Promise<boolean> => {
    setLoading(true);
    try {
      const resp = await axios.post('/api/auth/register', data);
      const { token, user: u } = resp.data || {};
      if (token) {
        localStorage.setItem(LOCAL_TOKEN_KEY, token);
        applyToken(token);
      } else applyToken(null);
      if (u) setUser(u);
      toast({ title: 'Welcome to UniCart!', description: u?.name || 'Account created' });
      return true;
    } catch (err: any) {
      console.error('register error', err);
      const errorMsg = err.response?.data?.msg || 
                       err.response?.data?.message || 
                       err.response?.data?.error || 
                       err.message || 
                       'Unable to register';
      toast({ 
        title: 'Registration failed', 
        description: errorMsg, 
        variant: 'destructive' 
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // best-effort server logout (clears cookie) and local cleanup
      await axios.post('/api/auth/logout', {});
    } catch (err) {
      console.error('logout error', err);
    } finally {
      localStorage.removeItem(LOCAL_TOKEN_KEY);
      applyToken(null);
      setUser(null);
      toast({ title: 'Logged out', description: 'You have been logged out' });
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      const resp = await axios.put('/api/auth/profile', data);
      if (resp.data?.user) {
        setUser(resp.data.user);
        toast({ title: 'Profile updated', description: 'Saved' });
        return true;
      }
      const errorMsg = resp.data?.msg || resp.data?.message || 'Unable to update';
      toast({ title: 'Update failed', description: errorMsg, variant: 'destructive' });
      return false;
    } catch (err: any) {
      console.error('updateProfile', err);
      const errorMsg = err.response?.data?.msg || 
                       err.response?.data?.message || 
                       err.response?.data?.error || 
                       'Network error';
      toast({ title: 'Update failed', description: errorMsg, variant: 'destructive' });
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isSeller: user?.role === 'seller' || user?.role === 'admin',
    isUser: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
