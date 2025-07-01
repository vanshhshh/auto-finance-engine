
import React from 'react';
import { ModernNavbar } from '@/components/ModernNavbar';
import Footer from '@/components/Footer';
import CBDCTransfer from '@/components/CBDCTransfer';

const Transfer = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ModernNavbar />
      
      <div className="pt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <CBDCTransfer />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Transfer;
