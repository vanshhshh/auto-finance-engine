
import React from 'react';
import WalletDashboard from '@/components/WalletDashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const Index = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        <WalletDashboard />
      </div>
    </QueryClientProvider>
  );
};

export default Index;
