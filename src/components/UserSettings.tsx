
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Copy, Eye, EyeOff, Upload, Download, Shield, User, Wallet, Bell, CreditCard, Globe, Lock, Phone, Mail, FileText, Camera, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWalletData } from '@/hooks/useWalletData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const UserSettings = () => {
  const { user } = useAuth();
  const { profile } = useWalletData();
  const { toast } = useToast();
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [kycStep, setKycStep] = useState(1);
  const [kycData, setKycData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    nationality: '',
    countryOfResidence: '',
    phoneNumber: '',
    address: '',
    city: '',
    postalCode: '',
    occupation: '',
    sourceOfFunds: ''
  });

  const countries = [
    { code: 'IN', name: 'India', docs: ['Aadhaar Card', 'PAN Card', 'Passport', 'Voter ID'] },
    { code: 'US', name: 'United States', docs: ['Driver License', 'Passport', 'State ID', 'Social Security Card'] },
    { code: 'AE', name: 'UAE', docs: ['Emirates ID', 'Passport', 'Visa', 'Labor Card'] },
    { code: 'GB', name: 'United Kingdom', docs: ['Passport', 'Driver License', 'National Insurance', 'Utility Bill'] },
    { code: 'SG', name: 'Singapore', docs: ['NRIC', 'Passport', 'Work Permit', 'Utility Bill'] },
    { code: 'CA', name: 'Canada', docs: ['Driver License', 'Passport', 'Health Card', 'SIN Card'] }
  ];

  const getRequiredDocuments = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    return country ? country.docs : ['Passport', 'National ID', 'Proof of Address'];
  };

  const generateQRCode = () => {
    const qrData = {
      walletAddress: profile?.wallet_address,
      name: `${kycData.firstName} ${kycData.lastName}`,
      platform: 'Gate Finance',
      version: '1.0'
    };
    return JSON.stringify(qrData);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
    });
  };

  const handleKycSubmit = async () => {
    try {
      await supabase.from('audit_logs').insert({
        action: 'kyc_submission',
        user_id: user?.id,
        details: { 
          step: kycStep,
          country: kycData.countryOfResidence,
          submitted_at: new Date().toISOString()
        }
      });

      toast({
        title: "KYC Submitted",
        description: "Your KYC information has been submitted for review.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit KYC information.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="text-blue-400" size={24} />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-slate-700/50">
              <TabsTrigger value="profile" className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Profile</TabsTrigger>
              <TabsTrigger value="wallet" className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Wallet</TabsTrigger>
              <TabsTrigger value="kyc" className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">KYC</TabsTrigger>
              <TabsTrigger value="security" className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Security</TabsTrigger>
              <TabsTrigger value="notifications" className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Notifications</TabsTrigger>
              <TabsTrigger value="payment" className="text-slate-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Payment</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-slate-300">Email</Label>
                  <Input 
                    id="email" 
                    value={user?.email || ''} 
                    disabled 
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="role" className="text-slate-300">Role</Label>
                  <Input 
                    id="role" 
                    value={profile?.role || 'user'} 
                    disabled 
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
                  <Input 
                    id="phone" 
                    placeholder="+1 234 567 8900"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="language" className="text-slate-300">Language</Label>
                  <Select>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                      <SelectItem value="ar">Arabic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Update Profile
              </Button>
            </TabsContent>

            {/* Wallet Tab */}
            <TabsContent value="wallet" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-700/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Wallet className="text-blue-400" size={20} />
                      Wallet Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Input 
                        value={profile?.wallet_address || ''} 
                        disabled 
                        className="bg-slate-600 border-slate-500 text-white font-mono text-sm"
                      />
                      <Button 
                        size="sm" 
                        onClick={() => copyToClipboard(profile?.wallet_address || '', 'Wallet address')}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Copy size={16} />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-slate-300">Private Key</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowPrivateKey(!showPrivateKey)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        {showPrivateKey ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                    </div>
                    {showPrivateKey && (
                      <div className="flex items-center gap-2">
                        <Input 
                          value="0x..." 
                          disabled 
                          className="bg-slate-600 border-slate-500 text-white font-mono text-sm"
                        />
                        <Button 
                          size="sm" 
                          onClick={() => copyToClipboard('0x...', 'Private key')}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Copy size={16} />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-slate-700/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <QrCode className="text-blue-400" size={20} />
                      QR Code
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-center">
                      <div className="bg-white p-4 rounded-lg">
                        <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                          QR Code
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => copyToClipboard(generateQRCode(), 'QR data')}
                        className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                      >
                        <Copy size={16} className="mr-1" />
                        Copy Data
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 text-white flex-1"
                      >
                        <Download size={16} className="mr-1" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* KYC Tab */}
            <TabsContent value="kyc" className="space-y-6">
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="text-blue-400" size={20} />
                    KYC Verification - Step {kycStep} of 3
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {kycStep === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" className="text-slate-300">First Name</Label>
                          <Input 
                            id="firstName"
                            value={kycData.firstName}
                            onChange={(e) => setKycData({...kycData, firstName: e.target.value})}
                            className="bg-slate-600 border-slate-500 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-slate-300">Last Name</Label>
                          <Input 
                            id="lastName"
                            value={kycData.lastName}
                            onChange={(e) => setKycData({...kycData, lastName: e.target.value})}
                            className="bg-slate-600 border-slate-500 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="dob" className="text-slate-300">Date of Birth</Label>
                          <Input 
                            id="dob"
                            type="date"
                            value={kycData.dateOfBirth}
                            onChange={(e) => setKycData({...kycData, dateOfBirth: e.target.value})}
                            className="bg-slate-600 border-slate-500 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="nationality" className="text-slate-300">Nationality</Label>
                          <Select onValueChange={(value) => setKycData({...kycData, nationality: value})}>
                            <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                              <SelectValue placeholder="Select nationality" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              {countries.map((country) => (
                                <SelectItem key={country.code} value={country.code}>
                                  {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="residence" className="text-slate-300">Country of Residence</Label>
                          <Select onValueChange={(value) => setKycData({...kycData, countryOfResidence: value})}>
                            <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-700 border-slate-600">
                              {countries.map((country) => (
                                <SelectItem key={country.code} value={country.code}>
                                  {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
                          <Input 
                            id="phone"
                            value={kycData.phoneNumber}
                            onChange={(e) => setKycData({...kycData, phoneNumber: e.target.value})}
                            className="bg-slate-600 border-slate-500 text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {kycStep === 2 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">Address Information</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor="address" className="text-slate-300">Full Address</Label>
                          <Input 
                            id="address"
                            value={kycData.address}
                            onChange={(e) => setKycData({...kycData, address: e.target.value})}
                            className="bg-slate-600 border-slate-500 text-white"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city" className="text-slate-300">City</Label>
                            <Input 
                              id="city"
                              value={kycData.city}
                              onChange={(e) => setKycData({...kycData, city: e.target.value})}
                              className="bg-slate-600 border-slate-500 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="postal" className="text-slate-300">Postal Code</Label>
                            <Input 
                              id="postal"
                              value={kycData.postalCode}
                              onChange={(e) => setKycData({...kycData, postalCode: e.target.value})}
                              className="bg-slate-600 border-slate-500 text-white"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="occupation" className="text-slate-300">Occupation</Label>
                            <Input 
                              id="occupation"
                              value={kycData.occupation}
                              onChange={(e) => setKycData({...kycData, occupation: e.target.value})}
                              className="bg-slate-600 border-slate-500 text-white"
                            />
                          </div>
                          <div>
                            <Label htmlFor="funds" className="text-slate-300">Source of Funds</Label>
                            <Select onValueChange={(value) => setKycData({...kycData, sourceOfFunds: value})}>
                              <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                                <SelectValue placeholder="Select source" />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-700 border-slate-600">
                                <SelectItem value="salary">Salary</SelectItem>
                                <SelectItem value="business">Business Income</SelectItem>
                                <SelectItem value="investment">Investment Returns</SelectItem>
                                <SelectItem value="inheritance">Inheritance</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {kycStep === 3 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">Document Upload</h3>
                      <p className="text-slate-400">Please upload the following documents based on your country of residence:</p>
                      
                      {kycData.countryOfResidence && (
                        <div className="space-y-4">
                          <h4 className="text-white font-medium">Required Documents for {countries.find(c => c.code === kycData.countryOfResidence)?.name}:</h4>
                          {getRequiredDocuments(kycData.countryOfResidence).map((doc, index) => (
                            <Card key={index} className="bg-slate-600/50 border-slate-500">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <FileText className="text-blue-400" size={20} />
                                    <span className="text-white">{doc}</span>
                                  </div>
                                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                                    <Upload size={16} className="mr-1" />
                                    Upload
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    {kycStep > 1 && (
                      <Button 
                        onClick={() => setKycStep(kycStep - 1)}
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        Previous
                      </Button>
                    )}
                    <div className="flex-1" />
                    {kycStep < 3 ? (
                      <Button 
                        onClick={() => setKycStep(kycStep + 1)}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Next
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleKycSubmit}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Submit KYC
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-700/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Lock className="text-blue-400" size={20} />
                      Password & Authentication
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Change Password
                    </Button>
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                      Enable 2FA
                    </Button>
                    <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                      Backup Codes
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-slate-700/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="text-blue-400" size={20} />
                      Account Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Login Alerts</span>
                      <Badge className="bg-green-600 text-white">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Transaction Limits</span>
                      <Badge className="bg-blue-600 text-white">Active</Badge>
                    </div>
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                      View Login History
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-4">
              <Card className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bell className="text-blue-400" size={20} />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white">Transaction Alerts</div>
                        <div className="text-slate-400 text-sm">Get notified of all transactions</div>
                      </div>
                      <Badge className="bg-green-600 text-white">ON</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white">Security Alerts</div>
                        <div className="text-slate-400 text-sm">Login and security notifications</div>
                      </div>
                      <Badge className="bg-green-600 text-white">ON</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-white">Marketing Emails</div>
                        <div className="text-slate-400 text-sm">Product updates and offers</div>
                      </div>
                      <Badge className="bg-gray-600 text-white">OFF</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Tab */}
            <TabsContent value="payment" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-700/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <CreditCard className="text-blue-400" size={20} />
                      Transaction Limits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-slate-300">
                        <span>Daily Limit</span>
                        <span>₹1,00,000</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Monthly Limit</span>
                        <span>₹30,00,000</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Used Today</span>
                        <span>₹25,000</span>
                      </div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Request Limit Increase
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-slate-700/50 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Globe className="text-blue-400" size={20} />
                      Regional Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-slate-300">Primary Currency</Label>
                      <Select>
                        <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="eINR">eINR (₹)</SelectItem>
                          <SelectItem value="eUSD">eUSD ($)</SelectItem>
                          <SelectItem value="eAED">eAED (د.إ)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-slate-300">Time Zone</Label>
                      <Select>
                        <SelectTrigger className="bg-slate-600 border-slate-500 text-white">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-700 border-slate-600">
                          <SelectItem value="UTC+5:30">IST (UTC+5:30)</SelectItem>
                          <SelectItem value="UTC+4">GST (UTC+4)</SelectItem>
                          <SelectItem value="UTC-5">EST (UTC-5)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettings;
