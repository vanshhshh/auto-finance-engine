
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, Shield, Globe, Zap, TrendingUp, Users, ChevronRight, Star, Coins, Code, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import WalletDashboard from '@/components/WalletDashboard';
import AdminDashboard from '@/components/AdminDashboard';
import MerchantDashboard from '@/components/MerchantDashboard';

const Index = () => {
  const { user } = useAuth();

  // Check user role to determine which dashboard to show
  const getUserRole = () => {
    if (!user) return null;
    if (user.email?.includes('admin')) return 'admin';
    if (user.email?.includes('merchant')) return 'merchant';
    return 'user';
  };

  const userRole = getUserRole();

  if (user) {
    // Show appropriate dashboard based on user role
    switch (userRole) {
      case 'admin':
        return <AdminDashboard />;
      case 'merchant':
        return <MerchantDashboard />;
      default:
        return <WalletDashboard />;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Wallet className="text-blue-600" size={32} />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Gate Finance
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/auth">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 mb-6">
            🚀 CBDC-Powered Financial Platform
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Global CBDC Payments
            </span>
            <br />
            <span className="text-gray-900">In Seconds</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Transfer money globally in seconds using Central Bank Digital Currencies (CBDCs) with programmable payments, 
            advanced security, and enterprise-grade compliance. The future of instant cross-border transactions.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                Start Your Journey
                <ChevronRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 px-8 py-4 text-lg">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Finance
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need for CBDC payments, programmable rules, and financial management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* CBDC Multi-Currency Wallet */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Coins className="text-blue-600" size={24} />
              </div>
              <CardTitle>CBDC Multi-Currency Wallet</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Support for eINR, eUSD, eAED Central Bank Digital Currencies with instant global transfers.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Instant CBDC transfers globally</li>
                <li>• Real-time exchange rates</li>
                <li>• Government-backed digital currencies</li>
                <li>• Mobile-optimized interface</li>
              </ul>
            </CardContent>
          </Card>

          {/* Programmable Payments */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Code className="text-purple-600" size={24} />
              </div>
              <CardTitle>Programmable Payment Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Create automated payment rules with smart contract integration for conditional transfers.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Conditional payment triggers</li>
                <li>• Smart contract automation</li>
                <li>• Custom business logic</li>
                <li>• Real-time rule execution</li>
              </ul>
            </CardContent>
          </Card>

          {/* Instant Global Transfers */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="text-green-600" size={24} />
              </div>
              <CardTitle>Instant Global Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Send money globally in seconds with CBDC technology and competitive rates.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Sub-second transaction processing</li>
                <li>• Global reach to 150+ countries</li>
                <li>• Minimal transaction fees</li>
                <li>• Real-time settlement</li>
              </ul>
            </CardContent>
          </Card>

          {/* Cross-Border Payments */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="text-green-600" size={24} />
              </div>
              <CardTitle>Cross-Border Remittance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Send money globally with competitive rates and compliance-ready documentation.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Global reach to 150+ countries</li>
                <li>• Competitive exchange rates</li>
                <li>• Compliance screening</li>
                <li>• Real-time tracking</li>
              </ul>
            </CardContent>
          </Card>

          {/* Security & Compliance */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-purple-600" size={24} />
              </div>
              <CardTitle>Advanced Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Enterprise-grade security with biometric authentication and AML compliance.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Multi-factor authentication</li>
                <li>• Biometric verification</li>
                <li>• AML/KYC compliance</li>
                <li>• Risk scoring system</li>
              </ul>
            </CardContent>
          </Card>

          {/* QR Payments */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="text-orange-600" size={24} />
              </div>
              <CardTitle>QR Code Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Instant payments with QR codes for merchants and peer-to-peer transactions.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Instant payment processing</li>
                <li>• Merchant integration</li>
                <li>• Receipt generation</li>
                <li>• Offline capability</li>
              </ul>
            </CardContent>
          </Card>

          {/* Analytics & Reporting */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="text-red-600" size={24} />
              </div>
              <CardTitle>Analytics & Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Comprehensive dashboards with real-time analytics and financial reporting.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Real-time transaction monitoring</li>
                <li>• Financial reporting</li>
                <li>• User behavior analytics</li>
                <li>• Export capabilities</li>
              </ul>
            </CardContent>
          </Card>

          {/* Enterprise Solutions */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-indigo-600" size={24} />
              </div>
              <CardTitle>Enterprise Solutions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Bulk payments, API integration, and enterprise-grade administration tools.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Bulk payment processing</li>
                <li>• RESTful API access</li>
                <li>• Webhook notifications</li>
                <li>• Admin dashboard</li>
              </ul>
            </CardContent>
          </Card>

          {/* Blockchain Integration */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
                <Globe className="text-cyan-600" size={24} />
              </div>
              <CardTitle>Blockchain Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Real crypto wallet connectivity with smart contract automation.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Multi-blockchain support</li>
                <li>• Smart contract deployment</li>
                <li>• DeFi protocol integration</li>
                <li>• Cross-chain compatibility</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">150+</div>
              <div className="text-gray-600">Countries Supported</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">$2.4B+</div>
              <div className="text-gray-600">Transaction Volume</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime Guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">50K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Financial Operations?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of businesses and individuals who trust Gate Finance for their CBDC payment needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
                Create Free Account
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-4 text-lg">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="text-blue-400" size={24} />
                <span className="text-xl font-bold">Gate Finance</span>
              </div>
              <p className="text-gray-400">
                The future of CBDC payments and programmable finance, available today.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/auth" className="hover:text-white">Digital Wallet</Link></li>
                <li><Link to="/auth" className="hover:text-white">Cross-Border Payments</Link></li>
                <li><Link to="/auth" className="hover:text-white">Merchant Solutions</Link></li>
                <li><Link to="/auth" className="hover:text-white">API Integration</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/auth" className="hover:text-white">About Us</Link></li>
                <li><Link to="/auth" className="hover:text-white">Careers</Link></li>
                <li><Link to="/auth" className="hover:text-white">Security</Link></li>
                <li><Link to="/auth" className="hover:text-white">Compliance</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/auth" className="hover:text-white">Help Center</Link></li>
                <li><Link to="/auth" className="hover:text-white">Documentation</Link></li>
                <li><Link to="/auth" className="hover:text-white">Contact Support</Link></li>
                <li><Link to="/auth" className="hover:text-white">System Status</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Gate Finance. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
