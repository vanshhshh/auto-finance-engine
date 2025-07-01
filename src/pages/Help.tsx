
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  HelpCircle, 
  MessageCircle, 
  Phone, 
  Mail,
  Book,
  Video,
  FileText,
  Users,
  Clock,
  CheckCircle,
  ChevronRight,
  Headphones,
  Globe,
  Shield,
  CreditCard,
  Send
} from 'lucide-react';
import { ModernNavbar } from '@/components/ModernNavbar';
import Footer from '@/components/Footer';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'transfers', name: 'Money Transfers' },
    { id: 'account', name: 'Account & Security' },
    { id: 'cards', name: 'Cards' },
    { id: 'fees', name: 'Fees & Rates' },
    { id: 'business', name: 'Business' }
  ];

  const popularArticles = [
    {
      id: 1,
      title: 'How to send money internationally',
      category: 'transfers',
      icon: <Send className="w-5 h-5" />,
      readTime: '3 min read',
      views: '45K views'
    },
    {
      id: 2,
      title: 'Understanding exchange rates and fees',
      category: 'fees',
      icon: <CreditCard className="w-5 h-5" />,
      readTime: '5 min read',
      views: '32K views'
    },
    {
      id: 3,
      title: 'How to verify your identity (KYC)',
      category: 'account',
      icon: <Shield className="w-5 h-5" />,
      readTime: '4 min read',
      views: '28K views'
    },
    {
      id: 4,
      title: 'Setting up your business account',
      category: 'business',
      icon: <Users className="w-5 h-5" />,
      readTime: '6 min read',
      views: '19K views'
    },
    {
      id: 5,
      title: 'Managing your virtual cards',
      category: 'cards',
      icon: <CreditCard className="w-5 h-5" />,
      readTime: '4 min read',
      views: '25K views'
    },
    {
      id: 6,
      title: 'Tracking your transfer status',
      category: 'transfers',
      icon: <Globe className="w-5 h-5" />,
      readTime: '2 min read',
      views: '41K views'
    }
  ];

  const contactOptions = [
    {
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      icon: <MessageCircle className="w-6 h-6" />,
      availability: 'Available 24/7',
      responseTime: 'Usually responds in 2-3 minutes',
      action: 'Start Chat',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      title: 'Phone Support',
      description: 'Speak directly with a support specialist',
      icon: <Phone className="w-6 h-6" />,
      availability: 'Mon-Fri, 9AM-6PM EST',
      responseTime: '+1 (555) 123-4567',
      action: 'Call Now',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message',
      icon: <Mail className="w-6 h-6" />,
      availability: 'Available 24/7',
      responseTime: 'Usually responds within 4 hours',
      action: 'Send Email',
      color: 'bg-purple-600 hover:bg-purple-700'
    }
  ];

  const resources = [
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      icon: <Video className="w-8 h-8 text-red-600" />,
      count: '50+ videos'
    },
    {
      title: 'User Guide',
      description: 'Comprehensive documentation',
      icon: <Book className="w-8 h-8 text-blue-600" />,
      count: '100+ articles'
    },
    {
      title: 'API Documentation',
      description: 'Developer resources and guides',
      icon: <FileText className="w-8 h-8 text-green-600" />,
      count: 'Full API docs'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other users',
      icon: <Users className="w-8 h-8 text-purple-600" />,
      count: '10K+ members'
    }
  ];

  const filteredArticles = selectedCategory === 'all' 
    ? popularArticles 
    : popularArticles.filter(article => article.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernNavbar />
      
      <div className="pt-20 pb-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              How can we help you?
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Find answers to your questions or get in touch with our support team
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500"
              />
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Quick Contact */}
          <section className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get Help Now</h2>
              <p className="text-xl text-gray-600">Multiple ways to reach our support team</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {contactOptions.map((option, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      {option.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{option.title}</h3>
                    <p className="text-gray-600 mb-4">{option.description}</p>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center justify-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{option.availability}</span>
                      </div>
                      <p className="text-sm text-gray-500">{option.responseTime}</p>
                    </div>
                    <Button className={`w-full text-white ${option.color}`}>
                      {option.action}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Popular Articles */}
          <section className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Help Articles</h2>
              <p className="text-xl text-gray-600">Find quick answers to common questions</p>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  className={selectedCategory === category.id ? 'bg-blue-600 hover:bg-blue-700' : ''}
                >
                  {category.name}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                        {article.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                          {article.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{article.readTime}</span>
                          <span>{article.views}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Resources */}
          <section className="py-16 bg-white rounded-2xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">More Resources</h2>
              <p className="text-xl text-gray-600">Explore additional help resources</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {resources.map((resource, index) => (
                <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      {resource.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
                    <Badge variant="secondary">{resource.count}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* FAQ Preview */}
          <section className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  question: "How long does an international transfer take?",
                  answer: "Most transfers arrive within minutes to a few hours, depending on the destination and delivery method."
                },
                {
                  question: "What documents do I need for verification?",
                  answer: "You'll need a government-issued ID and proof of address. Additional documents may be required for business accounts."
                },
                {
                  question: "Are there any transfer limits?",
                  answer: "Transfer limits depend on your verification level. Verified accounts have higher limits than unverified ones."
                },
                {
                  question: "How do I track my transfer?",
                  answer: "You can track your transfer in real-time through your dashboard or by using the tracking number provided."
                }
              ].map((faq, index) => (
                <Card key={index} className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <HelpCircle className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                        <p className="text-gray-600 text-sm">{faq.answer}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Contact CTA */}
          <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-center">
            <div className="max-w-3xl mx-auto px-6">
              <h2 className="text-3xl font-bold text-white mb-4">
                Still need help?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Our support team is here to help you 24/7
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4">
                  <MessageCircle className="mr-2 w-5 h-5" />
                  Start Live Chat
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4">
                  <Headphones className="mr-2 w-5 h-5" />
                  Contact Support
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Help;
