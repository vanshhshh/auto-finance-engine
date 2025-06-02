
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
        // First, let's check if we can access the profiles table at all
        const { count, error: countError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });

        console.log('📊 Total profiles count:', count);
        if (countError) {
          console.error('❌ Error getting count:', countError);
        }

        // Get all profiles with all fields including approved_tokens and updated_at
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('id, user_id, role, wallet_address, kyc_status, wallet_approved, approved_tokens, nationality, country_of_residence, created_at, updated_at')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ Error fetching profiles:', error);
          console.error('❌ Error details:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          });
          throw error;
        }

        console.log('✅ Profiles fetched successfully:');
        console.log('📋 Total profiles returned:', profiles?.length || 0);
        console.log('👥 Profile details:', profiles);

        // Log each profile for debugging
        profiles?.forEach((profile, index) => {
          console.log(`👤 Profile ${index + 1}:`, {
            id: profile.id,
            user_id: profile.user_id,
            role: profile.role,
            wallet_address: profile.wallet_address,
            kyc_status: profile.kyc_status,
            wallet_approved: profile.wallet_approved,
            approved_tokens: profile.approved_tokens,
            created_at: profile.created_at,
            updated_at: profile.updated_at
          });
        });

        return profiles || [];
      } catch (error) {
        console.error('💥 Error in useAdminUsers:', error);
        
        // Try a fallback query with minimal selection
        console.log('🔄 Trying fallback query...');
        try {
          const { data: fallbackData, error: fallbackError } = await supabase
            .from('profiles')
            .select('id, user_id, role, wallet_address, kyc_status, wallet_approved, created_at')
            .limit(100);

          if (fallbackError) {
            console.error('❌ Fallback query failed:', fallbackError);
            throw fallbackError;
          }

          console.log('✅ Fallback query successful:', fallbackData);
          return fallbackData || [];
        } catch (fallbackError) {
          console.error('💥 Both queries failed:', fallbackError);
          throw fallbackError;
        }
      }
    },
    enabled: isAdmin,
    refetchInterval: 5000, // Reduced interval
    retry: 3,
    retryDelay: 1000,
    staleTime: 0, // Always fetch fresh data
    gcTime: 0, // Don't cache results (renamed from cacheTime)
  });
};
