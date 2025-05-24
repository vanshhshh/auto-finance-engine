
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useWalletStore } from '@/store/walletStore';

interface TransactionModalProps {
  type: 'send' | 'receive' | 'mint' | 'burn';
  isOpen: boolean;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ type, isOpen, onClose }) => {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [selectedToken, setSelectedToken] = useState('eINR');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addTransaction } = useWalletStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate transaction processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const transaction = {
      id: Date.now().toString(),
      type,
      token: selectedToken,
      amount: parseFloat(amount),
      address: address || '0x742d35Cc6634C0532925a3b8D',
      timestamp: new Date(),
      status: 'completed' as const,
      txHash: `0x${Math.random().toString(16).substring(2)}`
    };

    addTransaction(transaction);

    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Successful`,
      description: `${amount} ${selectedToken} has been ${type === 'send' ? 'sent' : type === 'receive' ? 'received' : type}ed`,
    });

    setIsLoading(false);
    onClose();
    setAmount('');
    setAddress('');
  };

  const getTitle = () => {
    switch (type) {
      case 'send': return 'Send Tokens';
      case 'receive': return 'Receive Tokens';
      case 'mint': return 'Mint Tokens';
      case 'burn': return 'Burn Tokens';
    }
  };

  const getButtonColor = () => {
    switch (type) {
      case 'send': return 'bg-blue-600 hover:bg-blue-700';
      case 'receive': return 'bg-green-600 hover:bg-green-700';
      case 'mint': return 'bg-emerald-600 hover:bg-emerald-700';
      case 'burn': return 'bg-red-600 hover:bg-red-700';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="token">Token</Label>
            <Select value={selectedToken} onValueChange={setSelectedToken}>
              <SelectTrigger className="bg-slate-700 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="eINR">eINR (₹)</SelectItem>
                <SelectItem value="eUSD">eUSD ($)</SelectItem>
                <SelectItem value="eAED">eAED (د.إ)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="bg-slate-700 border-slate-600 text-white"
              required
            />
          </div>

          {(type === 'send' || type === 'receive') && (
            <div>
              <Label htmlFor="address">
                {type === 'send' ? 'Recipient Address' : 'Your Address'}
              </Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
                className="bg-slate-700 border-slate-600 text-white font-mono"
                required
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-600 text-white hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className={`flex-1 ${getButtonColor()}`}
            >
              {isLoading ? 'Processing...' : `${type.charAt(0).toUpperCase() + type.slice(1)}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
