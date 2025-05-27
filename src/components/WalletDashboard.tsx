
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Send, Download, Activity, Settings, LogOut, Shield, Building, AlertCircle } from 'lucide-react';
import TokenBalance from './TokenBalance';
import TransactionModal from './TransactionModal';
import ActivityLog from './ActivityLog';
import AnalyticsDashboard from './AnalyticsDashboard';
import ComplianceMonitor from './ComplianceMonitor';
import NotificationCenter from './NotificationCenter';
import AdminDashboard from './AdminDashboard';
import UserSettings from './UserSettings';
import { useAuth } from '@/contexts/AuthContext';
import { useWalletData } from '@/hooks/useWalletData';
import { useRealTimeData } from '@/hooks/useRealTimeData';
import { useToast } from '@/hooks/use-toast';

const WalletDashboard = () => {
  const [activeTab, setActiveTab] = useState('wallet');
  const [modalType, setModalType] = useState<'send' | 'receive' | null>(null);
  const { user, signOut } = useAuth();
  const { profile, balances } = useWalletData();
  const { toast } = useToast();
  
  useRealTimeData();

  const isAdmin = user?.email?.includes('admin') || false;

  const tabs = [
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'activity', label: 'Activity', icon: Activity },
    ...(isAdmin ? [
      { id: 'analytics', label: 'Analytics', icon: AnalyticsDashboard },
      { id: 'compliance', label: 'Compliance', icon: Shield },
      { id: 'admin', label: 'Admin', icon: AdminDashboard }
    ] : []),
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

  const handleSendClick = () => {
    if (!profile?.wallet_approved || profile?.kyc_status !== 'approved') {
      toast({
        title: "KYC Verification Required",
        description: "You must complete KYC verification and get wallet approval before sending CBDC.",
        className: "bg-blue-600 text-white border-blue-700",
      });
      return;
    }
    setModalType('send');
  };

  const handleAddCBDC = () => {
    toast({
      title: "Add CBDC",
      description: "Please use your bank's app to add CBDC to your wallet.",
      className: "bg-blue-600 text-white border-blue-700",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl bg-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gate Finance</h1>
            <p className="text-blue-600">Programmable CBDC Wallet Platform</p>
          </div>
          <div className="flex items-center gap-4">
            <NotificationCenter />
            <Badge variant="default" className="px-3 py-1 bg-green-600 text-white">
              Connected
            </Badge>
            {isAdmin && (
              <Badge className="bg-red-600 px-3 py-1 text-white">
                Admin
              </Badge>
            )}
            {profile?.organization && (
              <Badge variant="outline" className="border-blue-400 text-blue-600 px-3 py-1">
                <Building size={14} className="mr-1" />
                {profile.organization.type}
              </Badge>
            )}
            {profile?.wallet_address && (
              <div className="text-sm text-blue-600 font-mono">
                {profile.wallet_address.slice(0, 6)}...{profile.wallet_address.slice(-4)}
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('settings')}
              className="border-blue-400 text-blue-600 hover:bg-blue-50"
            >
              <Settings size={16} className="mr-2" />
              Settings
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="border-red-400 text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg backdrop-blur-sm overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* KYC Status Alert */}
      {!isAdmin && profile?.kyc_status !== 'approved' && (
        <Card className="bg-orange-50 border-orange-200 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-orange-600" size={20} />
              <div>
                <div className="text-orange-800 font-medium">KYC Verification Required</div>
                <div className="text-orange-700 text-sm">
                  Complete your KYC verification in Settings to unlock full wallet functionality.
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => setActiveTab('settings')}
                className="bg-orange-600 hover:bg-orange-700 text-white ml-auto"
              >
                Complete KYC
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tab Content */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          {/* Organization Info */}
          {profile?.organization && (
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building className="text-blue-600" size={20} />
                    <div>
                      <div className="text-gray-900 font-medium">{profile.organization.name}</div>
                      <div className="text-gray-600 text-sm">
                        {profile.organization.type} • KYC: {profile.organization.kyc_status}
                      </div>
                    </div>
                  </div>
                  <Badge className={`${
                    profile.organization.compliance_score > 80 ? 'bg-green-600' : 
                    profile.organization.compliance_score > 60 ? 'bg-yellow-600' : 'bg-red-600'
                  } text-white`}>
                    Compliance: {profile.organization.compliance_score || 0}%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

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
          <Card className="bg-gray-50 border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={handleSendClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send size={18} className="mr-2" />
                  Send
                </Button>
                <Button
                  onClick={() => setModalType('receive')}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download size={18} className="mr-2" />
                  Receive
                </Button>
                <Button
                  onClick={handleAddCBDC}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Add CBDC
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'activity' && <ActivityLog />}
      {activeTab === 'analytics' && isAdmin && <AnalyticsDashboard />}
      {activeTab === 'compliance' && isAdmin && <ComplianceMonitor />}
      {activeTab === 'admin' && isAdmin && <AdminDashboard />}
      {activeTab === 'settings' && <UserSettings />}

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
