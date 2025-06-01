
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useAdminData = () => {
  const { user } = useAuth();

  // Check if user is admin
  const isAdmin = user?.email?.includes('admin') || false;

  const { data: systemControls = [] } = useQuery({
    queryKey: ['system-controls'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_controls')
        .select('*');
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const { data: allUsers = [] } = useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      console.log('Fetching all users for admin...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      console.log('Fetched users:', data);
      return data || [];
    },
    enabled: isAdmin,
    refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
  });

  const { data: kycDocuments = [] } = useQuery({
    queryKey: ['kyc-documents'],
    queryFn: async () => {
      console.log('Fetching KYC documents...');
      
      // First get all KYC documents
      const { data: docs, error: docsError } = await supabase
        .from('kyc_documents')
        .select('*')
        .order('upload_date', { ascending: false });

      if (docsError) {
        console.error('Error fetching KYC documents:', docsError);
        throw docsError;
      }

      console.log('Raw KYC documents:', docs);

      // Then get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }

      console.log('All profiles:', profiles);

      // Manually join the data
      const documentsWithProfiles = (docs || []).map(doc => {
        const profile = profiles?.find(p => p.user_id === doc.user_id);
        return {
          ...doc,
          profiles: profile || null
        };
      });

      console.log('Documents with profiles:', documentsWithProfiles);
      return documentsWithProfiles;
    },
    enabled: isAdmin,
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  const { data: complianceEvents = [] } = useQuery({
    queryKey: ['admin-audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const { data: auditLogs = [] } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const { data: failingRules = [] } = useQuery({
    queryKey: ['failing-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rule_executions')
        .select(`
          *,
          rule:programmable_rules(*)
        `)
        .eq('success', false)
        .order('executed_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  return {
    isAdmin,
    systemControls,
    allUsers,
    kycDocuments,
    complianceEvents,
    auditLogs,
    failingRules,
  };
};
