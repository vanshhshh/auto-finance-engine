
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { QrCode, Scan, Copy, Check, Smartphone, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const QRPaymentSystem = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('eINR');
  const [description, setDescription] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [paymentRequests, setPaymentRequests] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQRCode = async () => {
    if (!amount || !user) return;

    try {
      const paymentData = {
        amount: parseFloat(amount),
        currency,
        description,
        merchant_id: user.id,
        expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('payment_requests')
        .insert(paymentData)
        .select()
        .single();

      if (error) throw error;

      // Generate simple QR code data
      const qrData = `gatefi://pay?id=${data.id}&amount=${amount}&currency=${currency}&merchant=${user.id}`;
      setQrCode(qrData);

      // Draw QR code on canvas (simplified representation)
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, 200, 200);
          ctx.fillStyle = '#FFFFFF';
          // Draw a pattern that represents QR code
          for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 20; j++) {
              if (Math.random() > 0.5) {
                ctx.fillRect(i * 10, j * 10, 10, 10);
              }
            }
          }
        }
      }

      toast({
        title: "QR Code Generated",
        description: "Payment QR code has been created successfully.",
        className: "bg-blue-600 text-white border-blue-700",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code.",
        variant: "destructive",
      });
    }
  };

  const copyQRData = () => {
    navigator.clipboard.writeText(qrCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied",
      description: "Payment link copied to clipboard.",
      className: "bg-blue-600 text-white border-blue-700",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Generate QR Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="text-blue-600" size={20} />
              Generate Payment QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            
            <div>
              <Label htmlFor="currency">Currency</Label>
              <select
                id="currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="eINR">eINR (₹)</option>
                <option value="eUSD">eUSD ($)</option>
                <option value="eAED">eAED (د.إ)</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Payment description"
              />
            </div>
            
            <Button 
              onClick={generateQRCode}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!amount}
            >
              Generate QR Code
            </Button>
          </CardContent>
        </Card>

        {/* QR Code Display */}
        <Card>
          <CardHeader>
            <CardTitle>Payment QR Code</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {qrCode ? (
              <div className="space-y-4">
                <canvas
                  ref={canvasRef}
                  width={200}
                  height={200}
                  className="mx-auto border border-gray-300 rounded-lg"
                />
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-sm font-mono break-all text-gray-600">
                    {qrCode}
                  </div>
                </div>
                <Button
                  onClick={copyQRData}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy Payment Link'}
                </Button>
              </div>
            ) : (
              <div className="py-12 text-gray-400">
                <QrCode size={64} className="mx-auto mb-4" />
                <p>Generate a QR code to display here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Payment Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payment Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {paymentRequests.length > 0 ? paymentRequests.map((request) => (
              <div key={request.id} className="p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{request.currency} {request.amount}</div>
                    <div className="text-sm text-gray-600">{request.description}</div>
                    <div className="text-xs text-gray-500">
                      Created: {new Date(request.created_at).toLocaleString()}
                    </div>
                  </div>
                  <Badge className={`${
                    request.status === 'completed' ? 'bg-green-600' :
                    request.status === 'expired' ? 'bg-red-600' : 'bg-orange-600'
                  } text-white`}>
                    {request.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 text-gray-600">
                <Smartphone size={48} className="mx-auto mb-4 text-gray-400" />
                <p>No payment requests yet. Generate your first QR code above.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QRPaymentSystem;
