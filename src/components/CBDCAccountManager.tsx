
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useCBDCAccounts } from '@/hooks/useCBDCAccounts';
import { Plus, Settings, Eye, EyeOff } from 'lucide-react';

const countryCodes = [
  { code: 'IN', name: 'India' },
  { code: 'US', name: 'United States' },
  { code: 'AE', name: 'UAE' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'EU', name: 'European Union' },
  { code: 'CN', name: 'China' },
  { code: 'JP', name: 'Japan' },
  { code: 'SG', name: 'Singapore' },
];

export const CBDCAccountManager = () => {
  const { accounts, isLoading, createAccount, updateAccountStatus } = useCBDCAccounts();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    account_type: 'personal' as 'personal' | 'business' | 'sub_account',
    country_code: '',
    alias_email: '',
    alias_phone: '',
    parent_account_id: '',
  });

  const handleCreateAccount = async () => {
    if (!createForm.country_code) return;
    
    const accountData = {
      ...createForm,
      alias_email: createForm.alias_email || undefined,
      alias_phone: createForm.alias_phone || undefined,
      parent_account_id: createForm.parent_account_id || undefined,
    };
    
    await createAccount.mutateAsync(accountData);
    setIsCreateDialogOpen(false);
    setCreateForm({
      account_type: 'personal',
      country_code: '',
      alias_email: '',
      alias_phone: '',
      parent_account_id: '',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'disabled': return 'bg-yellow-100 text-yellow-800';
      case 'frozen': return 'bg-blue-100 text-blue-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) return <div>Loading CBDC accounts...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">CBDC Account Management</h2>
          <p className="text-gray-600">Manage your digital currency accounts</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New CBDC Account</DialogTitle>
              <DialogDescription>
                Create a new digital currency account for managing your CBDCs
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="account_type">Account Type</Label>
                <Select
                  value={createForm.account_type}
                  onValueChange={(value: 'personal' | 'business' | 'sub_account') =>
                    setCreateForm({ ...createForm, account_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="sub_account">Sub Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="country_code">Country</Label>
                <Select
                  value={createForm.country_code}
                  onValueChange={(value) => setCreateForm({ ...createForm, country_code: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countryCodes.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {createForm.account_type === 'sub_account' && (
                <div>
                  <Label htmlFor="parent_account">Parent Account</Label>
                  <Select
                    value={createForm.parent_account_id}
                    onValueChange={(value) => setCreateForm({ ...createForm, parent_account_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent account" />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts
                        .filter(acc => acc.account_type !== 'sub_account')
                        .map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.account_type} - {account.country_code}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <Label htmlFor="alias_email">Alias Email (Optional)</Label>
                <Input
                  id="alias_email"
                  type="email"
                  value={createForm.alias_email}
                  onChange={(e) => setCreateForm({ ...createForm, alias_email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <Label htmlFor="alias_phone">Alias Phone (Optional)</Label>
                <Input
                  id="alias_phone"
                  type="tel"
                  value={createForm.alias_phone}
                  onChange={(e) => setCreateForm({ ...createForm, alias_phone: e.target.value })}
                  placeholder="+1234567890"
                />
              </div>

              <Button onClick={handleCreateAccount} className="w-full">
                Create Account
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {accounts.map((account) => (
          <Card key={account.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg">
                  {account.account_type.charAt(0).toUpperCase() + account.account_type.slice(1)} Account
                </CardTitle>
                <CardDescription>
                  {account.country_code} • Created {new Date(account.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(account.status)}>
                  {account.status}
                </Badge>
                <Select
                  value={account.status}
                  onValueChange={(status: 'active' | 'disabled' | 'frozen' | 'closed') =>
                    updateAccountStatus.mutate({ accountId: account.id, status })
                  }
                >
                  <SelectTrigger className="w-32">
                    <Settings className="w-4 h-4" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                    <SelectItem value="frozen">Frozen</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Account ID:</span>
                  <p className="text-gray-600 font-mono text-xs">{account.id}</p>
                </div>
                {account.alias_email && (
                  <div>
                    <span className="font-medium">Email Alias:</span>
                    <p className="text-gray-600">{account.alias_email}</p>
                  </div>
                )}
                {account.alias_phone && (
                  <div>
                    <span className="font-medium">Phone Alias:</span>
                    <p className="text-gray-600">{account.alias_phone}</p>
                  </div>
                )}
                {account.parent_account_id && (
                  <div>
                    <span className="font-medium">Parent Account:</span>
                    <p className="text-gray-600 font-mono text-xs">{account.parent_account_id}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {accounts.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500">No CBDC accounts found. Create your first account to get started.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
