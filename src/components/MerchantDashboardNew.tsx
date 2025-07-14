
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CBDCAccountManager } from './CBDCAccountManager';
import { FundingManager } from './FundingManager';
import { ProgrammableLockManager } from './ProgrammableLockManager';
import { ConditionalTriggerManager } from './ConditionalTriggerManager';
import { useAuth } from '@/contexts/AuthContext';
import { useBankingMethods } from '@/hooks/useBankingMethods';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  Store, 
  CreditCard, 
  QrCode, 
  TrendingUp, 
  Users, 
  DollarSign,
  Activity,
  Settings,
  Lock,
  Zap,
  LogOut,
  AlertTriangle
} from 'lucide-react';

export const MerchantDashboardNew = () => {
  const { user, signOut } = useAuth();
  const { data: bankingMethods = [], isLoading: bankingLoading, error: bankingError } = useBankingMethods();
  const { toast } = useToast();

  // Check if user is authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to access the merchant dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => window.location.href = '/auth'}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
        className: "bg-green-600 text-white border-green-700",
      });
      window.location.href = '/auth';
    } catch (error) {
      toast({
        title: "Sign Out Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Mock merchant stats - in real app, these would come from API
  const merchantStats = [
    {
      title: 'Monthly Revenue',
      value: '$12,487',
      icon: DollarSign,
      description: '+12% from last month',
      color: 'text-green-600',
    },
    {
      title: 'Transactions',
      value: '1,247',
      icon: Activity,
      description: 'This month',
      color: 'text-blue-600',
    },
    {
      title: 'Customers',
      value: '892',
      icon: Users,
      description: 'Active customers',
      color: 'text-purple-600',
    },
    {
      title: 'Success Rate',
      value: '99.2%',
      icon: TrendingUp,
      description: 'Payment success',
      color: 'text-green-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with Sign Out */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Merchant Dashboard</h1>
          <p className="text-gray-600">
            Manage your business CBDC operations and customer payments
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Merchant Access
          </Badge>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Merchant Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {merchantStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Merchant Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Store className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="accounts" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Accounts
          </TabsTrigger>
          <TabsTrigger value="funding" className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Funding
          </TabsTrigger>
          <TabsTrigger value="qr-payments" className="flex items-center gap-2">
            <QrCode className="w-4 h-4" />
            QR Payments
          </TabsTrigger>
          <TabsTrigger value="locks" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Escrow
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Automation
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Overview</CardTitle>
                <CardDescription>
                  Your merchant account performance and recent activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Available Banking Methods</h4>
                    {bankingLoading ? (
                      <div className="text-sm text-gray-500">Loading banking methods...</div>
                    ) : bankingError ? (
                      <div className="text-sm text-red-500">Failed to load banking methods</div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {bankingMethods.slice(0, 6).map((method) => (
                          <div key={method.id} className="p-3 border rounded-lg bg-white">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm">{method.method_name}</p>
                                <p className="text-xs text-gray-600">{method.provider_name}</p>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {method.method_type}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Recent Transactions</h4>
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div>
                            <p className="text-sm font-medium">Payment #{1000 + i}</p>
                            <p className="text-xs text-gray-600">
                              {new Date(Date.now() - i * 3600000).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">+${(Math.random() * 200 + 50).toFixed(2)}</p>
                            <Badge variant="default" className="text-xs bg-green-600">completed</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="accounts">
          <CBDCAccountManager />
        </TabsContent>

        <TabsContent value="funding">
          <FundingManager />
        </TabsContent>

        <TabsContent value="qr-payments">
          <Card>
            <CardHeader>
              <CardTitle>QR Code Payments</CardTitle>
              <CardDescription>
                Generate QR codes for customer payments and manage payment requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Quick Payment QR</h4>
                  <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center bg-white">
                    <QrCode className="w-24 h-24 mx-auto mb-4 text-gray-400" />
                    <p className="text-sm text-gray-600">Generate QR code for instant payments</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Payment Links</h4>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 rounded flex items-center justify-between">
                      <span className="text-sm">Product Payment - $25.99</span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                    <div className="p-3 bg-gray-50 rounded flex items-center justify-between">
                      <span className="text-sm">Service Fee - $15.00</span>
                      <Badge variant="outline">Active</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locks">
          <ProgrammableLockManager />
        </TabsContent>

        <TabsContent value="automation">
          <ConditionalTriggerManager />
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Merchant Settings</CardTitle>
              <CardDescription>
                Configure your merchant account preferences and business information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-3">Business Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Business Name</label>
                      <p className="text-sm text-gray-600 mt-1">ACME Corporation</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Business Type</label>
                      <p className="text-sm text-gray-600 mt-1">E-commerce</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Registration Number</label>
                      <p className="text-sm text-gray-600 mt-1">REG-2024-001</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tax ID</label>
                      <p className="text-sm text-gray-600 mt-1">TAX-2024-001</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Payment Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-accept payments under $100</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Require 2FA for large transactions</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Send payment confirmations</span>
                      <Badge variant="default">Enabled</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Supported Currencies</h4>
                  <div className="flex flex-wrap gap-2">
                    {['eINR', 'eUSD', 'eAED', 'eGBP', 'eEUR'].map((currency) => (
                      <Badge key={currency} variant="outline">{currency}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
