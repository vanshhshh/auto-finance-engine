
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { promoteCurrentUserToAdmin } from '@/utils/createAdminUser';
import { Shield, UserPlus } from 'lucide-react';

const AdminSetup = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePromoteCurrentUser = async () => {
    setLoading(true);
    try {
      const result = await promoteCurrentUserToAdmin();
      
      if (result.success) {
        toast({
          title: "Success",
          description: "You have been promoted to admin. Please refresh the page.",
          className: "bg-green-600 text-white border-green-700",
        });
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to promote user to admin",
          variant: "destructive",
        });
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
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              This is a development utility to promote your current user to admin.
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
          
          <div className="text-xs text-gray-500 text-center">
            <p>⚠️ This should only be used in development.</p>
            <p>After promoting yourself, refresh the page to access the admin dashboard.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;
