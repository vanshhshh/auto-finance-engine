
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
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          organization:organizations(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: isAdmin,
  });

  const { data: complianceEvents = [] } = useQuery({
    queryKey: ['all-compliance-events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('compliance_events')
        .select(`
          *,
          user:profiles!compliance_events_user_id_fkey(wallet_address),
          organization:organizations(name)
        `)
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
    complianceEvents,
    auditLogs,
    failingRules,
  };
};
