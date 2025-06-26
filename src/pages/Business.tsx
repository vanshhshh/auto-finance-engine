
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Users, 
  TrendingUp, 
  Globe, 
  Shield, 
  Zap,
  CreditCard,
  Calculator,
  Clock,
  CheckCircle,
  ArrowRight,
  BarChart3,
  FileText,
  Headphones,
  Banknote,
  University,
  Target,
  Award
} from 'lucide-react';
import ModernNavbar from '@/components/ModernNavbar';
import Footer from '@/components/Footer';

const Business = () => {
  const [selectedPlan, setSelectedPlan] = useState('growth');

  const features = [
    {
      icon: <Banknote className="w-8 h-8 text-blue-600" />,
      title: "CBDC Treasury",
      description: "Manage your business treasury with multiple CBDCs from different central banks."
    },
    {
      icon: <University className="w-8 h-8 text-green-600" />,
      title: "Central Bank Direct",
      description: "Direct integration with central bank networks for institutional-grade transfers."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      title: "CBDC Analytics",
      description: "Real-time reporting and analytics for all your CBDC transactions and holdings."
    },
    {
      icon: <Shield className="w-8 h-8 text-yellow-600" />,
      title: "Compliance Suite",
      description: "Built-in compliance tools for AML, KYC, and regulatory reporting requirements."
    }
  ];

  const plans = [
    {
      id: 'starter',
      name: 'CBDC Starter',
      price: 'Free',
      description: 'Perfect for small businesses exploring CBDCs',
      features: [
        'Up to $50K monthly CBDC volume',
        'Basic CBDC wallet',
        'Email support',
        '5 team members',
        'Standard compliance tools'
      ]
    },
    {
      id: 'growth',
      name: 'CBDC Growth',
      price: '$299/month',
      description: 'Ideal for growing businesses using CBDCs',
      features: [
        'Up to $500K monthly CBDC volume',
        'Multi-CBDC treasury management',
        'Priority support',
        'Unlimited team members',
        'Advanced analytics',
        'API access',
        'Custom compliance rules'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'CBDC Enterprise',
      price: 'Custom',
      description: 'For large-scale CBDC operations',
      features: [
        'Unlimited CBDC volume',
        'White-label CBDC solutions',
        'Dedicated relationship manager',
        'Central bank partnerships',
        'Custom integrations',
        'Advanced security features',
        'Regulatory consulting'
      ]
    }
  ];

  const stats = [
    { value: "500+", label: "Businesses Using CBDCs" },
    { value: "$1B+", label: "CBDC Volume Processed" },
    { value: "50+", label: "CBDC Networks" },
    { value: "99.99%", label: "Uptime Guarantee" }
  ];

  const cbdcNetworks = [
    { name: "Digital Yuan", country: "China", flag: "🇨🇳", status: "Live" },
    { name: "Digital Rupee", country: "India", flag: "🇮🇳", status: "Live" },
    { name: "Digital Euro", country: "EU", flag: "🇪🇺", status: "Pilot" },
    { name: "Digital Pound", country: "UK", flag: "🇬🇧", status: "Testing" },
    { name: "Digital Dollar", country: "USA", flag: "🇺🇸", status: "Research" },
    { name: "Digital Yen", country: "Japan", flag: "🇯🇵", status: "Pilot" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernNavbar />
      
      <div className="pt-20 pb-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-1 mb-4">
                🏛️ First CBDC business platform
              </Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Scale your business with
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}Central Bank Digital Currencies
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Manage international payments, treasury operations, and financial workflows using 
                official CBDCs from central banks worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4">
                  Start CBDC Business
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" size="lg" className="px-8 py-4">
                  Schedule Demo
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CBDC Networks */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Connected CBDC Networks
              </h2>
              <p className="text-xl text-gray-600">
                Access central bank digital currencies from major economies
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {cbdcNetworks.map((network, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow text-center">
                  <CardContent className="p-6">
                    <div className="text-3xl mb-2">{network.flag}</div>
                    <h3 className="font-semibold text-gray-900 mb-1">{network.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{network.country}</p>
                    <Badge 
                      className={`text-xs ${
                        network.status === 'Live' ? 'bg-green-100 text-green-700' :
                        network.status === 'Pilot' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {network.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Everything your business needs for CBDCs
              </h2>
              <p className="text-xl text-gray-600">
                Comprehensive CBDC solutions for modern businesses
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8 text-center">
                    <div className="flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Choose your CBDC plan
              </h2>
              <p className="text-xl text-gray-600">
                Transparent pricing for CBDC business solutions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <Card 
                  key={plan.id} 
                  className={`border-0 shadow-lg hover:shadow-xl transition-all duration-200 ${
                    plan.popular ? 'ring-2 ring-blue-600 scale-105' : ''
                  }`}
                >
                  <CardHeader className="text-center">
                    {plan.popular && (
                      <Badge className="bg-blue-600 text-white mb-4 mx-auto">
                        Most Popular
                      </Badge>
                    )}
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <div className="text-4xl font-bold text-blue-600 mt-2">{plan.price}</div>
                    <p className="text-gray-600 mt-2">{plan.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      }`}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                CBDC Business Use Cases
              </h2>
              <p className="text-xl text-gray-600">
                How businesses are leveraging CBDCs today
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "International Trade",
                  description: "Settle cross-border trade payments instantly with CBDCs, reducing settlement time from days to minutes.",
                  icon: <Globe className="w-8 h-8 text-blue-600" />
                },
                {
                  title: "Supply Chain Finance",
                  description: "Use CBDCs for transparent, traceable payments throughout your supply chain network.",
                  icon: <Target className="w-8 h-8 text-green-600" />
                },
                {
                  title: "Treasury Management",
                  description: "Manage multi-currency CBDC holdings with real-time visibility and control.",
                  icon: <BarChart3 className="w-8 h-8 text-purple-600" />
                },
                {
                  title: "Employee Payments",
                  description: "Pay international employees and contractors instantly with CBDCs.",
                  icon: <Users className="w-8 h-8 text-orange-600" />
                },
                {
                  title: "B2B Marketplaces",
                  description: "Enable instant CBDC payments in your B2B marketplace or platform.",
                  icon: <Building className="w-8 h-8 text-red-600" />
                },
                {
                  title: "Regulatory Compliance",
                  description: "Leverage built-in compliance features of CBDCs for regulatory reporting.",
                  icon: <Shield className="w-8 h-8 text-indigo-600" />
                }
              ].map((useCase, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      {useCase.icon}
                      <h3 className="text-xl font-semibold text-gray-900">{useCase.title}</h3>
                    </div>
                    <p className="text-gray-600">{useCase.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to transform your business with CBDCs?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join the future of business payments with central bank digital currencies.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4">
                <Headphones className="mr-2 w-5 h-5" />
                Talk to CBDC Expert
              </Button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Business;
