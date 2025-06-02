
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminUsers = () => {
  const { user } = useAuth();
  const isAdmin = user?.email?.includes('admin') || false;

  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('🔍 Fetching all users for admin...');
      
      try {
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select(`
            *,
            kyc_documents!inner(
              id,
              status,
              upload_date
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ Error fetching profiles:', error);
          
          // Fallback: try fetching profiles without join
          const { data: fallbackProfiles, error: fallbackError } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

          if (fallbackError) {
            console.error('❌ Fallback error:', fallbackError);
            throw fallbackError;
          }

          console.log('✅ Fallback profiles fetched:', fallbackProfiles);
          return fallbackProfiles || [];
        }

        console.log('✅ Profiles with KYC fetched:', profiles);
        return profiles || [];
      } catch (error) {
        console.error('💥 Error in useAdminUsers:', error);
        throw error;
      }
    },
    enabled: isAdmin,
    refetchInterval: 3000,
    retry: 2,
  });
};
