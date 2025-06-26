
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
  Play,
  Banknote,
  University,
  Target,
  Award
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import ModernNavbar from '@/components/ModernNavbar';
import Footer from '@/components/Footer';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <Banknote className="w-8 h-8 text-blue-600" />,
      title: "CBDC Network",
      description: "Send money using Central Bank Digital Currencies across 50+ countries with institutional backing."
    },
    {
      icon: <University className="w-8 h-8 text-green-600" />,
      title: "Central Bank Backed",
      description: "Every transaction is backed by official Central Bank Digital Currencies, ensuring maximum security."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Instant Settlement",
      description: "CBDC transfers settle instantly through direct central bank networks, not traditional banking."
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: "Regulatory Compliant",
      description: "Full compliance with global financial regulations and central bank requirements."
    }
  ];

  const cbdcCountries = [
    { name: "Digital Yuan", code: "CN", flag: "🇨🇳", status: "Live" },
    { name: "Digital Euro", code: "EU", flag: "🇪🇺", status: "Pilot" },
    { name: "Digital Rupee", code: "IN", flag: "🇮🇳", status: "Live" },
    { name: "Digital Pound", code: "GB", flag: "🇬🇧", status: "Testing" },
    { name: "Digital Dollar", code: "US", flag: "🇺🇸", status: "Research" },
    { name: "Digital Yen", code: "JP", flag: "🇯🇵", status: "Pilot" }
  ];

  const stats = [
    { value: "50+", label: "CBDC Networks" },
    { value: "$10B+", label: "CBDC Volume" },
    { value: "200+", label: "Countries Ready" },
    { value: "99.9%", label: "Uptime" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Treasury Manager",
      content: "CBDC transfers have revolutionized our international payments. Instant, secure, and cost-effective.",
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      role: "FinTech Founder",
      content: "Finally, a platform that leverages real CBDC infrastructure. The future of cross-border payments.",
      avatar: "MC"
    },
    {
      name: "Priya Patel",
      role: "Finance Director",
      content: "Central bank backing gives us the confidence we need for large international transactions.",
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
                  🏛️ First CBDC-Native Transfer Platform
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Transfer money with
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {" "}Central Bank Digital Currencies
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Send money globally using official CBDCs from central banks worldwide. 
                  Instant settlement, maximum security, regulatory compliance built-in.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => navigate('/transfer')}
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Send CBDC Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  onClick={() => navigate('/business')}
                  variant="outline" 
                  size="lg"
                  className="border-2 border-gray-300 hover:border-gray-400 px-8 py-4 text-lg font-semibold rounded-xl"
                >
                  <Building className="mr-2 w-5 h-5" />
                  Business Solutions
                </Button>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600">Trusted by Central Banks</span>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">CBDC Transfer</h3>
                    <Badge className="bg-green-100 text-green-700">Live Rates</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">You send</label>
                      <div className="mt-1 relative">
                        <input 
                          type="text" 
                          placeholder="1,000" 
                          className="w-full p-4 pr-20 text-2xl font-bold border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      <label className="text-sm font-medium text-gray-700">Recipient gets (Digital Rupee)</label>
                      <div className="mt-1 relative">
                        <input 
                          type="text" 
                          placeholder="83,120" 
                          className="w-full p-4 pr-20 text-2xl font-bold border border-gray-300 rounded-xl bg-gray-50"
                          readOnly
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">INR</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>CBDC Rate</span>
                      <span className="font-medium">1 USD = 83.12 INR</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Network Fee</span>
                      <span className="font-medium">$0.50</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Settlement</span>
                      <span className="font-medium text-green-600">Instant</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => navigate('/transfer')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold rounded-xl"
                  >
                    Continue with CBDC
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

      {/* CBDC Network Status */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Global CBDC Network Status
            </h2>
            <p className="text-xl text-gray-600">
              Connected to central bank digital currencies worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {cbdcCountries.map((cbdc, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-2">{cbdc.flag}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{cbdc.name}</h3>
                  <Badge 
                    className={`text-xs ${
                      cbdc.status === 'Live' ? 'bg-green-100 text-green-700' :
                      cbdc.status === 'Pilot' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {cbdc.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
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
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why choose CBDC transfers?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The next generation of international money transfers powered by central bank digital currencies.
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How CBDC transfers work
            </h2>
            <p className="text-xl text-gray-600">
              Send money in 3 simple steps using central bank infrastructure
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Select CBDCs",
                description: "Choose source and destination central bank digital currencies",
                icon: <Banknote className="w-8 h-8 text-blue-600" />
              },
              {
                step: "2",
                title: "Verify & Confirm",
                description: "Complete KYC verification and confirm transfer details",
                icon: <Shield className="w-8 h-8 text-green-600" />
              },
              {
                step: "3",
                title: "Instant Settlement",
                description: "Money transfers instantly through central bank networks",
                icon: <Zap className="w-8 h-8 text-purple-600" />
              }
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-6 border-2 border-gray-100">
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

      {/* Quick Access Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Explore our CBDC platform
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need for cross-border CBDC transfers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Send CBDCs",
                description: "Transfer money using central bank digital currencies",
                icon: <Banknote className="w-8 h-8 text-blue-600" />,
                href: "/transfer",
                color: "bg-blue-50 border-blue-200 hover:bg-blue-100"
              },
              {
                title: "Exchange Rates",
                description: "View real-time CBDC exchange rates",
                icon: <TrendingUp className="w-8 h-8 text-green-600" />,
                href: "/exchange",
                color: "bg-green-50 border-green-200 hover:bg-green-100"
              },
              {
                title: "Virtual Cards",
                description: "Spend CBDCs with virtual debit cards",
                icon: <CreditCard className="w-8 h-8 text-purple-600" />,
                href: "/cards",
                color: "bg-purple-50 border-purple-200 hover:bg-purple-100"
              },
              {
                title: "Business Tools",
                description: "CBDC solutions for businesses",
                icon: <Building className="w-8 h-8 text-orange-600" />,
                href: "/business",
                color: "bg-orange-50 border-orange-200 hover:bg-orange-100"
              }
            ].map((item, index) => (
              <Card 
                key={index} 
                className={`border-2 cursor-pointer transition-all duration-200 ${item.color}`}
                onClick={() => navigate(item.href)}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                  <div className="mt-4">
                    <ArrowRight className="w-4 h-4 text-gray-400 mx-auto" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by financial institutions
            </h2>
            <p className="text-xl text-gray-600">
              See what industry leaders say about CBDC transfers
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
            Ready to transfer with CBDCs?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join the future of cross-border payments with central bank digital currencies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/transfer')}
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Start CBDC Transfer
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              onClick={() => navigate('/help')}
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold rounded-xl"
            >
              <HelpCircle className="mr-2 w-5 h-5" />
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
