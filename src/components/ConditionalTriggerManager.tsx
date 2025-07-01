
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useCBDCAccounts } from '@/hooks/useCBDCAccounts';
import { useConditionalTriggers } from '@/hooks/useConditionalTriggers';
import { Plus, Clock, Cloud, TrendingUp, MapPin, Zap, Play, Pause } from 'lucide-react';

export const ConditionalTriggerManager = () => {
  const { accounts } = useCBDCAccounts();
  const { triggers, isLoading, createTrigger, updateTriggerStatus } = useConditionalTriggers();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [triggerForm, setTriggerForm] = useState({
    account_id: '',
    trigger_type: 'time_based' as 'time_based' | 'weather' | 'fx_rate' | 'geo_location' | 'oracle',
    conditions: '',
    action_type: 'payment' as 'payment' | 'lock' | 'unlock' | 'split_pay',
    action_config: '',
  });

  const handleCreateTrigger = async () => {
    if (!triggerForm.account_id || !triggerForm.conditions || !triggerForm.action_config) return;
    
    const triggerData = {
      account_id: triggerForm.account_id,
      trigger_type: triggerForm.trigger_type,
      conditions: JSON.parse(triggerForm.conditions),
      action_type: triggerForm.action_type,
      action_config: JSON.parse(triggerForm.action_config),
    };
    
    await createTrigger.mutateAsync(triggerData);
    setIsCreateDialogOpen(false);
    setTriggerForm({
      account_id: '',
      trigger_type: 'time_based',
      conditions: '',
      action_type: 'payment',
      action_config: '',
    });
  };

  const getTriggerIcon = (triggerType: string) => {
    switch (triggerType) {
      case 'time_based': return <Clock className="w-4 h-4" />;
      case 'weather': return <Cloud className="w-4 h-4" />;
      case 'fx_rate': return <TrendingUp className="w-4 h-4" />;
      case 'geo_location': return <MapPin className="w-4 h-4" />;
      case 'oracle': return <Zap className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'executed': return 'bg-blue-100 text-blue-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExampleConditions = (triggerType: string) => {
    switch (triggerType) {
      case 'time_based':
        return '{"schedule": "0 9 * * 1", "timezone": "UTC", "description": "Every Monday at 9 AM"}';
      case 'weather':
        return '{"location": "New York", "temperature": ">30", "condition": "sunny"}';
      case 'fx_rate':
        return '{"pair": "USD/EUR", "rate": "<0.85", "direction": "below"}';
      case 'geo_location':
        return '{"latitude": 40.7128, "longitude": -74.0060, "radius": 100, "action": "enter"}';
      case 'oracle':
        return '{"oracle_url": "https://api.example.com/data", "field": "price", "condition": ">100"}';
      default:
        return '{}';
    }
  };

  const getExampleActionConfig = (actionType: string) => {
    switch (actionType) {
      case 'payment':
        return '{"recipient": "0x123...", "amount": 100, "token": "eUSD", "description": "Automated payment"}';
      case 'lock':
        return '{"amount": 500, "token": "eINR", "lock_type": "two_party", "recipient": "pip_123"}';
      case 'unlock':
        return '{"lock_id": "lock_123", "conditions_met": true}';
      case 'split_pay':
        return '{"total_amount": 1000, "recipients": [{"pip": "pip_1", "amount": 600}, {"pip": "pip_2", "amount": 400}]}';
      default:
        return '{}';
    }
  };

  if (isLoading) return <div>Loading conditional triggers...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Conditional Triggers</h2>
          <p className="text-gray-600">Automate payments based on time, weather, FX rates, location, or oracle data</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Trigger
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create Conditional Trigger</DialogTitle>
              <DialogDescription>
                Set up automated actions based on external conditions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <Label>Account</Label>
                <Select value={triggerForm.account_id} onValueChange={(value) => setTriggerForm({ ...triggerForm, account_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.filter(acc => acc.status === 'active').map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.account_type} - {account.country_code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Trigger Type</Label>
                  <Select
                    value={triggerForm.trigger_type}
                    onValueChange={(value: 'time_based' | 'weather' | 'fx_rate' | 'geo_location' | 'oracle') => {
                      setTriggerForm({ 
                        ...triggerForm, 
                        trigger_type: value,
                        conditions: getExampleConditions(value)
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="time_based">Time-based</SelectItem>
                      <SelectItem value="weather">Weather</SelectItem>
                      <SelectItem value="fx_rate">FX Rate</SelectItem>
                      <SelectItem value="geo_location">Geo Location</SelectItem>
                      <SelectItem value="oracle">Oracle Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Action Type</Label>
                  <Select
                    value={triggerForm.action_type}
                    onValueChange={(value: 'payment' | 'lock' | 'unlock' | 'split_pay') => {
                      setTriggerForm({ 
                        ...triggerForm, 
                        action_type: value,
                        action_config: getExampleActionConfig(value)
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="payment">Payment</SelectItem>
                      <SelectItem value="lock">Lock Funds</SelectItem>
                      <SelectItem value="unlock">Unlock Funds</SelectItem>
                      <SelectItem value="split_pay">Split Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Trigger Conditions (JSON)</Label>
                <Textarea
                  value={triggerForm.conditions}
                  onChange={(e) => setTriggerForm({ ...triggerForm, conditions: e.target.value })}
                  placeholder={getExampleConditions(triggerForm.trigger_type)}
                  className="font-mono text-sm"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Define when this trigger should activate
                </p>
              </div>

              <div>
                <Label>Action Configuration (JSON)</Label>
                <Textarea
                  value={triggerForm.action_config}
                  onChange={(e) => setTriggerForm({ ...triggerForm, action_config: e.target.value })}
                  placeholder={getExampleActionConfig(triggerForm.action_type)}
                  className="font-mono text-sm"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Configure what happens when the trigger activates
                </p>
              </div>

              <Button onClick={handleCreateTrigger} className="w-full">
                Create Trigger
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {triggers.map((trigger) => (
          <Card key={trigger.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                {getTriggerIcon(trigger.trigger_type)}
                <div>
                  <CardTitle className="text-lg">
                    {trigger.trigger_type.replace('_', ' ').toUpperCase()} Trigger
                  </CardTitle>
                  <CardDescription>
                    {trigger.action_type.replace('_', ' ').toUpperCase()} action • Created {new Date(trigger.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(trigger.status)}>
                  {trigger.status}
                </Badge>
                {trigger.status === 'active' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateTriggerStatus.mutate({ triggerId: trigger.id, status: 'paused' })}
                  >
                    <Pause className="w-4 h-4 mr-1" />
                    Pause
                  </Button>
                )}
                {trigger.status === 'paused' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateTriggerStatus.mutate({ triggerId: trigger.id, status: 'active' })}
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Resume
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <span className="font-medium text-sm">Trigger Conditions:</span>
                  <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-x-auto">
                    {JSON.stringify(trigger.conditions, null, 2)}
                  </pre>
                </div>
                <div>
                  <span className="font-medium text-sm">Action Configuration:</span>
                  <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-x-auto">
                    {JSON.stringify(trigger.action_config, null, 2)}
                  </pre>
                </div>
                {trigger.last_executed && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    Last executed: {new Date(trigger.last_executed).toLocaleString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {triggers.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500">No conditional triggers found. Create your first automated trigger.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
