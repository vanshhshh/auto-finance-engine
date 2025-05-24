
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Profile {
  id: string;
  user_id: string;
  role: string;
  wallet_address: string;
  created_at: string;
  updated_at: string;
}

export interface TokenBalance {
  id: string;
  user_id: string;
  token_symbol: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  transaction_type: 'send' | 'receive' | 'mint' | 'burn';
  token_symbol: string;
  amount: number;
  from_address?: string;
  to_address: string;
  tx_hash?: string;
  status: 'pending' | 'completed' | 'failed';
  rule_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ProgrammableRule {
  id: string;
  user_id: string;
  name: string;
  condition_type: 'fx_rate' | 'time_based' | 'balance_threshold' | 'weather';
  condition_value: number;
  token_symbol: string;
  amount: number;
  target_address: string;
  status: 'active' | 'paused';
  created_at: string;
  last_executed?: string;
  execution_count: number;
}

export const useWalletData = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user profile
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data as Profile;
    },
    enabled: !!user,
  });

  // Fetch token balances
  const { data: balances = [] } = useQuery({
    queryKey: ['balances', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('token_balances')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data as TokenBalance[];
    },
    enabled: !!user,
  });

  // Fetch transactions
  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Transaction[];
    },
    enabled: !!user,
  });

  // Fetch programmable rules
  const { data: rules = [] } = useQuery({
    queryKey: ['rules', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('programmable_rules')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ProgrammableRule[];
    },
    enabled: !!user,
  });

  // Create transaction mutation
  const createTransaction = useMutation({
    mutationFn: async (transaction: Omit<Transaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          ...transaction,
          tx_hash: `0x${Math.random().toString(16).substring(2)}`,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balances'] });
    },
    onError: (error) => {
      toast({
        title: "Transaction Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create rule mutation
  const createRule = useMutation({
    mutationFn: async (rule: Omit<ProgrammableRule, 'id' | 'user_id' | 'created_at' | 'last_executed' | 'execution_count'>) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('programmable_rules')
        .insert({
          user_id: user.id,
          ...rule,
          execution_count: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
      toast({
        title: "Rule Created",
        description: "Your programmable rule has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Rule Creation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle rule mutation
  const toggleRule = useMutation({
    mutationFn: async ({ ruleId, status }: { ruleId: string; status: 'active' | 'paused' }) => {
      const { error } = await supabase
        .from('programmable_rules')
        .update({ status })
        .eq('id', ruleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
    },
  });

  // Delete rule mutation
  const deleteRule = useMutation({
    mutationFn: async (ruleId: string) => {
      const { error } = await supabase
        .from('programmable_rules')
        .delete()
        .eq('id', ruleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
    },
  });

  return {
    profile,
    balances,
    transactions,
    rules,
    createTransaction,
    createRule,
    toggleRule,
    deleteRule,
  };
};
