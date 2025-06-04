
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { UserPlus } from 'lucide-react';

const CreateAdminUser = () => {
  const [email, setEmail] = useState('admin@cbdc.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createAdminUser = async () => {
    try {
      setLoading(true);
      
      // Sign up the admin user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (authError) {
        throw authError;
      }

      if (authData.user) {
        // Update the profile to set admin role
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            role: 'admin',
            kyc_status: 'approved',
            wallet_approved: true
          })
          .eq('user_id', authData.user.id);

        if (profileError) {
          console.error('Error updating profile:', profileError);
          // Continue anyway as the user was created
        }

        toast({
          title: "Admin User Created",
          description: `Admin user created with email: ${email}`,
          className: "bg-green-600 text-white border-green-700",
        });
      }

    } catch (error: any) {
      console.error('Error creating admin user:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create admin user.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus size={20} />
          Create Admin User
        </CardTitle>
        <p className="text-sm text-gray-600">Create an admin user to access the dashboard</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@cbdc.com"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="admin123"
          />
        </div>
        <Button 
          onClick={createAdminUser}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Creating...' : 'Create Admin User'}
        </Button>
        <p className="text-xs text-gray-500">
          Note: You can use this admin user to log in and access the admin dashboard.
        </p>
      </CardContent>
    </Card>
  );
};

export default CreateAdminUser;
