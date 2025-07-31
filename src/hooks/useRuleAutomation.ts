import { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface RuleCondition {
  type: 'fx_rate' | 'time' | 'weather' | 'location' | 'balance';
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'in' | 'between';
  value: any;
  currency_pair?: string;
  location_zone?: string;
  weather_condition?: string;
  token_symbol?: string;
}

interface RuleAction {
  type: 'transfer' | 'mint' | 'burn' | 'notify' | 'freeze' | 'split_payment';
  amount?: string;
  recipient?: string;
  token_symbol?: string;
  message?: string;
  recipients?: Array<{ address: string; amount: string }>;
}

interface CreateRuleRequest {
  name: string;
  conditions: RuleCondition[];
  actions: RuleAction[];
}

export const useRuleAutomation = () => {
  const { toast } = useToast();

  const evaluateAllRules = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('rule-automation', {
        body: { action: 'evaluate_all_rules' }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Rules Evaluated",
        description: `${data.results.executed}/${data.results.total_rules} rules executed`,
      });
    },
    onError: (error) => {
      toast({
        title: "Evaluation Failed",
        description: error instanceof Error ? error.message : "Failed to evaluate rules",
        variant: "destructive",
      });
    },
  });

  const evaluateUserRules = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.functions.invoke('rule-automation', {
        body: { action: 'evaluate_user_rules', payload: { userId } }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "User Rules Evaluated",
        description: `Found ${data.results.length} rules for evaluation`,
      });
    },
    onError: (error) => {
      toast({
        title: "User Evaluation Failed",
        description: error instanceof Error ? error.message : "Failed to evaluate user rules",
        variant: "destructive",
      });
    },
  });

  const executeRule = useMutation({
    mutationFn: async (ruleId: string) => {
      const { data, error } = await supabase.functions.invoke('rule-automation', {
        body: { action: 'execute_rule', payload: { ruleId } }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: "Rule Executed",
        description: `Rule "${data.result.rule}" ${data.result.executed ? 'executed successfully' : 'conditions not met'}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Execution Failed",
        description: error instanceof Error ? error.message : "Failed to execute rule",
        variant: "destructive",
      });
    },
  });

  const updateOracles = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('rule-automation', {
        body: { action: 'update_oracles' }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Oracle Data Updated",
        description: "All oracle data sources have been refreshed",
      });
    },
    onError: (error) => {
      toast({
        title: "Oracle Update Failed",
        description: error instanceof Error ? error.message : "Failed to update oracle data",
        variant: "destructive",
      });
    },
  });

  return {
    evaluateAllRules,
    evaluateUserRules,
    executeRule,
    updateOracles,
  };
};

export const useAutomationStatus = () => {
  return useQuery({
    queryKey: ['automation-status'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('rule-automation');
      
      if (error) throw error;
      return data.status;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
};

export const useOracleData = () => {
  const { toast } = useToast();

  const fetchFxRates = useCallback(async (symbol?: string) => {
    const { data, error } = await supabase.functions.invoke('oracle-data', {
      body: { type: 'fx_rates', symbol }
    });

    if (error) throw error;
    return data;
  }, []);

  const fetchWeatherData = useCallback(async (location?: string) => {
    const { data, error } = await supabase.functions.invoke('oracle-data', {
      body: { type: 'weather', location }
    });

    if (error) throw error;
    return data;
  }, []);

  const fetchGpsData = useCallback(async (userId?: string) => {
    const { data, error } = await supabase.functions.invoke('oracle-data', {
      body: { type: 'gps', userId }
    });

    if (error) throw error;
    return data;
  }, []);

  return {
    fetchFxRates,
    fetchWeatherData,
    fetchGpsData,
  };
};

export const useSystemStatus = () => {
  return useQuery({
    queryKey: ['system-status'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('system_status')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    refetchInterval: 60000, // Refresh every minute
  });
};

export const useRuleExecutions = (ruleId?: string) => {
  return useQuery({
    queryKey: ['rule-executions', ruleId],
    queryFn: async () => {
      let query = supabase
        .from('rule_executions')
        .select('*')
        .order('executed_at', { ascending: false })
        .limit(50);

      if (ruleId) {
        query = query.eq('rule_id', ruleId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
    enabled: !!ruleId,
    refetchInterval: 30000,
  });
};

export const useCreateAutomatedRule = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (ruleData: CreateRuleRequest) => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get user's account
      const { data: accounts } = await supabase
        .from('cbdc_accounts')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (!accounts || accounts.length === 0) {
        throw new Error('No CBDC account found for user');
      }

      // Create rule in conditional_triggers table using correct schema
      const { data: rule, error: dbError } = await supabase
        .from('conditional_triggers')
        .insert({
          account_id: accounts[0].id,
          trigger_type: 'fx_rate', // Using valid enum value
          action_type: ruleData.actions[0]?.type || 'notify',
          conditions: ruleData.conditions,
          action_config: { 
            name: ruleData.name,
            actions: ruleData.actions 
          },
          status: 'active'
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Use blockchain service to deploy rule (simplified for now)
      try {
        const blockchainService = await import('@/lib/blockchain');
        const blockchainResult = await blockchainService.blockchainService.createRule({
          userId: user.id,
          ruleType: 'fx_rate',
          conditions: JSON.stringify(ruleData.conditions),
          actionType: ruleData.actions[0]?.type || 'notify',
          actionData: JSON.stringify(ruleData.actions)
        });

        console.log('Blockchain rule deployment result:', blockchainResult);
      } catch (blockchainError) {
        console.warn('Blockchain deployment failed, rule will run in database-only mode:', blockchainError);
      }

      return rule;
    },
    onSuccess: (data) => {
      toast({
        title: "Automated Rule Created",
        description: `Rule has been created and will be evaluated automatically`,
      });
    },
    onError: (error) => {
      toast({
        title: "Rule Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create automated rule",
        variant: "destructive",
      });
    },
  });
};