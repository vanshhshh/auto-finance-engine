
import React from 'react';
import { Navigate } from 'react-router-dom';
import WalletDashboard from '@/components/WalletDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <Wallet className="mx-auto mb-4 text-blue-400" size={48} />
            <div className="text-white text-lg">Loading your wallet...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <WalletDashboard />
    </div>
  );
};

export default Index;
