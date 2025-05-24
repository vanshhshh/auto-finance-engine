
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Play, Pause, Trash2, Settings } from 'lucide-react';
import { useWalletStore } from '@/store/walletStore';
import { useToast } from '@/hooks/use-toast';

const RuleBuilder = () => {
  const [showForm, setShowForm] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [conditionType, setConditionType] = useState('');
  const [conditionValue, setConditionValue] = useState('');
  const [actionToken, setActionToken] = useState('');
  const [actionAmount, setActionAmount] = useState('');
  const [targetAddress, setTargetAddress] = useState('');
  
  const { rules, addRule, toggleRule, deleteRule } = useWalletStore();
  const { toast } = useToast();

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRule = {
      id: Date.now().toString(),
      name: ruleName,
      conditionType,
      conditionValue: parseFloat(conditionValue),
      token: actionToken,
      amount: parseFloat(actionAmount),
      targetAddress,
      status: 'active' as const,
      createdAt: new Date(),
      lastExecuted: null,
      executionCount: 0
    };

    addRule(newRule);
    
    toast({
      title: 'Rule Created',
      description: `Programmable rule "${ruleName}" has been created and activated.`,
    });

    // Reset form
    setRuleName('');
    setConditionType('');
    setConditionValue('');
    setActionToken('');
    setActionAmount('');
    setTargetAddress('');
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Programmable Payment Rules</CardTitle>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus size={16} className="mr-2" />
              Create Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showForm && (
            <form onSubmit={handleCreateRule} className="space-y-4 mb-6 p-4 bg-slate-700/30 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ruleName">Rule Name</Label>
                  <Input
                    id="ruleName"
                    value={ruleName}
                    onChange={(e) => setRuleName(e.target.value)}
                    placeholder="e.g., Auto-convert on high FX"
                    className="bg-slate-600 border-slate-500 text-white"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="conditionType">Trigger Condition</Label>
                  <Select value={conditionType} onValueChange={setConditionType}>
                    <SelectTrigger className="bg-slate-600 border-slate-500">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="fx_rate">FX Rate</SelectItem>
                      <SelectItem value="time_based">Time Based</SelectItem>
                      <SelectItem value="balance_threshold">Balance Threshold</SelectItem>
                      <SelectItem value="weather">Weather Oracle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="conditionValue">Threshold Value</Label>
                  <Input
                    id="conditionValue"
                    type="number"
                    step="0.0001"
                    value={conditionValue}
                    onChange={(e) => setConditionValue(e.target.value)}
                    placeholder="e.g., 0.045"
                    className="bg-slate-600 border-slate-500 text-white"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="actionToken">Action Token</Label>
                  <Select value={actionToken} onValueChange={setActionToken}>
                    <SelectTrigger className="bg-slate-600 border-slate-500">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="eINR">eINR (₹)</SelectItem>
                      <SelectItem value="eUSD">eUSD ($)</SelectItem>
                      <SelectItem value="eAED">eAED (د.إ)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="actionAmount">Amount</Label>
                  <Input
                    id="actionAmount"
                    type="number"
                    value={actionAmount}
                    onChange={(e) => setActionAmount(e.target.value)}
                    placeholder="1000"
                    className="bg-slate-600 border-slate-500 text-white"
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
                    className="bg-slate-600 border-slate-500 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="border-slate-600 text-white hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                >
                  Create Rule
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {rules.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                No programmable rules yet. Create your first automated payment rule!
              </div>
            ) : (
              rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-600/50 rounded-full">
                      <Settings className="text-blue-400" size={16} />
                    </div>
                    <div>
                      <div className="font-medium text-white">{rule.name}</div>
                      <div className="text-sm text-slate-400">
                        When {rule.conditionType} {'>'} {rule.conditionValue} → Send {rule.amount} {rule.token}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Executed {rule.executionCount} times
                        {rule.lastExecuted && ` • Last: ${rule.lastExecuted.toLocaleString()}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className={rule.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}>
                      {rule.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleRule(rule.id)}
                      className="text-slate-400 hover:text-white"
                    >
                      {rule.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteRule(rule.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </Button>
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
