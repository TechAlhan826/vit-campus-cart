import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import unicartLogo from '@/assets/unicart-logo.png';
//import axios from 'axios';

const Login = () => {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);

  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  // Handle Google OAuth callback
  useEffect(() => {
    if (location.pathname === '/auth/google/callback') {
      const params = new URLSearchParams(location.search);
      const token = params.get('token');
      const error = params.get('error');

      if (error) {
        toast({
          title: 'Google Sign-In Failed',
          description: decodeURIComponent(error),
          variant: 'destructive',
        });
        navigate('/auth/login', { replace: true });
      } else if (token) {
        // Store token and trigger auth check
        localStorage.setItem('token', token);
        toast({
          title: 'Welcome!',
          description: 'Successfully signed in with Google',
        });
        // Force full reload to let AuthContext pick up the token
        window.location.href = from;
      } else if (isAuthenticated) {
        // Cookie-based auth already set by backend
        navigate(from, { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  function goGoogle() {
    // Redirect to backend Google OAuth; backend will set cookie and redirect back
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const ok = await login({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        rememberMe: formData.rememberMe,
      });
      if (ok) navigate(from, { replace: true });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-campus-blue/5 to-campus-orange/5">
      <Card className="w-full max-w-md card-elevated">
        <CardHeader className="space-y-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <img src={unicartLogo} alt="UniCart" className="h-8 w-8" />
            <span className="font-bold text-2xl gradient-secondary">UniCart</span>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <p className="text-text-secondary">Sign in to your VIT UniCart account</p>
        </CardHeader>

        <div className="px-6">
          <button
            onClick={goGoogle}
            className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background hover:bg-muted transition-colors text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.74,6.053,29.122,4,24,4C12.955,4,4,12.955,4,24 s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C33.74,6.053,29.122,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.197l-6.196-5.238C29.211,35.091,26.715,36,24,36 c-5.201,0-9.616-3.317-11.283-7.946l-6.541,5.036C9.482,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.794,2.24-2.231,4.166-4.089,5.565 c0.001-0.001,0.001-0.001,0.002-0.002l6.196,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
            Continue with Google
          </button>
          <div className="flex items-center gap-3 my-4">
            <div className="h-px bg-border flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px bg-border flex-1" />
          </div>
        </div>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">VIT Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" name="email" type="email" placeholder="your.roll@vitstudent.ac.in" value={formData.email} onChange={handleChange} className="pl-10" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={formData.password} onChange={handleChange} className="pl-10 pr-10" required />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="rememberMe" name="rememberMe" checked={formData.rememberMe} onCheckedChange={(c) => setFormData((p) => ({ ...p, rememberMe: !!c }))} />
                <Label htmlFor="rememberMe" className="text-sm">Remember me</Label>
              </div>
              <Link to="/auth/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
            </div>

            <Button type="submit" className="w-full btn-hero" size="lg" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</Button>
          </form>

          <div className="text-center text-sm text-text-secondary">
            Don't have an account? <Link to="/auth/register" className="text-primary font-medium hover:underline">Join VIT Community</Link>
          </div>

          <div className="text-center"><Link to="/" className="text-sm text-text-secondary hover:text-primary">← Back to Home</Link></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
