
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Plus, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock,
  Settings,
  ShoppingCart,
  Plane,
  Smartphone,
  Shield,
  Zap,
  Globe,
  TrendingUp,
  ChevronRight,
  MoreVertical
} from 'lucide-react';
import ModernNavbar from '@/components/ModernNavbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

const Cards = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [selectedCard, setSelectedCard] = useState(0);
  const { toast } = useToast();

  const cards = [
    {
      id: 1,
      type: 'Virtual',
      name: 'Primary Card',
      number: '4532 1234 5678 9012',
      balance: 2450.75,
      currency: 'USD',
      status: 'active',
      color: 'from-blue-600 to-purple-600',
      textColor: 'text-white'
    },
    {
      id: 2,
      type: 'Physical',
      name: 'Travel Card',
      number: '5412 9876 5432 1098',
      balance: 1250.00,
      currency: 'EUR',
      status: 'active',
      color: 'from-green-600 to-blue-600',
      textColor: 'text-white'
    },
    {
      id: 3,
      type: 'Virtual',
      name: 'Shopping Card',
      number: '4916 1111 2222 3333',
      balance: 500.00,
      currency: 'GBP',
      status: 'locked',
      color: 'from-gray-600 to-gray-800',
      textColor: 'text-white'
    }
  ];

  const transactions = [
    {
      id: 1,
      merchant: 'Amazon',
      amount: -89.99,
      currency: 'USD',
      date: '2024-01-15',
      category: 'Shopping',
      icon: <ShoppingCart className="w-4 h-4" />
    },
    {
      id: 2,
      merchant: 'British Airways',
      amount: -450.00,
      currency: 'USD',
      date: '2024-01-14',
      category: 'Travel',
      icon: <Plane className="w-4 h-4" />
    },
    {
      id: 3,
      merchant: 'Spotify',
      amount: -9.99,
      currency: 'USD',
      date: '2024-01-13',
      category: 'Entertainment',
      icon: <Smartphone className="w-4 h-4" />
    },
    {
      id: 4,
      merchant: 'Starbucks',
      amount: -12.50,
      currency: 'USD',
      date: '2024-01-12',
      category: 'Food & Drink',
      icon: <ShoppingCart className="w-4 h-4" />
    }
  ];

  const cardFeatures = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Advanced Security',
      description: 'Chip & PIN technology with real-time fraud monitoring'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global Acceptance',
      description: 'Use your card anywhere Visa/Mastercard is accepted'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Notifications',
      description: 'Get notified instantly for every transaction'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Spending Insights',
      description: 'Track and categorize all your expenses automatically'
    }
  ];

  const handleCardAction = (action: string, cardId: number) => {
    const card = cards.find(c => c.id === cardId);
    toast({
      title: `Card ${action}`,
      description: `${card?.name} has been ${action.toLowerCase()}`,
      className: "bg-blue-600 text-white border-blue-700",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernNavbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Cards</h1>
              <p className="text-xl text-gray-600">Manage your virtual and physical cards</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add New Card
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cards Display */}
            <div className="lg:col-span-2 space-y-8">
              {/* Card Carousel */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-gray-900">My Cards</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-gray-600"
                  >
                    {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {cards.map((card, index) => (
                    <div
                      key={card.id}
                      className={`relative p-6 rounded-2xl bg-gradient-to-br ${card.color} ${card.textColor} shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer`}
                      onClick={() => setSelectedCard(index)}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                          <CreditCard className="w-6 h-6" />
                          <span className="font-medium">{card.type}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={card.status === 'active' ? 'default' : 'secondary'}>
                            {card.status}
                          </Badge>
                          <button className="hover:bg-white/20 p-1 rounded">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-sm opacity-80 mb-1">{card.name}</div>
                          <div className="text-lg font-mono tracking-wider">
                            {showBalance ? card.number : '•••• •••• •••• ••••'}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm opacity-80">Balance</div>
                            <div className="text-2xl font-bold">
                              {showBalance ? `${card.balance.toFixed(2)} ${card.currency}` : '••••••'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm opacity-80">Exp</div>
                            <div className="font-medium">12/27</div>
                          </div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardAction(card.status === 'active' ? 'Locked' : 'Unlocked', card.id);
                          }}
                          className="hover:bg-white/20 p-2 rounded-full transition-colors"
                        >
                          {card.status === 'active' ? 
                            <Lock className="w-4 h-4" /> : 
                            <Unlock className="w-4 h-4" />
                          }
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardAction('Settings', card.id);
                          }}
                          className="hover:bg-white/20 p-2 rounded-full transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transactions */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Recent Transactions</span>
                    <Button variant="ghost" size="sm">
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            {transaction.icon}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{transaction.merchant}</div>
                            <div className="text-sm text-gray-500">{transaction.category}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-semibold ${
                            transaction.amount < 0 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {transaction.amount < 0 ? '-' : '+'}{Math.abs(transaction.amount).toFixed(2)} {transaction.currency}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Card Features */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Card Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cardFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                          <p className="text-gray-600 text-sm">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Card Controls */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Money
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Lock className="w-4 h-4 mr-2" />
                      Freeze Card
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Settings className="w-4 h-4 mr-2" />
                      Card Settings
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Shield className="w-4 h-4 mr-2" />
                      Security Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Spending Insights */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Spending This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900">$1,247.50</div>
                      <div className="text-green-600 text-sm flex items-center justify-center mt-1">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        15% less than last month
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { category: 'Shopping', amount: 456.78, percent: 37 },
                        { category: 'Travel', amount: 450.00, percent: 36 },
                        { category: 'Food & Drink', amount: 234.56, percent: 19 },
                        { category: 'Entertainment', amount: 106.16, percent: 8 }
                      ].map((item, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{item.category}</span>
                            <span className="font-medium">${item.amount.toFixed(2)}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${item.percent}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Status */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Security Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Card Protection</span>
                      <Badge className="bg-green-600">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">3D Secure</span>
                      <Badge className="bg-green-600">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">SMS Alerts</span>
                      <Badge className="bg-green-600">On</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Contactless Limit</span>
                      <span className="text-sm font-medium">$100</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cards;
