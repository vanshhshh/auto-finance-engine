
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useConditionalTriggers = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: triggers = [], isLoading } = useQuery({
    queryKey: ['conditional-triggers', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('conditional_triggers')
        .select(`
          *,
          cbdc_accounts!inner(user_id)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const createTrigger = useMutation({
    mutationFn: async (triggerData: {
      account_id: string;
      trigger_type: 'time_based' | 'weather' | 'fx_rate' | 'geo_location' | 'oracle';
      conditions: any;
      action_type: 'payment' | 'lock' | 'unlock' | 'split_pay';
      action_config: any;
    }) => {
      const { data, error } = await supabase
        .from('conditional_triggers')
        .insert([triggerData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conditional-triggers'] });
      toast.success('Conditional trigger created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create conditional trigger');
      console.error('Error creating trigger:', error);
    },
  });

  const updateTriggerStatus = useMutation({
    mutationFn: async ({ triggerId, status }: { triggerId: string; status: 'active' | 'paused' | 'executed' | 'expired' }) => {
      const { data, error } = await supabase
        .from('conditional_triggers')
        .update({ status })
        .eq('id', triggerId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conditional-triggers'] });
      toast.success('Trigger status updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update trigger status');
      console.error('Error updating trigger status:', error);
    },
  });

  return {
    triggers,
    isLoading,
    createTrigger,
    updateTriggerStatus,
  };
};
