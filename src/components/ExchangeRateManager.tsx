
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, RefreshCw, Globe, DollarSign, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ExchangeRateManager = () => {
  const [rates, setRates] = useState<any[]>([]);
  const [newRate, setNewRate] = useState({ from: '', to: '', rate: '' });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchExchangeRates();
    // Simulate real-time updates every 30 seconds
    const interval = setInterval(fetchExchangeRates, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchExchangeRates = async () => {
    try {
      const { data } = await supabase
        .from('fx_rates')
        .select('*')
        .order('timestamp', { ascending: false });

      if (data) {
        setRates(data);
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
  };

  const updateExchangeRate = async (pair: string, newRateValue: number) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('fx_rates')
        .insert({
          pair,
          rate: newRateValue,
          timestamp: new Date().toISOString()
        });

      if (error) throw error;

      await fetchExchangeRates();
      toast({
        title: "Rate Updated",
        description: `Exchange rate for ${pair} has been updated.`,
        className: "bg-blue-600 text-white border-blue-700",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update exchange rate.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addNewCurrencyPair = async () => {
    if (!newRate.from || !newRate.to || !newRate.rate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const pair = `${newRate.from}/${newRate.to}`;
    await updateExchangeRate(pair, parseFloat(newRate.rate));
    setNewRate({ from: '', to: '', rate: '' });
  };

  const simulateLiveUpdate = async () => {
    setLoading(true);
    
    // Simulate rate fluctuations
    const pairs = ['INR/USD', 'AED/USD', 'INR/AED', 'EUR/USD', 'GBP/USD'];
    const updates = pairs.map(async (pair) => {
      const currentRate = rates.find(r => r.pair === pair)?.rate || 1;
      const fluctuation = (Math.random() - 0.5) * 0.02; // ±1% fluctuation
      const newRateValue = currentRate * (1 + fluctuation);
      
      return supabase
        .from('fx_rates')
        .insert({
          pair,
          rate: newRateValue,
          timestamp: new Date().toISOString()
        });
    });

    try {
      await Promise.all(updates);
      await fetchExchangeRates();
      toast({
        title: "Rates Updated",
        description: "Live exchange rates have been refreshed.",
        className: "bg-blue-600 text-white border-blue-700",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update live rates.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getLatestRate = (pair: string) => {
    return rates.find(r => r.pair === pair);
  };

  const calculatePriceChange = (pair: string) => {
    const pairRates = rates.filter(r => r.pair === pair).slice(0, 2);
    if (pairRates.length < 2) return { change: 0, percentage: 0 };
    
    const current = parseFloat(pairRates[0].rate);
    const previous = parseFloat(pairRates[1].rate);
    const change = current - previous;
    const percentage = (change / previous) * 100;
    
    return { change, percentage };
  };

  const majorPairs = ['INR/USD', 'AED/USD', 'INR/AED', 'EUR/USD', 'GBP/USD'];

  return (
    <div className="space-y-6">
      {/* Live Rates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {majorPairs.map((pair) => {
          const rate = getLatestRate(pair);
          const priceChange = calculatePriceChange(pair);
          const isPositive = priceChange.change >= 0;
          
          return (
            <Card key={pair} className="border-2">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Globe className="text-blue-600" size={16} />
                    <span className="font-medium">{pair}</span>
                  </div>
                  <Badge className={`${isPositive ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  </Badge>
                </div>
                
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {rate ? parseFloat(rate.rate).toFixed(4) : '0.0000'}
                </div>
                
                <div className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {priceChange.change > 0 ? '+' : ''}{priceChange.change.toFixed(4)} 
                  ({priceChange.percentage > 0 ? '+' : ''}{priceChange.percentage.toFixed(2)}%)
                </div>
                
                <div className="text-xs text-gray-500 mt-2">
                  Last updated: {rate ? new Date(rate.timestamp).toLocaleTimeString() : 'Never'}
                </div>
                
                <Button
                  size="sm"
                  onClick={() => updateExchangeRate(pair, parseFloat(rate?.rate || '1') * (1 + (Math.random() - 0.5) * 0.01))}
                  className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading}
                >
                  Update Rate
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Live Update Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="text-green-600" size={20} />
            Live Rate Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={simulateLiveUpdate}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? <RefreshCw className="animate-spin" size={16} /> : <RefreshCw size={16} />}
              {loading ? 'Updating...' : 'Refresh All Rates'}
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <AlertCircle size={16} />
              Rates auto-refresh every 30 seconds
            </div>
          </div>

          {/* Add New Currency Pair */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Add New Currency Pair</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="fromCurrency">From Currency</Label>
                <Input
                  id="fromCurrency"
                  value={newRate.from}
                  onChange={(e) => setNewRate(prev => ({ ...prev, from: e.target.value.toUpperCase() }))}
                  placeholder="USD"
                  maxLength={3}
                />
              </div>
              
              <div>
                <Label htmlFor="toCurrency">To Currency</Label>
                <Input
                  id="toCurrency"
                  value={newRate.to}
                  onChange={(e) => setNewRate(prev => ({ ...prev, to: e.target.value.toUpperCase() }))}
                  placeholder="INR"
                  maxLength={3}
                />
              </div>
              
              <div>
                <Label htmlFor="exchangeRate">Exchange Rate</Label>
                <Input
                  id="exchangeRate"
                  type="number"
                  step="0.0001"
                  value={newRate.rate}
                  onChange={(e) => setNewRate(prev => ({ ...prev, rate: e.target.value }))}
                  placeholder="83.2500"
                />
              </div>
              
              <div className="flex items-end">
                <Button
                  onClick={addNewCurrencyPair}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading}
                >
                  Add Pair
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rate History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Rate Changes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {rates.slice(0, 20).map((rate, index) => {
              const isRecent = new Date(rate.timestamp) > new Date(Date.now() - 5 * 60 * 1000);
              return (
                <div key={`${rate.id}-${index}`} className={`p-3 rounded-lg border ${isRecent ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <DollarSign size={16} className="text-blue-600" />
                      <span className="font-medium">{rate.pair}</span>
                      <span className="font-mono">{parseFloat(rate.rate).toFixed(4)}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(rate.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExchangeRateManager;
