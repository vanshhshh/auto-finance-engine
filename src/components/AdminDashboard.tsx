import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Shield, Users, AlertTriangle, TrendingUp, Settings, FileText, BarChart3, LogOut, Wallet, QrCode, UserCheck, CreditCard, Globe, Brain, Smartphone, DollarSign } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import BulkPaymentProcessor from './BulkPaymentProcessor';
import BiometricAuth from './BiometricAuth';
import RiskScoringSystem from './RiskScoringSystem';
import SupportTicketSystem from './SupportTicketSystem';
import RealExchangeRates from './RealExchangeRates';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const { isAdmin, allUsers, complianceEvents, auditLogs } = useAdminData();
  const { signOut } = useAuth();
  const { toast } = useToast();

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto h-16 w-16 text-red-600 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'admin', label: 'Admin Controls', icon: Settings },
    { id: 'wallet-management', label: 'Wallet Management', icon: Wallet },
    { id: 'qr-payments', label: 'QR Payments', icon: QrCode },
    { id: 'kyc-verification', label: 'KYC Verification', icon: UserCheck },
    { id: 'bulk-payments', label: 'Bulk Payments', icon: CreditCard },
    { id: 'exchange-rates', label: 'Exchange Rates', icon: TrendingUp },
    { id: 'biometric-auth', label: 'Biometric Auth', icon: Shield },
    { id: 'risk-scoring', label: 'Risk Scoring', icon: AlertTriangle },
    { id: 'support-tickets', label: 'Support Tickets', icon: FileText },
    { id: 'blockchain', label: 'Blockchain', icon: Globe },
    { id: 'ai-fraud', label: 'AI Fraud Detection', icon: Brain },
    { id: 'mobile-integration', label: 'Mobile Integration', icon: Smartphone },
    { id: 'payment-gateways', label: 'Payment Gateways', icon: DollarSign },
  ];

  const handleUserStatusUpdate = async (userId: string, status: string) => {
    toast({
      title: "Status Updated",
      description: `User status has been updated to ${status}.`,
      className: "bg-blue-600 text-white border-blue-700",
    });
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
      className: "bg-green-600 text-white border-green-700",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">System administration and monitoring</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-red-600 text-white">
              ADMIN ACCESS
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
          <nav className="flex space-x-1 overflow-x-auto py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'border-red-600 text-red-600 bg-red-50'
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
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* System Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-blue-600">{allUsers.length}</p>
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
                      <p className="text-sm text-gray-600">Active Alerts</p>
                      <p className="text-2xl font-bold text-red-600">{complianceEvents.length}</p>
                      <p className="text-xs text-red-600">Needs attention</p>
                    </div>
                    <AlertTriangle className="text-red-600" size={24} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-green-600">$2.4M</p>
                      <p className="text-xs text-green-600">+8% from last month</p>
                    </div>
                    <TrendingUp className="text-green-600" size={24} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">System Health</p>
                      <p className="text-2xl font-bold text-green-600">99.9%</p>
                      <p className="text-xs text-green-600">All systems operational</p>
                    </div>
                    <Shield className="text-green-600" size={24} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Real-time Monitoring */}
            <Card>
              <CardHeader>
                <CardTitle>Real-time Transaction Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <div>
                        <div className="font-medium text-green-800">Transaction Processing</div>
                        <div className="text-sm text-green-600">1,247 transactions processed in last hour</div>
                      </div>
                    </div>
                    <Badge className="bg-green-600 text-white">ACTIVE</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <div>
                        <div className="font-medium text-blue-800">KYC Processing</div>
                        <div className="text-sm text-blue-600">23 documents pending review</div>
                      </div>
                    </div>
                    <Badge className="bg-blue-600 text-white">PENDING</Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                      <div>
                        <div className="font-medium text-orange-800">AML Screening</div>
                        <div className="text-sm text-orange-600">5 transactions flagged for review</div>
                      </div>
                    </div>
                    <Badge className="bg-orange-600 text-white">REVIEW</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="space-y-6">
            {/* Compliance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Compliance Score</p>
                    <p className="text-3xl font-bold text-green-600">94%</p>
                    <p className="text-xs text-green-600">Excellent</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Open Cases</p>
                    <p className="text-3xl font-bold text-orange-600">{complianceEvents.length}</p>
                    <p className="text-xs text-orange-600">Needs attention</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Reports Generated</p>
                    <p className="text-3xl font-bold text-blue-600">156</p>
                    <p className="text-xs text-blue-600">This month</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Compliance Events */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Compliance Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {complianceEvents.slice(0, 10).map((event) => (
                    <div key={event.id} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{event.event_type}</div>
                          <div className="text-sm text-gray-600">{event.description}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(event.created_at).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={`${
                            event.severity === 'critical' ? 'bg-red-600' :
                            event.severity === 'high' ? 'bg-orange-600' :
                            event.severity === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                          } text-white`}>
                            {event.severity.toUpperCase()}
                          </Badge>
                          <div className="mt-2">
                            <Badge className={`${
                              event.resolved ? 'bg-green-600' : 'bg-gray-600'
                            } text-white`}>
                              {event.resolved ? 'RESOLVED' : 'OPEN'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Audit Logs */}
            <Card>
              <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {auditLogs.slice(0, 10).map((log) => (
                    <div key={log.id} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{log.action}</div>
                          <div className="text-sm text-gray-600">
                            User: {log.user_id ? log.user_id.slice(0, 8) + '...' : 'System'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(log.created_at).toLocaleString()}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600">
                            {log.ip_address && `IP: ${log.ip_address}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="space-y-6">
            {/* User Management */}
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 mb-4">
                    <Input placeholder="Search users..." className="max-w-md" />
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Search</Button>
                  </div>
                  
                  <div className="space-y-3">
                    {allUsers.slice(0, 10).map((user) => (
                      <div key={user.id} className="p-4 bg-gray-50 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">User ID: {user.user_id}</div>
                            <div className="text-sm text-gray-600">Role: {user.role}</div>
                            <div className="text-sm text-gray-600">
                              KYC Status: {user.kyc_status || 'pending'}
                            </div>
                            <div className="text-xs text-gray-500">
                              Created: {new Date(user.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleUserStatusUpdate(user.user_id, 'approved')}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUserStatusUpdate(user.user_id, 'suspended')}
                              className="border-red-400 text-red-600 hover:bg-red-50"
                            >
                              Suspend
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Controls */}
            <Card>
              <CardHeader>
                <CardTitle>System Controls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">Transaction Limits</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Daily Limit:</span>
                        <span className="text-sm font-medium">$50,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Monthly Limit:</span>
                        <span className="text-sm font-medium">$1,000,000</span>
                      </div>
                    </div>
                    <Button size="sm" className="mt-3 bg-blue-600 hover:bg-blue-700 text-white">
                      Update Limits
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-2">System Maintenance</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Last Backup:</span>
                        <span className="text-sm font-medium">2 hours ago</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">System Status:</span>
                        <Badge className="bg-green-600 text-white">OPERATIONAL</Badge>
                      </div>
                    </div>
                    <Button size="sm" className="mt-3 bg-gray-600 hover:bg-gray-700 text-white">
                      Run Maintenance
                    </Button>
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
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Wallet size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">Advanced wallet management system</p>
                <p className="text-sm text-gray-500">Monitor and manage user wallets, balances, and transactions</p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'qr-payments' && (
          <Card>
            <CardHeader>
              <CardTitle>QR Payments Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <QrCode size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">QR Payment System Administration</p>
                <p className="text-sm text-gray-500">Manage QR payment configurations and monitor transactions</p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'kyc-verification' && (
          <Card>
            <CardHeader>
              <CardTitle>KYC Verification Center</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <UserCheck size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">KYC Document Review and Verification</p>
                <p className="text-sm text-gray-500">Review user documents and approve KYC applications</p>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'bulk-payments' && <BulkPaymentProcessor />}
        {activeTab === 'exchange-rates' && <RealExchangeRates />}
        {activeTab === 'biometric-auth' && <BiometricAuth />}
        {activeTab === 'risk-scoring' && <RiskScoringSystem />}
        {activeTab === 'support-tickets' && <SupportTicketSystem />}

        {activeTab === 'blockchain' && (
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 border rounded-lg">
                    <h3 className="font-medium mb-4">Smart Contract Management</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Active Contracts:</span>
                        <span className="text-sm font-medium">47</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Gas Usage:</span>
                        <span className="text-sm font-medium">1.2M gwei</span>
                      </div>
                      <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                        Deploy Contract
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-6 border rounded-lg">
                    <h3 className="font-medium mb-4">Network Status</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Network:</span>
                        <Badge className="bg-green-600 text-white">Ethereum Mainnet</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Block Height:</span>
                        <span className="text-sm font-medium">18,742,361</span>
                      </div>
                      <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        View Explorer
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'ai-fraud' && (
          <Card>
            <CardHeader>
              <CardTitle>AI Fraud Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 border rounded-lg">
                    <Brain className="mx-auto mb-2 text-purple-600" size={32} />
                    <h3 className="font-medium">ML Models</h3>
                    <p className="text-2xl font-bold text-purple-600">4</p>
                    <p className="text-sm text-gray-600">Active Models</p>
                  </div>
                  
                  <div className="text-center p-6 border rounded-lg">
                    <AlertTriangle className="mx-auto mb-2 text-red-600" size={32} />
                    <h3 className="font-medium">Fraud Detected</h3>
                    <p className="text-2xl font-bold text-red-600">12</p>
                    <p className="text-sm text-gray-600">Today</p>
                  </div>
                  
                  <div className="text-center p-6 border rounded-lg">
                    <Shield className="mx-auto mb-2 text-green-600" size={32} />
                    <h3 className="font-medium">Accuracy</h3>
                    <p className="text-2xl font-bold text-green-600">99.7%</p>
                    <p className="text-sm text-gray-600">Detection Rate</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'mobile-integration' && (
          <Card>
            <CardHeader>
              <CardTitle>Mobile App Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 border rounded-lg">
                    <h3 className="font-medium mb-4">Push Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Daily Active Users:</span>
                        <span className="text-sm font-medium">15,247</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Notifications Sent:</span>
                        <span className="text-sm font-medium">52,341</span>
                      </div>
                      <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Send Broadcast
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-6 border rounded-lg">
                    <h3 className="font-medium mb-4">App Performance</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Crash Rate:</span>
                        <span className="text-sm font-medium text-green-600">0.01%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">App Store Rating:</span>
                        <span className="text-sm font-medium">4.8/5</span>
                      </div>
                      <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white">
                        View Analytics
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'payment-gateways' && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Gateway Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 border rounded-lg">
                    <h3 className="font-medium mb-4">Stripe Integration</h3>
                    <div className="space-y-3">
                      <Badge className="bg-green-600 text-white">Connected</Badge>
                      <div className="text-sm">Daily Volume: $127,435</div>
                      <Button size="sm" className="w-full">Configure</Button>
                    </div>
                  </div>
                  
                  <div className="p-6 border rounded-lg">
                    <h3 className="font-medium mb-4">PayPal Integration</h3>
                    <div className="space-y-3">
                      <Badge className="bg-green-600 text-white">Connected</Badge>
                      <div className="text-sm">Daily Volume: $89,123</div>
                      <Button size="sm" className="w-full">Configure</Button>
                    </div>
                  </div>
                  
                  <div className="p-6 border rounded-lg">
                    <h3 className="font-medium mb-4">Bank APIs</h3>
                    <div className="space-y-3">
                      <Badge className="bg-orange-600 text-white">Setup Required</Badge>
                      <div className="text-sm">Connected Banks: 0</div>
                      <Button size="sm" className="w-full">Setup</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
