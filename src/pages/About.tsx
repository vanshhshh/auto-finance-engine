
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Globe, Users, TrendingUp, Award, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
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

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <Badge className="bg-blue-100 text-blue-800 border-blue-200 mb-6">
            🏛️ About Gate Finance
          </Badge>
          <h1 className="text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
              Leading the Future
            </span>
            <br />
            <span className="text-gray-900">of Digital Finance</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Gate Finance is pioneering the next generation of financial infrastructure with Central Bank Digital Currencies (CBDCs), 
            programmable payments, and enterprise-grade security solutions.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="text-blue-600" size={24} />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                To democratize access to central bank digital currencies and create a seamless, secure, 
                and programmable financial ecosystem that enables instant global transactions with 
                government-backed digital assets.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="text-purple-600" size={24} />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                A world where financial transactions are instant, transparent, and accessible to everyone, 
                powered by programmable CBDC technology that bridges traditional banking with 
                the future of digital finance.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Gate Finance?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Bank-Grade Security</h3>
              <p className="text-gray-600">
                Military-grade encryption, multi-factor authentication, and compliance with international 
                banking standards ensure your digital assets are always protected.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Global Reach</h3>
              <p className="text-gray-600">
                Send money instantly to over 150 countries with competitive rates and real-time 
                settlement using official central bank digital currencies.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-purple-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-4">Enterprise Ready</h3>
              <p className="text-gray-600">
                Built for businesses of all sizes with bulk payment processing, API integration, 
                and comprehensive administration tools.
              </p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
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

        {/* Compliance & Certifications */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Compliance & Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6">
              <Award className="text-blue-600 mx-auto mb-4" size={32} />
              <h3 className="font-semibold mb-2">ISO 27001</h3>
              <p className="text-sm text-gray-600">Information Security Management</p>
            </Card>
            <Card className="text-center p-6">
              <Shield className="text-green-600 mx-auto mb-4" size={32} />
              <h3 className="font-semibold mb-2">AML/KYC</h3>
              <p className="text-sm text-gray-600">Anti-Money Laundering Compliance</p>
            </Card>
            <Card className="text-center p-6">
              <CheckCircle className="text-purple-600 mx-auto mb-4" size={32} />
              <h3 className="font-semibold mb-2">PCI DSS</h3>
              <p className="text-sm text-gray-600">Payment Card Industry Standards</p>
            </Card>
            <Card className="text-center p-6">
              <Globe className="text-orange-600 mx-auto mb-4" size={32} />
              <h3 className="font-semibold mb-2">GDPR</h3>
              <p className="text-sm text-gray-600">Data Protection Compliance</p>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of businesses and individuals who trust Gate Finance for their CBDC needs.
          </p>
          <Link to="/auth">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
              Create Your Account Today
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
