
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminUsers = () => {
  const { user } = useAuth();
  
  // Simple admin check function to avoid RLS recursion
  const isKnownAdmin = () => {
    if (!user) return false;
    const knownAdminEmails = ['admin@example.com', 'admin@cbdc.com'];
    const knownAdminIds = ['de121dc9-d461-4716-a2fd-5c4850841446'];
    return knownAdminEmails.includes(user.email || '') || knownAdminIds.includes(user.id);
  };

  // Check current user's admin status from database
  const { data: currentUserProfile } = useQuery({
    queryKey: ['current-user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching current user profile:', error);
          return null;
        }
        
        return data;
      } catch (error) {
        console.error('Error in profile query:', error);
        return null;
      }
    },
    enabled: !!user,
  });

  const isAdmin = isKnownAdmin() || currentUserProfile?.role === 'admin';

  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('🔍 Admin fetching all users...');
      console.log('🔐 Current admin user:', user?.email, 'Role:', currentUserProfile?.role);
      
      try {
        // Get all profiles directly without complex joins
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ Error fetching profiles:', error);
          throw error;
        }

        console.log('✅ Profiles fetched successfully:', profiles?.length || 0);
        return profiles || [];
      } catch (error) {
        console.error('💥 Error in useAdminUsers:', error);
        throw error;
      }
    },
    enabled: isAdmin,
    refetchInterval: 10000,
    retry: 2,
    retryDelay: 1000,
  });
};
