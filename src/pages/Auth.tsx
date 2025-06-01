
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Wallet } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        // Handle specific error cases
        if (error.message.includes('email_not_confirmed')) {
          toast({
            title: "Email Confirmation Required",
            description: "Please check your email and click the confirmation link before signing in. If you can't find the email, check your spam folder.",
            variant: "destructive",
          });
        } else if (error.message.includes('Invalid login credentials')) {
          toast({
            title: "Invalid Credentials",
            description: "The email or password you entered is incorrect. Please try again.",
            variant: "destructive",
          });
        } else if (error.message.includes('User already registered')) {
          toast({
            title: "Account Already Exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive",
          });
          setIsLogin(true);
        } else {
          toast({
            title: "Authentication Error",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        if (isLogin) {
          toast({
            title: "Welcome back!",
            description: "Successfully signed in.",
            className: "bg-blue-600 text-white border-blue-700",
          });
          navigate('/');
        } else {
          toast({
            title: "Account Created!",
            description: "Please check your email for a confirmation link to complete your registration.",
            className: "bg-blue-600 text-white border-blue-700",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <Card className="bg-white border-gray-200 shadow-lg w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wallet className="text-blue-600" size={32} />
            <div className="text-2xl font-bold text-gray-900">Gate Finance</div>
          </div>
          <CardTitle className="text-gray-900">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </CardTitle>
          <p className="text-gray-600 text-sm">
            {isLogin ? 'Sign in to your programmable wallet' : 'Join the future of programmable payments'}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-gray-900">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="bg-white border-gray-300 text-gray-900"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-gray-900">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="bg-white border-gray-300 text-gray-900"
                required
                minLength={6}
              />
              {!isLogin && (
                <p className="text-xs text-gray-600 mt-1">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>

            {!isLogin && (
              <div className="text-xs text-gray-600 text-center mt-4 p-3 bg-blue-50 rounded">
                <p className="font-medium mb-1">After creating your account:</p>
                <p>1. Check your email for a confirmation link</p>
                <p>2. Click the link to verify your email</p>
                <p>3. Return here to sign in</p>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
