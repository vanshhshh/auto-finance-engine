
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Activity, Users, Shield } from 'lucide-react';

const AnalyticsDashboard = () => {
  // Mock analytics data
  const transactionData = [
    { month: 'Jan', volume: 45000, transactions: 120 },
    { month: 'Feb', volume: 52000, transactions: 145 },
    { month: 'Mar', volume: 48000, transactions: 135 },
    { month: 'Apr', volume: 61000, transactions: 168 },
    { month: 'May', volume: 55000, transactions: 152 },
    { month: 'Jun', volume: 67000, transactions: 184 },
  ];

  const tokenDistribution = [
    { name: 'eINR', value: 65, color: '#10b981' },
    { name: 'eUSD', value: 25, color: '#3b82f6' },
    { name: 'eAED', value: 10, color: '#f59e0b' },
  ];

  const complianceMetrics = [
    { metric: 'KYC Compliance', value: 98.5, trend: 'up' },
    { metric: 'AML Flags', value: 0.2, trend: 'down' },
    { metric: 'Transaction Success Rate', value: 99.8, trend: 'up' },
    { metric: 'Average Settlement Time', value: 2.3, trend: 'down', unit: 'seconds' },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Volume</p>
                <p className="text-2xl font-bold text-white">₹67,000</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="text-green-400 mr-1" size={16} />
                  <span className="text-green-400 text-sm">+12.5%</span>
                </div>
              </div>
              <DollarSign className="text-blue-400" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active Rules</p>
                <p className="text-2xl font-bold text-white">8</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="text-green-400 mr-1" size={16} />
                  <span className="text-green-400 text-sm">+2 this month</span>
                </div>
              </div>
              <Activity className="text-green-400" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Network Participants</p>
                <p className="text-2xl font-bold text-white">1,247</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="text-green-400 mr-1" size={16} />
                  <span className="text-green-400 text-sm">+5.8%</span>
                </div>
              </div>
              <Users className="text-purple-400" size={32} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Compliance Score</p>
                <p className="text-2xl font-bold text-white">98.5%</p>
                <div className="flex items-center mt-2">
                  <Badge variant="default" className="bg-green-600">
                    Excellent
                  </Badge>
                </div>
              </div>
              <Shield className="text-green-400" size={32} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Transaction Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="volume" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Token Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tokenDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {tokenDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Metrics */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Compliance & Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {complianceMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-slate-400 text-sm mb-2">{metric.metric}</div>
                <div className="text-2xl font-bold text-white mb-2">
                  {metric.value}{metric.unit || '%'}
                </div>
                <div className="flex items-center justify-center">
                  {metric.trend === 'up' ? (
                    <TrendingUp className="text-green-400 mr-1" size={16} />
                  ) : (
                    <TrendingDown className="text-green-400 mr-1" size={16} />
                  )}
                  <span className="text-green-400 text-sm">
                    {metric.trend === 'up' ? 'Improving' : 'Optimized'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
