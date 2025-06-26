
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminDocuments = () => {
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
    queryKey: ['admin-documents'],
    queryFn: async () => {
      console.log('📄 Fetching KYC documents...');
      
      try {
        // Get all KYC documents
        const { data: documents, error: docsError } = await supabase
          .from('kyc_documents')
          .select('*')
          .order('upload_date', { ascending: false });

        if (docsError) {
          console.error('❌ Error fetching documents:', docsError);
          throw docsError;
        }

        // Get profiles separately to avoid join issues
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, wallet_address, kyc_status, nationality, country_of_residence');

        if (profilesError) {
          console.error('❌ Error fetching profiles:', profilesError);
          throw profilesError;
        }

        // Manually join the data
        const documentsWithProfiles = documents?.map(doc => {
          const profile = profiles?.find(p => p.user_id === doc.user_id);
          return {
            ...doc,
            profiles: profile || null
          };
        }) || [];

        console.log('✅ Documents with profiles:', documentsWithProfiles.length);
        return documentsWithProfiles;
      } catch (error) {
        console.error('💥 Error in useAdminDocuments:', error);
        throw error;
      }
    },
    enabled: isAdmin,
    refetchInterval: 10000,
    retry: 2,
    retryDelay: 1000,
  });
};
