
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useWalletData } from '@/hooks/useWalletData';
import { Plus, Pause, Play, Trash2 } from 'lucide-react';

const RuleBuilder = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [conditionType, setConditionType] = useState('');
  const [conditionValue, setConditionValue] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('eINR');
  const [amount, setAmount] = useState('');
  const [targetAddress, setTargetAddress] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { rules } = useWalletData();

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('programmable_rules')
        .insert([{
          user_id: user.id,
          name: ruleName,
          condition_type: conditionType,
          condition_value: parseFloat(conditionValue),
          token_symbol: tokenSymbol,
          amount: parseFloat(amount),
          target_address: targetAddress,
          status: 'active',
        }]);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['rules'] });
      
      toast({
        title: "Rule Created",
        description: "Your programmable rule has been created successfully.",
      });

      // Reset form
      setRuleName('');
      setConditionType('');
      setConditionValue('');
      setAmount('');
      setTargetAddress('');
      setShowCreateForm(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleRuleStatus = async (ruleId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    
    try {
      const { error } = await supabase
        .from('programmable_rules')
        .update({ status: newStatus })
        .eq('id', ruleId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['rules'] });
      
      toast({
        title: `Rule ${newStatus}`,
        description: `Rule has been ${newStatus}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteRule = async (ruleId: string) => {
    try {
      const { error } = await supabase
        .from('programmable_rules')
        .delete()
        .eq('id', ruleId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['rules'] });
      
      toast({
        title: "Rule Deleted",
        description: "Rule has been deleted successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getConditionDescription = (type: string, value: number) => {
    switch (type) {
      case 'fx_rate':
        return `When exchange rate reaches ${value}`;
      case 'time_based':
        return `Every ${value} hours`;
      case 'balance_threshold':
        return `When balance exceeds ${value}`;
      case 'weather':
        return `When temperature is ${value}°C`;
      default:
        return `When condition value is ${value}`;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Programmable Rules</CardTitle>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus size={16} className="mr-2" />
              Create Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <Card className="mb-6 bg-slate-700/30 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white text-lg">Create New Rule</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateRule} className="space-y-4">
                  <div>
                    <Label htmlFor="ruleName">Rule Name</Label>
                    <Input
                      id="ruleName"
                      value={ruleName}
                      onChange={(e) => setRuleName(e.target.value)}
                      placeholder="Enter rule name"
                      className="bg-slate-700 border-slate-600"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="conditionType">Condition Type</Label>
                    <Select value={conditionType} onValueChange={setConditionType} required>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue placeholder="Select condition type" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="fx_rate">FX Rate</SelectItem>
                        <SelectItem value="time_based">Time Based</SelectItem>
                        <SelectItem value="balance_threshold">Balance Threshold</SelectItem>
                        <SelectItem value="weather">Weather</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="conditionValue">Condition Value</Label>
                    <Input
                      id="conditionValue"
                      type="number"
                      step="0.01"
                      value={conditionValue}
                      onChange={(e) => setConditionValue(e.target.value)}
                      placeholder="Enter condition value"
                      className="bg-slate-700 border-slate-600"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="token">Token</Label>
                    <Select value={tokenSymbol} onValueChange={setTokenSymbol}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="eINR">eINR</SelectItem>
                        <SelectItem value="eUSD">eUSD</SelectItem>
                        <SelectItem value="eAED">eAED</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="bg-slate-700 border-slate-600"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="targetAddress">Target Address</Label>
                    <Input
                      id="targetAddress"
                      value={targetAddress}
                      onChange={(e) => setTargetAddress(e.target.value)}
                      placeholder="0x..."
                      className="bg-slate-700 border-slate-600"
                      required
                    />
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1 border-slate-600"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      {loading ? 'Creating...' : 'Create Rule'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {rules.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                No programmable rules yet. Create your first automated rule!
              </div>
            ) : (
              rules.map((rule) => (
                <div
                  key={rule.id}
                  className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-white font-medium">{rule.name}</h3>
                      <Badge variant={rule.status === 'active' ? 'default' : 'secondary'}>
                        {rule.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleRuleStatus(rule.id, rule.status)}
                        className="border-slate-600"
                      >
                        {rule.status === 'active' ? (
                          <Pause size={14} />
                        ) : (
                          <Play size={14} />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteRule(rule.id)}
                        className="border-slate-600 text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-slate-300 mb-2">
                    {getConditionDescription(rule.condition_type, Number(rule.condition_value))}
                  </div>
                  
                  <div className="text-sm text-slate-400">
                    Action: Send {Number(rule.amount).toLocaleString()} {rule.token_symbol} to {rule.target_address.slice(0, 10)}...
                  </div>
                  
                  <div className="text-xs text-slate-500 mt-2">
                    Executed {rule.execution_count} times
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RuleBuilder;
