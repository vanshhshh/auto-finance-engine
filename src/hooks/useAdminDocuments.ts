
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
        const { data: documents, error } = await supabase
          .from('kyc_documents')
          .select(`
            *,
            profiles:user_id (*)
          `)
          .order('upload_date', { ascending: false });

        if (error) {
          console.error('❌ Error fetching documents:', error);
          throw error;
        }

        console.log('✅ Documents fetched:', documents);
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
