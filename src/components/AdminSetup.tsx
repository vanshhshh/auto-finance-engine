
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { promoteCurrentUserToAdmin } from '@/utils/createAdminUser';
import { Shield, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminSetup = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handlePromoteCurrentUser = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to promote yourself to admin",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      console.log('🚀 Starting admin promotion process...');
      const result = await promoteCurrentUserToAdmin();
      
      if (result.success) {
        toast({
          title: "Success",
          description: "You have been promoted to admin. Please refresh the page to access admin features.",
          className: "bg-green-600 text-white border-green-700",
        });
        
        // Refresh the page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to promote user to admin",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while promoting to admin",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="text-blue-600" size={32} />
          </div>
          <CardTitle className="text-2xl">Admin Setup</CardTitle>
          <p className="text-gray-600">Set up admin access for development</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {user ? (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-blue-600 mt-0.5" size={16} />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">Current User:</p>
                    <p className="text-blue-700">{user.email}</p>
                    <p className="text-blue-600 text-xs mt-1">ID: {user.id}</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  This will promote your current account to admin privileges.
                </p>
                <Button 
                  onClick={handlePromoteCurrentUser}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                >
                  <UserPlus size={16} />
                  {loading ? 'Promoting...' : 'Make Me Admin'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You must be logged in to use admin setup.</p>
              <Button 
                onClick={() => window.location.href = '/auth'}
                variant="outline"
              >
                Go to Login
              </Button>
            </div>
          )}
          
          <div className="text-xs text-gray-500 text-center">
            <p>⚠️ This should only be used in development.</p>
            <p>After promoting yourself, the page will refresh automatically.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;
