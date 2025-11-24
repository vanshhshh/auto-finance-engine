import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { blockchainService, RuleData } from '@/lib/blockchain';
import { useToast } from '@/hooks/use-toast';

export const useBlockchain = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const connectWallet = useCallback(async () => {
    try {
      console.log('🚀 Attempting to connect MetaMask...');
      const address = await blockchainService.connectWallet();
      setWalletAddress(address);
      setIsConnected(true);
      
      toast({
        title: "✅ Wallet Connected",
        description: `Successfully connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
        className: "bg-green-600 text-white border-green-700",
      });
      
      console.log('✅ Wallet connected successfully:', address);
      return address;
    } catch (error: any) {
      console.error('❌ Wallet connection error:', error);
      
      // Provide specific error messages
      let errorTitle = "Connection Failed";
      let errorMessage = "Failed to connect wallet";
      
      if (error.message?.includes('MetaMask is not installed')) {
        errorTitle = "MetaMask Not Found";
        errorMessage = "Please install MetaMask extension from metamask.io to continue.";
      } else if (error.message?.includes('rejected')) {
        errorTitle = "Connection Rejected";
        errorMessage = "You rejected the connection request. Please try again and approve in MetaMask.";
      } else if (error.message?.includes('pending')) {
        errorTitle = "Request Pending";
        errorMessage = "Please check MetaMask and approve the pending connection request.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: errorTitle,
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  }, [toast]);

  return {
    walletAddress,
    isConnected,
    connectWallet,
    isInitialized: blockchainService.isInitialized(),
  };
};

export const useMintToken = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tokenSymbol,
      to,
      amount,
    }: {
      tokenSymbol: 'eINR' | 'eUSD' | 'eAED';
      to: string;
      amount: string;
    }) => {
      const result = await blockchainService.mintToken(tokenSymbol, to, amount);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Tokens Minted",
        description: `Successfully minted ${variables.amount} ${variables.tokenSymbol}`,
      });
      // Invalidate balance queries
      queryClient.invalidateQueries({ queryKey: ['blockchain-balance'] });
      queryClient.invalidateQueries({ queryKey: ['balances'] });
    },
    onError: (error) => {
      toast({
        title: "Mint Failed",
        description: error instanceof Error ? error.message : "Failed to mint tokens",
        variant: "destructive",
      });
    },
  });
};

export const useBurnToken = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tokenSymbol,
      from,
      amount,
    }: {
      tokenSymbol: 'eINR' | 'eUSD' | 'eAED';
      from: string;
      amount: string;
    }) => {
      const result = await blockchainService.burnToken(tokenSymbol, from, amount);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Tokens Burned",
        description: `Successfully burned ${variables.amount} ${variables.tokenSymbol}`,
      });
      // Invalidate balance queries
      queryClient.invalidateQueries({ queryKey: ['blockchain-balance'] });
      queryClient.invalidateQueries({ queryKey: ['balances'] });
    },
    onError: (error) => {
      toast({
        title: "Burn Failed",
        description: error instanceof Error ? error.message : "Failed to burn tokens",
        variant: "destructive",
      });
    },
  });
};

export const useTransferToken = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tokenSymbol,
      to,
      amount,
    }: {
      tokenSymbol: 'eINR' | 'eUSD' | 'eAED';
      to: string;
      amount: string;
    }) => {
      const result = await blockchainService.transferToken(tokenSymbol, to, amount);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Transfer Successful",
        description: `Successfully transferred ${variables.amount} ${variables.tokenSymbol}`,
      });
      // Invalidate balance queries
      queryClient.invalidateQueries({ queryKey: ['blockchain-balance'] });
      queryClient.invalidateQueries({ queryKey: ['balances'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
    onError: (error) => {
      toast({
        title: "Transfer Failed",
        description: error instanceof Error ? error.message : "Failed to transfer tokens",
        variant: "destructive",
      });
    },
  });
};

export const useCreateRule = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ruleData: RuleData) => {
      const result = await blockchainService.createRule(ruleData);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: (data) => {
      toast({
        title: "Rule Created",
        description: `Successfully created rule with ID: ${data.ruleId}`,
      });
      // Invalidate rules queries
      queryClient.invalidateQueries({ queryKey: ['blockchain-rules'] });
      queryClient.invalidateQueries({ queryKey: ['rules'] });
    },
    onError: (error) => {
      toast({
        title: "Rule Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create rule",
        variant: "destructive",
      });
    },
  });
};

export const useEvaluateRules = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (userAddress: string) => {
      const result = await blockchainService.evaluateRules(userAddress);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: (data) => {
      if (data.eligibleRuleIds.length > 0) {
        toast({
          title: "Rules Evaluated",
          description: `Found ${data.eligibleRuleIds.length} eligible rules for execution`,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Rule Evaluation Failed",
        description: error instanceof Error ? error.message : "Failed to evaluate rules",
        variant: "destructive",
      });
    },
  });
};

export const useBlockchainBalance = (tokenSymbol: 'eINR' | 'eUSD' | 'eAED', address?: string) => {
  return useQuery({
    queryKey: ['blockchain-balance', tokenSymbol, address],
    queryFn: async () => {
      if (!address) throw new Error('Address is required');
      return await blockchainService.getTokenBalance(tokenSymbol, address);
    },
    enabled: !!address && blockchainService.isInitialized(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useBlockchainRules = (userAddress?: string) => {
  return useQuery({
    queryKey: ['blockchain-rules', userAddress],
    queryFn: async () => {
      if (!userAddress) throw new Error('User address is required');
      const result = await blockchainService.getUserRules(userAddress);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result.rules;
    },
    enabled: !!userAddress && blockchainService.isInitialized(),
  });
};

export const useCreateWallet = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const result = await blockchainService.createWallet();
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Wallet Created",
        description: "Successfully created blockchain wallet",
      });
    },
    onError: (error) => {
      toast({
        title: "Wallet Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create wallet",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateOracleData = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      dataType,
      value,
    }: {
      dataType: string;
      value: string;
    }) => {
      const result = await blockchainService.updateOracleData(dataType, value);
      if (!result.success) {
        throw new Error(result.error);
      }
      return result;
    },
    onSuccess: (data, variables) => {
      toast({
        title: "Oracle Data Updated",
        description: `Successfully updated ${variables.dataType} data`,
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
};