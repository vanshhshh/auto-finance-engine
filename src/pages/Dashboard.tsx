
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WalletDashboard from "@/components/WalletDashboard";
import { BlockchainDashboard } from "@/components/BlockchainDashboard";
import { BlockchainActions } from "@/components/BlockchainActions";
import { AdminDashboardNew } from "@/components/AdminDashboardNew";
import { MerchantDashboardNew } from "@/components/MerchantDashboardNew";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { AutomationAnalytics } from "@/components/AutomationAnalytics";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { session } = useAuth();

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to access the dashboard</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Hero Header */}
      <div className="dashboard-header px-6 py-8 mb-8">
        <div className="container mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2 text-white">Gate Finance Dashboard</h1>
            <p className="text-blue-100 text-lg">Advanced Digital Currency Management Platform</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-4 space-y-8">
        <Tabs defaultValue="blockchain" className="space-y-6">
          <div className="glass-card p-6">
            <TabsList className="grid w-full grid-cols-6 bg-white/50 backdrop-blur-sm border border-white/20 rounded-lg p-1">
              <TabsTrigger value="blockchain" className="dashboard-tab">Blockchain</TabsTrigger>
              <TabsTrigger value="actions" className="dashboard-tab">Actions</TabsTrigger>
              <TabsTrigger value="automation" className="dashboard-tab">Automation</TabsTrigger>
              <TabsTrigger value="wallet" className="dashboard-tab">Wallet</TabsTrigger>
              <TabsTrigger value="admin" className="dashboard-tab">Admin</TabsTrigger>
              <TabsTrigger value="analytics" className="dashboard-tab">Analytics</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="blockchain" className="space-y-6">
            <div className="dashboard-card p-6">
              <BlockchainDashboard />
            </div>
          </TabsContent>

          <TabsContent value="actions" className="space-y-6">
            <div className="dashboard-card p-6">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Blockchain Actions
                  </h2>
                  <p className="text-slate-600 mt-2">
                    Perform blockchain operations like minting, burning, transfers, and creating automated rules
                  </p>
                </div>
                <BlockchainActions />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="automation" className="space-y-6">
            <div className="dashboard-card p-6">
              <AutomationAnalytics />
            </div>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6">
            <div className="dashboard-card p-6">
              <WalletDashboard />
            </div>
          </TabsContent>

          <TabsContent value="admin" className="space-y-6">
            <div className="grid gap-6">
              <div className="dashboard-card p-6">
                <AdminDashboardNew />
              </div>
              <div className="dashboard-card p-6">
                <h3 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Merchant Dashboard
                </h3>
                <MerchantDashboardNew />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="dashboard-card p-6">
              <AnalyticsDashboard />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
