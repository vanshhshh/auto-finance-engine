
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Eye, Server, CheckCircle, AlertTriangle, Globe, Key } from 'lucide-react';
import { Link } from 'react-router-dom';

const Security = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Globe className="text-blue-600" size={32} />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Gate Finance
              </span>
            </Link>
            <Link to="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 mb-6">
            🔒 Security & Compliance
          </Badge>
          <h1 className="text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Bank-Grade Security
            </span>
            <br />
            <span className="text-gray-900">for Digital Finance</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your digital assets are protected by military-grade encryption, multi-layered security protocols, 
            and compliance with international banking standards.
          </p>
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="text-blue-600" size={24} />
              </div>
              <CardTitle>End-to-End Encryption</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                All data is encrypted using AES-256 encryption both in transit and at rest.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  TLS 1.3 for data transmission
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  AES-256 for data storage
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Perfect Forward Secrecy
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Key className="text-green-600" size={24} />
              </div>
              <CardTitle>Multi-Factor Authentication</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Multiple layers of authentication protect your account from unauthorized access.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  SMS & Email verification
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Biometric authentication
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Hardware security keys
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Eye className="text-purple-600" size={24} />
              </div>
              <CardTitle>Real-Time Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                24/7 fraud detection and suspicious activity monitoring.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  AI-powered fraud detection
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Real-time transaction alerts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Behavioral analysis
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Server className="text-orange-600" size={24} />
              </div>
              <CardTitle>Infrastructure Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Cloud infrastructure with enterprise-grade security controls.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  ISO 27001 certified data centers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  DDoS protection
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Regular security audits
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Lock className="text-red-600" size={24} />
              </div>
              <CardTitle>Cold Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Digital assets stored in offline, air-gapped systems for maximum security.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  95% assets in cold storage
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Multi-signature wallets
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Geographic distribution
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <AlertTriangle className="text-indigo-600" size={24} />
              </div>
              <CardTitle>Incident Response</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Rapid response team available 24/7 for security incidents.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  24/7 security operations center
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Automated threat response
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-green-600" />
                  Incident communication plan
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Compliance Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Regulatory Compliance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <Shield className="text-blue-600 mx-auto mb-4" size={32} />
              <h3 className="font-semibold mb-2">AML/KYC</h3>
              <p className="text-sm text-gray-600">Anti-Money Laundering and Know Your Customer compliance</p>
            </Card>
            <Card className="text-center p-6">
              <Lock className="text-green-600 mx-auto mb-4" size={32} />
              <h3 className="font-semibold mb-2">PCI DSS</h3>
              <p className="text-sm text-gray-600">Payment Card Industry Data Security Standard</p>
            </Card>
            <Card className="text-center p-6">
              <Eye className="text-purple-600 mx-auto mb-4" size={32} />
              <h3 className="font-semibold mb-2">GDPR</h3>
              <p className="text-sm text-gray-600">General Data Protection Regulation compliance</p>
            </Card>
            <Card className="text-center p-6">
              <Server className="text-orange-600 mx-auto mb-4" size={32} />
              <h3 className="font-semibold mb-2">SOC 2</h3>
              <p className="text-sm text-gray-600">Service Organization Control 2 Type II</p>
            </Card>
          </div>
        </div>

        {/* Security Best Practices */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Security Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>For Your Account</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-green-600 mt-1" />
                    <span className="text-gray-600">Use a strong, unique password</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-green-600 mt-1" />
                    <span className="text-gray-600">Enable two-factor authentication</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-green-600 mt-1" />
                    <span className="text-gray-600">Regularly review account activity</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-green-600 mt-1" />
                    <span className="text-gray-600">Keep your contact information updated</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>For Safe Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-green-600 mt-1" />
                    <span className="text-gray-600">Always verify recipient addresses</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-green-600 mt-1" />
                    <span className="text-gray-600">Start with small test transactions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-green-600 mt-1" />
                    <span className="text-gray-600">Use trusted networks only</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle size={16} className="text-green-600 mt-1" />
                    <span className="text-gray-600">Report suspicious activity immediately</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Security Contact */}
        <div className="text-center bg-gray-900 text-white rounded-2xl p-8">
          <h2 className="text-3xl font-bold mb-6">Security Concerns?</h2>
          <p className="text-xl mb-8">
            If you discover a security vulnerability or have concerns about your account, 
            please contact our security team immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg">
              security@gatefinance.com
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-gray-900">
              Report Vulnerability
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
