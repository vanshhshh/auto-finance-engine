
import React, { useState } from 'react';
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
  Scale
} from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { systemControls, allUsers, auditLogs } = useAdminData();
  const { toast } = useToast();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'user-management', label: 'User Management', icon: Users },
    { id: 'admin-controls', label: 'Admin Controls', icon: Settings },
    { id: 'wallet-management', label: 'Wallet Management', icon: Wallet },
    { id: 'qr-payments', label: 'QR Payments', icon: QrCode },
    { id: 'kyc-verification', label: 'KYC Verification', icon: FileText },
    { id: 'blockchain-integration', label: 'Blockchain Integration', icon: Globe },
    { id: 'mobile-integration', label: 'Mobile Integration', icon: Smartphone },
    { id: 'payment-gateway', label: 'Payment Gateway', icon: CreditCard },
    { id: 'ai-fraud-detection', label: 'AI Fraud Detection', icon: Brain },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'compliance', label: 'Compliance', icon: Scale },
  ];

  const approveUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          wallet_approved: true,
          kyc_status: 'approved'
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "User Approved",
        description: "User has been approved successfully.",
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

  const rejectUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          wallet_approved: false,
          kyc_status: 'rejected'
        })
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "User Rejected",
        description: "User has been rejected.",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject user.",
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
                <div className="text-2xl font-bold">{allUsers.length}</div>
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
                  {allUsers.filter(u => u.kyc_status === 'pending' || u.kyc_status === 'under_review').length}
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
                  {allUsers.filter(u => u.wallet_approved).length}
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

        {activeTab === 'user-management' && (
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{user.wallet_address || 'No Address'}</div>
                      <div className="text-sm text-gray-600">Role: {user.role}</div>
                      <div className="text-sm text-gray-600">
                        KYC: <Badge className={`${
                          user.kyc_status === 'approved' ? 'bg-green-600' :
                          user.kyc_status === 'rejected' ? 'bg-red-600' : 'bg-orange-600'
                        } text-white`}>
                          {user.kyc_status?.toUpperCase() || 'PENDING'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {user.kyc_status !== 'approved' && (
                        <Button 
                          onClick={() => approveUser(user.user_id)}
                          size="sm" 
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approve
                        </Button>
                      )}
                      {user.kyc_status !== 'rejected' && (
                        <Button 
                          onClick={() => rejectUser(user.user_id)}
                          size="sm" 
                          variant="destructive"
                        >
                          Reject
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
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

        {activeTab === 'kyc-verification' && (
          <Card>
            <CardHeader>
              <CardTitle>KYC Verification</CardTitle>
              <p className="text-sm text-gray-600">Review and approve user KYC documents</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allUsers.filter(u => u.kyc_status === 'under_review' || u.kyc_status === 'pending').map((user) => (
                  <div key={user.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">User: {user.wallet_address}</div>
                        <div className="text-sm text-gray-600">
                          Status: <Badge className="bg-orange-600 text-white">{user.kyc_status?.toUpperCase()}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Review Documents
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Country:</span> {user.country_of_residence || 'Not specified'}
                      </div>
                      <div>
                        <span className="text-gray-600">Nationality:</span> {user.nationality || 'Not specified'}
                      </div>
                    </div>
                  </div>
                ))}
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

        {/* Add other tab contents with real functionality */}
      </div>
    </div>
  );
};

export default AdminDashboard;
