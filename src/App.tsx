
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';

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

// Dashboard Pages (without navbar/footer)
import AdminPage from '@/pages/AdminPage';
import MerchantPage from '@/pages/MerchantPage';

import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen">
            <Routes>
              {/* Public pages with navbar/footer */}
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transfer" element={<Transfer />} />
              <Route path="/exchange" element={<Exchange />} />
              <Route path="/cards" element={<Cards />} />
              <Route path="/business" element={<Business />} />
              <Route path="/security" element={<Security />} />
              <Route path="/help" element={<Help />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Dashboard pages without navbar/footer */}
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/merchant" element={<MerchantPage />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
