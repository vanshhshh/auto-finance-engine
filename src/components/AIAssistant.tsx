
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Brain, AlertTriangle, TrendingUp, Clock, Shield, Zap } from 'lucide-react';

interface AIInsight {
  id: string;
  type: 'fraud_alert' | 'rate_suggestion' | 'optimization' | 'risk_warning';
  title: string;
  description: string;
  confidence: number;
  action?: string;
  timestamp: string;
}

const AIAssistant = () => {
  const [query, setQuery] = useState('');
  const [insights, setInsights] = useState<AIInsight[]>([
    {
      id: '1',
      type: 'rate_suggestion',
      title: 'Optimal Send Time for eUSD to UAE',
      description: 'Based on historical data, sending eUSD to UAE between 2-4 PM GMT shows 12% better exchange rates.',
      confidence: 87,
      action: 'Set reminder for 2 PM GMT',
      timestamp: new Date(Date.now() - 300000).toISOString(),
    },
    {
      id: '2',
      type: 'fraud_alert',
      title: 'Unusual Transaction Pattern Detected',
      description: 'Recent transaction to 0x1234...5678 shows patterns similar to known phishing addresses.',
      confidence: 94,
      action: 'Review transaction',
      timestamp: new Date(Date.now() - 600000).toISOString(),
    },
    {
      id: '3',
      type: 'optimization',
      title: 'Rule Optimization Suggestion',
      description: 'Your auto-payment rule could save 15% in fees by bundling transactions.',
      confidence: 72,
      action: 'Optimize rule',
      timestamp: new Date(Date.now() - 900000).toISOString(),
    },
  ]);

  const handleQuery = async () => {
    if (!query.trim()) return;

    // Simulate AI processing
    const responses: Record<string, AIInsight> = {
      'fraud': {
        id: Date.now().toString(),
        type: 'fraud_alert',
        title: 'Fraud Risk Assessment',
        description: 'Your recent transactions show low risk. Maintain current security practices.',
        confidence: 91,
        timestamp: new Date().toISOString(),
      },
      'rate': {
        id: Date.now().toString(),
        type: 'rate_suggestion',
        title: 'Exchange Rate Analysis',
        description: 'eINR/eUSD rates are expected to be favorable in the next 2-3 hours.',
        confidence: 78,
        timestamp: new Date().toISOString(),
      },
      'time': {
        id: Date.now().toString(),
        type: 'rate_suggestion',
        title: 'Best Time to Send',
        description: 'For UAE transactions, 10 AM - 2 PM UAE time typically offers the best rates and fastest processing.',
        confidence: 85,
        timestamp: new Date().toISOString(),
      },
    };

    let response = responses['rate']; // default
    if (query.toLowerCase().includes('fraud')) response = responses['fraud'];
    if (query.toLowerCase().includes('time') || query.toLowerCase().includes('when')) response = responses['time'];

    setInsights(prev => [response, ...prev]);
    setQuery('');
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'fraud_alert': return <AlertTriangle className="text-red-400" size={16} />;
      case 'rate_suggestion': return <TrendingUp className="text-green-400" size={16} />;
      case 'optimization': return <Zap className="text-yellow-400" size={16} />;
      case 'risk_warning': return <Shield className="text-orange-400" size={16} />;
      default: return <Brain className="text-blue-400" size={16} />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'fraud_alert': return 'border-red-500/30 bg-red-600/10';
      case 'rate_suggestion': return 'border-green-500/30 bg-green-600/10';
      case 'optimization': return 'border-yellow-500/30 bg-yellow-600/10';
      case 'risk_warning': return 'border-orange-500/30 bg-orange-600/10';
      default: return 'border-blue-500/30 bg-blue-600/10';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="text-blue-400" size={20} />
          <CardTitle className="text-white">AI Assistant</CardTitle>
          <Badge className="bg-gradient-to-r from-blue-600 to-purple-600">Smart</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Query Interface */}
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask me anything... e.g., 'What time is best to send eUSD to UAE?'"
            className="bg-slate-700 border-slate-600 text-white"
            onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
          />
          <Button
            onClick={handleQuery}
            disabled={!query.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Ask AI
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setQuery('Check fraud risk for my recent transactions')}
            className="border-slate-600 text-slate-300"
          >
            <Shield size={14} className="mr-1" />
            Fraud Check
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setQuery('What time is best to send eUSD to UAE?')}
            className="border-slate-600 text-slate-300"
          >
            <Clock size={14} className="mr-1" />
            Best Send Time
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setQuery('Optimize my payment rules')}
            className="border-slate-600 text-slate-300"
          >
            <Zap size={14} className="mr-1" />
            Optimize Rules
          </Button>
        </div>

        {/* AI Insights */}
        <div className="space-y-3">
          <h3 className="text-white font-medium">Recent Insights</h3>
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`p-3 rounded-lg border ${getInsightColor(insight.type)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getInsightIcon(insight.type)}
                  <span className="text-white font-medium text-sm">
                    {insight.title}
                  </span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {insight.confidence}% confidence
                </Badge>
              </div>
              
              <p className="text-slate-300 text-sm mb-2">
                {insight.description}
              </p>
              
              <div className="flex items-center justify-between">
                {insight.action && (
                  <Button size="sm" variant="outline" className="border-slate-600 text-xs">
                    {insight.action}
                  </Button>
                )}
                <span className="text-xs text-slate-500">
                  {new Date(insight.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIAssistant;
