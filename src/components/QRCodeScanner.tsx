
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, Scan } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRCodeScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (data: { walletAddress: string; name: string; amount?: string }) => void;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({ isOpen, onClose, onScanSuccess }) => {
  const [qrData, setQrData] = useState('');
  const { toast } = useToast();

  const handleManualInput = () => {
    try {
      const data = JSON.parse(qrData);
      if (data.walletAddress) {
        onScanSuccess({
          walletAddress: data.walletAddress,
          name: data.name || 'Unknown User',
          amount: data.amount || ''
        });
        onClose();
      } else {
        throw new Error('Invalid QR code format');
      }
    } catch (error) {
      toast({
        title: "Invalid QR Code",
        description: "Please scan a valid Gate Finance QR code.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200 text-gray-900">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scan className="text-blue-600" size={24} />
            Scan QR Code
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <QrCode size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">Position QR code within the frame</p>
            <p className="text-sm text-gray-500">Camera will activate automatically</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="qrInput" className="text-gray-700">Or paste QR code data manually:</Label>
            <Input
              id="qrInput"
              placeholder="Paste QR code data here..."
              value={qrData}
              onChange={(e) => setQrData(e.target.value)}
              className="bg-white border-gray-300 text-gray-900"
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleManualInput}
              disabled={!qrData}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Process QR Code
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeScanner;
