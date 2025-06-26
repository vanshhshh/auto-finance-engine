
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Globe, 
  Shield, 
  Zap, 
  DollarSign, 
  CreditCard, 
  Building, 
  Smartphone,
  CheckCircle,
  TrendingUp,
  Lock,
  Clock,
  Users,
  Star,
  Play
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ModernNavbar from '@/components/ModernNavbar';
import Footer from '@/components/Footer';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <Globe className="w-8 h-8 text-blue-600" />,
      title: "200+ Countries",
      description: "Send money to over 200 countries and territories worldwide with competitive exchange rates."
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Bank-Level Security",
      description: "Your money and data are protected with enterprise-grade security and encryption."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Instant Transfers",
      description: "Most transfers arrive within minutes, not days. Track your money in real-time."
    },
    {
      icon: <DollarSign className="w-8 h-8 text-purple-600" />,
      title: "Best Exchange Rates",
      description: "Get the real exchange rate with transparent, low fees. No hidden charges."
    }
  ];

  const stats = [
    { value: "50M+", label: "Happy Customers" },
    { value: "$100B+", label: "Money Transferred" },
    { value: "200+", label: "Countries Served" },
    { value: "4.8/5", label: "Trust Score" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Freelancer",
      content: "The fastest way to receive payments from my international clients. Highly recommended!",
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "Business Owner",
      content: "Switched from traditional banks to GateFinance. Saving thousands in fees every month.",
      avatar: "MC"
    },
    {
      name: "Priya Patel",
      role: "Student",
      content: "My parents can send money instantly. The rates are amazing compared to other services.",
      avatar: "PP"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <ModernNavbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-16">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-4 py-1">
                  ✨ Trusted by 50M+ users worldwide
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Money transfers 
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {" "}made simple
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Send money abroad with the real exchange rate, low fees, and lightning-fast delivery. 
                  Join millions who trust GateFinance for their international transfers.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => user ? navigate('/dashboard') : navigate('/auth')}
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {user ? 'Go to Dashboard' : 'Send Money Now'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-2 border-gray-300 hover:border-gray-400 px-8 py-4 text-lg font-semibold rounded-xl"
                >
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </Button>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600">4.8/5 from 100K+ reviews</span>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">Quick Transfer</h3>
                    <Badge className="bg-green-100 text-green-700">Live Rates</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">You send</label>
                      <div className="mt-1 relative">
                        <input 
                          type="text" 
                          placeholder="1,000" 
                          className="w-full p-4 pr-16 text-2xl font-bold border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">USD</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <ArrowRight className="w-5 h-5 text-blue-600 rotate-90" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Recipient gets</label>
                      <div className="mt-1 relative">
                        <input 
                          type="text" 
                          placeholder="83,120" 
                          className="w-full p-4 pr-16 text-2xl font-bold border border-gray-300 rounded-xl bg-gray-50"
                          readOnly
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">INR</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Exchange rate</span>
                      <span className="font-medium">1 USD = 83.12 INR</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Our fee</span>
                      <span className="font-medium">$2.99</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery time</span>
                      <span className="font-medium text-green-600">Within minutes</span>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold rounded-xl">
                    Continue
                  </Button>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-100 rounded-full opacity-50 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-100 rounded-full opacity-50 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why choose GateFinance?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're building the future of money transfers with cutting-edge technology and unmatched service.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600">
              Send money in 3 simple steps
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Enter amount",
                description: "Tell us how much you want to send and where",
                icon: <DollarSign className="w-8 h-8 text-blue-600" />
              },
              {
                step: "2",
                title: "Verify identity",
                description: "Complete quick identity verification for security",
                icon: <Shield className="w-8 h-8 text-green-600" />
              },
              {
                step: "3",
                title: "Send money",
                description: "Your money is on its way within minutes",
                icon: <Zap className="w-8 h-8 text-purple-600" />
              }
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-6">
                  {item.icon}
                </div>
                <div className="absolute top-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by millions worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers have to say
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-gray-600 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to send money globally?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join millions of people who trust GateFinance for their international transfers.
          </p>
          <Button 
            onClick={() => user ? navigate('/dashboard') : navigate('/auth')}
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {user ? 'Go to Dashboard' : 'Get Started Now'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
