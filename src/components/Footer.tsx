
import React from 'react';
import { Wallet, Globe, Shield, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Product",
      links: [
        { name: "Send Money", href: "/transfer" },
        { name: "Exchange Rates", href: "/exchange" },
        { name: "Cards", href: "/cards" },
        { name: "Business", href: "/business" },
        { name: "API", href: "/api" }
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "/careers" },
        { name: "Press", href: "/press" },
        { name: "Blog", href: "/blog" },
        { name: "Partners", href: "/partners" }
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Contact Us", href: "/contact" },
        { name: "Security", href: "/security" },
        { name: "Status", href: "/status" },
        { name: "Community", href: "/community" }
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Terms of Service", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "Compliance", href: "/compliance" },
        { name: "Licenses", href: "/licenses" }
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">GateFinance</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              The fastest, most secure way to send money globally. Trusted by millions worldwide 
              for international transfers with the best rates.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>support@gatefinance.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>New York, London, Singapore</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Security & Compliance */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="flex flex-wrap items-center space-x-6">
              <div className="flex items-center space-x-2 text-gray-400">
                <Shield className="w-5 h-5" />
                <span className="text-sm">Bank-level security</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Globe className="w-5 h-5" />
                <span className="text-sm">200+ countries</span>
              </div>
              <div className="text-gray-400 text-sm">
                Regulated by FCA, FINTRAC, MAS
              </div>
            </div>
            
            <div className="flex flex-wrap items-center justify-start lg:justify-end space-x-4">
              <img src="/api/placeholder/80/30" alt="FCA Regulated" className="h-6 opacity-70" />
              <img src="/api/placeholder/80/30" alt="SSL Secured" className="h-6 opacity-70" />
              <img src="/api/placeholder/80/30" alt="PCI Compliant" className="h-6 opacity-70" />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col lg:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} GateFinance. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 lg:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M20 4.077a8.23 8.23 0 01-2.36.647 4.121 4.121 0 001.804-2.27 8.224 8.224 0 01-2.605.996A4.107 4.107 0 0013.85 2c-2.266 0-4.103 1.837-4.103 4.103 0 .322.036.635.106.935C6.44 6.867 3.416 5.225 1.392 2.64A4.073 4.073 0 00.879 4.58a4.099 4.099 0 001.824 3.413 4.085 4.085 0 01-1.858-.514v.052c0 1.988 1.414 3.647 3.292 4.023a4.108 4.108 0 01-1.853.07 4.106 4.106 0 003.834 2.85A8.233 8.233 0 012 16.407a11.616 11.616 0 006.29 1.84c7.547 0 11.675-6.252 11.675-11.675 0-.178-.004-.355-.012-.53A8.348 8.348 0 0020 4.077z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
