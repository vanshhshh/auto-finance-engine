
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
  Headphones
} from 'lucide-react';
import ModernNavbar from '@/components/ModernNavbar';
import Footer from '@/components/Footer';

const Business = () => {
  const [selectedPlan, setSelectedPlan] = useState('growth');

  const features = [
    {
      icon: <Globe className="w-8 h-8 text-blue-600" />,
      title: "Global Payments",
      description: "Send money to 200+ countries with competitive rates and fast delivery times."
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Enterprise Security",
      description: "Bank-level security with advanced fraud protection and compliance monitoring."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-purple-600" />,
      title: "Advanced Analytics",
      description: "Comprehensive reporting and insights to track your business payments."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "API Integration",
      description: "Seamlessly integrate payments into your existing business systems."
    }
  ];

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for small businesses getting started',
      features: [
        'Up to $10K monthly volume',
        'Basic reporting',
        'Email support',
        '5 team members'
      ]
    },
    {
      id: 'growth',
      name: 'Growth',
      price: '$99/month',
      description: 'Ideal for growing businesses',
      features: [
        'Up to $100K monthly volume',
        'Advanced analytics',
        'Priority support',
        'Unlimited team members',
        'API access'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large-scale operations',
      features: [
        'Unlimited volume',
        'Custom reporting',
        'Dedicated account manager',
        'White-label solutions',
        'Custom integrations'
      ]
    }
  ];

  const stats = [
    { value: "50M+", label: "Businesses Trust Us" },
    { value: "$100B+", label: "Processed Volume" },
    { value: "200+", label: "Countries Served" },
    { value: "99.9%", label: "Uptime Guarantee" }
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
                ✨ Trusted by 50M+ businesses worldwide
              </Badge>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Scale your business
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}globally
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Send money internationally with competitive rates, advanced security, and powerful tools 
                designed for businesses of all sizes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4">
                  Get Started Free
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

        {/* Features Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Everything your business needs
              </h2>
              <p className="text-xl text-gray-600">
                Powerful features designed for modern businesses
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
                Choose your plan
              </h2>
              <p className="text-xl text-gray-600">
                Transparent pricing with no hidden fees
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

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to scale your business?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of businesses already using GateFinance for their international payments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4">
                <Headphones className="mr-2 w-5 h-5" />
                Talk to Sales
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
