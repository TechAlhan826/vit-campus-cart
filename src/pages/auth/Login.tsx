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

  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  function goGoogle() {
    window.location.href = '/api/auth/google'; // proxy to backend
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const ok = await login({
        email: formData.email,
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
            <span className="font-bold text-2xl gradient-primary">UniCart</span>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <p className="text-text-secondary">Sign in to your VIT UniCart account</p>
        </CardHeader>

        <button onClick={goGoogle} className="w-full h-9 px-4 py-2 border bg-background shadow-sm">
          Sign in with Google
        </button>

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
