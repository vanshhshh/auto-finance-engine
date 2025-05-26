
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle, Clock, Eye } from 'lucide-react';
import { useWalletData } from '@/hooks/useWalletData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ComplianceMonitor = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { complianceEvents, profile } = useWalletData();
  const { toast } = useToast();

  const categories = [
    { value: 'all', label: 'All Events' },
    { value: 'kyc_verification', label: 'KYC' },
    { value: 'aml_flag', label: 'AML' },
    { value: 'suspicious_activity', label: 'Suspicious Activity' },
    { value: 'limit_breach', label: 'Limit Breach' },
    { value: 'compliance_check', label: 'Compliance Check' },
  ];

  const filteredEvents = selectedCategory === 'all' 
    ? complianceEvents 
    : complianceEvents.filter(event => event.event_type === selectedCategory);

  const getStatusIcon = (severity: string) => {
    switch (severity) {
      case 'low': return <CheckCircle className="text-green-400" size={20} />;
      case 'medium': return <AlertTriangle className="text-yellow-400" size={20} />;
      case 'high': return <AlertTriangle className="text-orange-400" size={20} />;
      case 'critical': return <AlertTriangle className="text-red-400" size={20} />;
      default: return <Clock className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-600';
      case 'medium': return 'bg-yellow-600';
      case 'high': return 'bg-orange-600';
      case 'critical': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const resolveEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('compliance_events')
        .update({ 
          resolved: true, 
          resolved_at: new Date().toISOString(),
          resolved_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', eventId);

      if (error) throw error;

      toast({
        title: "Event Resolved",
        description: "Compliance event has been marked as resolved.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resolve compliance event.",
        variant: "destructive",
      });
    }
  };

  // Calculate compliance score
  const criticalEvents = complianceEvents.filter(e => e.severity === 'critical' && !e.resolved).length;
  const highEvents = complianceEvents.filter(e => e.severity === 'high' && !e.resolved).length;
  const mediumEvents = complianceEvents.filter(e => e.severity === 'medium' && !e.resolved).length;
  
  const complianceScore = Math.max(0, 100 - (criticalEvents * 30) - (highEvents * 15) - (mediumEvents * 5));

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
            <div className="flex items-center gap-4">
              <Badge className={`${complianceScore > 80 ? 'bg-green-600' : complianceScore > 60 ? 'bg-yellow-600' : 'bg-red-600'} text-white`}>
                Score: {complianceScore}%
              </Badge>
              <Badge variant="outline" className="border-slate-600 text-slate-300">
                KYC: {profile?.kyc_status || 'pending'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {complianceEvents.filter(e => e.severity === 'low').length}
              </div>
              <div className="text-sm text-slate-400">Low Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {mediumEvents}
              </div>
              <div className="text-sm text-slate-400">Medium Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-1">
                {highEvents}
              </div>
              <div className="text-sm text-slate-400">High Risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400 mb-1">
                {criticalEvents}
              </div>
              <div className="text-sm text-slate-400">Critical</div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-slate-400 mb-2">
              <span>Compliance Score</span>
              <span>{complianceScore}%</span>
            </div>
            <Progress value={complianceScore} className="h-2" />
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

      {/* Compliance Events */}
      <div className="space-y-4">
        {filteredEvents.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="text-slate-400">No compliance events found</div>
            </CardContent>
          </Card>
        ) : (
          filteredEvents.map((event) => (
            <Card key={event.id} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(event.severity)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-medium capitalize">
                          {event.event_type.replace('_', ' ')}
                        </h3>
                        <Badge className={`${getStatusColor(event.severity)} text-white text-xs`}>
                          {event.severity.toUpperCase()}
                        </Badge>
                        {event.resolved && (
                          <Badge className="bg-green-600 text-white text-xs">
                            RESOLVED
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm mb-2">{event.description}</p>
                      <div className="text-xs text-slate-500">
                        {new Date(event.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!event.resolved && (
                      <Button
                        size="sm"
                        onClick={() => resolveEvent(event.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle size={14} className="mr-1" />
                        Resolve
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-white hover:bg-slate-700"
                    >
                      <Eye size={14} className="mr-1" />
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ComplianceMonitor;
