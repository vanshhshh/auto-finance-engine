
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Globe, MapPin, Clock, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const CrossBorderRemittance = () => {
  const [remittance, setRemittance] = useState({
    recipientCountry: '',
    recipientBank: '',
    recipientAccount: '',
    recipientName: '',
    amount: '',
    currency: 'USD',
    purpose: ''
  });
  const [exchangeRate, setExchangeRate] = useState(0);
  const [fees, setFees] = useState(0);
  const [deliveryTime, setDeliveryTime] = useState('');
  const [complianceChecks, setComplianceChecks] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const countries = [
    { code: 'IN', name: 'India', currency: 'INR', rate: 83.12 },
    { code: 'AE', name: 'United Arab Emirates', currency: 'AED', rate: 3.67 },
    { code: 'GB', name: 'United Kingdom', currency: 'GBP', rate: 0.79 },
    { code: 'EU', name: 'European Union', currency: 'EUR', rate: 0.92 },
    { code: 'PH', name: 'Philippines', currency: 'PHP', rate: 56.45 },
    { code: 'MX', name: 'Mexico', currency: 'MXN', rate: 17.23 },
    { code: 'NG', name: 'Nigeria', currency: 'NGN', rate: 765.50 }
  ];

  const remittancePurposes = [
    'Family Support',
    'Education',
    'Medical Treatment',
    'Property Purchase',
    'Business Investment',
    'Gift',
    'Other'
  ];

  React.useEffect(() => {
    if (remittance.recipientCountry && remittance.amount) {
      calculateRemittance();
    }
  }, [remittance.recipientCountry, remittance.amount, remittance.currency]);

  const calculateRemittance = async () => {
    const country = countries.find(c => c.code === remittance.recipientCountry);
    if (!country) return;

    const amount = parseFloat(remittance.amount) || 0;
    const rate = country.rate;
    const feePercentage = 0.025; // 2.5% fee
    const calculatedFees = amount * feePercentage;
    
    setExchangeRate(rate);
    setFees(calculatedFees);
    
    // Estimate delivery time based on country
    const deliveryTimes: { [key: string]: string } = {
      'IN': '2-4 hours',
      'AE': '1-2 hours',
      'GB': '4-8 hours',
      'EU': '4-8 hours',
      'PH': '24-48 hours',
      'MX': '24-48 hours',
      'NG': '48-72 hours'
    };
    
    setDeliveryTime(deliveryTimes[remittance.recipientCountry] || '24-48 hours');

    // Run compliance checks
    runComplianceChecks(amount, country.code);
  };

  const runComplianceChecks = (amount: number, countryCode: string) => {
    const checks = [];

    // Amount limits
    if (amount > 10000) {
      checks.push({
        type: 'amount_limit',
        status: 'warning',
        message: 'Large transaction requires additional documentation',
        action: 'Provide source of funds documentation'
      });
    }

    // Sanctions screening
    checks.push({
      type: 'sanctions_screening',
      status: 'passed',
      message: 'Recipient not on sanctions list',
      action: 'Completed'
    });

    // KYC verification
    checks.push({
      type: 'kyc_verification',
      status: 'passed',
      message: 'Sender KYC verified',
      action: 'Completed'
    });

    // Destination country regulations
    const highRiskCountries = ['NG'];
    if (highRiskCountries.includes(countryCode)) {
      checks.push({
        type: 'country_risk',
        status: 'review',
        message: 'Enhanced due diligence required',
        action: 'Additional verification needed'
      });
    }

    setComplianceChecks(checks);
  };

  const processRemittance = async () => {
    setProcessing(true);
    
    try {
      const country = countries.find(c => c.code === remittance.recipientCountry);
      const amount = parseFloat(remittance.amount);
      const finalAmount = (amount - fees) * exchangeRate;

      // Create transaction record
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user?.id,
          amount: amount,
          token_symbol: remittance.currency,
          to_address: remittance.recipientAccount,
          transaction_type: 'remittance',
          status: 'processing'
        });

      if (error) throw error;

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 3000));

      toast({
        title: "Remittance Initiated",
        description: `${finalAmount.toFixed(2)} ${country?.currency} will be delivered to ${remittance.recipientName} in ${deliveryTime}.`,
        className: "bg-green-600 text-white border-green-700",
      });

      // Reset form
      setRemittance({
        recipientCountry: '',
        recipientBank: '',
        recipientAccount: '',
        recipientName: '',
        amount: '',
        currency: 'USD',
        purpose: ''
      });
    } catch (error) {
      toast({
        title: "Transfer Failed",
        description: "Failed to process remittance. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const getCheckStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'bg-green-600';
      case 'warning': return 'bg-orange-600';
      case 'review': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getCheckIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle size={16} />;
      case 'warning': return <AlertCircle size={16} />;
      case 'review': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const country = countries.find(c => c.code === remittance.recipientCountry);
  const amount = parseFloat(remittance.amount) || 0;
  const finalAmount = country ? (amount - fees) * exchangeRate : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="text-blue-600" size={20} />
            Cross-Border Remittance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recipient Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="recipientCountry">Recipient Country</Label>
              <select
                id="recipientCountry"
                value={remittance.recipientCountry}
                onChange={(e) => setRemittance({ ...remittance, recipientCountry: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name} ({country.currency})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                value={remittance.recipientName}
                onChange={(e) => setRemittance({ ...remittance, recipientName: e.target.value })}
                placeholder="Full name as per bank records"
              />
            </div>

            <div>
              <Label htmlFor="recipientBank">Recipient Bank</Label>
              <Input
                id="recipientBank"
                value={remittance.recipientBank}
                onChange={(e) => setRemittance({ ...remittance, recipientBank: e.target.value })}
                placeholder="Bank name"
              />
            </div>

            <div>
              <Label htmlFor="recipientAccount">Bank Account Number</Label>
              <Input
                id="recipientAccount"
                value={remittance.recipientAccount}
                onChange={(e) => setRemittance({ ...remittance, recipientAccount: e.target.value })}
                placeholder="Account number or IBAN"
              />
            </div>
          </div>

          {/* Transfer Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="amount">Send Amount</Label>
              <Input
                id="amount"
                type="number"
                value={remittance.amount}
                onChange={(e) => setRemittance({ ...remittance, amount: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div>
              <Label htmlFor="currency">Send Currency</Label>
              <select
                id="currency"
                value={remittance.currency}
                onChange={(e) => setRemittance({ ...remittance, currency: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>
            </div>

            <div>
              <Label htmlFor="purpose">Transfer Purpose</Label>
              <select
                id="purpose"
                value={remittance.purpose}
                onChange={(e) => setRemittance({ ...remittance, purpose: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Purpose</option>
                {remittancePurposes.map((purpose) => (
                  <option key={purpose} value={purpose}>{purpose}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transfer Summary */}
      {country && amount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Transfer Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="text-blue-600" size={20} />
                  <span className="font-medium text-blue-800">Send Amount</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {amount.toFixed(2)} {remittance.currency}
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="text-orange-600" size={20} />
                  <span className="font-medium text-orange-800">Fees</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {fees.toFixed(2)} {remittance.currency}
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="text-green-600" size={20} />
                  <span className="font-medium text-green-800">Recipient Gets</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {finalAmount.toFixed(2)} {country.currency}
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="text-purple-600" size={20} />
                  <span className="font-medium text-purple-800">Delivery Time</span>
                </div>
                <div className="text-lg font-bold text-purple-600">
                  {deliveryTime}
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">
                Exchange Rate: 1 {remittance.currency} = {exchangeRate.toFixed(4)} {country.currency}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Checks */}
      {complianceChecks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Compliance Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {complianceChecks.map((check, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        check.status === 'passed' ? 'bg-green-100' :
                        check.status === 'warning' ? 'bg-orange-100' : 'bg-red-100'
                      }`}>
                        {getCheckIcon(check.status)}
                      </div>
                      <div>
                        <div className="font-medium">{check.message}</div>
                        <div className="text-sm text-gray-600">{check.action}</div>
                      </div>
                    </div>
                    <Badge className={`${getCheckStatusColor(check.status)} text-white`}>
                      {check.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Send Button */}
      {country && amount > 0 && remittance.recipientName && remittance.recipientAccount && (
        <Card>
          <CardContent className="pt-6">
            <Button
              onClick={processRemittance}
              disabled={processing || complianceChecks.some(c => c.status === 'review')}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
            >
              {processing ? 'Processing...' : `Send ${finalAmount.toFixed(2)} ${country.currency} to ${remittance.recipientName}`}
            </Button>
            
            {complianceChecks.some(c => c.status === 'review') && (
              <p className="text-sm text-red-600 mt-2 text-center">
                Additional verification required before transfer can be processed
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CrossBorderRemittance;
