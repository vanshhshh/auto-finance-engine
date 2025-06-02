import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  Wallet,
  QrCode,
  FileText,
  Globe,
  Smartphone,
  CreditCard,
  Brain,
  BarChart3,
  Scale,
  Download,
  Eye,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import { supabase } from '@/integrations/supabase/client';
import CBDCCountries from './CBDCCountries';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { systemControls, allUsers, auditLogs, kycDocuments, isLoading } = useAdminData();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Enhanced logging for debugging
  useEffect(() => {
    console.log('🔄 AdminDashboard data updated:');
    console.log('👥 All users:', allUsers);
    console.log('📄 KYC documents:', kycDocuments);
    console.log('🔄 Is loading:', isLoading);
    
    // Specifically look for the target users
    const targetUsers = allUsers?.filter(user => 
      user?.wallet_address?.includes('0x48193892d57240be965462d7dc0cf11a') ||
      user?.wallet_address?.includes('0x66569048d2eb4b2b9070db5cef80ffdc')
    ) || [];
    console.log('🎯 Found target users:', targetUsers);
    
    const targetDocs = kycDocuments?.filter(doc => 
      doc?.profiles?.wallet_address?.includes('0x48193892d57240be965462d7dc0cf11a') ||
      doc?.profiles?.wallet_address?.includes('0x66569048d2eb4b2b9070db5cef80ffdc')
    ) || [];
    console.log('🎯 Found target documents:', targetDocs);
  }, [allUsers, kycDocuments, isLoading]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'user-management', label: 'User Management', icon: Users },
    { id: 'kyc-verification', label: 'KYC Verification', icon: FileText },
    { id: 'cbdc-countries', label: 'CBDC Countries', icon: Globe },
    { id: 'admin-controls', label: 'Admin Controls', icon: Settings },
    { id: 'wallet-management', label: 'Wallet Management', icon: Wallet },
    { id: 'qr-payments', label: 'QR Payments', icon: QrCode },
    { id: 'blockchain-integration', label: 'Blockchain Integration', icon: Globe },
    { id: 'mobile-integration', label: 'Mobile Integration', icon: Smartphone },
    { id: 'payment-gateway', label: 'Payment Gateway', icon: CreditCard },
    { id: 'ai-fraud-detection', label: 'AI Fraud Detection', icon: Brain },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'compliance', label: 'Compliance', icon: Scale },
  ];

  const approveUser = async (userId: string) => {
    try {
      setLoading(true);
      console.log('✅ Approving user:', userId);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          wallet_approved: true,
          kyc_status: 'approved',
          approved_tokens: ['eINR', 'eUSD', 'eAED', 'eEUR', 'eGBP', 'eJPY', 'eCAD', 'eAUD', 'eSEK', 'eCNY', 'eBRL', 'eRUB', 'eKRW', 'eTRY', 'eSAR', 'eGHS', 'eNGN', 'eJMD', 'eBSD', 'eXCD']
        })
        .eq('user_id', userId);

      if (error) throw error;

      const { error: docError } = await supabase
        .from('kyc_documents')
        .update({ 
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id || 'admin'
        })
        .eq('user_id', userId);

      if (docError) console.error('Error updating documents:', docError);

      toast({
        title: "User Approved",
        description: "User has been approved and all CBDC wallets activated.",
        className: "bg-green-600 text-white border-green-700",
      });

      window.location.reload();
    } catch (error) {
      console.error('Error approving user:', error);
      toast({
        title: "Error",
        description: "Failed to approve user.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const rejectUser = async (userId: string, reason?: string) => {
    try {
      setLoading(true);
      console.log('❌ Rejecting user:', userId);
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          wallet_approved: false,
          kyc_status: 'rejected',
          approved_tokens: []
        })
        .eq('user_id', userId);

      if (error) throw error;

      const { error: docError } = await supabase
        .from('kyc_documents')
        .update({ 
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id || 'admin',
          admin_notes: reason || 'Documents rejected by admin'
        })
        .eq('user_id', userId);

      if (docError) console.error('Error updating documents:', docError);

      toast({
        title: "User Rejected",
        description: "User has been rejected.",
        variant: "destructive",
      });

      window.location.reload();
    } catch (error) {
      console.error('Error rejecting user:', error);
      toast({
        title: "Error",
        description: "Failed to reject user.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: "Could not download the document.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage users, compliance, and system operations</p>
            {isLoading && (
              <div className="flex items-center mt-2 text-blue-600">
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm">Loading fresh data...</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            <Button 
              onClick={handleSignOut}
              variant="outline"
              className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
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
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{allUsers?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Active users</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending KYC</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {kycDocuments?.filter(doc => doc?.status === 'pending' || doc?.status === 'under_review').length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Awaiting review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved Wallets</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {allUsers?.filter(u => u?.wallet_approved).length || 0}
                </div>
                <p className="text-xs text-muted-foreground">Active wallets</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">99.9%</div>
                <p className="text-xs text-muted-foreground">Uptime</p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'cbdc-countries' && <CBDCCountries />}

        {activeTab === 'kyc-verification' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                KYC Document Review
                <Badge variant="outline" className="text-sm">
                  {kycDocuments?.length || 0} Documents
                </Badge>
              </CardTitle>
              <p className="text-sm text-gray-600">Review and approve user KYC documents</p>
            </CardHeader>
            <CardContent>
              {isLoading && (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Loading documents...</span>
                </div>
              )}
              
              <div className="space-y-6">
                {kycDocuments && kycDocuments.length > 0 ? kycDocuments.map((doc) => (
                  <div key={doc.id} className="p-6 border rounded-lg bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="font-medium text-lg">
                          User: {doc?.profiles?.wallet_address || 'No Address'}
                        </div>
                        <div className="text-sm text-gray-600">
                          Document: {doc.document_type.replace('_', ' ').toUpperCase()}
                        </div>
                        <div className="text-xs text-gray-500">
                          Uploaded: {new Date(doc.upload_date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          User ID: {doc.user_id}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${
                          doc.status === 'approved' ? 'bg-green-600' :
                          doc.status === 'rejected' ? 'bg-red-600' : 'bg-orange-600'
                        } text-white`}>
                          {doc.status?.toUpperCase() || 'PENDING'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-gray-600">Country:</span> {doc?.profiles?.country_of_residence || 'Not specified'}
                      </div>
                      <div>
                        <span className="text-gray-600">Nationality:</span> {doc?.profiles?.nationality || 'Not specified'}
                      </div>
                      <div>
                        <span className="text-gray-600">File:</span> {doc.file_name}
                      </div>
                      <div>
                        <span className="text-gray-600">KYC Status:</span> {doc?.profiles?.kyc_status || 'pending'}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => downloadDocument(doc.file_path)}
                      >
                        <Download size={16} className="mr-1" />
                        Download
                      </Button>
                      
                      {doc.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => approveUser(doc.user_id)}
                            disabled={loading}
                          >
                            <CheckCircle size={16} className="mr-1" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => rejectUser(doc.user_id, 'Document quality insufficient')}
                            disabled={loading}
                          >
                            <XCircle size={16} className="mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>

                    {doc.admin_notes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <strong>Admin Notes:</strong> {doc.admin_notes}
                      </div>
                    )}

                    {doc.reviewed_at && (
                      <div className="mt-2 text-xs text-gray-500">
                        Reviewed: {new Date(doc.reviewed_at).toLocaleString()} by {doc.reviewed_by}
                      </div>
                    )}
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-600">
                    <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                    <p>No KYC documents found</p>
                    <p className="text-sm">Documents will appear here when users submit them</p>
                    <Button 
                      onClick={() => window.location.reload()} 
                      variant="outline" 
                      className="mt-4"
                    >
                      Refresh to check for new documents
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'user-management' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                User Management
                <Badge variant="outline" className="text-sm">
                  {allUsers?.length || 0} Users
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allUsers && allUsers.length > 0 ? allUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{user?.wallet_address || 'No Address'}</div>
                      <div className="text-sm text-gray-600">User ID: {user.user_id}</div>
                      <div className="text-sm text-gray-600">Role: {user.role}</div>
                      <div className="text-sm text-gray-600">
                        KYC: <Badge className={`${
                          user.kyc_status === 'approved' ? 'bg-green-600' :
                          user.kyc_status === 'rejected' ? 'bg-red-600' : 'bg-orange-600'
                        } text-white`}>
                          {user.kyc_status?.toUpperCase() || 'PENDING'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        Wallet: <Badge className={`${
                          user.wallet_approved ? 'bg-green-600' : 'bg-gray-600'
                        } text-white`}>
                          {user.wallet_approved ? 'APPROVED' : 'PENDING'}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Created: {new Date(user.created_at).toLocaleDateString()}
                      </div>
                      {user.approved_tokens && user.approved_tokens.length > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          Approved Tokens: {user.approved_tokens.join(', ')}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {user.kyc_status !== 'approved' && (
                        <Button 
                          onClick={() => approveUser(user.user_id)}
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                          disabled={loading}
                        >
                          Approve
                        </Button>
                      )}
                      {user.kyc_status !== 'rejected' && (
                        <Button 
                          onClick={() => rejectUser(user.user_id)}
                          size="sm" 
                          variant="destructive"
                          disabled={loading}
                        >
                          Reject
                        </Button>
                      )}
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-gray-600">
                    <Users size={48} className="mx-auto mb-4 text-gray-400" />
                    <p>No users found</p>
                    <Button 
                      onClick={() => window.location.reload()} 
                      variant="outline" 
                      className="mt-4"
                    >
                      Refresh to check for users
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'admin-controls' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Maintenance Mode</div>
                      <div className="text-sm text-gray-600">Temporarily disable user access</div>
                    </div>
                    <Badge className="bg-green-600 text-white">Active</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">New User Registrations</div>
                      <div className="text-sm text-gray-600">Allow new users to register</div>
                    </div>
                    <Badge className="bg-green-600 text-white">Enabled</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">Transaction Processing</div>
                      <div className="text-sm text-gray-600">Process CBDC transactions</div>
                    </div>
                    <Badge className="bg-green-600 text-white">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'wallet-management' && (
          <Card>
            <CardHeader>
              <CardTitle>Wallet Management</CardTitle>
              <p className="text-sm text-gray-600">Manage user wallets and CBDC balances</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allUsers.filter(u => u.wallet_approved).map((user) => (
                  <div key={user.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">{user.wallet_address}</div>
                      <Badge className="bg-green-600 text-white">Approved</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">eINR Balance:</span>
                        <div className="font-medium">₹0.00</div>
                      </div>
                      <div>
                        <span className="text-gray-600">eUSD Balance:</span>
                        <div className="font-medium">$0.00</div>
                      </div>
                      <div>
                        <span className="text-gray-600">eAED Balance:</span>
                        <div className="font-medium">د.إ0.00</div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Last Activity: {new Date(user.updated_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'qr-payments' && (
          <Card>
            <CardHeader>
              <CardTitle>QR Payment System</CardTitle>
              <p className="text-sm text-gray-600">Monitor and manage QR code payment transactions</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">247</div>
                  <div className="text-sm text-gray-600">QR Codes Generated Today</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">189</div>
                  <div className="text-sm text-gray-600">Successful Payments</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">₹45,670</div>
                  <div className="text-sm text-gray-600">Total Volume Today</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'compliance' && (
          <Card>
            <CardHeader>
              <CardTitle>Compliance Monitoring</CardTitle>
              <p className="text-sm text-gray-600">Real-time compliance events and monitoring</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.slice(0, 10).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-blue-100">
                        <Shield className="text-blue-600" size={16} />
                      </div>
                      <div>
                        <div className="font-medium">{log.action}</div>
                        <div className="text-sm text-gray-600">
                          {new Date(log.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-green-600 text-white">Compliant</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
