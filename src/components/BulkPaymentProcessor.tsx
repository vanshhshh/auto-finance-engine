
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, Send, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const BulkPaymentProcessor = () => {
  const [file, setFile] = useState<File | null>(null);
  const [bulkPayments, setBulkPayments] = useState<any[]>([]);
  const [processing, setProcessing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      parseCSVFile(uploadedFile);
    }
  };

  const parseCSVFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const headers = lines[0].split(',');
      
      const payments = lines.slice(1).filter(line => line.trim()).map((line, index) => {
        const values = line.split(',');
        return {
          id: index + 1,
          recipient: values[0]?.trim(),
          amount: parseFloat(values[1]?.trim()) || 0,
          currency: values[2]?.trim() || 'eUSD',
          description: values[3]?.trim() || '',
          status: 'pending'
        };
      });
      
      setBulkPayments(payments);
      toast({
        title: "File Uploaded",
        description: `${payments.length} payments loaded from CSV file.`,
        className: "bg-blue-600 text-white border-blue-700",
      });
    };
    reader.readAsText(file);
  };

  const processBulkPayments = async () => {
    setProcessing(true);
    
    try {
      // Create bulk payment record
      const { data: bulkPayment, error: bulkError } = await supabase
        .from('bulk_payments')
        .insert({
          user_id: user?.id,
          title: `Bulk Payment - ${new Date().toLocaleDateString()}`,
          total_amount: bulkPayments.reduce((sum, p) => sum + p.amount, 0),
          total_recipients: bulkPayments.length,
          status: 'processing'
        })
        .select()
        .single();

      if (bulkError) throw bulkError;

      // Process each payment
      let processed = 0;
      let failed = 0;
      
      for (const payment of bulkPayments) {
        try {
          // Simulate payment processing
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Create transaction record
          const { error: txError } = await supabase
            .from('transactions')
            .insert({
              user_id: user?.id,
              amount: payment.amount,
              token_symbol: payment.currency,
              to_address: payment.recipient,
              transaction_type: 'send',
              status: Math.random() > 0.1 ? 'completed' : 'failed' // 90% success rate
            });

          if (txError) throw txError;
          
          payment.status = 'completed';
          processed++;
        } catch (error) {
          payment.status = 'failed';
          failed++;
        }
        
        // Update UI
        setBulkPayments([...bulkPayments]);
      }

      // Update bulk payment status
      await supabase
        .from('bulk_payments')
        .update({
          status: 'completed',
          processed_count: processed,
          failed_count: failed,
          processed_at: new Date().toISOString()
        })
        .eq('id', bulkPayment.id);

      toast({
        title: "Bulk Payment Completed",
        description: `${processed} payments successful, ${failed} failed.`,
        className: "bg-green-600 text-white border-green-700",
      });
    } catch (error) {
      toast({
        title: "Processing Failed",
        description: "Failed to process bulk payments.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = "recipient,amount,currency,description\n0x1234567890123456789012345678901234567890,100.50,eUSD,Payment for services\n0x0987654321098765432109876543210987654321,75.25,eINR,Refund payment";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_payment_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Payment Processor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload */}
          <div>
            <Label htmlFor="csvFile">Upload CSV File</Label>
            <div className="mt-2 flex items-center gap-4">
              <Input
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="max-w-md"
              />
              <Button
                variant="outline"
                onClick={downloadTemplate}
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Download Template
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Upload a CSV file with columns: recipient, amount, currency, description
            </p>
          </div>

          {/* Payment Summary */}
          {bulkPayments.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{bulkPayments.length}</div>
                <div className="text-sm text-blue-700">Total Payments</div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600">
                  {bulkPayments.filter(p => p.status === 'completed').length}
                </div>
                <div className="text-sm text-green-700">Completed</div>
              </div>
              
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="text-2xl font-bold text-red-600">
                  {bulkPayments.filter(p => p.status === 'failed').length}
                </div>
                <div className="text-sm text-red-700">Failed</div>
              </div>
              
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-2xl font-bold text-orange-600">
                  ${bulkPayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                </div>
                <div className="text-sm text-orange-700">Total Amount</div>
              </div>
            </div>
          )}

          {/* Process Button */}
          {bulkPayments.length > 0 && (
            <Button
              onClick={processBulkPayments}
              disabled={processing}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {processing ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Process Bulk Payments
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Payment List */}
      {bulkPayments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bulkPayments.map((payment) => (
                <div key={payment.id} className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">
                        {payment.recipient.slice(0, 20)}...
                      </div>
                      <div className="text-sm text-gray-600">
                        {payment.amount} {payment.currency} - {payment.description}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${
                        payment.status === 'completed' ? 'bg-green-600' :
                        payment.status === 'failed' ? 'bg-red-600' : 'bg-orange-600'
                      } text-white`}>
                        {payment.status.toUpperCase()}
                      </Badge>
                      {payment.status === 'completed' && <CheckCircle className="text-green-600" size={16} />}
                      {payment.status === 'failed' && <XCircle className="text-red-600" size={16} />}
                      {payment.status === 'pending' && <Clock className="text-orange-600" size={16} />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BulkPaymentProcessor;
