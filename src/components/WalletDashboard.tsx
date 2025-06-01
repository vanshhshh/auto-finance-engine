
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Send, Receipt, QrCode, ArrowUpRight, ArrowDownLeft, LogOut, Bell, Settings, Zap } from 'lucide-react';
import { useWalletData } from '@/hooks/useWalletData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import TokenBalance from './TokenBalance';
import TransactionModal from './TransactionModal';
import QRPaymentSystem from './QRPaymentSystem';
import UserSettings from './UserSettings';
import RuleBuilder from './RuleBuilder';
import TransferPage from './TransferPage';
import KYCOnboarding from './KYCOnboarding';

const WalletDashboard = () => {
  const [activeTab, setActiveTab] = useState('wallet');
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [transactionType, setTransactionType] = useState<'send' | 'receive'>('send');
  const { balances, transactions, notifications, profile } = useWalletData();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const tabs = [
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'transfer', label: 'Transfer', icon: Send },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'qr-payments', label: 'QR Payments', icon: QrCode },
    { id: 'programmable-rules', label: 'Programmable Rules', icon: Zap },
  ];

  const totalBalance = balances.reduce((sum, balance) => {
    const usdValue = balance.token_symbol === 'eUSD' ? Number(balance.balance) : 
                     balance.token_symbol === 'eINR' ? Number(balance.balance) * 0.012 :
                     balance.token_symbol === 'eAED' ? Number(balance.balance) * 0.27 : 0;
    return sum + usdValue;
  }, 0);

  const recentTransactions = transactions.slice(0, 5);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
      className: "bg-blue-600 text-white border-blue-700",
    });
  };

  const openTransactionModal = (type: 'send' | 'receive') => {
    setTransactionType(type);
    setShowTransactionModal(true);
  };

  // Check if user needs KYC
  if (!profile?.kyc_status || profile.kyc_status === 'pending') {
    return <KYCOnboarding />;
  }

  if (profile.kyc_status === 'under_review') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center">KYC Under Review</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Your KYC documents are being reviewed. This typically takes 1-3 business days.
            </p>
            <Badge className="bg-orange-600 text-white">Under Review</Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (profile.kyc_status === 'rejected') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">KYC Rejected</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Your KYC verification was rejected. Please contact support or resubmit your documents.
            </p>
            <Button onClick={() => setActiveTab('settings')} className="bg-blue-600 hover:bg-blue-700">
              Resubmit Documents
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Wallet</h1>
            <p className="text-gray-600">Manage your digital assets and CBDC transactions</p>
            {profile?.wallet_address && (
              <p className="text-sm text-gray-500">Address: {profile.wallet_address}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Portfolio Value</p>
              <p className="text-2xl font-bold text-green-600">${totalBalance.toFixed(2)}</p>
            </div>
            <div className="relative">
              <Button variant="outline" size="icon" className="relative">
                <Bell size={20} />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </Button>
            </div>
            <Button
              onClick={() => setShowSettings(!showSettings)}
              variant="outline"
              size="icon"
            >
              <Settings size={20} />
            </Button>
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

      {/* Settings Dropdown */}
      {showSettings && (
        <div className="absolute top-20 right-6 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-64">
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              className="w-full justify-start"
              onClick={() => {
                setActiveTab('settings');
                setShowSettings(false);
              }}
            >
              Profile Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              User Guide
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              FAQ
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Support
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Privacy Policy
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Terms of Service
            </Button>
          </div>
        </div>
      )}

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
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${
                activeTab === 'settings'
                  ? 'border-blue-600 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings size={16} />
              Settings
            </button>
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
                <TokenBalance 
                  key={balance.id} 
                  balance={{
                    ...balance,
                    balance: balance.balance.toString()
                  }} 
                />
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

        {activeTab === 'transfer' && <TransferPage />}
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
        {activeTab === 'programmable-rules' && <RuleBuilder />}
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
