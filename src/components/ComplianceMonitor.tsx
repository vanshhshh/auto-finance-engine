
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle, Clock, Eye } from 'lucide-react';

interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  status: 'compliant' | 'warning' | 'violation';
  lastChecked: string;
  threshold: number;
  currentValue: number;
  category: 'kyc' | 'aml' | 'transaction' | 'reporting';
}

const ComplianceMonitor = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const complianceRules: ComplianceRule[] = [
    {
      id: '1',
      name: 'Daily Transaction Limit',
      description: 'Maximum daily transaction volume per user',
      status: 'compliant',
      lastChecked: '2 mins ago',
      threshold: 100000,
      currentValue: 67000,
      category: 'transaction',
    },
    {
      id: '2',
      name: 'KYC Verification Rate',
      description: 'Percentage of users with completed KYC',
      status: 'compliant',
      lastChecked: '5 mins ago',
      threshold: 95,
      currentValue: 98.5,
      category: 'kyc',
    },
    {
      id: '3',
      name: 'Suspicious Activity Detection',
      description: 'AML monitoring for unusual patterns',
      status: 'warning',
      lastChecked: '1 min ago',
      threshold: 1,
      currentValue: 2.3,
      category: 'aml',
    },
    {
      id: '4',
      name: 'Transaction Reporting',
      description: 'Regulatory reporting compliance',
      status: 'compliant',
      lastChecked: '10 mins ago',
      threshold: 99,
      currentValue: 100,
      category: 'reporting',
    },
    {
      id: '5',
      name: 'Cross-border Transaction Monitoring',
      description: 'International transfer compliance',
      status: 'compliant',
      lastChecked: '3 mins ago',
      threshold: 100,
      currentValue: 97.8,
      category: 'transaction',
    },
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'kyc', label: 'KYC' },
    { value: 'aml', label: 'AML' },
    { value: 'transaction', label: 'Transaction' },
    { value: 'reporting', label: 'Reporting' },
  ];

  const filteredRules = selectedCategory === 'all' 
    ? complianceRules 
    : complianceRules.filter(rule => rule.category === selectedCategory);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="text-green-400" size={20} />;
      case 'warning': return <AlertTriangle className="text-yellow-400" size={20} />;
      case 'violation': return <AlertTriangle className="text-red-400" size={20} />;
      default: return <Clock className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-600';
      case 'warning': return 'bg-yellow-600';
      case 'violation': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'violation': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const overallComplianceScore = complianceRules.reduce((acc, rule) => {
    const weight = rule.status === 'compliant' ? 1 : rule.status === 'warning' ? 0.7 : 0.3;
    return acc + weight;
  }, 0) / complianceRules.length * 100;

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="text-blue-400" size={24} />
              Compliance Dashboard
            </CardTitle>
            <Badge className={`${getStatusColor(overallComplianceScore > 90 ? 'compliant' : overallComplianceScore > 70 ? 'warning' : 'violation')} text-white`}>
              Score: {overallComplianceScore.toFixed(1)}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {complianceRules.filter(r => r.status === 'compliant').length}
              </div>
              <div className="text-sm text-slate-400">Compliant Rules</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {complianceRules.filter(r => r.status === 'warning').length}
              </div>
              <div className="text-sm text-slate-400">Warnings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {complianceRules.filter(r => r.status === 'violation').length}
              </div>
              <div className="text-sm text-slate-400">Violations</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Overall Compliance Score</span>
              <span>{overallComplianceScore.toFixed(1)}%</span>
            </div>
            <Progress 
              value={overallComplianceScore} 
              className="h-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={selectedCategory === category.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.value)}
            className={selectedCategory === category.value 
              ? "bg-blue-600 hover:bg-blue-700" 
              : "border-slate-600 text-white hover:bg-slate-700"
            }
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Compliance Rules */}
      <div className="space-y-4">
        {filteredRules.map((rule) => (
          <Card key={rule.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  {getStatusIcon(rule.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-medium">{rule.name}</h3>
                      <Badge className={`${getStatusColor(rule.status)} text-white text-xs`}>
                        {rule.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{rule.description}</p>
                    <div className="text-xs text-slate-500">
                      Last checked: {rule.lastChecked}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-slate-600 text-white hover:bg-slate-700"
                >
                  <Eye size={14} className="mr-1" />
                  Details
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Current Value</span>
                  <span className="text-white">
                    {rule.currentValue}{rule.category === 'transaction' ? ' eINR' : '%'} / {rule.threshold}{rule.category === 'transaction' ? ' eINR' : '%'}
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getProgressColor(rule.status)}`}
                    style={{ 
                      width: `${Math.min((rule.currentValue / rule.threshold) * 100, 100)}%` 
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ComplianceMonitor;
