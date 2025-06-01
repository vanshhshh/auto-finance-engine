
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminDocuments = () => {
  const { user } = useAuth();
  const isAdmin = user?.email?.includes('admin') || false;

  return useQuery({
    queryKey: ['admin-kyc-documents-detailed'],
    queryFn: async () => {
      console.log('📄 Fetching KYC documents with detailed logging...');
      
      try {
        // Get all KYC documents
        const { data: documents, error: docsError } = await supabase
          .from('kyc_documents')
          .select('*')
          .order('upload_date', { ascending: false });

        if (docsError) {
          console.error('❌ Error fetching KYC documents:', docsError);
          throw docsError;
        }

        console.log('✅ Raw KYC documents:', documents);
        console.log('📊 Total documents found:', documents?.length || 0);

        // Get all profiles to join with documents
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*');

        if (profilesError) {
          console.error('❌ Error fetching profiles for documents:', profilesError);
          throw profilesError;
        }

        // Join documents with profiles
        const documentsWithProfiles = (documents || []).map(doc => {
          const profile = profiles?.find(p => p.user_id === doc.user_id);
          console.log(`🔗 Document ${doc.id} linked to profile:`, profile?.wallet_address);
          return {
            ...doc,
            profiles: profile || null
          };
        });

        console.log('🔗 Documents with profiles:', documentsWithProfiles);
        
        // Log specific user documents
        const targetDocs = documentsWithProfiles.filter(doc => 
          doc.profiles?.wallet_address?.includes('0x48193892d57240be965462d7dc0cf11a') ||
          doc.profiles?.wallet_address?.includes('0x66569048d2eb4b2b9070db5cef80ffdc')
        );
        
        console.log('🎯 Target user documents:', targetDocs);

        return documentsWithProfiles;
      } catch (error) {
        console.error('💥 Fatal error in admin documents fetch:', error);
        throw error;
      }
    },
    enabled: isAdmin,
    refetchInterval: 3000, // Refetch every 3 seconds
    retry: 3,
  });
};
