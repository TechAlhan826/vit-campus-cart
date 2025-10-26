import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Mail, Lock, Phone, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import unicartLogo from '@/assets/unicart-logo.png';
//import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'user' as 'user' | 'seller',
    collegeRoll: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register: registerCtx } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({ title: 'Password mismatch', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    if (!formData.agreeToTerms) {
      toast({ title: 'Terms required', description: 'Please accept terms', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      // use context register so state syncs centrally
      const ok = await registerCtx({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
        collegeRoll: formData.collegeRoll,
      } as any);
      if (ok) navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleRoleChange = (role: 'user' | 'seller') => setFormData((p) => ({ ...p, role }));

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-campus-blue/5 to-campus-orange/5">
      <Card className="w-full max-w-md card-elevated">
        <CardHeader className="space-y-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <img src={unicartLogo} alt="UniCart" className="h-8 w-8" />
            <span className="font-bold text-2xl gradient-secondary">UniCart</span>
          </div>
          <CardTitle className="text-2xl font-bold">Join VIT Community</CardTitle>
          <p className="text-text-secondary">Create your account to start buying and selling</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="name" name="name" type="text" placeholder="Enter your full name" value={formData.name} onChange={handleChange} className="pl-10" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">VIT Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" name="email" type="email" placeholder="your.roll@vitstudent.ac.in" value={formData.email} onChange={handleChange} className="pl-10" required />
              </div>
              <p className="text-xs text-text-muted">Use your official VIT email for verification</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="collegeRoll">College Roll Number</Label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="collegeRoll" name="collegeRoll" type="text" placeholder="e.g., 23BCA0173" value={formData.collegeRoll} onChange={handleChange} className="pl-10" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="phone" name="phone" type="tel" placeholder="+91 99999 00000" value={formData.phone} onChange={handleChange} className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Account Type</Label>
              <Select value={formData.role} onValueChange={handleRoleChange}>
                <SelectTrigger><SelectValue placeholder="Select account type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">Buyer</SelectItem>
                  <SelectItem value="seller">Seller (Buy & Sell)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-text-muted">{formData.role === 'seller' ? 'Seller accounts require verification' : 'You can upgrade later'}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" value={formData.password} onChange={handleChange} className="pl-10 pr-10" required />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 transform -translate-y-1/2">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} className="pl-10 pr-10" required />
                <button type="button" onClick={() => setShowConfirmPassword((s) => !s)} className="absolute right-3 top-1/2 transform -translate-y-1/2">{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox id="agreeToTerms" name="agreeToTerms" checked={formData.agreeToTerms} onCheckedChange={(c) => setFormData((p) => ({ ...p, agreeToTerms: !!c }))} />
              <div className="text-sm">
                <Label htmlFor="agreeToTerms" className="text-sm">I agree to the <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link></Label>
              </div>
            </div>

            <Button type="submit" className="w-full btn-hero" size="lg" disabled={loading}>{loading ? 'Creating Account...' : 'Create Account'}</Button>
          </form>

          <div className="text-center text-sm text-text-secondary">Already have an account? <Link to="/auth/login" className="text-primary font-medium hover:underline">Sign In</Link></div>
          <div className="text-center"><Link to="/" className="text-sm text-text-secondary hover:text-primary">← Back to Home</Link></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
