
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface TransactionModalProps {
  type: 'send' | 'receive';
  isOpen: boolean;
  onClose: () => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ type, isOpen, onClose }) => {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('eINR');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !amount || !address) return;

    setLoading(true);
    try {
      // Create transaction record
      const transactionData = {
        user_id: user.id,
        transaction_type: type,
        token_symbol: tokenSymbol,
        amount: parseFloat(amount),
        to_address: type === 'send' ? address : user.email,
        from_address: type === 'receive' ? address : user.email,
        status: 'completed',
      };

      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert([transactionData])
        .select()
        .single();

      if (transactionError) throw transactionError;

      // Update balance
      if (type === 'receive') {
        const { data: currentBalance } = await supabase
          .from('token_balances')
          .select('balance')
          .eq('user_id', user.id)
          .eq('token_symbol', tokenSymbol)
          .single();

        if (currentBalance) {
          const newBalance = Number(currentBalance.balance) + parseFloat(amount);
          await supabase
            .from('token_balances')
            .update({ balance: newBalance, updated_at: new Date().toISOString() })
            .eq('user_id', user.id)
            .eq('token_symbol', tokenSymbol);
        }
      } else if (type === 'send') {
        const { data: currentBalance } = await supabase
          .from('token_balances')
          .select('balance')
          .eq('user_id', user.id)
          .eq('token_symbol', tokenSymbol)
          .single();

        if (currentBalance) {
          const newBalance = Number(currentBalance.balance) - parseFloat(amount);
          if (newBalance < 0) {
            throw new Error('Insufficient balance');
          }
          
          await supabase
            .from('token_balances')
            .update({ balance: newBalance, updated_at: new Date().toISOString() })
            .eq('user_id', user.id)
            .eq('token_symbol', tokenSymbol);
        }
      }

      // Create audit log
      await supabase.from('audit_logs').insert({
        action: `transaction_${type}`,
        user_id: user.id,
        details: {
          transaction_id: transaction.id,
          amount: parseFloat(amount),
          token_symbol: tokenSymbol,
          to_address: address
        }
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['balances'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });

      toast({
        title: "Transaction Successful",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} transaction completed successfully.`,
      });

      onClose();
      setAmount('');
      setAddress('');
    } catch (error: any) {
      toast({
        title: "Transaction Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getModalTitle = () => {
    switch (type) {
      case 'send': return 'Send CBDC';
      case 'receive': return 'Receive CBDC';
      default: return 'Transaction';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>{getModalTitle()}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="address">
              {type === 'send' ? 'Recipient Wallet Address' : 'Sender Wallet Address'}
            </Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              className="bg-slate-700 border-slate-600"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Processing...' : 'Confirm'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModal;
