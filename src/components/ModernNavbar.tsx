
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X, 
  Wallet, 
  Globe, 
  CreditCard, 
  Building, 
  HelpCircle, 
  Shield,
  ChevronDown 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ModernNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const navigation = [
    { name: 'Send Money', href: '/transfer', icon: <Globe className="w-4 h-4" /> },
    { name: 'Exchange', href: '/exchange', icon: <Wallet className="w-4 h-4" /> },
    { name: 'Cards', href: '/cards', icon: <CreditCard className="w-4 h-4" /> },
    { name: 'Business', href: '/business', icon: <Building className="w-4 h-4" /> },
    { name: 'Help', href: '/help', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">GateFinance</span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.href)}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {user.email?.[0]?.toUpperCase()}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={() => navigate('/security')}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Security</span>
                    </button>
                    <hr className="my-2" />
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/auth')}
                  className="font-semibold"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 rounded-lg"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-4">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.href);
                    setIsOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full text-left p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </button>
              ))}
              
              <hr className="my-4" />
              
              {user ? (
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      navigate('/dashboard');
                      setIsOpen(false);
                    }}
                    className="w-full text-left p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsOpen(false);
                    }}
                    className="w-full text-left p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      navigate('/auth');
                      setIsOpen(false);
                    }}
                    className="w-full"
                  >
                    Sign In
                  </Button>
                  <Button 
                    onClick={() => {
                      navigate('/auth');
                      setIsOpen(false);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ModernNavbar;
