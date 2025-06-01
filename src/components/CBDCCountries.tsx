
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Globe, TrendingUp, Clock, Eye, Plus } from 'lucide-react';

interface CBDCCountry {
  country: string;
  cbdcName: string;
  status: 'launched' | 'pilot' | 'planning' | 'research';
  launchYear?: number;
  currency: string;
  description: string;
  region: string;
}

const cbdcCountries: CBDCCountry[] = [
  // Launched
  { country: 'Bahamas', cbdcName: 'Sand Dollar', status: 'launched', launchYear: 2020, currency: 'BSD', description: "World's first CBDC", region: 'Caribbean' },
  { country: 'Jamaica', cbdcName: 'Jam-Dex', status: 'launched', launchYear: 2022, currency: 'JMD', description: 'Digital Jamaican Dollar', region: 'Caribbean' },
  { country: 'Nigeria', cbdcName: 'eNaira', status: 'launched', launchYear: 2021, currency: 'NGN', description: 'Digital Nigerian Naira', region: 'Africa' },
  { country: 'Eastern Caribbean', cbdcName: 'DCash', status: 'launched', launchYear: 2021, currency: 'XCD', description: 'Multi-country digital currency', region: 'Caribbean' },
  
  // Pilot
  { country: 'India', cbdcName: 'e-Rupee (e₹)', status: 'pilot', currency: 'INR', description: 'Digital Indian Rupee with ₹1,016 crore circulation', region: 'Asia' },
  { country: 'China', cbdcName: 'Digital Yuan (e-CNY)', status: 'pilot', currency: 'CNY', description: 'Extensive trials of digital yuan', region: 'Asia' },
  { country: 'Brazil', cbdcName: 'Drex', status: 'pilot', currency: 'BRL', description: 'Testing phase with full launch planned', region: 'South America' },
  { country: 'Russia', cbdcName: 'Digital Ruble', status: 'pilot', currency: 'RUB', description: 'Piloting digital ruble', region: 'Europe' },
  { country: 'Sweden', cbdcName: 'e-Krona', status: 'pilot', currency: 'SEK', description: 'Advanced e-krona project', region: 'Europe' },
  { country: 'Australia', cbdcName: 'eAUD', status: 'pilot', currency: 'AUD', description: 'Various stages of CBDC pilots', region: 'Oceania' },
  { country: 'Japan', cbdcName: 'Digital Yen', status: 'pilot', currency: 'JPY', description: 'CBDC pilot programs', region: 'Asia' },
  { country: 'South Korea', cbdcName: 'Digital Won', status: 'pilot', currency: 'KRW', description: 'Engaged in CBDC pilots', region: 'Asia' },
  { country: 'Turkey', cbdcName: 'Digital Lira', status: 'pilot', currency: 'TRY', description: 'Various stages of CBDC pilots', region: 'Europe' },
  
  // Planning
  { country: 'United Arab Emirates', cbdcName: 'Digital Dirham', status: 'planning', currency: 'AED', description: 'Launch planned for Q4 2025', region: 'Middle East' },
  
  // Research
  { country: 'United Kingdom', cbdcName: 'Digital Pound', status: 'research', currency: 'GBP', description: 'Bank of England exploring digital pound', region: 'Europe' },
  { country: 'United States', cbdcName: 'Digital Dollar', status: 'research', currency: 'USD', description: 'Researching CBDC possibilities', region: 'North America' },
  { country: 'Canada', cbdcName: 'Digital CAD', status: 'research', currency: 'CAD', description: 'Actively studying CBDC implementation', region: 'North America' },
  { country: 'European Union', cbdcName: 'Digital Euro', status: 'research', currency: 'EUR', description: 'EU-wide CBDC research', region: 'Europe' },
  { country: 'Ghana', cbdcName: 'e-Cedi', status: 'research', currency: 'GHS', description: 'Studying CBDC implementation', region: 'Africa' },
  { country: 'Saudi Arabia', cbdcName: 'Digital Riyal', status: 'research', currency: 'SAR', description: 'Actively studying CBDC implementation', region: 'Middle East' },
];

const CBDCCountries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const filteredCountries = cbdcCountries.filter(country => {
    const matchesSearch = country.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         country.cbdcName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || country.status === selectedStatus;
    const matchesRegion = selectedRegion === 'all' || country.region === selectedRegion;
    
    return matchesSearch && matchesStatus && matchesRegion;
  });

  const statusCounts = {
    launched: cbdcCountries.filter(c => c.status === 'launched').length,
    pilot: cbdcCountries.filter(c => c.status === 'pilot').length,
    planning: cbdcCountries.filter(c => c.status === 'planning').length,
    research: cbdcCountries.filter(c => c.status === 'research').length,
  };

  const regions = [...new Set(cbdcCountries.map(c => c.region))].sort();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'launched': return 'bg-green-600';
      case 'pilot': return 'bg-blue-600';
      case 'planning': return 'bg-orange-600';
      case 'research': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'launched': return <TrendingUp size={16} />;
      case 'pilot': return <Eye size={16} />;
      case 'planning': return <Clock size={16} />;
      case 'research': return <Search size={16} />;
      default: return <Globe size={16} />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-6 w-6" />
            Global CBDC Status
          </CardTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{statusCounts.launched}</div>
              <div className="text-sm text-green-700">Launched</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{statusCounts.pilot}</div>
              <div className="text-sm text-blue-700">Pilot</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{statusCounts.planning}</div>
              <div className="text-sm text-orange-700">Planning</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{statusCounts.research}</div>
              <div className="text-sm text-gray-700">Research</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CBDC Directory</CardTitle>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search countries or CBDC names..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Statuses</option>
              <option value="launched">Launched</option>
              <option value="pilot">Pilot</option>
              <option value="planning">Planning</option>
              <option value="research">Research</option>
            </select>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredCountries.map((country, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{country.country}</h3>
                      <Badge className={`${getStatusColor(country.status)} text-white flex items-center gap-1`}>
                        {getStatusIcon(country.status)}
                        {country.status.toUpperCase()}
                      </Badge>
                      {country.launchYear && (
                        <Badge variant="outline">{country.launchYear}</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">CBDC Name:</span> {country.cbdcName}
                      </div>
                      <div>
                        <span className="font-medium">Currency:</span> {country.currency}
                      </div>
                      <div>
                        <span className="font-medium">Region:</span> {country.region}
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2">{country.description}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus size={16} className="mr-1" />
                    Add Support
                  </Button>
                </div>
              </div>
            ))}
            {filteredCountries.length === 0 && (
              <div className="text-center py-8 text-gray-600">
                <Globe size={48} className="mx-auto mb-4 text-gray-400" />
                <p>No countries found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CBDCCountries;
