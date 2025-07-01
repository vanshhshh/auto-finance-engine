
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CBDCAccountManager } from './CBDCAccountManager';
import { FundingManager } from './FundingManager';
import { ProgrammableLockManager } from './ProgrammableLockManager';
import { ConditionalTriggerManager } from './ConditionalTriggerManager';
import { useAdminData } from '@/hooks/useAdminData';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Shield, 
  Settings, 
  Database,
  Lock,
  Zap,
  DollarSign,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { DeveloperSandbox } from './DeveloperSandbox';

export const AdminDashboardNew = () => {
  const { 
    allUsers, 
    kycDocuments, 
    systemControls, 
    complianceEvents, 
    auditLogs, 
    isLoading,
    isAdmin,
    hasErrors
  } = useAdminData();

  // Show access denied if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Shield className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin dashboard.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Users',
      value: allUsers?.length || 0,
      icon: Users,
      description: 'Registered users',
    },
    {
      title: 'KYC Documents',
      value: kycDocuments?.length || 0,
      icon: FileText,
      description: 'Pending review',
    },
    {
      title: 'System Controls',
      value: systemControls?.length || 0,
      icon: Settings,
      description: 'Active controls',
    },
    {
      title: 'Compliance Events',
      value: complianceEvents?.length || 0,
      icon: Shield,
      description: 'Recent events',
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-3 w-32" />
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">CBDC Admin Dashboard</h1>
        <p className="text-gray-600">
          Comprehensive management for Central Bank Digital Currency infrastructure
        </p>
        {hasErrors && (
          <div className="mt-2 flex items-center gap-2 text-amber-600">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">Some data may be limited due to connection issues</span>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-9">
          <TabsTrigger value="accounts" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Accounts
          </TabsTrigger>
          <TabsTrigger value="funding" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Funding
          </TabsTrigger>
          <TabsTrigger value="locks" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Locks
          </TabsTrigger>
          <TabsTrigger value="triggers" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Triggers
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="kyc" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            KYC
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="sandbox" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Sandbox
          </TabsTrigger>
        </TabsList>

        <TabsContent value="accounts">
          <CBDCAccountManager />
        </TabsContent>

        <TabsContent value="funding">
          <FundingManager />
        </TabsContent>

        <TabsContent value="locks">
          <ProgrammableLockManager />
        </TabsContent>

        <TabsContent value="triggers">
          <ConditionalTriggerManager />
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage registered users and their account status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {allUsers?.length > 0 ? (
                <div className="space-y-4">
                  {allUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{user.wallet_address || 'No wallet address'}</p>
                        <p className="text-sm text-gray-600">
                          KYC: {user.kyc_status || 'pending'} • Role: {user.role || 'user'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.kyc_status === 'approved' ? 'default' : 'secondary'}>
                          {user.kyc_status || 'pending'}
                        </Badge>
                        <Badge variant={user.role === 'admin' ? 'destructive' : 'outline'}>
                          {user.role || 'user'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No users found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc">
          <Card>
            <CardHeader>
              <CardTitle>KYC Document Review</CardTitle>
              <CardDescription>
                Review and approve user KYC submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {kycDocuments?.length > 0 ? (
                <div className="space-y-4">
                  {kycDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{doc.document_type}</p>
                        <p className="text-sm text-gray-600">
                          Uploaded: {new Date(doc.upload_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={doc.status === 'approved' ? 'default' : 'secondary'}>
                        {doc.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No KYC documents found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Monitoring</CardTitle>
              <CardDescription>
                Monitor compliance events and audit logs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Recent Audit Logs</h4>
                  {auditLogs?.length > 0 ? (
                    <div className="space-y-2">
                      {auditLogs.slice(0, 5).map((log) => (
                        <div key={log.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                          <span>{log.action}</span>
                          <span className="text-gray-600">{new Date(log.created_at).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No audit logs available</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>System Analytics</CardTitle>
              <CardDescription>
                View system performance and usage metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <h4 className="font-medium">System Uptime</h4>
                  <p className="text-2xl font-bold text-blue-600">99.9%</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Activity className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <h4 className="font-medium">Active Transactions</h4>
                  <p className="text-2xl font-bold text-green-600">1,247</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Shield className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <h4 className="font-medium">Security Score</h4>
                  <p className="text-2xl font-bold text-purple-600">A+</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sandbox">
          <DeveloperSandbox />
        </TabsContent>
      </Tabs>
    </div>
  );
};
