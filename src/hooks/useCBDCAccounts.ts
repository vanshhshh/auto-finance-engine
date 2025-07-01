
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useCBDCAccounts = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ['cbdc-accounts', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cbdc_accounts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const createAccount = useMutation({
    mutationFn: async (accountData: {
      account_type: 'personal' | 'business' | 'sub_account';
      parent_account_id?: string;
      country_code: string;
      alias_email?: string;
      alias_phone?: string;
    }) => {
      const { data, error } = await supabase
        .from('cbdc_accounts')
        .insert([{
          ...accountData,
          user_id: user?.id,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cbdc-accounts'] });
      toast.success('CBDC account created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create CBDC account');
      console.error('Error creating CBDC account:', error);
    },
  });

  const updateAccountStatus = useMutation({
    mutationFn: async ({ accountId, status }: { accountId: string; status: 'active' | 'disabled' | 'frozen' | 'closed' }) => {
      const { data, error } = await supabase
        .from('cbdc_accounts')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', accountId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cbdc-accounts'] });
      toast.success('Account status updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update account status');
      console.error('Error updating account status:', error);
    },
  });

  return {
    accounts,
    isLoading,
    createAccount,
    updateAccountStatus,
  };
};
