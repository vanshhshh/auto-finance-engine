
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, Users, Settings, CheckCircle, X, FileText, DownloadIcon, 
  TrendingUp, DollarSign, Activity, AlertTriangle, CreditCard, 
  Globe, Lock, BarChart3, FileSpreadsheet, Bell, Headphones,
  Zap, Database, Smartphone, UserCheck, Ban, Eye
} from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mintLimit, setMintLimit] = useState('1000000');
  const [burnLimit, setBurnLimit] = useState('500000');
  const [dailyLimit, setDailyLimit] = useState('50000');
  const { toast } = useToast();
  const { allUsers, complianceEvents, auditLogs } = useAdminData();

  const [kycDocuments, setKycDocuments] = useState<any[]>([]);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [totalVolume, setTotalVolume] = useState(0);
  const [pendingKyc, setPendingKyc] = useState(0);
  const [approvedUsers, setApprovedUsers] = useState(0);
  const [riskScores, setRiskScores] = useState<any[]>([]);
  const [exchangeRates, setExchangeRates] = useState<any[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<any[]>([]);
  const [merchantAccounts, setMerchantAccounts] = useState<any[]>([]);

  useEffect(() => {
    const fetchRealData = async () => {
      // Fetch KYC documents
      const { data: kycData } = await supabase
        .from('kyc_documents')
        .select(`
          *,
          profile:profiles!inner(user_id, kyc_status)
        `)
        .order('upload_date', { ascending: false });
      
      setKycDocuments(kycData || []);

      // Fetch all transactions
      const { data: transactionData } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      setAllTransactions(transactionData || []);

      // Calculate metrics
      const volume = transactionData?.reduce((sum, tx) => sum + Number(tx.amount), 0) || 0;
      setTotalVolume(volume);

      const pendingUsers = allUsers.filter(u => u.kyc_status === 'under_review').length;
      setPendingKyc(pendingUsers);

      const approved = allUsers.filter(u => u.kyc_status === 'approved').length;
      setApprovedUsers(approved);

      // Initialize exchange rates
      setExchangeRates([
        { pair: 'INR/USD', rate: 83.25, timestamp: new Date() },
        { pair: 'AED/USD', rate: 3.67, timestamp: new Date() },
        { pair: 'INR/AED', rate: 22.68, timestamp: new Date() }
      ]);
    };

    fetchRealData();
  }, [allUsers, activeTab]);

  const handleApproveUser = async (userId: string, tokenSymbol: string) => {
    try {
      const walletAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
      
      await supabase
        .from('profiles')
        .update({ 
          kyc_status: 'approved',
          wallet_approved: true,
          approved_tokens: [tokenSymbol],
          wallet_address: walletAddress
        })
        .eq('user_id', userId);

      await supabase.from('audit_logs').insert({
        action: 'admin_approve_user',
        user_id: userId,
        details: { 
          admin_action: 'approved',
          approved_token: tokenSymbol,
          target_user: userId,
          wallet_address: walletAddress
        }
      });

      toast({
        title: "User Approved",
        description: `User has been approved for ${tokenSymbol} wallet.`,
        className: "bg-blue-600 text-white border-blue-700",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve user.",
        variant: "destructive",
      });
    }
  };

  const handleApproveDocument = async (docId: string, userId: string) => {
    try {
      await supabase
        .from('kyc_documents')
        .update({ 
          status: 'approved',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', docId);

      await supabase
        .from('profiles')
        .update({ kyc_status: 'under_review' })
        .eq('user_id', userId);

      toast({
        title: "Document Approved",
        description: "KYC document has been approved.",
        className: "bg-blue-600 text-white border-blue-700",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve document.",
        variant: "destructive",
      });
    }
  };

  const handleRejectDocument = async (docId: string, reason: string) => {
    try {
      await supabase
        .from('kyc_documents')
        .update({ 
          status: 'rejected',
          admin_notes: reason,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', docId);

      toast({
        title: "Document Rejected",
        description: "KYC document has been rejected.",
        className: "bg-blue-600 text-white border-blue-700",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject document.",
        variant: "destructive",
      });
    }
  };

  const downloadDocument = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('kyc-documents')
        .download(filePath);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filePath.split('/').pop() || 'document.pdf';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download document.",
        variant: "destructive",
      });
    }
  };

  const calculateRiskScore = (user: any, transactions: any[]) => {
    let score = 0;
    const userTxs = transactions.filter(tx => tx.user_id === user.user_id);
    
    // High transaction volume increases risk
    const totalAmount = userTxs.reduce((sum, tx) => sum + Number(tx.amount), 0);
    if (totalAmount > 100000) score += 30;
    else if (totalAmount > 50000) score += 20;
    else if (totalAmount > 10000) score += 10;
    
    // Frequent transactions increase risk
    if (userTxs.length > 50) score += 25;
    else if (userTxs.length > 20) score += 15;
    else if (userTxs.length > 10) score += 5;
    
    // Failed transactions increase risk
    const failedTxs = userTxs.filter(tx => tx.status === 'failed').length;
    score += failedTxs * 5;
    
    // No KYC is high risk
    if (user.kyc_status === 'pending') score += 40;
    else if (user.kyc_status === 'under_review') score += 20;
    
    return Math.min(score, 100);
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'kyc', label: 'KYC Review', icon: FileText },
    { id: 'transactions', label: 'Transactions', icon: Activity },
    { id: 'risk', label: 'Risk & AML', icon: AlertTriangle },
    { id: 'exchange', label: 'Exchange Rates', icon: TrendingUp },
    { id: 'payments', label: 'Payment Requests', icon: CreditCard },
    { id: 'merchant', label: 'Merchants', icon: DollarSign },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'support', label: 'Support', icon: Headphones },
    { id: 'integrations', label: 'Integrations', icon: Zap },
    { id: 'system', label: 'System', icon: Database },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const totalUsers = allUsers.length;
  const totalTransactions = allTransactions.length;
  const activeUsers = allUsers.filter(u => u.wallet_approved).length;
  const avgTransactionValue = totalVolume / (totalTransactions || 1);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Complete system administration and monitoring</p>
          </div>
          <Badge className="bg-red-600 text-white">Admin Panel</Badge>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-50 border-b border-gray-200">
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
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                      <p className="text-xs text-green-600">+12% this month</p>
                    </div>
                    <Users className="text-blue-600" size={24} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Active Users</p>
                      <p className="text-2xl font-bold text-green-600">{activeUsers}</p>
                      <p className="text-xs text-green-600">+8% this month</p>
                    </div>
                    <UserCheck className="text-green-600" size={24} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Transactions</p>
                      <p className="text-2xl font-bold text-blue-600">{totalTransactions}</p>
                      <p className="text-xs text-blue-600">+24% this month</p>
                    </div>
                    <Activity className="text-blue-600" size={24} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Transaction Volume</p>
                      <p className="text-2xl font-bold text-purple-600">₹{totalVolume.toLocaleString()}</p>
                      <p className="text-xs text-purple-600">+18% this month</p>
                    </div>
                    <DollarSign className="text-purple-600" size={24} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                onClick={() => setActiveTab('kyc')}
                className="h-16 bg-orange-600 hover:bg-orange-700 text-white"
              >
                <div className="flex flex-col items-center">
                  <FileText size={20} />
                  <span className="text-sm">Review KYC ({pendingKyc})</span>
                </div>
              </Button>
              
              <Button 
                onClick={() => setActiveTab('risk')}
                className="h-16 bg-red-600 hover:bg-red-700 text-white"
              >
                <div className="flex flex-col items-center">
                  <AlertTriangle size={20} />
                  <span className="text-sm">Risk Monitor</span>
                </div>
              </Button>
              
              <Button 
                onClick={() => setActiveTab('transactions')}
                className="h-16 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <div className="flex flex-col items-center">
                  <Activity size={20} />
                  <span className="text-sm">Monitor Transactions</span>
                </div>
              </Button>
              
              <Button 
                onClick={() => setActiveTab('reports')}
                className="h-16 bg-green-600 hover:bg-green-700 text-white"
              >
                <div className="flex flex-col items-center">
                  <FileSpreadsheet size={20} />
                  <span className="text-sm">Generate Reports</span>
                </div>
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <CardTitle>User Management & Wallet Approval</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allUsers.slice(0, 20).map((user) => (
                  <div key={user.id} className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <code className="text-blue-600 font-mono text-sm">
                          {user.wallet_address?.slice(0, 10)}...{user.wallet_address?.slice(-8)}
                        </code>
                        <Badge className={`${
                          user.kyc_status === 'approved' ? 'bg-green-600' :
                          user.kyc_status === 'under_review' ? 'bg-orange-600' :
                          user.kyc_status === 'rejected' ? 'bg-red-600' : 'bg-gray-600'
                        } text-white`}>
                          {user.kyc_status?.toUpperCase() || 'PENDING'}
                        </Badge>
                        {user.wallet_approved && (
                          <Badge className="bg-blue-600 text-white">WALLET APPROVED</Badge>
                        )}
                        <Badge className={`${
                          calculateRiskScore(user, allTransactions) > 70 ? 'bg-red-600' :
                          calculateRiskScore(user, allTransactions) > 40 ? 'bg-orange-600' : 'bg-green-600'
                        } text-white`}>
                          Risk: {calculateRiskScore(user, allTransactions)}%
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-gray-600 hover:bg-gray-700 text-white">
                          <Eye size={14} className="mr-1" />
                          View
                        </Button>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                          <Ban size={14} className="mr-1" />
                          Suspend
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      User ID: {user.user_id?.slice(0, 8)}... | Country: {user.country_of_residence || 'Not set'}
                    </div>
                    {user.kyc_status === 'approved' && !user.wallet_approved && (
                      <div className="space-y-2">
                        <Label>Approve wallet for token:</Label>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveUser(user.user_id, 'eINR')}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Approve eINR
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApproveUser(user.user_id, 'eUSD')}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Approve eUSD
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleApproveUser(user.user_id, 'eAED')}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            Approve eAED
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'kyc' && (
          <Card>
            <CardHeader>
              <CardTitle>KYC Document Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {kycDocuments.map((doc) => (
                  <div key={doc.id} className="p-4 bg-gray-50 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <FileText className="text-blue-600" size={20} />
                        <div>
                          <div className="font-medium">{doc.document_type.replace(/_/g, ' ').toUpperCase()}</div>
                          <div className="text-sm text-gray-600">
                            User: {doc.user_id?.slice(0, 8)}... | {doc.file_name}
                          </div>
                        </div>
                      </div>
                      <Badge className={`${
                        doc.status === 'approved' ? 'bg-green-600' :
                        doc.status === 'rejected' ? 'bg-red-600' : 'bg-orange-600'
                      } text-white`}>
                        {doc.status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500 mb-3">
                      Uploaded: {new Date(doc.upload_date).toLocaleString()}
                    </div>
                    {doc.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => downloadDocument(doc.file_path)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <DownloadIcon size={14} className="mr-1" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApproveDocument(doc.id, doc.user_id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle size={14} className="mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleRejectDocument(doc.id, 'Document rejected by admin')}
                          className="bg-red-600 hover:bg-red-700 text-white"
                        >
                          <X size={14} className="mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                {kycDocuments.length === 0 && (
                  <div className="text-center py-8 text-gray-600">
                    No KYC documents submitted yet.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'transactions' && (
          <Card>
            <CardHeader>
              <CardTitle>Transaction Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allTransactions.map((tx) => (
                  <div key={tx.id} className="p-4 bg-gray-50 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{tx.token_symbol} {tx.amount}</div>
                        <div className="text-sm text-gray-600">
                          {tx.transaction_type} | {new Date(tx.created_at).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          From: {tx.from_address || 'N/A'} → To: {tx.to_address}
                        </div>
                        {tx.tx_hash && (
                          <div className="text-xs text-blue-600 font-mono">
                            TX: {tx.tx_hash.slice(0, 20)}...
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={`${
                          tx.status === 'completed' ? 'bg-green-600' :
                          tx.status === 'failed' ? 'bg-red-600' : 'bg-orange-600'
                        } text-white`}>
                          {tx.status.toUpperCase()}
                        </Badge>
                        <div className="flex gap-1">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Eye size={12} className="mr-1" />
                            Details
                          </Button>
                          {tx.status === 'pending' && (
                            <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                              <Ban size={12} className="mr-1" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'risk' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>High Risk Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allUsers
                    .map(user => ({
                      ...user,
                      riskScore: calculateRiskScore(user, allTransactions)
                    }))
                    .filter(user => user.riskScore > 50)
                    .sort((a, b) => b.riskScore - a.riskScore)
                    .slice(0, 10)
                    .map((user) => (
                      <div key={user.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{user.user_id?.slice(0, 8)}...</div>
                            <div className="text-sm text-gray-600">{user.country_of_residence}</div>
                          </div>
                          <Badge className="bg-red-600 text-white">
                            Risk: {user.riskScore}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AML Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allTransactions
                    .filter(tx => Number(tx.amount) > 50000)
                    .slice(0, 10)
                    .map((tx) => (
                      <div key={tx.id} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">Large Transaction Alert</div>
                            <div className="text-sm text-gray-600">
                              {tx.token_symbol} {tx.amount} | {tx.transaction_type}
                            </div>
                          </div>
                          <Badge className="bg-orange-600 text-white">
                            High Amount
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'exchange' && (
          <Card>
            <CardHeader>
              <CardTitle>Exchange Rates Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {exchangeRates.map((rate, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{rate.pair}</div>
                        <div className="text-2xl font-bold text-blue-600">{rate.rate}</div>
                        <div className="text-xs text-gray-500">
                          Updated: {rate.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        Update
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Add New Currency Pair</Label>
                  <div className="flex gap-2 mt-2">
                    <Input placeholder="From Currency" />
                    <Input placeholder="To Currency" />
                    <Input placeholder="Rate" type="number" step="0.0001" />
                    <Button className="bg-green-600 hover:bg-green-700 text-white">Add</Button>
                  </div>
                </div>
                
                <div>
                  <Label>Transaction Fee Settings</Label>
                  <div className="flex gap-2 mt-2">
                    <Input placeholder="Percentage" type="number" step="0.01" />
                    <Input placeholder="Min Fee" type="number" step="0.01" />
                    <Input placeholder="Max Fee" type="number" step="0.01" />
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Update</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'settings' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>System Limits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="mintLimit">Daily Mint Limit (₹)</Label>
                  <Input
                    id="mintLimit"
                    value={mintLimit}
                    onChange={(e) => setMintLimit(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="burnLimit">Daily Burn Limit (₹)</Label>
                  <Input
                    id="burnLimit"
                    value={burnLimit}
                    onChange={(e) => setBurnLimit(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="dailyLimit">User Daily Limit (₹)</Label>
                  <Input
                    id="dailyLimit"
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(e.target.value)}
                  />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Update Limits
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Enable New Registrations</Label>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Allow Cross-Border Transfers</Label>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Emergency Freeze Mode</Label>
                  <Switch checked={false} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Maintenance Mode</Label>
                  <Switch checked={false} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Enable Multi-Factor Authentication</Label>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Real-time Fraud Detection</Label>
                  <Switch checked={true} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {!['overview', 'users', 'kyc', 'transactions', 'risk', 'exchange', 'settings'].includes(activeTab) && (
          <Card>
            <CardHeader>
              <CardTitle>{tabs.find(t => t.id === activeTab)?.label} - Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  {React.createElement(tabs.find(t => t.id === activeTab)?.icon || Shield, { size: 48 })}
                </div>
                <p className="text-gray-600">This feature is under development and will be available soon.</p>
                <Button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                  Request Priority Access
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
