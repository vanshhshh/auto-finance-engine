import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Send, Receipt, QrCode, CreditCard, ArrowUpRight, ArrowDownLeft, LogOut } from 'lucide-react';
import { useWalletData } from '@/hooks/useWalletData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import TokenBalance from './TokenBalance';
import TransactionModal from './TransactionModal';
import QRPaymentSystem from './QRPaymentSystem';
import NotificationCenter from './NotificationCenter';
import UserSettings from './UserSettings';

const WalletDashboard = () => {
  const [activeTab, setActiveTab] = useState('wallet');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState<'send' | 'receive'>('send');
  const { balances, transactions, notifications } = useWalletData();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const tabs = [
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'qr-payments', label: 'QR Payments', icon: QrCode },
    { id: 'notifications', label: 'Notifications', icon: Receipt },
    { id: 'settings', label: 'Settings', icon: CreditCard },
  ];

  const totalBalance = balances.reduce((sum, balance) => {
    // Convert to USD for display (simplified conversion)
    const usdValue = balance.token_symbol === 'eUSD' ? balance.balance : 
                     balance.token_symbol === 'eINR' ? Number(balance.balance) * 0.012 :
                     balance.token_symbol === 'eAED' ? Number(balance.balance) * 0.27 : 0;
    return sum + usdValue;
  }, 0);

  const recentTransactions = transactions.slice(0, 5);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
      className: "bg-green-600 text-white border-green-700",
    });
  };

  const openTransactionModal = (type: 'send' | 'receive') => {
    setTransactionType(type);
    setShowTransactionModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Wallet</h1>
            <p className="text-gray-600">Manage your digital assets and transactions</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Portfolio Value</p>
              <p className="text-2xl font-bold text-green-600">${totalBalance.toFixed(2)}</p>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex space-x-4 overflow-x-auto py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'wallet' && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => openTransactionModal('send')}
                className="p-6 h-auto flex-col bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="mb-2" size={24} />
                <span>Send Money</span>
              </Button>
              
              <Button 
                onClick={() => openTransactionModal('receive')}
                variant="outline"
                className="p-6 h-auto flex-col border-green-600 text-green-600 hover:bg-green-50"
              >
                <ArrowDownLeft className="mb-2" size={24} />
                <span>Request Payment</span>
              </Button>
              
              <Button 
                onClick={() => setActiveTab('qr-payments')}
                variant="outline"
                className="p-6 h-auto flex-col border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                <QrCode className="mb-2" size={24} />
                <span>QR Payment</span>
              </Button>
            </div>

            {/* Token Balances */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {balances.map((balance) => (
                <TokenBalance key={balance.id} balance={balance} />
              ))}
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Activity</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setActiveTab('transactions')}
                >
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          tx.transaction_type === 'send' ? 'bg-red-100' : 'bg-green-100'
                        }`}>
                          {tx.transaction_type === 'send' ? 
                            <ArrowUpRight className="text-red-600" size={16} /> : 
                            <ArrowDownLeft className="text-green-600" size={16} />
                          }
                        </div>
                        <div>
                          <div className="font-medium capitalize">{tx.transaction_type}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(tx.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-medium ${
                          tx.transaction_type === 'send' ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {tx.transaction_type === 'send' ? '-' : '+'}
                          {tx.amount} {tx.token_symbol}
                        </div>
                        <Badge className={`${
                          tx.status === 'completed' ? 'bg-green-600' :
                          tx.status === 'failed' ? 'bg-red-600' : 'bg-orange-600'
                        } text-white`}>
                          {tx.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {recentTransactions.length === 0 && (
                    <div className="text-center py-8 text-gray-600">
                      <Receipt size={48} className="mx-auto mb-4 text-gray-400" />
                      <p>No transactions yet</p>
                      <p className="text-sm">Start sending or receiving money to see your activity here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'transactions' && (
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${
                        tx.transaction_type === 'send' ? 'bg-red-100' : 'bg-green-100'
                      }`}>
                        {tx.transaction_type === 'send' ? 
                          <ArrowUpRight className="text-red-600" size={20} /> : 
                          <ArrowDownLeft className="text-green-600" size={20} />
                        }
                      </div>
                      <div>
                        <div className="font-medium capitalize">{tx.transaction_type}</div>
                        <div className="text-sm text-gray-600">
                          To: {tx.to_address.slice(0, 10)}...{tx.to_address.slice(-8)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(tx.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-medium ${
                        tx.transaction_type === 'send' ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {tx.transaction_type === 'send' ? '-' : '+'}
                        {tx.amount} {tx.token_symbol}
                      </div>
                      <Badge className={`${
                        tx.status === 'completed' ? 'bg-green-600' :
                        tx.status === 'failed' ? 'bg-red-600' : 'bg-orange-600'
                      } text-white`}>
                        {tx.status.toUpperCase()}
                      </Badge>
                      {tx.tx_hash && (
                        <div className="text-xs text-gray-500 mt-1">
                          Hash: {tx.tx_hash.slice(0, 8)}...
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <div className="text-center py-12 text-gray-600">
                    <Receipt size={48} className="mx-auto mb-4 text-gray-400" />
                    <p>No transaction history</p>
                    <p className="text-sm">Your completed transactions will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'qr-payments' && <QRPaymentSystem />}
        {activeTab === 'notifications' && <NotificationCenter />}
        {activeTab === 'settings' && <UserSettings />}
      </div>

      {/* Transaction Modal */}
      {showTransactionModal && (
        <TransactionModal 
          type={transactionType}
          isOpen={showTransactionModal}
          onClose={() => setShowTransactionModal(false)} 
        />
      )}
    </div>
  );
};

export default WalletDashboard;
