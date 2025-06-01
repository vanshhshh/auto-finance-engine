
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Send, ArrowDownLeft, QrCode, Users } from 'lucide-react';
import { useWalletData } from '@/hooks/useWalletData';

const TransferPage = () => {
  const [transferType, setTransferType] = useState<'send' | 'receive' | 'bulk'>('send');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [currency, setCurrency] = useState('eINR');
  const [note, setNote] = useState('');
  const { balances } = useWalletData();
  const { toast } = useToast();

  const handleTransfer = () => {
    toast({
      title: "Transfer Initiated",
      description: `${transferType} transfer of ${amount} ${currency} has been initiated.`,
      className: "bg-blue-600 text-white border-blue-700",
    });
  };

  return (
    <div className="space-y-6">
      {/* Transfer Type Selection */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button
          onClick={() => setTransferType('send')}
          variant={transferType === 'send' ? 'default' : 'outline'}
          className={`p-6 h-auto flex-col ${
            transferType === 'send' 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'border-blue-600 text-blue-600 hover:bg-blue-50'
          }`}
        >
          <Send className="mb-2" size={24} />
          <span>Send Money</span>
        </Button>
        
        <Button
          onClick={() => setTransferType('receive')}
          variant={transferType === 'receive' ? 'default' : 'outline'}
          className={`p-6 h-auto flex-col ${
            transferType === 'receive' 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'border-green-600 text-green-600 hover:bg-green-50'
          }`}
        >
          <ArrowDownLeft className="mb-2" size={24} />
          <span>Request Payment</span>
        </Button>
        
        <Button
          onClick={() => setTransferType('bulk')}
          variant={transferType === 'bulk' ? 'default' : 'outline'}
          className={`p-6 h-auto flex-col ${
            transferType === 'bulk' 
              ? 'bg-purple-600 hover:bg-purple-700 text-white' 
              : 'border-purple-600 text-purple-600 hover:bg-purple-50'
          }`}
        >
          <Users className="mb-2" size={24} />
          <span>Bulk Transfer</span>
        </Button>

        <Button
          variant="outline"
          className="p-6 h-auto flex-col border-orange-600 text-orange-600 hover:bg-orange-50"
        >
          <QrCode className="mb-2" size={24} />
          <span>QR Payment</span>
        </Button>
      </div>

      {/* Transfer Form */}
      <Card>
        <CardHeader>
          <CardTitle className="capitalize">{transferType} Transfer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="text-lg font-medium"
              />
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eINR">eINR (₹)</SelectItem>
                  <SelectItem value="eUSD">eUSD ($)</SelectItem>
                  <SelectItem value="eAED">eAED (د.إ)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {transferType === 'send' && (
            <div>
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x... or email@example.com"
              />
            </div>
          )}

          <div>
            <Label htmlFor="note">Note (Optional)</Label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note for this transfer"
            />
          </div>

          {/* Balance Display */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">Available Balance:</div>
            <div className="grid grid-cols-3 gap-4">
              {balances.map((balance) => (
                <div key={balance.id} className="text-center">
                  <div className="font-medium">{balance.token_symbol}</div>
                  <div className="text-lg font-bold">
                    {Number(balance.balance).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleTransfer}
            disabled={!amount || (transferType === 'send' && !recipient)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {transferType === 'send' ? 'Send' : transferType === 'receive' ? 'Request' : 'Bulk Transfer'}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Recipients */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Recipients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
              <div>
                <div className="font-medium">0x1234...5678</div>
                <div className="text-sm text-gray-600">Last used 2 days ago</div>
              </div>
              <Button size="sm" variant="outline">Use</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
              <div>
                <div className="font-medium">0x9abc...def0</div>
                <div className="text-sm text-gray-600">Last used 1 week ago</div>
              </div>
              <Button size="sm" variant="outline">Use</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransferPage;
