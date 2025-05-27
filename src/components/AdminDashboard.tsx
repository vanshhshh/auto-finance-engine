
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, Settings, CheckCircle, X, FileText, Download } from 'lucide-react';
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

  useEffect(() => {
    const fetchKycDocuments = async () => {
      const { data } = await supabase
        .from('kyc_documents')
        .select(`
          *,
          profile:profiles!inner(user_id, kyc_status)
        `)
        .order('upload_date', { ascending: false });
      
      setKycDocuments(data || []);
    };

    const fetchAllTransactions = async () => {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      
      setAllTransactions(data || []);
    };

    if (activeTab === 'kyc' || activeTab === 'overview') {
      fetchKycDocuments();
      fetchAllTransactions();
    }
  }, [activeTab]);

  const handleApproveUser = async (userId: string, tokenSymbol: string) => {
    try {
      // Update user profile
      await supabase
        .from('profiles')
        .update({ 
          kyc_status: 'approved',
          wallet_approved: true,
          approved_tokens: [tokenSymbol]
        })
        .eq('user_id', userId);

      // Log the admin action
      await supabase.from('audit_logs').insert({
        action: 'admin_approve_user',
        user_id: userId,
        details: { 
          admin_action: 'approved',
          approved_token: tokenSymbol,
          target_user: userId 
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

      // Create download link
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

  const updateSystemLimits = async () => {
    try {
      await supabase.from('system_controls').upsert([
        { key: 'daily_mint_limit', value: true },
        { key: 'daily_burn_limit', value: true },
        { key: 'user_daily_limit', value: true }
      ]);

      await supabase.from('audit_logs').insert({
        action: 'update_system_limits',
        details: { 
          mint_limit: mintLimit,
          burn_limit: burnLimit,
          daily_limit: dailyLimit
        }
      });

      toast({
        title: "Limits Updated",
        description: "System limits have been updated successfully.",
        className: "bg-blue-600 text-white border-blue-700",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update system limits.",
        variant: "destructive",
      });
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'kyc', label: 'KYC Review', icon: FileText },
    { id: 'limits', label: 'System Controls', icon: Settings },
  ];

  const totalUsers = allUsers.length;
  const pendingKyc = allUsers.filter(u => u.kyc_status === 'under_review').length;
  const approvedUsers = allUsers.filter(u => u.kyc_status === 'approved').length;
  const pendingDocuments = kycDocuments.filter(d => d.status === 'pending').length;
  const totalTransactionVolume = allTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
  const totalTransactions = allTransactions.length;

  return (
    <div className="space-y-6 bg-white min-h-screen p-6">
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg backdrop-blur-sm overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                  </div>
                  <Users className="text-blue-600" size={24} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Approved Users</p>
                    <p className="text-2xl font-bold text-green-600">{approvedUsers}</p>
                  </div>
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Transactions</p>
                    <p className="text-2xl font-bold text-blue-600">{totalTransactions}</p>
                  </div>
                  <Shield className="text-blue-600" size={24} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Transaction Volume</p>
                    <p className="text-2xl font-bold text-purple-600">₹{totalTransactionVolume.toLocaleString()}</p>
                  </div>
                  <FileText className="text-purple-600" size={24} />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">Recent Compliance Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {complianceEvents.slice(0, 5).map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-gray-900 font-medium">{event.event_type}</div>
                      <div className="text-gray-600 text-sm">{event.description}</div>
                    </div>
                    <Badge className={`${
                      event.severity === 'high' ? 'bg-red-600' :
                      event.severity === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                    } text-white`}>
                      {event.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <Users size={20} />
                User Management & Wallet Approval
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allUsers.slice(0, 10).map((user) => (
                  <div key={user.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
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
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      User ID: {user.user_id?.slice(0, 8)}... | Country: {user.country_of_residence || 'Not set'}
                    </div>
                    {user.kyc_status === 'approved' && !user.wallet_approved && (
                      <div className="space-y-2">
                        <Label className="text-gray-700">Approve wallet for token:</Label>
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
        </div>
      )}

      {activeTab === 'kyc' && (
        <div className="space-y-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">KYC Document Review</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {kycDocuments.map((doc) => (
                  <div key={doc.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <FileText className="text-blue-600" size={20} />
                        <div>
                          <div className="text-gray-900 font-medium">{doc.document_type.replace(/_/g, ' ').toUpperCase()}</div>
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
                          <Download size={14} className="mr-1" />
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
        </div>
      )}

      {activeTab === 'limits' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">System Limits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mintLimit" className="text-gray-700">Daily Mint Limit (₹)</Label>
                <Input
                  id="mintLimit"
                  value={mintLimit}
                  onChange={(e) => setMintLimit(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
              <div>
                <Label htmlFor="burnLimit" className="text-gray-700">Daily Burn Limit (₹)</Label>
                <Input
                  id="burnLimit"
                  value={burnLimit}
                  onChange={(e) => setBurnLimit(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
              <div>
                <Label htmlFor="dailyLimit" className="text-gray-700">User Daily Limit (₹)</Label>
                <Input
                  id="dailyLimit"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(e.target.value)}
                  className="bg-white border-gray-300 text-gray-900"
                />
              </div>
              <Button onClick={updateSystemLimits} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Update Limits
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">System Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-gray-700">Enable New Registrations</Label>
                <Switch checked={true} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-gray-700">Allow Cross-Border Transfers</Label>
                <Switch checked={true} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-gray-700">Emergency Freeze Mode</Label>
                <Switch checked={false} />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-gray-700">Maintenance Mode</Label>
                <Switch checked={false} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
