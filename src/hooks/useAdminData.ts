
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminUsers } from './useAdminUsers';
import { useAdminDocuments } from './useAdminDocuments';

export const useAdminData = () => {
  const { user } = useAuth();
  
  // Check if user is admin by checking known admin users or database
  const checkIsAdmin = () => {
    if (!user) return false;
    
    // Known admin emails and IDs
    const knownAdminEmails = ['admin@example.com', 'admin@cbdc.com'];
    const knownAdminIds = ['de121dc9-d461-4716-a2fd-5c4850841446'];
    
    return knownAdminEmails.includes(user.email || '') || knownAdminIds.includes(user.id);
  };
  
  const isAdmin = checkIsAdmin();

  // Use the new focused hooks
  const { data: allUsers = [], isLoading: usersLoading, error: usersError } = useAdminUsers();
  const { data: kycDocuments = [], isLoading: docsLoading, error: docsError } = useAdminDocuments();

  // Log any errors
  if (usersError) console.error('👥 Users error:', usersError);
  if (docsError) console.error('📄 Documents error:', docsError);

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
    isLoading: usersLoading || docsLoading,
  };
};
