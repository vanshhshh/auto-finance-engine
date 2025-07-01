
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useFundOperations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: operations = [], isLoading } = useQuery({
    queryKey: ['fund-operations', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fund_operations')
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

  const createFundOperation = useMutation({
    mutationFn: async (operationData: {
      account_id: string;
      operation_type: 'fund' | 'defund';
      amount: number;
      token_symbol: string;
      bank_account_id?: string;
      country_code: string;
      bank_method: string;
      reference_id?: string;
    }) => {
      const { data, error } = await supabase
        .from('fund_operations')
        .insert([operationData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fund-operations'] });
      toast.success('Fund operation initiated successfully');
    },
    onError: (error) => {
      toast.error('Failed to initiate fund operation');
      console.error('Error creating fund operation:', error);
    },
  });

  return {
    operations,
    isLoading,
    createFundOperation,
  };
};
