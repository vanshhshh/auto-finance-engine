
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  RefreshCw, 
  Clock, 
  Calculator,
  ArrowUpDown,
  Globe,
  Zap,
  ChevronRight
} from 'lucide-react';
import { ModernNavbar } from '@/components/ModernNavbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';

const Exchange = () => {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [amount, setAmount] = useState('1000');
  const [exchangeRates, setExchangeRates] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', rate: 1.0000, change: 0 },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', rate: 0.9234, change: 0.15 },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', rate: 0.7891, change: -0.08 },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', rate: 83.1245, change: 0.22 },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪', rate: 3.6729, change: -0.05 },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', rate: 1.3456, change: 0.11 },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦', rate: 1.3567, change: 0.18 },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', rate: 1.5234, change: -0.12 },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', rate: 149.8765, change: 0.33 },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭', rate: 0.8987, change: 0.07 }
  ];

  const popularPairs = [
    { from: 'USD', to: 'INR', rate: 83.12, change: 0.22 },
    { from: 'USD', to: 'EUR', rate: 0.92, change: 0.15 },
    { from: 'USD', to: 'GBP', rate: 0.79, change: -0.08 },
    { from: 'USD', to: 'AED', rate: 3.67, change: -0.05 },
    { from: 'EUR', to: 'USD', rate: 1.08, change: -0.15 },
    { from: 'GBP', to: 'USD', rate: 1.27, change: 0.08 }
  ];

  const getExchangeRate = (from: string, to: string) => {
    const fromRate = currencies.find(c => c.code === from)?.rate || 1;
    const toRate = currencies.find(c => c.code === to)?.rate || 1;
    return (toRate / fromRate);
  };

  const getConvertedAmount = () => {
    const rate = getExchangeRate(fromCurrency, toCurrency);
    return (parseFloat(amount) * rate).toFixed(2);
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleExchange = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Exchange Completed",
        description: `Successfully exchanged ${amount} ${fromCurrency} to ${getConvertedAmount()} ${toCurrency}`,
        className: "bg-green-600 text-white border-green-700",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernNavbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Currency Exchange</h1>
            <p className="text-xl text-gray-600">Get the best exchange rates with zero hidden fees</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Exchange Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Exchange Calculator</span>
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Live Rates
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* From Currency */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-700">You have</label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="text-3xl font-bold h-20 pl-16 pr-4"
                        placeholder="0.00"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <span className="text-2xl">
                          {currencies.find(c => c.code === fromCurrency)?.flag}
                        </span>
                      </div>
                    </div>
                    
                    <select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {currencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.flag} {currency.code} - {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Swap Button */}
                  <div className="flex justify-center">
                    <Button
                      onClick={swapCurrencies}
                      variant="outline"
                      size="lg"
                      className="rounded-full w-12 h-12 p-0 border-2 border-blue-600 hover:bg-blue-50"
                    >
                      <ArrowUpDown className="w-5 h-5 text-blue-600" />
                    </Button>
                  </div>

                  {/* To Currency */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-700">You get</label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={getConvertedAmount()}
                        readOnly
                        className="text-3xl font-bold h-20 pl-16 pr-4 bg-green-50 border-green-200"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <span className="text-2xl">
                          {currencies.find(c => c.code === toCurrency)?.flag}
                        </span>
                      </div>
                    </div>
                    
                    <select
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {currencies.map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.flag} {currency.code} - {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Exchange Rate Info */}
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calculator className="w-5 h-5 text-blue-600" />
                        <span className="text-blue-800 font-medium">Exchange Rate</span>
                      </div>
                      <div className="text-right">
                        <div className="text-blue-900 font-bold">
                          1 {fromCurrency} = {getExchangeRate(fromCurrency, toCurrency).toFixed(4)} {toCurrency}
                        </div>
                        <div className="text-blue-700 text-sm">Updated: Just now</div>
                      </div>
                    </div>
                  </div>

                  {/* Exchange Button */}
                  <Button
                    onClick={handleExchange}
                    disabled={loading || !amount}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-14 text-lg font-semibold"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Processing Exchange...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Zap className="w-5 h-5" />
                        <span>Exchange Now</span>
                      </div>
                    )}
                  </Button>

                  {/* Features */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Globe className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-sm font-medium">Real-time Rates</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Zap className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <div className="text-sm font-medium">Instant Exchange</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <Calculator className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-sm font-medium">No Hidden Fees</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Popular Pairs */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Popular Currency Pairs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {popularPairs.map((pair, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setFromCurrency(pair.from);
                          setToCurrency(pair.to);
                        }}
                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-sm font-medium">
                            {pair.from}/{pair.to}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{pair.rate}</div>
                          <div className={`text-xs flex items-center ${
                            pair.change >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {pair.change >= 0 ? 
                              <TrendingUp className="w-3 h-3 mr-1" /> : 
                              <TrendingDown className="w-3 h-3 mr-1" />
                            }
                            {Math.abs(pair.change)}%
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Live Rates */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-lg">
                    <span>Live Exchange Rates</span>
                    <Clock className="w-4 h-4 text-gray-400" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currencies.slice(0, 6).map((currency, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{currency.flag}</span>
                          <div>
                            <div className="font-medium text-sm">{currency.code}</div>
                            <div className="text-xs text-gray-500">{currency.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">{currency.rate.toFixed(4)}</div>
                          <div className={`text-xs flex items-center justify-end ${
                            currency.change >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {currency.change >= 0 ? 
                              <TrendingUp className="w-3 h-3 mr-1" /> : 
                              <TrendingDown className="w-3 h-3 mr-1" />
                            }
                            {Math.abs(currency.change)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4">
                    View All Rates
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>

              {/* Market Insights */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Market Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-800">USD Strong</span>
                      </div>
                      <p className="text-green-700">US Dollar strengthens against major currencies today.</p>
                    </div>
                    
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-800">Market Update</span>
                      </div>
                      <p className="text-blue-700">Central bank decisions affecting EUR/USD pair this week.</p>
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

export default Exchange;
