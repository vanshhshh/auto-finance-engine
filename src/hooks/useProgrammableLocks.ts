
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useProgrammableLocks = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: locks = [], isLoading } = useQuery({
    queryKey: ['programmable-locks', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('programmable_locks')
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

  const createLock = useMutation({
    mutationFn: async (lockData: {
      lock_type: 'two_party' | 'three_party' | 'htlc';
      account_id: string;
      amount: number;
      token_symbol: string;
      recipient_pip: string;
      arbiter_pip?: string;
      hash_condition?: string;
      time_lock?: string;
      conditions?: any;
      expires_at?: string;
    }) => {
      const { data, error } = await supabase
        .from('programmable_locks')
        .insert([lockData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programmable-locks'] });
      toast.success('Programmable lock created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create programmable lock');
      console.error('Error creating lock:', error);
    },
  });

  const releaseLock = useMutation({
    mutationFn: async (lockId: string) => {
      const { data, error } = await supabase
        .from('programmable_locks')
        .update({ status: 'released' })
        .eq('id', lockId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['programmable-locks'] });
      toast.success('Lock released successfully');
    },
    onError: (error) => {
      toast.error('Failed to release lock');
      console.error('Error releasing lock:', error);
    },
  });

  return {
    locks,
    isLoading,
    createLock,
    releaseLock,
  };
};
