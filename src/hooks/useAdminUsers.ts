
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminUsers = () => {
  const { user } = useAuth();
  
  // Check if user is admin by checking their profile role
  const { data: currentUserProfile } = useQuery({
    queryKey: ['current-user-profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
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
    },
    enabled: !!user,
  });

  const isAdmin = currentUserProfile?.role === 'admin';

  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('🔍 Admin fetching all users...');
      console.log('🔐 Current admin user:', user?.email, 'Role:', currentUserProfile?.role);
      
      try {
        // Get all profiles with explicit field selection
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select(`
            id,
            user_id,
            role,
            wallet_address,
            kyc_status,
            wallet_approved,
            approved_tokens,
            nationality,
            country_of_residence,
            created_at,
            updated_at
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ Error fetching profiles:', error);
          throw error;
        }

        console.log('✅ Profiles fetched successfully:');
        console.log('📋 Total profiles returned:', profiles?.length || 0);
        console.log('👥 Profile details:', profiles);

        return profiles || [];
      } catch (error) {
        console.error('💥 Error in useAdminUsers:', error);
        throw error;
      }
    },
    enabled: isAdmin,
    refetchInterval: 10000,
    retry: 3,
    retryDelay: 2000,
    staleTime: 5000,
  });
};
