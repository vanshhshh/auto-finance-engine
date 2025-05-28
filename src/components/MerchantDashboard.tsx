
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Store, QrCode, Receipt, Settings, TrendingUp, Users, CreditCard, LogOut, FileText, Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWalletData } from '@/hooks/useWalletData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const MerchantDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [businessInfo, setBusinessInfo] = useState({
    business_name: '',
    business_type: '',
    address: '',
    phone: '',
    website: '',
  });
  const [kycStatus, setKycStatus] = useState('pending');
  const { user, signOut } = useAuth();
  const { profile, balances, transactions } = useWalletData();
  const { toast } = useToast();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Store },
    { id: 'kyc', label: 'KYC Verification', icon: Shield },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'qr-codes', label: 'QR Codes', icon: QrCode },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
      className: "bg-green-600 text-white border-green-700",
    });
  };

  const handleKycSubmission = async () => {
    if (!user) return;

    try {
      // Create merchant profile
      const { error: profileError } = await supabase
        .from('merchant_profiles')
        .upsert({
          user_id: user.id,
          ...businessInfo,
          status: 'under_review'
        });

      if (profileError) throw profileError;

      // Update profile KYC status
      const { error: kycError } = await supabase
        .from('profiles')
        .update({ 
          kyc_status: 'under_review',
          kyc_documents_uploaded: true 
        })
        .eq('user_id', user.id);

      if (kycError) throw kycError;

      setKycStatus('under_review');
      
      toast({
        title: "KYC Submitted",
        description: "Your KYC application has been submitted for review.",
        className: "bg-blue-600 text-white border-blue-700",
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit KYC application. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Check if merchant can access wallet features
  const canAccessWallet = profile?.kyc_status === 'approved' && profile?.wallet_approved;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Merchant Dashboard</h1>
            <p className="text-gray-600">Manage your business payments and transactions</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-purple-600 text-white">
              MERCHANT ACCESS
            </Badge>
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
                      ? 'border-purple-600 text-purple-600 bg-purple-50'
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
        {/* KYC Warning Banner */}
        {!canAccessWallet && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-yellow-600" size={20} />
              <div>
                <h3 className="font-medium text-yellow-800">KYC Verification Required</h3>
                <p className="text-sm text-yellow-700">
                  Complete KYC verification to access wallet features and start processing payments.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Business Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Today's Revenue</p>
                      <p className="text-2xl font-bold text-green-600">$1,247</p>
                      <p className="text-xs text-green-600">+12% from yesterday</p>
                    </div>
                    <TrendingUp className="text-green-600" size={24} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Transactions</p>
                      <p className="text-2xl font-bold text-blue-600">{transactions.length}</p>
                      <p className="text-xs text-blue-600">This month</p>
                    </div>
                    <Receipt className="text-blue-600" size={24} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Customers</p>
                      <p className="text-2xl font-bold text-purple-600">847</p>
                      <p className="text-xs text-purple-600">+8% this month</p>
                    </div>
                    <Users className="text-purple-600" size={24} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Wallet Balance</p>
                      <p className="text-2xl font-bold text-orange-600">
                        ${balances.reduce((sum, b) => sum + b.balance * (b.token_symbol === 'eUSD' ? 1 : 0.012), 0).toFixed(2)}
                      </p>
                      <p className="text-xs text-orange-600">Available</p>
                    </div>
                    <CreditCard className="text-orange-600" size={24} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    className="p-6 h-auto flex-col bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={!canAccessWallet}
                  >
                    <QrCode className="mb-2" size={24} />
                    <span>Generate QR Code</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="p-6 h-auto flex-col border-blue-600 text-blue-600 hover:bg-blue-50"
                    disabled={!canAccessWallet}
                  >
                    <Receipt className="mb-2" size={24} />
                    <span>Create Invoice</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="p-6 h-auto flex-col border-green-600 text-green-600 hover:bg-green-50"
                    disabled={!canAccessWallet}
                  >
                    <TrendingUp className="mb-2" size={24} />
                    <span>View Analytics</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'kyc' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="business_name">Business Name *</Label>
                    <Input
                      id="business_name"
                      value={businessInfo.business_name}
                      onChange={(e) => setBusinessInfo({...businessInfo, business_name: e.target.value})}
                      placeholder="Enter your business name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="business_type">Business Type *</Label>
                    <Input
                      id="business_type"
                      value={businessInfo.business_type}
                      onChange={(e) => setBusinessInfo({...businessInfo, business_type: e.target.value})}
                      placeholder="e.g., Restaurant, Retail, Services"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address">Business Address *</Label>
                    <Input
                      id="address"
                      value={businessInfo.address}
                      onChange={(e) => setBusinessInfo({...businessInfo, address: e.target.value})}
                      placeholder="Enter your business address"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={businessInfo.phone}
                      onChange={(e) => setBusinessInfo({...businessInfo, phone: e.target.value})}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input
                      id="website"
                      value={businessInfo.website}
                      onChange={(e) => setBusinessInfo({...businessInfo, website: e.target.value})}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleKycSubmission}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={!businessInfo.business_name || !businessInfo.business_type || !businessInfo.address || !businessInfo.phone}
                >
                  Submit for Review
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Verification Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Badge className={`${
                    profile?.kyc_status === 'approved' ? 'bg-green-600' :
                    profile?.kyc_status === 'under_review' ? 'bg-orange-600' :
                    profile?.kyc_status === 'rejected' ? 'bg-red-600' : 'bg-gray-600'
                  } text-white px-4 py-2`}>
                    {profile?.kyc_status?.toUpperCase() || 'PENDING'}
                  </Badge>
                </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  {profile?.kyc_status === 'pending' && "Please submit your business information to start the verification process."}
                  {profile?.kyc_status === 'under_review' && "Your business information is being reviewed. This typically takes 2-5 business days."}
                  {profile?.kyc_status === 'approved' && "Your merchant account is verified. You can now use all payment features."}
                  {profile?.kyc_status === 'rejected' && "Your application was rejected. Please contact support or resubmit with correct information."}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'payments' && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Management</CardTitle>
            </CardHeader>
            <CardContent>
              {canAccessWallet ? (
                <div className="text-center py-8">
                  <CreditCard size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">Payment processing system</p>
                  <p className="text-sm text-gray-500">Manage payment links, invoices, and recurring payments</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield size={48} className="mx-auto mb-4 text-yellow-500" />
                  <p className="text-gray-600 mb-4">Complete KYC verification to access payment features</p>
                  <Button onClick={() => setActiveTab('kyc')} className="bg-purple-600 hover:bg-purple-700 text-white">
                    Complete KYC
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'qr-codes' && (
          <Card>
            <CardHeader>
              <CardTitle>QR Code Management</CardTitle>
            </CardHeader>
            <CardContent>
              {canAccessWallet ? (
                <div className="text-center py-8">
                  <QrCode size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">QR code payment system</p>
                  <p className="text-sm text-gray-500">Generate and manage QR codes for quick payments</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield size={48} className="mx-auto mb-4 text-yellow-500" />
                  <p className="text-gray-600 mb-4">Complete KYC verification to access QR features</p>
                  <Button onClick={() => setActiveTab('kyc')} className="bg-purple-600 hover:bg-purple-700 text-white">
                    Complete KYC
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'transactions' && (
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              {canAccessWallet ? (
                <div className="space-y-4">
                  {transactions.length > 0 ? (
                    transactions.map((tx) => (
                      <div key={tx.id} className="p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{tx.transaction_type}</div>
                            <div className="text-sm text-gray-600">{tx.amount} {tx.token_symbol}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(tx.created_at).toLocaleString()}
                            </div>
                          </div>
                          <Badge className={`${
                            tx.status === 'completed' ? 'bg-green-600' :
                            tx.status === 'failed' ? 'bg-red-600' : 'bg-orange-600'
                          } text-white`}>
                            {tx.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Receipt size={48} className="mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600">No transactions yet</p>
                      <p className="text-sm text-gray-500">Your payment transactions will appear here</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield size={48} className="mx-auto mb-4 text-yellow-500" />
                  <p className="text-gray-600 mb-4">Complete KYC verification to view transactions</p>
                  <Button onClick={() => setActiveTab('kyc')} className="bg-purple-600 hover:bg-purple-700 text-white">
                    Complete KYC
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'analytics' && (
          <Card>
            <CardHeader>
              <CardTitle>Business Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              {canAccessWallet ? (
                <div className="text-center py-8">
                  <TrendingUp size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 mb-4">Business intelligence dashboard</p>
                  <p className="text-sm text-gray-500">Revenue analytics, customer insights, and performance metrics</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield size={48} className="mx-auto mb-4 text-yellow-500" />
                  <p className="text-gray-600 mb-4">Complete KYC verification to access analytics</p>
                  <Button onClick={() => setActiveTab('kyc')} className="bg-purple-600 hover:bg-purple-700 text-white">
                    Complete KYC
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'settings' && (
          <Card>
            <CardHeader>
              <CardTitle>Merchant Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">Merchant account settings</p>
                <p className="text-sm text-gray-500">Configure your business preferences and payment settings</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MerchantDashboard;
