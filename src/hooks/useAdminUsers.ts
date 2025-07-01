
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminUsers = () => {
  const { user } = useAuth();
  
  // Simple admin check function
  const isKnownAdmin = () => {
    if (!user) return false;
    const knownAdminEmails = ['admin@example.com', 'admin@cbdc.com'];
    const knownAdminIds = ['de121dc9-d461-4716-a2fd-5c4850841446'];
    return knownAdminEmails.includes(user.email || '') || knownAdminIds.includes(user.id);
  };

  const isAdmin = isKnownAdmin();

  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('🔍 Fetching all users for admin...');
      
      try {
        // Get all profiles directly
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ Error fetching profiles:', error);
          return [];
        }

        console.log('✅ Profiles fetched successfully:', profiles?.length || 0);
        return profiles || [];
      } catch (error) {
        console.error('💥 Error in useAdminUsers:', error);
        return [];
      }
    },
    enabled: isAdmin,
    retry: 1,
    refetchInterval: false,
  });
};
