import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Send, Zap, CheckCircle } from 'lucide-react';

export const InstantTransfer = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [transferData, setTransferData] = useState({
    recipient: '',
    amount: '',
    token: 'eUSD',
    description: ''
  });

  const handleInstantTransfer = async () => {
    if (!user || !transferData.recipient || !transferData.amount) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Call the instant transfer function via SQL query
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          transaction_type: 'send',
          token_symbol: transferData.token,
          amount: parseFloat(transferData.amount),
          to_address: transferData.recipient,
          status: 'completed'
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Transfer Successful! ⚡",
        description: `${transferData.amount} ${transferData.token} sent instantly to ${transferData.recipient}`,
        className: "bg-green-600 text-white border-green-700",
      });

      // Reset form
      setTransferData({
        recipient: '',
        amount: '',
        token: 'eUSD',
        description: ''
      });

    } catch (error: any) {
      console.error('Transfer error:', error);
      toast({
        title: "Transfer Failed",
        description: error.message || "Failed to process transfer",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="dashboard-card">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="w-6 h-6 text-yellow-500" />
          <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Instant Transfer
          </CardTitle>
        </div>
        <p className="text-slate-600">Send money instantly to other Gate Finance users</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="recipient">Recipient Email or Wallet Address</Label>
            <Input
              id="recipient"
              type="text"
              value={transferData.recipient}
              onChange={(e) => setTransferData({ ...transferData, recipient: e.target.value })}
              placeholder="user@example.com or 0x..."
              className="mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={transferData.amount}
                onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                placeholder="0.00"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="token">Currency</Label>
              <Select value={transferData.token} onValueChange={(value) => setTransferData({ ...transferData, token: value })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eUSD">eUSD</SelectItem>
                  <SelectItem value="eINR">eINR</SelectItem>
                  <SelectItem value="eAED">eAED</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={transferData.description}
              onChange={(e) => setTransferData({ ...transferData, description: e.target.value })}
              placeholder="Payment for..."
              className="mt-1"
            />
          </div>
        </div>

        <Button 
          onClick={handleInstantTransfer}
          disabled={loading || !transferData.recipient || !transferData.amount}
          className="w-full primary-button h-12 text-lg"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Send Instantly
            </div>
          )}
        </Button>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-800 mb-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Instant Transfer Benefits</span>
          </div>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Immediate settlement - no waiting</li>
            <li>• Zero fees for Gate Finance users</li>
            <li>• Real-time balance updates</li>
            <li>• Secure blockchain verification</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};