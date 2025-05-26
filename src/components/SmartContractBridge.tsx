
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertTriangle, ExternalLink } from 'lucide-react';

interface ContractInteraction {
  id: string;
  type: 'mint' | 'burn' | 'send' | 'receive';
  amount: number;
  token: string;
  status: 'pending' | 'confirmed' | 'failed';
  txHash: string;
  gasUsed: number;
  gasCost: string;
  blockNumber?: number;
  network: 'polygon' | 'ethereum' | 'cbdc-testnet';
  timestamp: string;
}

interface SmartContractBridgeProps {
  onInteraction?: (interaction: ContractInteraction) => void;
}

const SmartContractBridge: React.FC<SmartContractBridgeProps> = ({ onInteraction }) => {
  const [interactions, setInteractions] = useState<ContractInteraction[]>([
    {
      id: '1',
      type: 'mint',
      amount: 1000,
      token: 'eINR',
      status: 'confirmed',
      txHash: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef1234567890abcdef1234567890',
      gasUsed: 21000,
      gasCost: '0.002 MATIC',
      blockNumber: 45612789,
      network: 'polygon',
      timestamp: new Date(Date.now() - 300000).toISOString(),
    },
    {
      id: '2',
      type: 'send',
      amount: 500,
      token: 'eUSD',
      status: 'pending',
      txHash: '0x9876543210fedcba0987654321fedcba0987654321fedcba0987654321fedcba',
      gasUsed: 0,
      gasCost: '0.001 ETH',
      network: 'ethereum',
      timestamp: new Date().toISOString(),
    },
  ]);

  const [isSimulating, setIsSimulating] = useState(false);

  const simulateContractInteraction = async (type: string, amount: number, token: string) => {
    setIsSimulating(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newInteraction: ContractInteraction = {
      id: Date.now().toString(),
      type: type as any,
      amount,
      token,
      status: Math.random() > 0.1 ? 'confirmed' : 'failed',
      txHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      gasUsed: Math.floor(Math.random() * 50000) + 21000,
      gasCost: `${(Math.random() * 0.01).toFixed(4)} ETH`,
      blockNumber: Math.floor(Math.random() * 1000000) + 45000000,
      network: ['polygon', 'ethereum', 'cbdc-testnet'][Math.floor(Math.random() * 3)] as any,
      timestamp: new Date().toISOString(),
    };

    setInteractions(prev => [newInteraction, ...prev]);
    onInteraction?.(newInteraction);
    setIsSimulating(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="text-green-400" size={16} />;
      case 'pending': return <Clock className="text-yellow-400" size={16} />;
      case 'failed': return <AlertTriangle className="text-red-400" size={16} />;
      default: return <Clock className="text-blue-400" size={16} />;
    }
  };

  const getNetworkColor = (network: string) => {
    switch (network) {
      case 'polygon': return 'bg-purple-600';
      case 'ethereum': return 'bg-blue-600';
      case 'cbdc-testnet': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Smart Contract Bridge</CardTitle>
          <Badge className="bg-blue-600">Layer 1/2 Ready</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Simulation Controls */}
        <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
          <h3 className="text-white font-medium mb-3">Simulate Contract Interaction</h3>
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => simulateContractInteraction('mint', 1000, 'eINR')}
              disabled={isSimulating}
              className="bg-green-600 hover:bg-green-700"
            >
              Simulate Mint
            </Button>
            <Button
              size="sm"
              onClick={() => simulateContractInteraction('burn', 500, 'eUSD')}
              disabled={isSimulating}
              className="bg-red-600 hover:bg-red-700"
            >
              Simulate Burn
            </Button>
            <Button
              size="sm"
              onClick={() => simulateContractInteraction('send', 250, 'eAED')}
              disabled={isSimulating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Simulate Send
            </Button>
          </div>
          {isSimulating && (
            <div className="mt-3">
              <div className="text-sm text-slate-300 mb-2">Processing contract interaction...</div>
              <Progress value={66} className="w-full" />
            </div>
          )}
        </div>

        {/* Contract Interactions List */}
        <div className="space-y-3">
          {interactions.map((interaction) => (
            <div
              key={interaction.id}
              className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(interaction.status)}
                  <span className="text-white font-medium capitalize">
                    {interaction.type} {interaction.amount} {interaction.token}
                  </span>
                  <Badge className={getNetworkColor(interaction.network)}>
                    {interaction.network}
                  </Badge>
                </div>
                <Badge variant={interaction.status === 'confirmed' ? 'default' : 'secondary'}>
                  {interaction.status}
                </Badge>
              </div>
              
              <div className="space-y-1 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <span>Tx Hash:</span>
                  <code className="text-blue-300 font-mono text-xs">
                    {interaction.txHash.slice(0, 10)}...{interaction.txHash.slice(-8)}
                  </code>
                  <Button variant="ghost" size="sm" className="p-1">
                    <ExternalLink size={12} />
                  </Button>
                </div>
                <div>Gas Used: <span className="text-yellow-300">{interaction.gasUsed.toLocaleString()}</span></div>
                <div>Gas Cost: <span className="text-green-300">{interaction.gasCost}</span></div>
                {interaction.blockNumber && (
                  <div>Block: <span className="text-purple-300">#{interaction.blockNumber}</span></div>
                )}
                <div className="text-xs text-slate-400">
                  {new Date(interaction.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Network Status */}
        <div className="p-3 bg-slate-700/20 rounded-lg border border-slate-600/30">
          <h4 className="text-white text-sm font-medium mb-2">Network Status</h4>
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="text-center">
              <div className="text-purple-300 font-medium">Polygon</div>
              <div className="text-green-400">Active</div>
            </div>
            <div className="text-center">
              <div className="text-blue-300 font-medium">Ethereum</div>
              <div className="text-green-400">Active</div>
            </div>
            <div className="text-center">
              <div className="text-green-300 font-medium">CBDC Testnet</div>
              <div className="text-yellow-400">Beta</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartContractBridge;
