
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useWalletData } from '@/hooks/useWalletData';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownLeft, Plus, Minus } from 'lucide-react';

const ActivityLog = () => {
  const { transactions } = useWalletData();

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send': return <ArrowUpRight className="text-red-400" size={16} />;
      case 'receive': return <ArrowDownLeft className="text-green-400" size={16} />;
      case 'mint': return <Plus className="text-blue-400" size={16} />;
      case 'burn': return <Minus className="text-orange-400" size={16} />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              No transactions yet. Start by sending or receiving tokens!
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50"
                >
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(tx.transaction_type)}
                    <div>
                      <div className="text-white font-medium">
                        {tx.transaction_type.charAt(0).toUpperCase() + tx.transaction_type.slice(1)} {tx.token_symbol}
                      </div>
                      <div className="text-sm text-slate-400">
                        {format(new Date(tx.created_at), 'MMM dd, yyyy HH:mm')}
                      </div>
                      {tx.to_address && tx.to_address !== 'system' && (
                        <div className="text-xs text-slate-500 font-mono">
                          To: {tx.to_address.slice(0, 10)}...{tx.to_address.slice(-6)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-medium ${
                      tx.transaction_type === 'send' || tx.transaction_type === 'burn' 
                        ? 'text-red-400' 
                        : 'text-green-400'
                    }`}>
                      {tx.transaction_type === 'send' || tx.transaction_type === 'burn' ? '-' : '+'}
                      {Number(tx.amount).toLocaleString()} {tx.token_symbol}
                    </div>
                    <Badge variant={getStatusColor(tx.status)} className="text-xs">
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityLog;
