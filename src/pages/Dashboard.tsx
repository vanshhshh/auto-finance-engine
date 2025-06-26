
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Send, 
  Receipt, 
  CreditCard, 
  Globe, 
  TrendingUp,
  Clock,
  Shield,
  Bell,
  Settings,
  Plus,
  Eye,
  EyeOff,
  ChevronRight,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWalletData } from '@/hooks/useWalletData';
import ModernNavbar from '@/components/ModernNavbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { profile, balances, transactions, notifications } = useWalletData();
  const { toast } = useToast();

  if (!user) {
    navigate('/auth');
    return null;
  }

  const totalBalance = balances.reduce((sum, balance) => {
    const usdValue = balance.token_symbol === 'eUSD' ? Number(balance.balance) : 
                     balance.token_symbol === 'eINR' ? Number(balance.balance) * 0.012 :
                     balance.token_symbol === 'eAED' ? Number(balance.balance) * 0.27 : 0;
    return sum + usdValue;
  }, 0);

  const recentTransactions = transactions.slice(0, 4);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const quickActions = [
    {
      icon: <Send className="w-5 h-5" />,
      title: "Send Money",
      description: "Transfer funds globally",
      action: () => navigate('/transfer'),
      color: "bg-blue-600 hover:bg-blue-700"
    },
    {
      icon: <Receipt className="w-5 h-5" />,
      title: "Request Money",
      description: "Create payment request",
      action: () => navigate('/transfer?type=request'),
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Exchange",
      description: "Convert currencies",
      action: () => navigate('/exchange'),
      color: "bg-purple-600 hover:bg-purple-700"
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: "Cards",
      description: "Manage your cards",
      action: () => navigate('/cards'),
      color: "bg-orange-600 hover:bg-orange-700"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernNavbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {user.email?.split('@')[0]}!
                </h1>
                <p className="text-gray-600 mt-1">
                  Here's what's happening with your money today.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="relative"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/security')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>

          {/* KYC Status Banner */}
          {profile?.kyc_status !== 'approved' && (
            <Card className="mb-8 border-orange-200 bg-orange-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-orange-800">Complete your verification</h3>
                      <p className="text-orange-600 text-sm">
                        {profile?.kyc_status === 'pending' && "Upload your documents to start using all features"}
                        {profile?.kyc_status === 'under_review' && "Your documents are being reviewed"}
                        {profile?.kyc_status === 'rejected' && "Please resubmit your documents"}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => navigate('/security')}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    {profile?.kyc_status === 'pending' ? 'Start Verification' : 'View Status'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Balance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Balance */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-blue-100 font-medium">Total Balance</h3>
                      <button
                        onClick={() => setBalanceVisible(!balanceVisible)}
                        className="text-blue-100 hover:text-white transition-colors"
                      >
                        {balanceVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="text-3xl font-bold mb-2">
                      {balanceVisible ? `$${totalBalance.toFixed(2)}` : '••••••'}
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-green-300" />
                      <span className="text-green-300 text-sm">+2.5% this month</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Available Balance */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-600 font-medium">Available to Send</h3>
                      <Zap className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {balanceVisible ? `$${totalBalance.toFixed(2)}` : '••••••'}
                    </div>
                    <p className="text-green-600 text-sm">Ready to transfer</p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Quick Actions</span>
                    <Button variant="ghost" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Customize
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className={`${action.color} text-white p-4 rounded-xl transition-all duration-200 hover:scale-105 text-left`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          {action.icon}
                          <ChevronRight className="w-4 h-4 opacity-70" />
                        </div>
                        <h4 className="font-semibold text-sm">{action.title}</h4>
                        <p className="text-xs opacity-90">{action.description}</p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Recent Activity</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate('/transactions')}
                    >
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentTransactions.length > 0 ? (
                    <div className="space-y-4">
                      {recentTransactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              tx.transaction_type === 'send' ? 'bg-red-100' : 'bg-green-100'
                            }`}>
                              {tx.transaction_type === 'send' ? 
                                <ArrowUpRight className="w-5 h-5 text-red-600" /> : 
                                <ArrowDownLeft className="w-5 h-5 text-green-600" />
                              }
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 capitalize">
                                {tx.transaction_type} to {tx.to_address.slice(0, 10)}...
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(tx.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-semibold ${
                              tx.transaction_type === 'send' ? 'text-red-600' : 'text-green-600'
                            }`}>
                              {tx.transaction_type === 'send' ? '-' : '+'}${tx.amount}
                            </div>
                            <Badge variant={
                              tx.status === 'completed' ? 'default' : 
                              tx.status === 'failed' ? 'destructive' : 'secondary'
                            }>
                              {tx.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Receipt className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium mb-2">No transactions yet</p>
                      <p className="text-sm">Start by sending or receiving money</p>
                      <Button 
                        onClick={() => navigate('/transfer')}
                        className="mt-4 bg-blue-600 hover:bg-blue-700"
                      >
                        Send Money Now
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Currency Balances */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Currency Balances</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {balances.map((balance) => (
                      <div key={balance.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-xs">
                              {balance.token_symbol.replace('e', '')}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{balance.token_symbol}</div>
                            <div className="text-xs text-gray-500">
                              {balance.token_symbol === 'eUSD' ? 'US Dollar' :
                               balance.token_symbol === 'eINR' ? 'Indian Rupee' :
                               balance.token_symbol === 'eAED' ? 'UAE Dirham' : 'Digital Currency'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {balanceVisible ? Number(balance.balance).toFixed(2) : '••••'}
                          </div>
                          <div className="text-xs text-gray-500">{balance.token_symbol}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => navigate('/exchange')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Currency
                  </Button>
                </CardContent>
              </Card>

              {/* Exchange Rates */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span>Live Rates</span>
                    <Clock className="w-4 h-4 text-gray-400" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { from: 'USD', to: 'INR', rate: '83.12', change: '+0.15%', positive: true },
                      { from: 'USD', to: 'AED', rate: '3.67', change: '-0.08%', positive: false },
                      { from: 'EUR', to: 'USD', rate: '1.09', change: '+0.22%', positive: true },
                      { from: 'GBP', to: 'USD', rate: '1.27', change: '+0.11%', positive: true }
                    ].map((rate, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="font-medium">{rate.from}/{rate.to}</span>
                        <div className="text-right">
                          <div className="font-semibold">{rate.rate}</div>
                          <div className={`text-xs ${rate.positive ? 'text-green-600' : 'text-red-600'}`}>
                            {rate.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4"
                    onClick={() => navigate('/exchange')}
                  >
                    View All Rates
                  </Button>
                </CardContent>
              </Card>

              {/* Security Status */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Security Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">2FA Enabled</span>
                      <Badge variant={profile?.kyc_status === 'approved' ? 'default' : 'secondary'}>
                        {profile?.kyc_status === 'approved' ? 'Active' : 'Pending'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">KYC Verified</span>
                      <Badge variant={profile?.kyc_status === 'approved' ? 'default' : 'secondary'}>
                        {profile?.kyc_status === 'approved' ? 'Verified' : 'Pending'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Device Trusted</span>
                      <Badge variant="default">Yes</Badge>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-4"
                    onClick={() => navigate('/security')}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Security Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
