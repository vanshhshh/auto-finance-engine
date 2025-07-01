
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminUsers } from './useAdminUsers';
import { useAdminDocuments } from './useAdminDocuments';

export const useAdminData = () => {
  const { user } = useAuth();
  
  // Check if user is admin by known identifiers only
  const checkIsAdmin = () => {
    if (!user) return false;
    
    // Known admin emails and IDs - expand this list as needed
    const knownAdminEmails = ['admin@example.com', 'admin@cbdc.com'];
    const knownAdminIds = ['de121dc9-d461-4716-a2fd-5c4850841446'];
    
    return knownAdminEmails.includes(user.email || '') || knownAdminIds.includes(user.id);
  };
  
  const isAdmin = checkIsAdmin();

  // Use the new focused hooks with proper error handling
  const { data: allUsers = [], isLoading: usersLoading, error: usersError } = useAdminUsers();
  const { data: kycDocuments = [], isLoading: docsLoading, error: docsError } = useAdminDocuments();

  // System controls with better error handling
  const { data: systemControls = [], isLoading: controlsLoading } = useQuery({
    queryKey: ['system-controls'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('system_controls')
          .select('*');
        
        if (error) {
          console.error('System controls error:', error);
          return [];
        }
        return data || [];
      } catch (error) {
        console.error('System controls query failed:', error);
        return [];
      }
    },
    enabled: isAdmin,
    retry: 1,
    refetchInterval: false,
  });

  // Compliance events with better error handling
  const { data: complianceEvents = [], isLoading: complianceLoading } = useQuery({
    queryKey: ['compliance-events'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
        
        if (error) {
          console.error('Compliance events error:', error);
          return [];
        }
        return data || [];
      } catch (error) {
        console.error('Compliance events query failed:', error);
        return [];
      }
    },
    enabled: isAdmin,
    retry: 1,
    refetchInterval: false,
  });

  // Audit logs with better error handling
  const { data: auditLogs = [], isLoading: auditLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);
        
        if (error) {
          console.error('Audit logs error:', error);
          return [];
        }
        return data || [];
      } catch (error) {
        console.error('Audit logs query failed:', error);
        return [];
      }
    },
    enabled: isAdmin,
    retry: 1,
    refetchInterval: false,
  });

  return {
    isAdmin,
    systemControls,
    allUsers,
    kycDocuments,
    complianceEvents,
    auditLogs,
    isLoading: usersLoading || docsLoading || controlsLoading || complianceLoading || auditLoading,
    hasErrors: !!usersError || !!docsError,
  };
};
