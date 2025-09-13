import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
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

const LOCAL_TOKEN_KEY = 'unicart_token';

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
    try {
      const token = localStorage.getItem(LOCAL_TOKEN_KEY);
      if (token) {
        applyToken(token);
  const resp = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`); // uses Authorization header
        if (resp.data?.user) {
          setUser(resp.data.user);
          return;
        }
        // fallback: clear invalid token
        localStorage.removeItem(LOCAL_TOKEN_KEY);
        applyToken(null);
      }

      // try cookie-based session (credentials: include)
      try {
  const resp2 = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, { withCredentials: true });
        if (resp2.data?.user) {
          setUser(resp2.data.user);
        }
      } catch {
        setUser(null);
      }
    } catch (err) {
      console.error('checkAuthStatus error', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    setLoading(true);
    try {
      // prefer proxy path; backend may return { token, user } or set cookie
  const resp = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, credentials, { withCredentials: true });
      const { token, user: u } = resp.data || {};

      if (token) {
        localStorage.setItem(LOCAL_TOKEN_KEY, token);
        applyToken(token);
      } else {
        // ensure no stale token header
        applyToken(null);
      }

      if (u) setUser(u);
      toast({ title: 'Welcome back!', description: u?.name || 'Logged in' });
      return true;
    } catch (err: any) {
      console.error('login error', err);
      toast({ title: 'Login failed', description: err.response?.data?.msg || err.message || 'Invalid credentials', variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest): Promise<boolean> => {
    setLoading(true);
    try {
  const resp = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, data, { withCredentials: true });
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
      toast({ title: 'Registration failed', description: err.response?.data?.msg || err.message || 'Unable to register', variant: 'destructive' });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // best-effort server logout (clears cookie) and local cleanup
  await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {}, { withCredentials: true });
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
  const resp = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/auth/profile`, data, { withCredentials: true });
      if (resp.data?.user) {
        setUser(resp.data.user);
        toast({ title: 'Profile updated', description: 'Saved' });
        return true;
      }
      toast({ title: 'Update failed', description: resp.data?.msg || 'Unable to update', variant: 'destructive' });
      return false;
    } catch (err) {
      console.error('updateProfile', err);
      toast({ title: 'Update failed', description: 'Network error', variant: 'destructive' });
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
