
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
import { useProgrammableLocks } from '@/hooks/useProgrammableLocks';
import { Lock, Unlock, Clock, Users, Shield, Plus } from 'lucide-react';

export const ProgrammableLockManager = () => {
  const { accounts } = useCBDCAccounts();
  const { locks, isLoading, createLock, releaseLock } = useProgrammableLocks();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [lockForm, setLockForm] = useState({
    lock_type: 'two_party' as 'two_party' | 'three_party' | 'htlc',
    account_id: '',
    amount: '',
    token_symbol: 'eINR',
    recipient_pip: '',
    arbiter_pip: '',
    hash_condition: '',
    time_lock: '',
    conditions: '',
    expires_at: '',
  });

  const handleCreateLock = async () => {
    if (!lockForm.account_id || !lockForm.amount || !lockForm.recipient_pip) return;
    
    const lockData = {
      lock_type: lockForm.lock_type,
      account_id: lockForm.account_id,
      amount: parseFloat(lockForm.amount),
      token_symbol: lockForm.token_symbol,
      recipient_pip: lockForm.recipient_pip,
      arbiter_pip: lockForm.arbiter_pip || undefined,
      hash_condition: lockForm.hash_condition || undefined,
      time_lock: lockForm.time_lock || undefined,
      conditions: lockForm.conditions ? JSON.parse(lockForm.conditions) : undefined,
      expires_at: lockForm.expires_at || undefined,
    };
    
    await createLock.mutateAsync(lockData);
    setIsCreateDialogOpen(false);
    setLockForm({
      lock_type: 'two_party',
      account_id: '',
      amount: '',
      token_symbol: 'eINR',
      recipient_pip: '',
      arbiter_pip: '',
      hash_condition: '',
      time_lock: '',
      conditions: '',
      expires_at: '',
    });
  };

  const getLockIcon = (lockType: string) => {
    switch (lockType) {
      case 'two_party': return <Users className="w-4 h-4" />;
      case 'three_party': return <Shield className="w-4 h-4" />;
      case 'htlc': return <Clock className="w-4 h-4" />;
      default: return <Lock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'released': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (isLoading) return <div>Loading programmable locks...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Programmable Locks</h2>
          <p className="text-gray-600">Create conditional payments with two-party, three-party, and HTLC locks</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Lock
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Programmable Lock</DialogTitle>
              <DialogDescription>
                Lock funds with conditional release mechanisms
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <Label>Lock Type</Label>
                <Select
                  value={lockForm.lock_type}
                  onValueChange={(value: 'two_party' | 'three_party' | 'htlc') =>
                    setLockForm({ ...lockForm, lock_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="two_party">Two-Party Lock</SelectItem>
                    <SelectItem value="three_party">Three-Party Lock (Escrow)</SelectItem>
                    <SelectItem value="htlc">Hash Time Lock Contract (HTLC)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Account</Label>
                <Select value={lockForm.account_id} onValueChange={(value) => setLockForm({ ...lockForm, account_id: value })}>
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
                    value={lockForm.amount}
                    onChange={(e) => setLockForm({ ...lockForm, amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label>Token</Label>
                  <Select value={lockForm.token_symbol} onValueChange={(value) => setLockForm({ ...lockForm, token_symbol: value })}>
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
                <Label>Recipient PIP</Label>
                <Input
                  value={lockForm.recipient_pip}
                  onChange={(e) => setLockForm({ ...lockForm, recipient_pip: e.target.value })}
                  placeholder="Recipient Payment Interface Provider ID"
                />
              </div>

              {lockForm.lock_type === 'three_party' && (
                <div>
                  <Label>Arbiter PIP</Label>
                  <Input
                    value={lockForm.arbiter_pip}
                    onChange={(e) => setLockForm({ ...lockForm, arbiter_pip: e.target.value })}
                    placeholder="Arbiter Payment Interface Provider ID"
                  />
                </div>
              )}

              {lockForm.lock_type === 'htlc' && (
                <>
                  <div>
                    <Label>Hash Condition</Label>
                    <Input
                      value={lockForm.hash_condition}
                      onChange={(e) => setLockForm({ ...lockForm, hash_condition: e.target.value })}
                      placeholder="SHA256 hash for conditional release"
                    />
                  </div>
                  <div>
                    <Label>Time Lock</Label>
                    <Input
                      type="datetime-local"
                      value={lockForm.time_lock}
                      onChange={(e) => setLockForm({ ...lockForm, time_lock: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div>
                <Label>Additional Conditions (JSON)</Label>
                <Textarea
                  value={lockForm.conditions}
                  onChange={(e) => setLockForm({ ...lockForm, conditions: e.target.value })}
                  placeholder='{"temperature": ">30", "location": "New York"}'
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <Label>Expiration Date (Optional)</Label>
                <Input
                  type="datetime-local"
                  value={lockForm.expires_at}
                  onChange={(e) => setLockForm({ ...lockForm, expires_at: e.target.value })}
                />
              </div>

              <Button onClick={handleCreateLock} className="w-full">
                Create Lock
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {locks.map((lock) => (
          <Card key={lock.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                {getLockIcon(lock.lock_type)}
                <div>
                  <CardTitle className="text-lg">
                    {lock.lock_type.replace('_', '-').toUpperCase()} Lock
                  </CardTitle>
                  <CardDescription>
                    {lock.amount} {lock.token_symbol} • Created {new Date(lock.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(lock.status)}>
                  {lock.status}
                </Badge>
                {lock.status === 'active' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => releaseLock.mutate(lock.id)}
                  >
                    <Unlock className="w-4 h-4 mr-1" />
                    Release
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Recipient PIP:</span>
                  <p className="text-gray-600">{lock.recipient_pip}</p>
                </div>
                {lock.arbiter_pip && (
                  <div>
                    <span className="font-medium">Arbiter PIP:</span>
                    <p className="text-gray-600">{lock.arbiter_pip}</p>
                  </div>
                )}
                {lock.hash_condition && (
                  <div className="col-span-2">
                    <span className="font-medium">Hash Condition:</span>
                    <p className="text-gray-600 font-mono text-xs break-all">{lock.hash_condition}</p>
                  </div>
                )}
                {lock.time_lock && (
                  <div>
                    <span className="font-medium">Time Lock:</span>
                    <p className="text-gray-600">{new Date(lock.time_lock).toLocaleString()}</p>
                  </div>
                )}
                {lock.expires_at && (
                  <div>
                    <span className="font-medium">Expires:</span>
                    <p className="text-gray-600">{new Date(lock.expires_at).toLocaleString()}</p>
                  </div>
                )}
                {lock.conditions && (
                  <div className="col-span-2">
                    <span className="font-medium">Conditions:</span>
                    <pre className="text-gray-600 text-xs bg-gray-50 p-2 rounded mt-1">
                      {JSON.stringify(lock.conditions, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        
        {locks.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500">No programmable locks found. Create your first conditional payment lock.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
