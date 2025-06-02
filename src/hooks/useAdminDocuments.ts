
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
        // First get all KYC documents
        const { data: documents, error: docsError } = await supabase
          .from('kyc_documents')
          .select('*')
          .order('upload_date', { ascending: false });

        if (docsError) {
          console.error('❌ Error fetching documents:', docsError);
          throw docsError;
        }

        // Then get all profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*');

        if (profilesError) {
          console.error('❌ Error fetching profiles:', profilesError);
          throw profilesError;
        }

        // Manually join the data
        const documentsWithProfiles = documents?.map(doc => ({
          ...doc,
          profile: profiles?.find(profile => profile.user_id === doc.user_id) || null
        })) || [];

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
