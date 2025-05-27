
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Store, CreditCard, BarChart3, Settings, QrCode, Receipt, Globe, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const MerchantDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [merchantData, setMerchantData] = useState<any>({
    businessName: '',
    businessType: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    status: 'pending'
  });
  const [paymentMethods, setPaymentMethods] = useState({
    qr: true,
    nfc: false,
    online: true,
    pos: false
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchMerchantData();
    fetchMerchantTransactions();
  }, []);

  const fetchMerchantData = async () => {
    try {
      const { data } = await supabase
        .from('merchant_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (data) {
        setMerchantData(data);
      }
    } catch (error) {
      console.error('Error fetching merchant data:', error);
    }
  };

  const fetchMerchantTransactions = async () => {
    try {
      const { data } = await supabase
        .from('transactions')
        .select('*')
        .eq('merchant_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (data) {
        setTransactions(data);
        const revenue = data
          .filter(tx => tx.status === 'completed')
          .reduce((sum, tx) => sum + Number(tx.amount), 0);
        setTotalRevenue(revenue);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const updateMerchantProfile = async () => {
    try {
      const { error } = await supabase
        .from('merchant_profiles')
        .upsert({
          user_id: user?.id,
          ...merchantData,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Merchant profile has been updated successfully.",
        className: "bg-blue-600 text-white border-blue-700",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update merchant profile.",
        variant: "destructive",
      });
    }
  };

  const generatePaymentLink = async (amount: number, description: string) => {
    try {
      const { data, error } = await supabase
        .from('payment_links')
        .insert({
          merchant_id: user?.id,
          amount,
          description,
          status: 'active',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      const paymentUrl = `https://gatefi.app/pay/${data.id}`;
      navigator.clipboard.writeText(paymentUrl);

      toast({
        title: "Payment Link Generated",
        description: "Payment link copied to clipboard.",
        className: "bg-blue-600 text-white border-blue-700",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate payment link.",
        variant: "destructive",
      });
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'profile', label: 'Business Profile', icon: Store },
    { id: 'payments', label: 'Payment Methods', icon: CreditCard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'tools', label: 'Payment Tools', icon: QrCode },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const todayTransactions = transactions.filter(tx => 
    new Date(tx.created_at).toDateString() === new Date().toDateString()
  );
  const todayRevenue = todayTransactions
    .filter(tx => tx.status === 'completed')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Merchant Dashboard</h1>
            <p className="text-gray-600">Manage your business payments and analytics</p>
          </div>
          <Badge className={`${
            merchantData.status === 'approved' ? 'bg-green-600' :
            merchantData.status === 'under_review' ? 'bg-orange-600' : 'bg-gray-600'
          } text-white`}>
            {merchantData.status?.toUpperCase() || 'PENDING'}
          </Badge>
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
                      <p className="text-sm text-gray-600">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
                      <p className="text-xs text-green-600">All time</p>
                    </div>
                    <BarChart3 className="text-green-600" size={24} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Today's Revenue</p>
                      <p className="text-2xl font-bold text-blue-600">₹{todayRevenue.toLocaleString()}</p>
                      <p className="text-xs text-blue-600">Last 24 hours</p>
                    </div>
                    <CreditCard className="text-blue-600" size={24} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Transactions</p>
                      <p className="text-2xl font-bold text-purple-600">{transactions.length}</p>
                      <p className="text-xs text-purple-600">All time</p>
                    </div>
                    <Receipt className="text-purple-600" size={24} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold text-green-600">
                        {transactions.length > 0 ? 
                          Math.round((transactions.filter(tx => tx.status === 'completed').length / transactions.length) * 100) : 0}%
                      </p>
                      <p className="text-xs text-green-600">Transaction success</p>
                    </div>
                    <BarChart3 className="text-green-600" size={24} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.slice(0, 10).map((tx) => (
                    <div key={tx.id} className="p-3 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{tx.token_symbol} {tx.amount}</div>
                          <div className="text-sm text-gray-600">
                            {tx.transaction_type} | {new Date(tx.created_at).toLocaleString()}
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
                  ))}
                  {transactions.length === 0 && (
                    <div className="text-center py-8 text-gray-600">
                      No transactions yet. Start accepting payments to see them here.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'profile' && (
          <Card>
            <CardHeader>
              <CardTitle>Business Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={merchantData.businessName}
                    onChange={(e) => setMerchantData(prev => ({ ...prev, businessName: e.target.value }))}
                    placeholder="Your Business Name"
                  />
                </div>

                <div>
                  <Label htmlFor="businessType">Business Type</Label>
                  <select
                    id="businessType"
                    value={merchantData.businessType}
                    onChange={(e) => setMerchantData(prev => ({ ...prev, businessType: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select Business Type</option>
                    <option value="retail">Retail</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="services">Services</option>
                    <option value="online">Online Business</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={merchantData.phone}
                    onChange={(e) => setMerchantData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+1234567890"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Business Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={merchantData.email}
                    onChange={(e) => setMerchantData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="business@example.com"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address">Business Address</Label>
                  <Input
                    id="address"
                    value={merchantData.address}
                    onChange={(e) => setMerchantData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="123 Business Street, City, State"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    value={merchantData.website}
                    onChange={(e) => setMerchantData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://yourbusiness.com"
                  />
                </div>
              </div>

              <Button 
                onClick={updateMerchantProfile}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Update Profile
              </Button>
            </CardContent>
          </Card>
        )}

        {activeTab === 'payments' && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <QrCode className="text-blue-600" size={20} />
                      <div>
                        <div className="font-medium">QR Code Payments</div>
                        <div className="text-sm text-gray-600">Accept payments via QR scanning</div>
                      </div>
                    </div>
                    <Switch 
                      checked={paymentMethods.qr}
                      onCheckedChange={(checked) => setPaymentMethods(prev => ({ ...prev, qr: checked }))}
                    />
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Smartphone className="text-green-600" size={20} />
                      <div>
                        <div className="font-medium">NFC Payments</div>
                        <div className="text-sm text-gray-600">Tap-to-pay functionality</div>
                      </div>
                    </div>
                    <Switch 
                      checked={paymentMethods.nfc}
                      onCheckedChange={(checked) => setPaymentMethods(prev => ({ ...prev, nfc: checked }))}
                    />
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Globe className="text-purple-600" size={20} />
                      <div>
                        <div className="font-medium">Online Payments</div>
                        <div className="text-sm text-gray-600">Website and app integration</div>
                      </div>
                    </div>
                    <Switch 
                      checked={paymentMethods.online}
                      onCheckedChange={(checked) => setPaymentMethods(prev => ({ ...prev, online: checked }))}
                    />
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <CreditCard className="text-orange-600" size={20} />
                      <div>
                        <div className="font-medium">POS Terminal</div>
                        <div className="text-sm text-gray-600">Physical point of sale</div>
                      </div>
                    </div>
                    <Switch 
                      checked={paymentMethods.pos}
                      onCheckedChange={(checked) => setPaymentMethods(prev => ({ ...prev, pos: checked }))}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Payment Fees</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">QR Code</div>
                    <div className="text-lg font-bold">1.5%</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Online</div>
                    <div className="text-lg font-bold">2.0%</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">International</div>
                    <div className="text-lg font-bold">3.5%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'tools' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Payment Link Generator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="linkAmount">Amount</Label>
                    <Input
                      id="linkAmount"
                      type="number"
                      placeholder="100.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="linkDescription">Description</Label>
                    <Input
                      id="linkDescription"
                      placeholder="Product or service"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={() => {
                        const amount = parseFloat((document.getElementById('linkAmount') as HTMLInputElement)?.value || '0');
                        const description = (document.getElementById('linkDescription') as HTMLInputElement)?.value || '';
                        generatePaymentLink(amount, description);
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      Generate Link
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Integration Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">API Integration</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Integrate Gate Finance payments into your existing systems.
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      View API Documentation
                    </Button>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">WordPress Plugin</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Easy integration for WordPress websites and WooCommerce stores.
                    </p>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      Download Plugin
                    </Button>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Mobile SDK</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Native mobile app integration for iOS and Android.
                    </p>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      Download SDK
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {!['overview', 'profile', 'payments', 'tools'].includes(activeTab) && (
          <Card>
            <CardHeader>
              <CardTitle>{tabs.find(t => t.id === activeTab)?.label} - Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  {React.createElement(tabs.find(t => t.id === activeTab)?.icon || Store, { size: 48 })}
                </div>
                <p className="text-gray-600">This feature is under development and will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MerchantDashboard;
