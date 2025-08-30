import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/lib/validations';
import unicartLogo from '@/assets/unicart-logo.png';

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const api = useApi();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await api.post('/api/auth/forgot-password', data);
      
      if (response?.success) {
        setIsSubmitted(true);
        toast({
          title: "Reset email sent",
          description: "Please check your email for password reset instructions",
        });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-campus-blue/5 to-campus-orange/5 p-4">
        <Card className="w-full max-w-md card-elevated">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <img src={unicartLogo} alt="UniCart" className="h-8 w-8" />
              <span className="font-bold text-2xl gradient-primary">UniCart</span>
            </div>
            <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              
              <div>
                <p className="text-text-secondary mb-2">
                  We've sent password reset instructions to:
                </p>
                <p className="font-medium">{getValues('email')}</p>
              </div>
              
              <p className="text-sm text-text-muted">
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </div>
            
            <div className="space-y-3">
              <Button onClick={() => setIsSubmitted(false)} variant="outline" className="w-full">
                Try Another Email
              </Button>
              
              <div className="text-center">
                <Link
                  to="/auth/login"
                  className="text-sm text-primary hover:underline flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Back to Sign In
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-campus-blue/5 to-campus-orange/5 p-4">
      <Card className="w-full max-w-md card-elevated">
        <CardHeader className="space-y-6 text-center">
          <div className="flex items-center justify-center space-x-2">
            <img src={unicartLogo} alt="UniCart" className="h-8 w-8" />
            <span className="font-bold text-2xl gradient-primary">UniCart</span>
          </div>
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <p className="text-text-secondary">
            Enter your email address and we'll send you instructions to reset your password
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.roll@vitstudent.ac.in"
                  className="pl-10"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full btn-hero"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
            </Button>
          </form>

          <div className="text-center space-y-4">
            <div className="text-sm text-text-secondary">
              Remember your password?{' '}
              <Link to="/auth/login" className="text-primary font-medium hover:underline">
                Sign In
              </Link>
            </div>

            <Link
              to="/"
              className="text-sm text-text-secondary hover:text-primary transition-colors flex items-center justify-center gap-1"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;