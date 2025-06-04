
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminDocuments = () => {
  const { user } = useAuth();
  const isAdmin = user?.email?.includes('admin') || false;

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
    refetchInterval: 5000,
    retry: 3,
  });
};
