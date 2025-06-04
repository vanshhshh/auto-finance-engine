
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminUsers = () => {
  const { user } = useAuth();
  const isAdmin = user?.email?.includes('admin') || false;

  return useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('🔍 Admin fetching all users...');
      console.log('🔐 Current admin user:', user?.email);
      
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

        // Ensure all required fields are present in the returned data
        const typedProfiles = profiles?.map(profile => ({
          id: profile.id,
          user_id: profile.user_id,
          role: profile.role || 'user',
          wallet_address: profile.wallet_address,
          kyc_status: profile.kyc_status || 'pending',
          wallet_approved: profile.wallet_approved || false,
          approved_tokens: profile.approved_tokens || [],
          nationality: profile.nationality,
          country_of_residence: profile.country_of_residence,
          created_at: profile.created_at,
          updated_at: profile.updated_at
        })) || [];

        console.log('🎯 Typed profiles:', typedProfiles);
        return typedProfiles;
      } catch (error) {
        console.error('💥 Error in useAdminUsers:', error);
        throw error;
      }
    },
    enabled: isAdmin,
    refetchInterval: 5000,
    retry: 3,
    retryDelay: 1000,
    staleTime: 0,
    gcTime: 0,
  });
};
