import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QrCode, Copy, Upload, Shield, User, Wallet, Bell, CreditCard, Globe, Lock, FileText } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWalletData } from '@/hooks/useWalletData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const UserSettings = () => {
  const { user } = useAuth();
  const { profile } = useWalletData();
  const { toast } = useToast();
  const [kycStep, setKycStep] = useState(1);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<{[key: string]: boolean}>({});
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
    { code: 'IN', name: 'India', docs: ['Aadhaar Card', 'PAN Card', 'Passport', 'Address Proof'] },
    { code: 'US', name: 'United States', docs: ['Driver License', 'Passport', 'SSN Card', 'Utility Bill'] },
    { code: 'AE', name: 'UAE', docs: ['Emirates ID', 'Passport', 'Visa', 'Salary Certificate'] },
    { code: 'GB', name: 'United Kingdom', docs: ['Passport', 'Driver License', 'National Insurance', 'Council Tax Bill'] },
    { code: 'SG', name: 'Singapore', docs: ['NRIC', 'Passport', 'Work Permit', 'Bank Statement'] },
    { code: 'CA', name: 'Canada', docs: ['Driver License', 'Passport', 'Health Card', 'Employment Letter'] }
  ];

  const getRequiredDocuments = (countryCode: string) => {
    const country = countries.find(c => c.code === countryCode);
    return country ? country.docs : ['Passport', 'National ID', 'Proof of Address', 'Income Proof'];
  };

  const generateQRCode = () => {
    const qrData = {
      walletAddress: profile?.wallet_address,
      name: `${kycData.firstName} ${kycData.lastName}` || user?.email?.split('@')[0],
      platform: 'Gate Finance',
      type: 'payment_request',
      version: '1.0',
      userId: user?.id
    };
    return JSON.stringify(qrData);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${type} copied to clipboard`,
      className: "bg-blue-600 text-white border-blue-700",
    });
  };

  const handleFileUpload = async (file: File, docType: string) => {
    if (!user) return;
    
    setUploadingDoc(docType);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${docType}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Save document record
      const { error: dbError } = await supabase
        .from('kyc_documents')
        .insert({
          user_id: user.id,
          document_type: docType,
          file_name: file.name,
          file_path: fileName,
          status: 'pending'
        });

      if (dbError) throw dbError;

      setUploadedDocs(prev => ({ ...prev, [docType]: true }));

      toast({
        title: "Document Uploaded",
        description: "Your document has been uploaded and is being reviewed.",
        className: "bg-blue-600 text-white border-blue-700",
      });
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleKycSubmit = async () => {
    try {
      // Update profile with KYC data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          kyc_status: 'under_review',
          kyc_documents_uploaded: true,
          country_of_residence: kycData.countryOfResidence,
          nationality: kycData.nationality
        })
        .eq('user_id', user?.id);

      if (profileError) throw profileError;

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
        description: "Your KYC information has been submitted for review. You'll be notified once approved.",
        className: "bg-blue-600 text-white border-blue-700",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to submit KYC information.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6 bg-white min-h-screen">
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900 flex items-center gap-2">
            <User className="text-blue-600" size={24} />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-gray-100">
              <TabsTrigger value="profile" className="text-gray-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Profile</TabsTrigger>
              <TabsTrigger value="wallet" className="text-gray-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Wallet</TabsTrigger>
              <TabsTrigger value="kyc" className="text-gray-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white">KYC</TabsTrigger>
              <TabsTrigger value="security" className="text-gray-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Security</TabsTrigger>
              <TabsTrigger value="notifications" className="text-gray-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Notifications</TabsTrigger>
              <TabsTrigger value="payment" className="text-gray-600 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Payment</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-gray-700">Email</Label>
                  <Input 
                    id="email" 
                    value={user?.email || ''} 
                    disabled 
                    className="bg-gray-100 border-gray-300 text-gray-900"
                  />
                </div>
                <div>
                  <Label htmlFor="role" className="text-gray-700">Role</Label>
                  <Input 
                    id="role" 
                    value={profile?.role || 'user'} 
                    disabled 
                    className="bg-gray-100 border-gray-300 text-gray-900"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                  <Input 
                    id="phone" 
                    placeholder="+1 234 567 8900"
                    className="bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <div>
                  <Label htmlFor="language" className="text-gray-700">Language</Label>
                  <Select>
                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-300">
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
                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <Wallet className="text-blue-600" size={20} />
                      Wallet Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Input 
                        value={profile?.wallet_address || ''} 
                        disabled 
                        className="bg-gray-100 border-gray-300 text-gray-900 font-mono text-sm"
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
                      <Badge className={`${profile?.wallet_approved ? 'bg-green-600' : 'bg-orange-600'} text-white`}>
                        {profile?.wallet_approved ? 'Approved' : 'Pending Approval'}
                      </Badge>
                      <Badge className={`${profile?.kyc_status === 'approved' ? 'bg-green-600' : 'bg-orange-600'} text-white`}>
                        KYC: {profile?.kyc_status || 'Pending'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <QrCode className="text-blue-600" size={20} />
                      Payment QR Code
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-center">
                      <div className="bg-white p-4 rounded-lg border border-gray-300">
                        <div className="w-32 h-32 bg-gray-100 flex items-center justify-center text-gray-500 text-xs border border-gray-300 rounded">
                          <div className="text-center">
                            <QrCode size={48} className="mx-auto mb-2" />
                            <div className="text-xs">QR Code</div>
                            <div className="text-xs text-gray-400">Scan to Pay</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => copyToClipboard(generateQRCode(), 'QR payment data')}
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
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Shield className="text-blue-600" size={20} />
                    KYC Verification - Step {kycStep} of 3
                    <Badge className={`ml-auto ${
                      profile?.kyc_status === 'approved' ? 'bg-green-600' :
                      profile?.kyc_status === 'under_review' ? 'bg-orange-600' :
                      profile?.kyc_status === 'rejected' ? 'bg-red-600' : 'bg-gray-600'
                    } text-white`}>
                      {profile?.kyc_status?.toUpperCase() || 'PENDING'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile?.kyc_status === 'under_review' && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <div className="text-orange-800 font-medium">Documents Under Review</div>
                      <div className="text-orange-700 text-sm">
                        Your KYC documents are being verified by our team. This process typically takes 1-3 business days.
                      </div>
                    </div>
                  )}

                  {kycStep === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
                          <Input 
                            id="firstName"
                            value={kycData.firstName}
                            onChange={(e) => setKycData({...kycData, firstName: e.target.value})}
                            className="bg-white border-gray-300 text-gray-900"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
                          <Input 
                            id="lastName"
                            value={kycData.lastName}
                            onChange={(e) => setKycData({...kycData, lastName: e.target.value})}
                            className="bg-white border-gray-300 text-gray-900"
                          />
                        </div>
                        <div>
                          <Label htmlFor="dob" className="text-gray-700">Date of Birth</Label>
                          <Input 
                            id="dob"
                            type="date"
                            value={kycData.dateOfBirth}
                            onChange={(e) => setKycData({...kycData, dateOfBirth: e.target.value})}
                            className="bg-white border-gray-300 text-gray-900"
                          />
                        </div>
                        <div>
                          <Label htmlFor="nationality" className="text-gray-700">Nationality</Label>
                          <Select onValueChange={(value) => setKycData({...kycData, nationality: value})}>
                            <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                              <SelectValue placeholder="Select nationality" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-300">
                              {countries.map((country) => (
                                <SelectItem key={country.code} value={country.code}>
                                  {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="residence" className="text-gray-700">Country of Residence</Label>
                          <Select onValueChange={(value) => setKycData({...kycData, countryOfResidence: value})}>
                            <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-gray-300">
                              {countries.map((country) => (
                                <SelectItem key={country.code} value={country.code}>
                                  {country.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                          <Input 
                            id="phone"
                            value={kycData.phoneNumber}
                            onChange={(e) => setKycData({...kycData, phoneNumber: e.target.value})}
                            className="bg-white border-gray-300 text-gray-900"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {kycStep === 2 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-900">Address & Employment</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <Label htmlFor="address" className="text-gray-700">Full Address</Label>
                          <Input 
                            id="address"
                            value={kycData.address}
                            onChange={(e) => setKycData({...kycData, address: e.target.value})}
                            className="bg-white border-gray-300 text-gray-900"
                          />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city" className="text-gray-700">City</Label>
                            <Input 
                              id="city"
                              value={kycData.city}
                              onChange={(e) => setKycData({...kycData, city: e.target.value})}
                              className="bg-white border-gray-300 text-gray-900"
                            />
                          </div>
                          <div>
                            <Label htmlFor="postal" className="text-gray-700">Postal Code</Label>
                            <Input 
                              id="postal"
                              value={kycData.postalCode}
                              onChange={(e) => setKycData({...kycData, postalCode: e.target.value})}
                              className="bg-white border-gray-300 text-gray-900"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="occupation" className="text-gray-700">Occupation</Label>
                            <Input 
                              id="occupation"
                              value={kycData.occupation}
                              onChange={(e) => setKycData({...kycData, occupation: e.target.value})}
                              className="bg-white border-gray-300 text-gray-900"
                            />
                          </div>
                          <div>
                            <Label htmlFor="funds" className="text-gray-700">Source of Funds</Label>
                            <Select onValueChange={(value) => setKycData({...kycData, sourceOfFunds: value})}>
                              <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                <SelectValue placeholder="Select source" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-gray-300">
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
                      <h3 className="text-lg font-medium text-gray-900">Document Upload</h3>
                      <p className="text-gray-600">Upload documents in PDF format only. All documents are required for verification.</p>
                      
                      {kycData.countryOfResidence && (
                        <div className="space-y-4">
                          <h4 className="text-gray-800 font-medium">Required Documents for {countries.find(c => c.code === kycData.countryOfResidence)?.name}:</h4>
                          {getRequiredDocuments(kycData.countryOfResidence).map((doc, index) => (
                            <Card key={index} className="bg-white border-gray-200">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <FileText className="text-blue-600" size={20} />
                                    <span className="text-gray-900">{doc}</span>
                                    {uploadedDocs[doc.toLowerCase().replace(/\s+/g, '_')] && (
                                      <Badge className="bg-green-600 text-white">Uploaded</Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="file"
                                      accept=".pdf"
                                      onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                          if (file.type !== 'application/pdf') {
                                            toast({
                                              title: "Invalid File Type",
                                              description: "Please upload PDF files only.",
                                              variant: "destructive",
                                            });
                                            return;
                                          }
                                          handleFileUpload(file, doc.toLowerCase().replace(/\s+/g, '_'));
                                        }
                                      }}
                                      className="hidden"
                                      id={`file-${index}`}
                                    />
                                    <Button 
                                      size="sm" 
                                      onClick={() => document.getElementById(`file-${index}`)?.click()}
                                      disabled={uploadingDoc === doc.toLowerCase().replace(/\s+/g, '_')}
                                      className={uploadedDocs[doc.toLowerCase().replace(/\s+/g, '_')] 
                                        ? "bg-green-600 hover:bg-green-700 text-white" 
                                        : "bg-blue-600 hover:bg-blue-700 text-white"
                                      }
                                    >
                                      <Upload size={16} className="mr-1" />
                                      {uploadingDoc === doc.toLowerCase().replace(/\s+/g, '_') ? 'Uploading...' : 
                                       uploadedDocs[doc.toLowerCase().replace(/\s+/g, '_')] ? 'Uploaded' : 'Upload PDF'}
                                    </Button>
                                  </div>
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
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
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
                        disabled={profile?.kyc_status === 'under_review'}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {profile?.kyc_status === 'under_review' ? 'Submitted' : 'Submit KYC'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <Lock className="text-blue-600" size={20} />
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

                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <Shield className="text-blue-600" size={20} />
                      Account Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Login Alerts</span>
                      <Badge className="bg-green-600 text-white">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Transaction Limits</span>
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
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900 flex items-center gap-2">
                    <Bell className="text-blue-600" size={20} />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-gray-900">Transaction Alerts</div>
                        <div className="text-gray-600 text-sm">Get notified of all transactions</div>
                      </div>
                      <Badge className="bg-green-600 text-white">ON</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-gray-900">Security Alerts</div>
                        <div className="text-gray-600 text-sm">Login and security notifications</div>
                      </div>
                      <Badge className="bg-green-600 text-white">ON</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-gray-900">Marketing Emails</div>
                        <div className="text-gray-600 text-sm">Product updates and offers</div>
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
                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <CreditCard className="text-blue-600" size={20} />
                      Transaction Limits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-gray-700">
                        <span>Daily Limit</span>
                        <span>₹1,00,000</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Monthly Limit</span>
                        <span>₹30,00,000</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Used Today</span>
                        <span>₹0</span>
                      </div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Request Limit Increase
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900 flex items-center gap-2">
                      <Globe className="text-blue-600" size={20} />
                      Regional Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-gray-700">Primary Currency</Label>
                      <Select>
                        <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300">
                          <SelectItem value="eINR">eINR (₹)</SelectItem>
                          <SelectItem value="eUSD">eUSD ($)</SelectItem>
                          <SelectItem value="eAED">eAED (د.إ)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-700">Time Zone</Label>
                      <Select>
                        <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300">
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
