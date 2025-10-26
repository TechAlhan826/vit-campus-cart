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

  // Cache user data in memory for persistence
  const userCacheRef = React.useRef<User | null>(null);

  // boot: try cookie-based /me first (httpOnly JWT), then fallback to Authorization token from localStorage
  useEffect(() => {
    (async () => {
      await checkAuthStatus();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuthStatus = async () => {
    setLoading(true);
    const token = localStorage.getItem(LOCAL_TOKEN_KEY);

    console.log('[AuthContext] checkAuthStatus start:', { hasToken: !!token, hasCache: !!userCacheRef.current });

    try {
      // First attempt: rely on cookie
      const resp = await axios.get('/api/auth/me');
      const userData = resp.data?.data?.user || resp.data?.user || resp.data?.data || resp.data;
      
      console.log('[AuthContext] Cookie auth success:', userData);
      
      if (userData && userData.id) {
        setUser(userData);
        userCacheRef.current = userData;
        setLoading(false);
        return;
      }
    } catch (err: any) {
      console.log('[AuthContext] Cookie auth failed:', { status: err.response?.status, message: err.message });
      
      // If cookie-based check fails, try token fallback if present
      if (token) {
        try {
          applyToken(token);
          const r2 = await axios.get('/api/auth/me');
          const u2 = r2.data?.data?.user || r2.data?.user || r2.data?.data || r2.data;
          
          console.log('[AuthContext] Token auth success:', u2);
          
          if (u2 && u2.id) {
            setUser(u2);
            userCacheRef.current = u2;
            setLoading(false);
            return;
          }
          // token invalid
          console.log('[AuthContext] Token returned no user, clearing');
          localStorage.removeItem(LOCAL_TOKEN_KEY);
          applyToken(null);
          setUser(null);
          userCacheRef.current = null;
        } catch (err2: any) {
          console.log('[AuthContext] Token auth failed:', { status: err2.response?.status, message: err2.message });
          
          if (err2.response?.status === 401 || err2.response?.status === 403) {
            console.log('[AuthContext] Auth error, clearing session');
            localStorage.removeItem(LOCAL_TOKEN_KEY);
            applyToken(null);
            setUser(null);
            userCacheRef.current = null;
          } else if (userCacheRef.current) {
            // Non-auth error (network/server) - keep cached session
            console.log('[AuthContext] Network error, keeping cache:', userCacheRef.current);
            setUser(userCacheRef.current);
          } else {
            // No cache, remain logged out
            console.log('[AuthContext] No cache available, logging out');
            setUser(null);
          }
        }
      } else if (userCacheRef.current) {
        // No token but have cache - keep session for transient errors
        console.log('[AuthContext] No token, keeping cache:', userCacheRef.current);
        setUser(userCacheRef.current);
      } else {
        // no cache; remain logged out
        console.log('[AuthContext] No token, no cache, logging out');
        setUser(null);
      }
    }
    
    setLoading(false);
  };

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    setLoading(true);
    try {
      const resp = await axios.post('/api/auth/login', {
        ...credentials,
        email: credentials.email.toLowerCase().trim()
      });
      // If server sets cookie, user might not be in payload; still fine
      const responseData = resp.data?.data || resp.data;
      const tokenResp = responseData?.token;
      const u = responseData?.user;

      if (tokenResp) {
        localStorage.setItem(LOCAL_TOKEN_KEY, tokenResp);
        applyToken(tokenResp);
      }

      if (u && u.id) {
        setUser(u);
        userCacheRef.current = u;
      } else {
        // Ensure we hydrate from cookie/token
        await checkAuthStatus();
      }

      toast({ title: 'Welcome back!', description: u?.name || 'Logged in' });
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
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest): Promise<boolean> => {
    setLoading(true);
    try {
      const resp = await axios.post('/api/auth/register', {
        ...data,
        email: data.email.toLowerCase().trim()
      });
      const { token, user: u } = resp.data || {};
      if (token) {
        localStorage.setItem(LOCAL_TOKEN_KEY, token);
        applyToken(token);
      } else applyToken(null);
      if (u) {
        setUser(u);
        userCacheRef.current = u;
      }
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
      userCacheRef.current = null;
      toast({ title: 'Logged out', description: 'You have been logged out' });
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      const resp = await axios.put('/api/auth/profile', data);
      const body = resp.data?.data || resp.data;
      const updatedUser = body?.user || body;
      if (updatedUser && updatedUser.id) {
        setUser(updatedUser);
        userCacheRef.current = updatedUser;
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
