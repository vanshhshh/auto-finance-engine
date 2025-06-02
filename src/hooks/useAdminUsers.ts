
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminUsers = () => {
  const { user } = useAuth();
  const isAdmin = user?.email?.includes('admin') || false;

  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('🔍 Fetching all users...');
      
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ Error fetching profiles:', error);
          throw error;
        }

        console.log('✅ Profiles fetched:', profiles);
        return profiles || [];
      } catch (error) {
        console.error('💥 Error in useAdminUsers:', error);
        throw error;
      }
    },
    enabled: isAdmin,
    refetchInterval: 5000,
    retry: 3,
  });
};
