
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, ArrowDownLeft, Plus, Minus, ExternalLink } from 'lucide-react';
import { useWalletStore } from '@/store/walletStore';

const ActivityLog = () => {
  const { transactions } = useWalletStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'send': return <ArrowUpRight className="text-blue-400" size={16} />;
      case 'receive': return <ArrowDownLeft className="text-green-400" size={16} />;
      case 'mint': return <Plus className="text-emerald-400" size={16} />;
      case 'burn': return <Minus className="text-red-400" size={16} />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              No transactions yet. Start by minting or sending tokens!
            </div>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-600/50 rounded-full">
                    {getIcon(tx.type)}
                  </div>
                  <div>
                    <div className="font-medium text-white">
                      {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)} {tx.token}
                    </div>
                    <div className="text-sm text-slate-400">
                      {tx.timestamp.toLocaleDateString()} at {tx.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-medium text-white">
                    {tx.type === 'send' || tx.type === 'burn' ? '-' : '+'}
                    {tx.amount.toLocaleString()} {tx.token}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getStatusColor(tx.status)}>
                      {tx.status}
                    </Badge>
                    {tx.txHash && (
                      <button className="text-blue-400 hover:text-blue-300">
                        <ExternalLink size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
