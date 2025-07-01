
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCBDCAccounts } from '@/hooks/useCBDCAccounts';
import { useBankingMethods } from '@/hooks/useBankingMethods';
import { useFundOperations } from '@/hooks/useFundOperations';
import { Plus, ArrowUpCircle, ArrowDownCircle, Clock, CheckCircle, XCircle } from 'lucide-react';

export const FundingManager = () => {
  const { accounts } = useCBDCAccounts();
  const { operations, isLoading, createFundOperation } = useFundOperations();
  const [selectedCountry, setSelectedCountry] = useState('');
  const { data: bankingMethods = [] } = useBankingMethods(selectedCountry);
  const [isFundDialogOpen, setIsFundDialogOpen] = useState(false);
  const [isDefundDialogOpen, setIsDefundDialogOpen] = useState(false);
  const [fundForm, setFundForm] = useState({
    account_id: '',
    amount: '',
    token_symbol: 'eINR',
    bank_method: '',
    bank_account_id: '',
    reference_id: '',
  });

  const handleFundOperation = async (operationType: 'fund' | 'defund') => {
    if (!fundForm.account_id || !fundForm.amount || !fundForm.bank_method) return;
    
    const selectedAccount = accounts.find(acc => acc.id === fundForm.account_id);
    if (!selectedAccount) return;

    const operationData = {
      account_id: fundForm.account_id,
      operation_type: operationType,
      amount: parseFloat(fundForm.amount),
      token_symbol: fundForm.token_symbol,
      bank_account_id: fundForm.bank_account_id || undefined,
      country_code: selectedAccount.country_code,
      bank_method: fundForm.bank_method,
      reference_id: fundForm.reference_id || undefined,
    };
    
    await createFundOperation.mutateAsync(operationData);
    setIsFundDialogOpen(false);
    setIsDefundDialogOpen(false);
    setFundForm({
      account_id: '',
      amount: '',
      token_symbol: 'eINR',
      bank_method: '',
      bank_account_id: '',
      reference_id: '',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'processing': return <Clock className="w-4 h-4 text-blue-600" />;
      default: return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  // Update selected country when account changes
  const handleAccountChange = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    if (account) {
      setSelectedCountry(account.country_code);
    }
    setFundForm({ ...fundForm, account_id: accountId });
  };

  if (isLoading) return <div>Loading funding operations...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Fund Management</h2>
          <p className="text-gray-600">Add or withdraw CBDC from your accounts using various banking methods</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isFundDialogOpen} onOpenChange={setIsFundDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <ArrowDownCircle className="w-4 h-4 mr-2" />
                Fund Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Fund CBDC Account</DialogTitle>
                <DialogDescription>
                  Add CBDC to your account using bank transfer or other payment methods
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Select Account</Label>
                  <Select value={fundForm.account_id} onValueChange={handleAccountChange}>
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
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      value={fundForm.amount}
                      onChange={(e) => setFundForm({ ...fundForm, amount: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>Token</Label>
                    <Select value={fundForm.token_symbol} onValueChange={(value) => setFundForm({ ...fundForm, token_symbol: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eINR">eINR</SelectItem>
                        <SelectItem value="eUSD">eUSD</SelectItem>
                        <SelectItem value="eAED">eAED</SelectItem>
                        <SelectItem value="eGBP">eGBP</SelectItem>
                        <SelectItem value="eEUR">eEUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Banking Method</Label>
                  <Select value={fundForm.bank_method} onValueChange={(value) => setFundForm({ ...fundForm, bank_method: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select banking method" />
                    </SelectTrigger>
                    <SelectContent>
                      {bankingMethods.map((method) => (
                        <SelectItem key={method.id} value={method.method_name}>
                          {method.method_name} ({method.provider_name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Bank Account ID (Optional)</Label>
                  <Input
                    value={fundForm.bank_account_id}
                    onChange={(e) => setFundForm({ ...fundForm, bank_account_id: e.target.value })}
                    placeholder="Account number, IBAN, or wallet ID"
                  />
                </div>

                <div>
                  <Label>Reference ID (Optional)</Label>
                  <Input
                    value={fundForm.reference_id}
                    onChange={(e) => setFundForm({ ...fundForm, reference_id: e.target.value })}
                    placeholder="Transaction reference"
                  />
                </div>

                <Button onClick={() => handleFundOperation('fund')} className="w-full">
                  Fund Account
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isDefundDialogOpen} onOpenChange={setIsDefundDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <ArrowUpCircle className="w-4 h-4 mr-2" />
                Withdraw
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Withdraw CBDC</DialogTitle>
                <DialogDescription>
                  Withdraw CBDC from your account to bank or other payment methods
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {/* Same form as funding but for withdrawal */}
                <div>
                  <Label>Select Account</Label>
                  <Select value={fundForm.account_id} onValueChange={handleAccountChange}>
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
                    <Label>Amount</Label>
                    <Input
                      type="number"
                      value={fundForm.amount}
                      onChange={(e) => setFundForm({ ...fundForm, amount: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label>Token</Label>
                    <Select value={fundForm.token_symbol} onValueChange={(value) => setFundForm({ ...fundForm, token_symbol: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eINR">eINR</SelectItem>
                        <SelectItem value="eUSD">eUSD</SelectItem>
                        <SelectItem value="eAED">eAED</SelectItem>
                        <SelectItem value="eGBP">eGBP</SelectItem>
                        <SelectItem value="eEUR">eEUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Banking Method</Label>
                  <Select value={fundForm.bank_method} onValueChange={(value) => setFundForm({ ...fundForm, bank_method: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select banking method" />
                    </SelectTrigger>
                    <SelectContent>
                      {bankingMethods.map((method) => (
                        <SelectItem key={method.id} value={method.method_name}>
                          {method.method_name} ({method.provider_name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Bank Account ID</Label>
                  <Input
                    value={fundForm.bank_account_id}
                    onChange={(e) => setFundForm({ ...fundForm, bank_account_id: e.target.value })}
                    placeholder="Account number, IBAN, or wallet ID"
                    required
                  />
                </div>

                <div>
                  <Label>Reference ID (Optional)</Label>
                  <Input
                    value={fundForm.reference_id}
                    onChange={(e) => setFundForm({ ...fundForm, reference_id: e.target.value })}
                    placeholder="Transaction reference"
                  />
                </div>

                <Button onClick={() => handleFundOperation('defund')} className="w-full">
                  Withdraw Funds
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        <h3 className="text-lg font-semibold">Recent Operations</h3>
        {operations.map((operation) => (
          <Card key={operation.id}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {operation.operation_type === 'fund' ? (
                    <ArrowDownCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <ArrowUpCircle className="w-5 h-5 text-red-600" />
                  )}
                  <div>
                    <p className="font-medium">
                      {operation.operation_type === 'fund' ? 'Fund' : 'Withdraw'} {operation.amount} {operation.token_symbol}
                    </p>
                    <p className="text-sm text-gray-600">
                      via {operation.bank_method} • {new Date(operation.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(operation.status)}
                  <Badge className={getStatusColor(operation.status)}>
                    {operation.status}
                  </Badge>
                </div>
              </div>
              {operation.reference_id && (
                <p className="text-xs text-gray-500 mt-2">
                  Reference: {operation.reference_id}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
        
        {operations.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500">No funding operations found. Start by funding your first account.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
