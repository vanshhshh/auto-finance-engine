
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminDocuments = () => {
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
    queryKey: ['admin-documents'],
    queryFn: async () => {
      console.log('📄 Fetching KYC documents...');
      
      try {
        // Get all KYC documents and join with profiles
        const { data: documents, error: docsError } = await supabase
          .from('kyc_documents')
          .select(`
            id,
            user_id,
            document_type,
            status,
            file_name,
            file_path,
            upload_date,
            reviewed_at,
            reviewed_by,
            admin_notes
          `)
          .order('upload_date', { ascending: false });

        if (docsError) {
          console.error('❌ Error fetching documents:', docsError);
          throw docsError;
        }

        // Get profiles separately to avoid join issues
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            user_id,
            wallet_address,
            kyc_status,
            nationality,
            country_of_residence
          `);

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

        console.log('✅ Documents with profiles:', documentsWithProfiles);
        return documentsWithProfiles;
      } catch (error) {
        console.error('💥 Error in useAdminDocuments:', error);
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
