
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'mint' | 'burn';
  token: string;
  amount: number;
  address: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
}

export interface Rule {
  id: string;
  name: string;
  conditionType: string;
  conditionValue: number;
  token: string;
  amount: number;
  targetAddress: string;
  status: 'active' | 'paused';
  createdAt: Date;
  lastExecuted: Date | null;
  executionCount: number;
}

interface WalletState {
  walletAddress: string;
  isConnected: boolean;
  balances: Record<string, number>;
  transactions: Transaction[];
  rules: Rule[];
  
  // Actions
  connectWallet: (address: string) => void;
  disconnectWallet: () => void;
  addTransaction: (transaction: Transaction) => void;
  updateBalance: (token: string, amount: number) => void;
  addRule: (rule: Rule) => void;
  toggleRule: (ruleId: string) => void;
  deleteRule: (ruleId: string) => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      walletAddress: '0x742d35Cc6634C0532925a3b8D400bBd707c76c2',
      isConnected: true,
      balances: {
        eINR: 25000,
        eUSD: 1200,
        eAED: 850
      },
      transactions: [
        {
          id: '1',
          type: 'mint',
          token: 'eINR',
          amount: 10000,
          address: '0x742d35Cc6634C0532925a3b8D400bBd707c76c2',
          timestamp: new Date(Date.now() - 86400000),
          status: 'completed',
          txHash: '0xa1b2c3d4e5f6'
        },
        {
          id: '2',
          type: 'send',
          token: 'eUSD',
          amount: 500,
          address: '0x123456789abcdef',
          timestamp: new Date(Date.now() - 43200000),
          status: 'completed',
          txHash: '0xf6e5d4c3b2a1'
        }
      ],
      rules: [],

      connectWallet: (address: string) => set({ walletAddress: address, isConnected: true }),
      
      disconnectWallet: () => set({ walletAddress: '', isConnected: false }),
      
      addTransaction: (transaction: Transaction) => set((state) => ({
        transactions: [transaction, ...state.transactions]
      })),
      
      updateBalance: (token: string, amount: number) => set((state) => ({
        balances: {
          ...state.balances,
          [token]: (state.balances[token] || 0) + amount
        }
      })),

      addRule: (rule: Rule) => set((state) => ({
        rules: [...state.rules, rule]
      })),

      toggleRule: (ruleId: string) => set((state) => ({
        rules: state.rules.map(rule =>
          rule.id === ruleId
            ? { ...rule, status: rule.status === 'active' ? 'paused' as const : 'active' as const }
            : rule
        )
      })),

      deleteRule: (ruleId: string) => set((state) => ({
        rules: state.rules.filter(rule => rule.id !== ruleId)
      }))
    }),
    {
      name: 'wallet-storage',
      partialize: (state) => ({
        walletAddress: state.walletAddress,
        isConnected: state.isConnected,
        balances: state.balances,
        transactions: state.transactions,
        rules: state.rules
      })
    }
  )
);
