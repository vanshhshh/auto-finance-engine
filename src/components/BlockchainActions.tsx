import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Play, Pause, Trash2, Eye, Settings, AlertCircle, CheckCircle } from 'lucide-react';
import { 
  useMintToken, 
  useBurnToken, 
  useTransferToken, 
  useCreateRule, 
  useUpdateOracleData 
} from '@/hooks/useBlockchain';
import { useCreateAutomatedRule } from '@/hooks/useRuleAutomation';
import { useToast } from '@/hooks/use-toast';

interface RuleCondition {
  type: 'fx_rate' | 'time' | 'weather' | 'location' | 'balance';
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'in' | 'between';
  value: any;
  currency_pair?: string;
  location_zone?: string;
  weather_condition?: string;
  token_symbol?: string;
}

interface RuleAction {
  type: 'transfer' | 'mint' | 'burn' | 'notify' | 'freeze' | 'split_payment';
  amount?: string;
  recipient?: string;
  token_symbol?: string;
  message?: string;
  recipients?: Array<{ address: string; amount: string }>;
}

export const BlockchainActions = () => {
  const { toast } = useToast();
  
  // Blockchain mutations
  const mintToken = useMintToken();
  const burnToken = useBurnToken();
  const transferToken = useTransferToken();
  const createRule = useCreateRule();
  const updateOracle = useUpdateOracleData();
  const createAutomatedRule = useCreateAutomatedRule();

  // State for forms
  const [mintForm, setMintForm] = useState({ tokenSymbol: 'eINR', to: '', amount: '' });
  const [burnForm, setBurnForm] = useState({ tokenSymbol: 'eINR', from: '', amount: '' });
  const [transferForm, setTransferForm] = useState({ tokenSymbol: 'eINR', to: '', amount: '' });
  const [oracleForm, setOracleForm] = useState({ dataType: '', value: '' });

  const handleMint = () => {
    if (!mintForm.to || !mintForm.amount) {
      toast({
        title: "Invalid Input",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    mintToken.mutate({
      tokenSymbol: mintForm.tokenSymbol as 'eINR' | 'eUSD' | 'eAED',
      to: mintForm.to,
      amount: mintForm.amount
    });
  };

  const handleBurn = () => {
    if (!burnForm.from || !burnForm.amount) {
      toast({
        title: "Invalid Input",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    burnToken.mutate({
      tokenSymbol: burnForm.tokenSymbol as 'eINR' | 'eUSD' | 'eAED',
      from: burnForm.from,
      amount: burnForm.amount
    });
  };

  const handleTransfer = () => {
    if (!transferForm.to || !transferForm.amount) {
      toast({
        title: "Invalid Input",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    transferToken.mutate({
      tokenSymbol: transferForm.tokenSymbol as 'eINR' | 'eUSD' | 'eAED',
      to: transferForm.to,
      amount: transferForm.amount
    });
  };

  const handleOracleUpdate = () => {
    if (!oracleForm.dataType || !oracleForm.value) {
      toast({
        title: "Invalid Input",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    updateOracle.mutate({
      dataType: oracleForm.dataType,
      value: oracleForm.value
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Mint Tokens */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Mint Tokens
            </CardTitle>
            <CardDescription>Create new CBDC tokens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mint-token">Token Type</Label>
              <Select value={mintForm.tokenSymbol} onValueChange={(value) => setMintForm({...mintForm, tokenSymbol: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eINR">eINR (Indian Rupee)</SelectItem>
                  <SelectItem value="eUSD">eUSD (US Dollar)</SelectItem>
                  <SelectItem value="eAED">eAED (UAE Dirham)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mint-to">Recipient Address</Label>
              <Input
                id="mint-to"
                placeholder="0x..."
                value={mintForm.to}
                onChange={(e) => setMintForm({...mintForm, to: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mint-amount">Amount</Label>
              <Input
                id="mint-amount"
                type="number"
                placeholder="0.00"
                value={mintForm.amount}
                onChange={(e) => setMintForm({...mintForm, amount: e.target.value})}
              />
            </div>
            
            <Button 
              onClick={handleMint} 
              disabled={mintToken.isPending} 
              className="w-full"
            >
              {mintToken.isPending ? 'Minting...' : 'Mint Tokens'}
            </Button>
          </CardContent>
        </Card>

        {/* Burn Tokens */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Burn Tokens
            </CardTitle>
            <CardDescription>Destroy CBDC tokens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="burn-token">Token Type</Label>
              <Select value={burnForm.tokenSymbol} onValueChange={(value) => setBurnForm({...burnForm, tokenSymbol: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eINR">eINR (Indian Rupee)</SelectItem>
                  <SelectItem value="eUSD">eUSD (US Dollar)</SelectItem>
                  <SelectItem value="eAED">eAED (UAE Dirham)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="burn-from">From Address</Label>
              <Input
                id="burn-from"
                placeholder="0x..."
                value={burnForm.from}
                onChange={(e) => setBurnForm({...burnForm, from: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="burn-amount">Amount</Label>
              <Input
                id="burn-amount"
                type="number"
                placeholder="0.00"
                value={burnForm.amount}
                onChange={(e) => setBurnForm({...burnForm, amount: e.target.value})}
              />
            </div>
            
            <Button 
              onClick={handleBurn} 
              disabled={burnToken.isPending} 
              variant="destructive"
              className="w-full"
            >
              {burnToken.isPending ? 'Burning...' : 'Burn Tokens'}
            </Button>
          </CardContent>
        </Card>

        {/* Transfer Tokens */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Transfer Tokens
            </CardTitle>
            <CardDescription>Send CBDC tokens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transfer-token">Token Type</Label>
              <Select value={transferForm.tokenSymbol} onValueChange={(value) => setTransferForm({...transferForm, tokenSymbol: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eINR">eINR (Indian Rupee)</SelectItem>
                  <SelectItem value="eUSD">eUSD (US Dollar)</SelectItem>
                  <SelectItem value="eAED">eAED (UAE Dirham)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transfer-to">Recipient Address</Label>
              <Input
                id="transfer-to"
                placeholder="0x..."
                value={transferForm.to}
                onChange={(e) => setTransferForm({...transferForm, to: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="transfer-amount">Amount</Label>
              <Input
                id="transfer-amount"
                type="number"
                placeholder="0.00"
                value={transferForm.amount}
                onChange={(e) => setTransferForm({...transferForm, amount: e.target.value})}
              />
            </div>
            
            <Button 
              onClick={handleTransfer} 
              disabled={transferToken.isPending} 
              className="w-full"
            >
              {transferToken.isPending ? 'Transferring...' : 'Transfer Tokens'}
            </Button>
          </CardContent>
        </Card>

        {/* Oracle Data Update */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Update Oracle Data
            </CardTitle>
            <CardDescription>Update blockchain oracle information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="oracle-type">Data Type</Label>
              <Select value={oracleForm.dataType} onValueChange={(value) => setOracleForm({...oracleForm, dataType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fx_rate">FX Rate</SelectItem>
                  <SelectItem value="weather">Weather</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                  <SelectItem value="market_data">Market Data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="oracle-value">Value</Label>
              <Textarea
                id="oracle-value"
                placeholder="Enter oracle data value..."
                value={oracleForm.value}
                onChange={(e) => setOracleForm({...oracleForm, value: e.target.value})}
              />
            </div>
            
            <Button 
              onClick={handleOracleUpdate} 
              disabled={updateOracle.isPending} 
              variant="outline"
              className="w-full"
            >
              {updateOracle.isPending ? 'Updating...' : 'Update Oracle'}
            </Button>
          </CardContent>
        </Card>

        {/* Create Automated Rule */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Create Automated Rule
            </CardTitle>
            <CardDescription>Set up conditional automation rules</CardDescription>
          </CardHeader>
          <CardContent>
            <RuleCreationDialog />
          </CardContent>
        </Card>
      </div>

      {/* Transaction Status */}
      <div className="space-y-4">
        {(mintToken.error || burnToken.error || transferToken.error || createRule.error || updateOracle.error) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {mintToken.error?.message || 
               burnToken.error?.message || 
               transferToken.error?.message || 
               createRule.error?.message || 
               updateOracle.error?.message}
            </AlertDescription>
          </Alert>
        )}

        {(mintToken.isSuccess || burnToken.isSuccess || transferToken.isSuccess || createRule.isSuccess || updateOracle.isSuccess) && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Transaction completed successfully! Check your wallet for updates.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

const RuleCreationDialog = () => {
  const [open, setOpen] = useState(false);
  const [ruleName, setRuleName] = useState('');
  const [conditions, setConditions] = useState<RuleCondition[]>([]);
  const [actions, setActions] = useState<RuleAction[]>([]);
  
  const createAutomatedRule = useCreateAutomatedRule();

  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        type: 'fx_rate',
        operator: 'gt',
        value: '',
        currency_pair: 'USD/INR'
      }
    ]);
  };

  const addAction = () => {
    setActions([
      ...actions,
      {
        type: 'notify',
        message: 'Rule condition met'
      }
    ]);
  };

  const handleCreateRule = () => {
    if (!ruleName || conditions.length === 0 || actions.length === 0) {
      return;
    }

    createAutomatedRule.mutate({
      name: ruleName,
      conditions,
      actions
    });
    
    setOpen(false);
    setRuleName('');
    setConditions([]);
    setActions([]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Create New Rule
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Automated Rule</DialogTitle>
          <DialogDescription>
            Set up conditions and actions for automated execution
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="rule-name">Rule Name</Label>
            <Input
              id="rule-name"
              placeholder="Enter rule name..."
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Conditions</h4>
              <Button onClick={addCondition} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Condition
              </Button>
            </div>
            
            {conditions.map((condition, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  <Select 
                    value={condition.type} 
                    onValueChange={(value) => {
                      const newConditions = [...conditions];
                      newConditions[index].type = value as any;
                      setConditions(newConditions);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fx_rate">FX Rate</SelectItem>
                      <SelectItem value="time">Time</SelectItem>
                      <SelectItem value="weather">Weather</SelectItem>
                      <SelectItem value="location">Location</SelectItem>
                      <SelectItem value="balance">Balance</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select 
                    value={condition.operator} 
                    onValueChange={(value) => {
                      const newConditions = [...conditions];
                      newConditions[index].operator = value as any;
                      setConditions(newConditions);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gt">Greater than</SelectItem>
                      <SelectItem value="lt">Less than</SelectItem>
                      <SelectItem value="eq">Equals</SelectItem>
                      <SelectItem value="gte">Greater or equal</SelectItem>
                      <SelectItem value="lte">Less or equal</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    placeholder="Value"
                    value={condition.value}
                    onChange={(e) => {
                      const newConditions = [...conditions];
                      newConditions[index].value = e.target.value;
                      setConditions(newConditions);
                    }}
                  />
                </div>
                
                {condition.type === 'fx_rate' && (
                  <Input
                    placeholder="Currency pair (e.g., USD/INR)"
                    value={condition.currency_pair || ''}
                    onChange={(e) => {
                      const newConditions = [...conditions];
                      newConditions[index].currency_pair = e.target.value;
                      setConditions(newConditions);
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Actions</h4>
              <Button onClick={addAction} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Action
              </Button>
            </div>
            
            {actions.map((action, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <Select 
                    value={action.type} 
                    onValueChange={(value) => {
                      const newActions = [...actions];
                      newActions[index].type = value as any;
                      setActions(newActions);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transfer">Transfer</SelectItem>
                      <SelectItem value="mint">Mint</SelectItem>
                      <SelectItem value="burn">Burn</SelectItem>
                      <SelectItem value="notify">Notify</SelectItem>
                      <SelectItem value="freeze">Freeze</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {(action.type === 'transfer' || action.type === 'mint' || action.type === 'burn') && (
                    <Input
                      placeholder="Amount"
                      value={action.amount || ''}
                      onChange={(e) => {
                        const newActions = [...actions];
                        newActions[index].amount = e.target.value;
                        setActions(newActions);
                      }}
                    />
                  )}
                </div>
                
                {(action.type === 'transfer' || action.type === 'mint') && (
                  <Input
                    placeholder="Recipient address"
                    value={action.recipient || ''}
                    onChange={(e) => {
                      const newActions = [...actions];
                      newActions[index].recipient = e.target.value;
                      setActions(newActions);
                    }}
                  />
                )}
                
                <Input
                  placeholder="Message (optional)"
                  value={action.message || ''}
                  onChange={(e) => {
                    const newActions = [...actions];
                    newActions[index].message = e.target.value;
                    setActions(newActions);
                  }}
                />
              </div>
            ))}
          </div>

          <Button 
            onClick={handleCreateRule} 
            disabled={createAutomatedRule.isPending || !ruleName || conditions.length === 0 || actions.length === 0}
            className="w-full"
          >
            {createAutomatedRule.isPending ? 'Creating...' : 'Create Rule'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};