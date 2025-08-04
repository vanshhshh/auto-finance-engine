
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ExchangeRate {
  pair: string;
  rate: number;
  change24h: number;
  timestamp: string;
}

const RealExchangeRates = () => {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { toast } = useToast();

  const fetchRealRates = async () => {
    setLoading(true);
    try {
      // Using our Supabase edge function with real API
      const response = await fetch('https://xgzlmfbwtfazmobddwgn.supabase.co/functions/v1/exchange-rates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success && data.rates) {
        setRates(data.rates);
        setLastUpdate(new Date());
        
        toast({
          title: "Rates Updated",
          description: "Exchange rates refreshed with live market data.",
          className: "bg-green-600 text-white border-green-700",
        });
      } else {
        throw new Error(data.error || 'Failed to fetch rates');
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      // Fallback to demo data if API fails
      setRates([
        { pair: 'USD/INR', rate: 83.12, change24h: 0.45, timestamp: new Date().toISOString() },
        { pair: 'USD/AED', rate: 3.67, change24h: -0.12, timestamp: new Date().toISOString() },
        { pair: 'EUR/USD', rate: 1.09, change24h: 0.23, timestamp: new Date().toISOString() },
        { pair: 'GBP/USD', rate: 1.27, change24h: -0.18, timestamp: new Date().toISOString() },
        { pair: 'INR/AED', rate: 0.044, change24h: 0.08, timestamp: new Date().toISOString() },
      ]);
      
      toast({
        title: "Using Demo Data",
        description: "Live rates unavailable, showing demo exchange rates.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealRates();
    
    // Update rates every 5 minutes
    const interval = setInterval(fetchRealRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Live Exchange Rates</CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={fetchRealRates}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rates.map((rate) => (
            <div key={rate.pair} className="p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{rate.pair}</span>
                <Badge className={`${
                  rate.change24h >= 0 ? 'bg-green-600' : 'bg-red-600'
                } text-white`}>
                  {rate.change24h >= 0 ? '+' : ''}{rate.change24h.toFixed(2)}%
                </Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {rate.rate.toFixed(rate.rate > 1 ? 2 : 4)}
                </span>
                <div className={`p-2 rounded-full ${
                  rate.change24h >= 0 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {rate.change24h >= 0 ? 
                    <TrendingUp className="text-green-600" size={20} /> : 
                    <TrendingDown className="text-red-600" size={20} />
                  }
                </div>
              </div>
              
              <div className="text-xs text-gray-500 mt-2">
                Updated: {new Date(rate.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-blue-800">
            <RefreshCw size={16} />
            <span className="font-medium">Live Data</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            Exchange rates are updated every 5 minutes using real-time market data.
            Rates shown are for reference only and may vary from actual trading rates.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealExchangeRates;
