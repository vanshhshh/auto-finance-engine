
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Send, 
  ArrowDownLeft, 
  QrCode, 
  Users, 
  Calculator,
  Clock,
  Shield,
  Globe,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  Zap,
  CreditCard,
  Building,
  Smartphone
} from 'lucide-react';
import { useWalletData } from '@/hooks/useWalletData';
import { useAuth } from '@/contexts/AuthContext';
import ModernNavbar from '@/components/ModernNavbar';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

const Transfer = () => {
  const [transferType, setTransferType] = useState<'send' | 'receive' | 'bulk'>('send');
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [recipient, setRecipient] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState('wallet');
  const [note, setNote] = useState('');
  const [exchangeRate, setExchangeRate] = useState(83.12);
  const [fees, setFees] = useState({ transfer: 2.99, exchange: 0 });
  const [deliveryTime, setDeliveryTime] = useState('Within minutes');
  const [loading, setLoading] = useState(false);
  
  const { balances } = useWalletData();
  const { user } = useAuth();
  const { toast } = useToast();

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' }
  ];

  const deliveryMethods = [
    { 
      id: 'wallet', 
      name: 'Digital Wallet', 
      description: 'Instant transfer to digital wallet',
      icon: <Smartphone className="w-5 h-5" />,
      time: 'Within minutes',
      fee: 0
    },
    { 
      id: 'bank', 
      name: 'Bank Transfer', 
      description: 'Direct to bank account',
      icon: <Building className="w-5 h-5" />,
      time: '1-2 hours',
      fee: 1.99
    },
    { 
      id: 'card', 
      name: 'Debit Card', 
      description: 'Load money to debit card',
      icon: <CreditCard className="w-5 h-5" />,
      time: 'Within minutes',
      fee: 2.99
    },
    { 
      id: 'cash', 
      name: 'Cash Pickup', 
      description: 'Pickup cash at agent location',
      icon: <Users className="w-5 h-5" />,
      time: '15 minutes',
      fee: 3.99
    }
  ];

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      calculateTransfer();
    }
  }, [amount, fromCurrency, toCurrency, deliveryMethod]);

  const calculateTransfer = () => {
    const rates: { [key: string]: number } = {
      'USD-INR': 83.12,
      'USD-AED': 3.67,
      'USD-EUR': 0.92,
      'USD-GBP': 0.79,
      'EUR-USD': 1.09,
      'GBP-USD': 1.27,
      'INR-USD': 0.012,
      'AED-USD': 0.27
    };

    const rateKey = `${fromCurrency}-${toCurrency}`;
    const rate = rates[rateKey] || 1;
    setExchangeRate(rate);

    const transferAmount = parseFloat(amount) || 0;
    const selectedMethod = deliveryMethods.find(m => m.id === deliveryMethod);
    const methodFee = selectedMethod?.fee || 0;
    
    setFees({
      transfer: methodFee,
      exchange: transferAmount * 0.005 // 0.5% exchange fee
    });

    setDeliveryTime(selectedMethod?.time || 'Within minutes');
  };

  const handleTransfer = async () => {
    if (!user || !amount || !recipient) return;

    setLoading(true);
    try {
      const transferAmount = parseFloat(amount);
      const finalAmount = transferAmount * exchangeRate;
      const totalFees = fees.transfer + fees.exchange;

      // Create transaction record
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          amount: transferAmount,
          token_symbol: fromCurrency,
          to_address: recipient,
          transaction_type: transferType,
          status: 'processing'
        });

      if (error) throw error;

      toast({
        title: "Transfer Initiated",
        description: `Sending ${finalAmount.toFixed(2)} ${toCurrency} via ${deliveryMethods.find(m => m.id === deliveryMethod)?.name}`,
        className: "bg-green-600 text-white border-green-700",
      });

      // Reset form
      setAmount('');
      setRecipient('');
      setRecipientName('');
      setNote('');
    } catch (error: any) {
      toast({
        title: "Transfer Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFinalAmount = () => {
    const transferAmount = parseFloat(amount) || 0;
    return (transferAmount * exchangeRate).toFixed(2);
  };

  const getTotalFees = () => {
    return (fees.transfer + fees.exchange).toFixed(2);
  };

  const fromCurrencyObj = currencies.find(c => c.code === fromCurrency);
  const toCurrencyObj = currencies.find(c => c.code === toCurrency);

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernNavbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Send Money Globally</h1>
            <p className="text-xl text-gray-600">Fast, secure, and affordable international transfers</p>
          </div>

          {/* Transfer Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Button
              onClick={() => setTransferType('send')}
              variant={transferType === 'send' ? 'default' : 'outline'}
              className={`p-6 h-auto flex-col ${
                transferType === 'send' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'border-blue-600 text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Send className="mb-2" size={24} />
              <span>Send Money</span>
            </Button>
            
            <Button
              onClick={() => setTransferType('receive')}
              variant={transferType === 'receive' ? 'default' : 'outline'}
              className={`p-6 h-auto flex-col ${
                transferType === 'receive' 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'border-green-600 text-green-600 hover:bg-green-50'
              }`}
            >
              <ArrowDownLeft className="mb-2" size={24} />
              <span>Request Payment</span>
            </Button>
            
            <Button
              onClick={() => setTransferType('bulk')}
              variant={transferType === 'bulk' ? 'default' : 'outline'}
              className={`p-6 h-auto flex-col ${
                transferType === 'bulk' 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'border-purple-600 text-purple-600 hover:bg-purple-50'
              }`}
            >
              <Users className="mb-2" size={24} />
              <span>Bulk Transfer</span>
            </Button>

            <Button
              variant="outline"
              className="p-6 h-auto flex-col border-orange-600 text-orange-600 hover:bg-orange-50"
            >
              <QrCode className="mb-2" size={24} />
              <span>QR Payment</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Transfer Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="capitalize">{transferType} Transfer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Amount and Currency Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label>You Send</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.00"
                          className="text-2xl font-semibold h-16 pl-12 pr-4"
                        />
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">
                          {fromCurrencyObj?.symbol}
                        </span>
                      </div>
                      
                      <Select value={fromCurrency} onValueChange={setFromCurrency}>
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              <div className="flex items-center space-x-2">
                                <span>{currency.flag}</span>
                                <span>{currency.code} - {currency.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      <Label>Recipient Gets</Label>
                      <div className="relative">
                        <Input
                          type="text"
                          value={getFinalAmount()}
                          readOnly
                          className="text-2xl font-semibold h-16 pl-12 pr-4 bg-gray-50"
                        />
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">
                          {toCurrencyObj?.symbol}
                        </span>
                      </div>
                      
                      <Select value={toCurrency} onValueChange={setToCurrency}>
                        <SelectTrigger className="h-12">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              <div className="flex items-center space-x-2">
                                <span>{currency.flag}</span>
                                <span>{currency.code} - {currency.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Exchange Rate Display */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calculator className="w-5 h-5 text-blue-600" />
                        <span className="text-blue-800 font-medium">Exchange Rate</span>
                      </div>
                      <span className="text-blue-900 font-semibold">
                        1 {fromCurrency} = {exchangeRate} {toCurrency}
                      </span>
                    </div>
                  </div>

                  {/* Recipient Information */}
                  {transferType === 'send' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="recipientName">Recipient Name</Label>
                          <Input
                            id="recipientName"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            placeholder="Full name"
                            className="h-12"
                          />
                        </div>
                        <div>
                          <Label htmlFor="recipient">Email or Wallet Address</Label>
                          <Input
                            id="recipient"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder="email@example.com or 0x..."
                            className="h-12"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Delivery Method */}
                  <div className="space-y-4">
                    <Label>Delivery Method</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {deliveryMethods.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setDeliveryMethod(method.id)}
                          className={`p-4 border-2 rounded-lg text-left transition-all ${
                            deliveryMethod === method.id
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {method.icon}
                              <span className="font-semibold">{method.name}</span>
                            </div>
                            {method.fee > 0 && (
                              <Badge variant="secondary">${method.fee}</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{method.description}</p>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-green-600" />
                            <span className="text-xs text-green-600">{method.time}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Note */}
                  <div>
                    <Label htmlFor="note">Note (Optional)</Label>
                    <Input
                      id="note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Add a note for this transfer"
                      className="h-12"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Transfer Summary */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Transfer Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Send Amount</span>
                      <span className="font-semibold">{amount || '0'} {fromCurrency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Exchange Rate</span>
                      <span className="font-semibold">1 {fromCurrency} = {exchangeRate} {toCurrency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transfer Fee</span>
                      <span className="font-semibold">${fees.transfer}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Exchange Fee</span>
                      <span className="font-semibold">${fees.exchange.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold">Total Cost</span>
                      <span className="font-bold">${(parseFloat(amount || '0') + parseFloat(getTotalFees())).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold text-green-600">Recipient Gets</span>
                      <span className="font-bold text-green-600">{getFinalAmount()} {toCurrency}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-4 h-4 text-green-600" />
                      <span className="text-green-800 font-medium">Delivery Time</span>
                    </div>
                    <p className="text-green-700">{deliveryTime}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600">Bank-level security</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600">Real-time tracking</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600">Guaranteed delivery</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleTransfer}
                    disabled={loading || !amount || (transferType === 'send' && !recipient)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-semibold"
                  >
                    {loading ? 'Processing...' : `Send ${getFinalAmount()} ${toCurrency}`}
                  </Button>
                </CardContent>
              </Card>

              {/* Security Notice */}
              <Card className="border-yellow-200 bg-yellow-50 border-0 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-1">Security Notice</h4>
                      <p className="text-yellow-700 text-sm">
                        Always verify recipient details before sending. Transfers are irreversible once confirmed.
                      </p>
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

export default Transfer;
