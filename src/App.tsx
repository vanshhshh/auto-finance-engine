import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { ModernNavbar } from '@/components/ModernNavbar';
import { Footer } from '@/components/Footer';

// Pages
import Index from '@/pages/Index';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Transfer from '@/pages/Transfer';
import Exchange from '@/pages/Exchange';
import Cards from '@/pages/Cards';
import Business from '@/pages/Business';
import Security from '@/pages/Security';
import Help from '@/pages/Help';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';

// New Advanced Dashboards
import { AdminDashboardNew } from '@/components/AdminDashboardNew';
import { MerchantDashboardNew } from '@/components/MerchantDashboardNew';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <ModernNavbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboardNew />} />
                <Route path="/merchant" element={<MerchantDashboardNew />} />
                <Route path="/transfer" element={<Transfer />} />
                <Route path="/exchange" element={<Exchange />} />
                <Route path="/cards" element={<Cards />} />
                <Route path="/business" element={<Business />} />
                <Route path="/security" element={<Security />} />
                <Route path="/help" element={<Help />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
