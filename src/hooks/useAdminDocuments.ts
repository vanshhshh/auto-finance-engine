
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminDocuments = () => {
  const { user } = useAuth();
  
  // Simple admin check function
  const isKnownAdmin = () => {
    if (!user) return false;
    const knownAdminEmails = ['admin@example.com', 'admin@cbdc.com'];
    const knownAdminIds = ['de121dc9-d461-4716-a2fd-5c4850841446'];
    return knownAdminEmails.includes(user.email || '') || knownAdminIds.includes(user.id);
  };

  const isAdmin = isKnownAdmin();

  return useQuery({
    queryKey: ['admin-documents'],
    queryFn: async () => {
      console.log('📄 Fetching KYC documents...');
      
      try {
        // Get KYC documents directly
        const { data: documents, error: docsError } = await supabase
          .from('kyc_documents')
          .select('*')
          .order('upload_date', { ascending: false });

        if (docsError) {
          console.error('❌ Error fetching documents:', docsError);
          return [];
        }

        console.log('✅ Documents fetched successfully:', documents?.length || 0);
        return documents || [];
      } catch (error) {
        console.error('💥 Error in useAdminDocuments:', error);
        return [];
      }
    },
    enabled: isAdmin,
    retry: 1,
    refetchInterval: false,
  });
};
