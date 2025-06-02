
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
        // Get all KYC documents with proper joins
        const { data: documents, error: docsError } = await supabase
          .from('kyc_documents')
          .select(`
            *,
            profiles!kyc_documents_user_id_fkey (
              id,
              user_id,
              wallet_address,
              kyc_status,
              nationality,
              country_of_residence
            )
          `)
          .order('upload_date', { ascending: false });

        if (docsError) {
          console.error('❌ Error fetching documents:', docsError);
          throw docsError;
        }

        console.log('✅ Documents with profiles:', documents);
        return documents || [];
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
