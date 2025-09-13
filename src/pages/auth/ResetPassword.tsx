import React from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { resetPasswordSchema, ResetPasswordFormData } from '@/lib/validations';
import unicartLogo from '@/assets/unicart-logo.png';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const { toast } = useToast();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-campus-blue/5 to-campus-orange/5">
        <Card className="w-full max-w-md card-elevated">
          <CardContent className="p-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">Invalid Reset Link</h2>
            <p className="text-text-secondary mb-6">This link is invalid or expired.</p>
            <Button asChild><Link to="/auth/forgot-password">Request New Link</Link></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      const resp = await axios.post('/api/auth/reset-password', data);
      if (resp.data?.success) {
        toast({ title: 'Password reset successful', description: 'You can now sign in' });
        navigate('/auth/login');
      } else {
        toast({ title: 'Error', description: resp.data?.msg || 'Unable to reset', variant: 'destructive' });
      }
    } catch (err) {
      console.error('Reset password error', err);
      toast({ title: 'Error', description: 'Network error', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-campus-blue/5 to-campus-orange/5">
      <Card className="w-full max-w-md card-elevated">
        <CardHeader className="space-y-6 text-center">
          <div className="flex items-center justify-center space-x-2"><img src={unicartLogo} alt="UniCart" className="h-8 w-8" /><span className="font-bold text-2xl gradient-primary">UniCart</span></div>
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <p className="text-text-secondary">Enter your new password below</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register('token')} />

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter new password" className="pl-10 pr-10" {...register('password')} />
                <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-3 top-1/2 transform -translate-y-1/2">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </div>
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm new password" className="pl-10 pr-10" {...register('confirmPassword')} />
                <button type="button" onClick={() => setShowConfirmPassword((s) => !s)} className="absolute right-3 top-1/2 transform -translate-y-1/2">{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>}
            </div>

            <Button type="submit" className="w-full btn-hero" size="lg" disabled={isSubmitting}>{isSubmitting ? 'Updating Password...' : 'Update Password'}</Button>
          </form>

          <div className="text-center"><Link to="/auth/login" className="text-sm text-text-secondary hover:text-primary transition-colors flex items-center justify-center gap-1"><ArrowLeft className="h-3 w-3" />Back to Sign In</Link></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
