
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Banknote, 
  University, 
  Globe, 
  Shield, 
  Zap, 
  Calculator,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  ArrowRight,
  CreditCard,
  Building,
  Smartphone,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const CBDCTransfer = () => {
  const [amount, setAmount] = useState('');
  const [fromCBDC, setFromCBDC] = useState('USD');
  const [toCBDC, setToCBDC] = useState('INR');
  const [recipient, setRecipient] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [exchangeRate, setExchangeRate] = useState(83.12);
  const [networkFee, setNetworkFee] = useState(0.50);
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  const cbdcOptions = [
    { 
      code: 'USD', 
      name: 'Digital Dollar', 
      flag: '🇺🇸', 
      status: 'Research',
      centralBank: 'Federal Reserve',
      network: 'FedNow'
    },
    { 
      code: 'EUR', 
      name: 'Digital Euro', 
      flag: '🇪🇺', 
      status: 'Pilot',
      centralBank: 'European Central Bank',
      network: 'Euro System'
    },
    { 
      code: 'INR', 
      name: 'Digital Rupee', 
      flag: '🇮🇳', 
      status: 'Live',
      centralBank: 'Reserve Bank of India',
      network: 'e-Rupee'
    },
    { 
      code: 'CNY', 
      name: 'Digital Yuan', 
      flag: '🇨🇳', 
      status: 'Live',
      centralBank: 'People\'s Bank of China',
      network: 'DCEP'
    },
    { 
      code: 'GBP', 
      name: 'Digital Pound', 
      flag: '🇬🇧', 
      status: 'Testing',
      centralBank: 'Bank of England',
      network: 'Britcoin'
    },
    { 
      code: 'JPY', 
      name: 'Digital Yen', 
      flag: '🇯🇵', 
      status: 'Pilot',
      centralBank: 'Bank of Japan',
      network: 'CBDC-JP'
    }
  ];

  const transferPurposes = [
    'Family Support',
    'Business Payment',
    'Education',
    'Healthcare',
    'Investment',
    'Trade Finance',
    'Remittance',
    'Other'
  ];

  useEffect(() => {
    if (amount && fromCBDC && toCBDC) {
      calculateTransfer();
    }
  }, [amount, fromCBDC, toCBDC]);

  const calculateTransfer = () => {
    const rates: { [key: string]: number } = {
      'USD-INR': 83.12,
      'USD-EUR': 0.92,
      'USD-GBP': 0.79,
      'USD-CNY': 7.23,
      'USD-JPY': 149.50,
      'EUR-USD': 1.09,
      'EUR-INR': 90.47,
      'GBP-USD': 1.27,
      'CNY-USD': 0.14,
      'JPY-USD': 0.0067,
      'INR-USD': 0.012
    };

    const rateKey = `${fromCBDC}-${toCBDC}`;
    const rate = rates[rateKey] || 1;
    setExchangeRate(rate);

    // Calculate network fee based on amount and CBDC pair
    const transferAmount = parseFloat(amount) || 0;
    const baseFee = 0.50;
    const percentageFee = transferAmount * 0.001; // 0.1%
    setNetworkFee(Math.max(baseFee, percentageFee));
  };

  const handleTransfer = async () => {
    if (!user || !amount || !recipient) return;

    setLoading(true);
    try {
      const transferAmount = parseFloat(amount);
      const finalAmount = transferAmount * exchangeRate;

      // Create CBDC transaction record
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          amount: transferAmount,
          token_symbol: fromCBDC,
          to_address: recipient,
          transaction_type: 'cbdc_transfer',
          status: 'processing'
        });

      if (error) throw error;

      toast({
        title: "CBDC Transfer Initiated",
        description: `Sending ${finalAmount.toFixed(2)} ${toCBDC} via ${cbdcOptions.find(c => c.code === toCBDC)?.network}`,
        className: "bg-green-600 text-white border-green-700",
      });

      // Reset form
      setAmount('');
      setRecipient('');
      setRecipientName('');
      setPurpose('');
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

  const fromCBDCObj = cbdcOptions.find(c => c.code === fromCBDC);
  const toCBDCObj = cbdcOptions.find(c => c.code === toCBDC);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">CBDC Cross-Border Transfer</h1>
        <p className="text-lg text-gray-600">Send money using Central Bank Digital Currencies</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transfer Form */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Banknote className="w-5 h-5 text-blue-600" />
                <span>CBDC Transfer Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* CBDC Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>From CBDC</Label>
                  <select
                    value={fromCBDC}
                    onChange={(e) => setFromCBDC(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {cbdcOptions.map((cbdc) => (
                      <option key={cbdc.code} value={cbdc.code}>
                        {cbdc.flag} {cbdc.name} ({cbdc.code})
                      </option>
                    ))}
                  </select>
                  {fromCBDCObj && (
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-sm">
                        <div className="font-medium text-blue-800">{fromCBDCObj.centralBank}</div>
                        <div className="text-blue-600">{fromCBDCObj.network} Network</div>
                        <Badge className={`mt-1 ${
                          fromCBDCObj.status === 'Live' ? 'bg-green-100 text-green-700' :
                          fromCBDCObj.status === 'Pilot' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {fromCBDCObj.status}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <Label>To CBDC</Label>
                  <select
                    value={toCBDC}
                    onChange={(e) => setToCBDC(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {cbdcOptions.map((cbdc) => (
                      <option key={cbdc.code} value={cbdc.code}>
                        {cbdc.flag} {cbdc.name} ({cbdc.code})
                      </option>
                    ))}
                  </select>
                  {toCBDCObj && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="text-sm">
                        <div className="font-medium text-green-800">{toCBDCObj.centralBank}</div>
                        <div className="text-green-600">{toCBDCObj.network} Network</div>
                        <Badge className={`mt-1 ${
                          toCBDCObj.status === 'Live' ? 'bg-green-100 text-green-700' :
                          toCBDCObj.status === 'Pilot' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {toCBDCObj.status}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Amount */}
              <div>
                <Label htmlFor="amount">Transfer Amount</Label>
                <div className="relative mt-1">
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="text-xl font-semibold h-14 pl-4 pr-16"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    {fromCBDC}
                  </span>
                </div>
              </div>

              {/* Exchange Rate Display */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-800 font-medium">CBDC Exchange Rate</span>
                  </div>
                  <span className="text-blue-900 font-semibold">
                    1 {fromCBDC} = {exchangeRate} {toCBDC}
                  </span>
                </div>
              </div>

              {/* Recipient Information */}
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
                    <Label htmlFor="recipient">CBDC Wallet Address</Label>
                    <Input
                      id="recipient"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="0x... or bank account"
                      className="h-12"
                    />
                  </div>
                </div>
              </div>

              {/* Transfer Purpose */}
              <div>
                <Label htmlFor="purpose">Transfer Purpose</Label>
                <select
                  id="purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Purpose</option>
                  {transferPurposes.map((purposeOption) => (
                    <option key={purposeOption} value={purposeOption}>
                      {purposeOption}
                    </option>
                  ))}
                </select>
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
                  <span className="font-semibold">{amount || '0'} {fromCBDC}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CBDC Rate</span>
                  <span className="font-semibold">1 {fromCBDC} = {exchangeRate} {toCBDC}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Network Fee</span>
                  <span className="font-semibold">${networkFee.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-green-600">Recipient Gets</span>
                  <span className="font-bold text-green-600">{getFinalAmount()} {toCBDC}</span>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-4 h-4 text-green-600" />
                    <span className="text-green-800 font-medium">Settlement Time</span>
                  </div>
                  <p className="text-green-700">Instant via CBDC network</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <University className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Central bank backed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Regulatory compliant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Global CBDC network</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleTransfer}
                disabled={loading || !amount || !recipient || !recipientName}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-semibold"
              >
                {loading ? 'Processing...' : `Send ${getFinalAmount()} ${toCBDC}`}
              </Button>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="border-yellow-200 bg-yellow-50 border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">CBDC Security</h4>
                  <p className="text-yellow-700 text-sm">
                    All transfers are processed through official central bank networks. 
                    Verify recipient details before confirming.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CBDCTransfer;
