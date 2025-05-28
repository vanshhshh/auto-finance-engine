
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TokenBalanceProps {
  balance: {
    id: string;
    user_id: string;
    token_symbol: string;
    balance: string;
    created_at: string;
    updated_at: string;
  };
}

const TokenBalance: React.FC<TokenBalanceProps> = ({ balance }) => {
  // Determine color based on token symbol
  const getTokenColor = (symbol: string): 'emerald' | 'blue' | 'amber' => {
    switch (symbol) {
      case 'eUSD':
        return 'emerald';
      case 'eINR':
        return 'blue';
      case 'eAED':
        return 'amber';
      default:
        return 'blue';
    }
  };

  const color = getTokenColor(balance.token_symbol);

  const colorClasses = {
    emerald: {
      bg: 'from-emerald-600/20 to-emerald-500/20',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      accent: 'text-emerald-300'
    },
    blue: {
      bg: 'from-blue-600/20 to-blue-500/20',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      accent: 'text-blue-300'
    },
    amber: {
      bg: 'from-amber-600/20 to-amber-500/20',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
      accent: 'text-amber-300'
    }
  };

  const styles = colorClasses[color];
  const change = Math.random() > 0.5 ? Math.random() * 5 : -Math.random() * 3;

  // Get symbol prefix for display
  const getSymbolPrefix = (tokenSymbol: string): string => {
    switch (tokenSymbol) {
      case 'eUSD':
        return '$';
      case 'eINR':
        return '₹';
      case 'eAED':
        return 'د.إ';
      default:
        return '$';
    }
  };

  const symbolPrefix = getSymbolPrefix(balance.token_symbol);
  const balanceAmount = Number(balance.balance);

  return (
    <Card className={`bg-gradient-to-br ${styles.bg} ${styles.border} border backdrop-blur-sm hover:scale-105 transition-transform duration-200`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`text-sm font-medium ${styles.text}`}>{balance.token_symbol}</div>
          <div className="flex items-center gap-1">
            {change > 0 ? (
              <TrendingUp size={16} className="text-green-400" />
            ) : (
              <TrendingDown size={16} className="text-red-400" />
            )}
            <span className={`text-xs ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {Math.abs(change).toFixed(2)}%
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className={`text-2xl font-bold ${styles.accent}`}>
            {symbolPrefix}{balanceAmount.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400">
            ≈ ${(balanceAmount * 0.012).toFixed(2)} USD
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Available</span>
            <span className={styles.text}>{balanceAmount.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenBalance;
