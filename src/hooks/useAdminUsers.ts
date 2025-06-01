
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminUsers = () => {
  const { user } = useAuth();
  const isAdmin = user?.email?.includes('admin') || false;

  return useQuery({
    queryKey: ['admin-users-detailed'],
    queryFn: async () => {
      console.log('🔍 Fetching admin users with detailed logging...');
      
      try {
        // Get all profiles first
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (profilesError) {
          console.error('❌ Error fetching profiles:', profilesError);
          throw profilesError;
        }

        console.log('✅ Raw profiles data:', profiles);
        console.log('📊 Total profiles found:', profiles?.length || 0);

        // Filter and log specific users
        const targetUsers = profiles?.filter(p => 
          p.wallet_address?.includes('0x48193892d57240be965462d7dc0cf11a') ||
          p.wallet_address?.includes('0x66569048d2eb4b2b9070db5cef80ffdc')
        );
        
        console.log('🎯 Target users found:', targetUsers);

        return profiles || [];
      } catch (error) {
        console.error('💥 Fatal error in admin users fetch:', error);
        throw error;
      }
    },
    enabled: isAdmin,
    refetchInterval: 3000, // Refetch every 3 seconds
    retry: 3,
  });
};
