
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
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Tabs defaultValue="blockchain" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="admin">Admin</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="blockchain" className="space-y-4">
          <BlockchainDashboard />
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Blockchain Actions</h2>
              <p className="text-muted-foreground">
                Perform blockchain operations like minting, burning, transfers, and creating automated rules
              </p>
            </div>
            <BlockchainActions />
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <AutomationAnalytics />
        </TabsContent>

        <TabsContent value="wallet" className="space-y-4">
          <WalletDashboard />
        </TabsContent>

        <TabsContent value="admin" className="space-y-4">
          <div className="grid gap-6">
            <AdminDashboardNew />
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Merchant Dashboard</h3>
              <MerchantDashboardNew />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AnalyticsDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
