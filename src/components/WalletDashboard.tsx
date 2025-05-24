
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Send, Download, Plus, Minus, Activity, Settings, LogOut } from 'lucide-react';
import TokenBalance from './TokenBalance';
import TransactionModal from './TransactionModal';
import ActivityLog from './ActivityLog';
import RuleBuilder from './RuleBuilder';
import { useAuth } from '@/contexts/AuthContext';
import { useWalletData } from '@/hooks/useWalletData';

const WalletDashboard = () => {
  const [activeTab, setActiveTab] = useState('wallet');
  const [modalType, setModalType] = useState<'send' | 'receive' | 'mint' | 'burn' | null>(null);
  const { user, signOut } = useAuth();
  const { profile, balances } = useWalletData();

  const tabs = [
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'activity', label: 'Activity', icon: Activity },
    { id: 'rules', label: 'Rules', icon: Settings },
  ];

  const getTokenBalance = (symbol: string) => {
    const balance = balances.find(b => b.token_symbol === symbol);
    return balance ? Number(balance.balance) : 0;
  };

  const getTokenSymbol = (token: string) => {
    switch (token) {
      case 'eINR': return '₹';
      case 'eUSD': return '$';
      case 'eAED': return 'د.إ';
      default: return '';
    }
  };

  const getTokenColor = (token: string): 'emerald' | 'blue' | 'amber' => {
    switch (token) {
      case 'eINR': return 'emerald';
      case 'eUSD': return 'blue';
      case 'eAED': return 'amber';
      default: return 'blue';
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Gate Finance</h1>
            <p className="text-blue-200">Programmable CBDC Wallet Platform</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="default" className="px-3 py-1">
              Connected
            </Badge>
            {profile?.wallet_address && (
              <div className="text-sm text-blue-200 font-mono">
                {profile.wallet_address.slice(0, 6)}...{profile.wallet_address.slice(-4)}
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg backdrop-blur-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-blue-200 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          {/* Token Balances */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['eINR', 'eUSD', 'eAED'].map((token) => (
              <TokenBalance 
                key={token}
                token={token} 
                balance={getTokenBalance(token)} 
                symbol={getTokenSymbol(token)} 
                color={getTokenColor(token)} 
              />
            ))}
          </div>

          {/* Action Buttons */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  onClick={() => setModalType('send')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send size={18} className="mr-2" />
                  Send
                </Button>
                <Button
                  onClick={() => setModalType('receive')}
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-700"
                >
                  <Download size={18} className="mr-2" />
                  Receive
                </Button>
                <Button
                  onClick={() => setModalType('mint')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Plus size={18} className="mr-2" />
                  Mint
                </Button>
                <Button
                  onClick={() => setModalType('burn')}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Minus size={18} className="mr-2" />
                  Burn
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'activity' && <ActivityLog />}
      {activeTab === 'rules' && <RuleBuilder />}

      {/* Transaction Modal */}
      {modalType && (
        <TransactionModal
          type={modalType}
          isOpen={!!modalType}
          onClose={() => setModalType(null)}
        />
      )}
    </div>
  );
};

export default WalletDashboard;
