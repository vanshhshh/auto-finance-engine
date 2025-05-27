
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { User, Upload, FileText, CheckCircle, X, Download as DownloadIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useWalletData } from '@/hooks/useWalletData';

const UserSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [uploading, setUploading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<any[]>([]);
  const { user } = useAuth();
  const { profile } = useWalletData();
  const { toast } = useToast();

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    country_of_residence: '',
    nationality: '',
  });

  useEffect(() => {
    if (profile) {
      setPersonalInfo({
        country_of_residence: profile.country_of_residence || '',
        nationality: profile.nationality || '',
      });
    }
    fetchUploadedDocuments();
  }, [profile]);

  const fetchUploadedDocuments = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('kyc_documents')
      .select('*')
      .eq('user_id', user.id)
      .order('upload_date', { ascending: false });
    
    setUploadedDocs(data || []);
  };

  const handleDocumentUpload = async (documentType: string, file: File) => {
    if (!user || !file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid File Type",
        description: "Only PDF files are allowed.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileExt = 'pdf';
      const fileName = `${user.id}/${documentType}_${Date.now()}.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Save document record
      const { error: dbError } = await supabase
        .from('kyc_documents')
        .insert({
          user_id: user.id,
          document_type: documentType,
          file_name: file.name,
          file_path: fileName,
          status: 'pending'
        });

      if (dbError) throw dbError;

      // Update profile
      await supabase
        .from('profiles')
        .update({ 
          kyc_documents_uploaded: true,
          kyc_status: 'under_review'
        })
        .eq('user_id', user.id);

      toast({
        title: "Document Uploaded",
        description: "Your document has been uploaded and is being reviewed.",
        className: "bg-blue-600 text-white border-blue-700",
      });

      fetchUploadedDocuments();
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const updatePersonalInfo = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(personalInfo)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your personal information has been updated.",
        className: "bg-blue-600 text-white border-blue-700",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile information.",
        variant: "destructive",
      });
    }
  };

  const getDocumentStatus = (docType: string) => {
    const doc = uploadedDocs.find(d => d.document_type === docType);
    return doc?.status || 'not_uploaded';
  };

  const renderFileUpload = (documentType: string, label: string, required = false) => {
    const status = getDocumentStatus(documentType);
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
          <Badge className={`${
            status === 'approved' ? 'bg-green-600' :
            status === 'rejected' ? 'bg-red-600' :
            status === 'pending' ? 'bg-orange-600' : 'bg-gray-400'
          } text-white`}>
            {status === 'not_uploaded' ? 'Not Uploaded' : status.toUpperCase()}
          </Badge>
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleDocumentUpload(documentType, file);
              }
            }}
            className="hidden"
            id={`upload-${documentType}`}
            disabled={uploading || status === 'approved'}
          />
          <label
            htmlFor={`upload-${documentType}`}
            className={`flex flex-col items-center justify-center cursor-pointer ${
              status === 'approved' ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">
              {status === 'approved' ? 'Document Approved' : 
               status === 'pending' ? 'Under Review' :
               status === 'rejected' ? 'Rejected - Upload Again' :
               'Click to upload PDF'}
            </span>
          </label>
        </div>

        {status === 'rejected' && (
          <div className="text-sm text-red-600">
            Document was rejected. Please upload a new document.
          </div>
        )}
      </div>
    );
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'kyc', label: 'KYC Verification', icon: FileText },
  ];

  return (
    <div className="space-y-6 bg-white min-h-screen p-6">
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'profile' && (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country" className="text-gray-700">Country of Residence</Label>
                <Select 
                  value={personalInfo.country_of_residence} 
                  onValueChange={(value) => setPersonalInfo({...personalInfo, country_of_residence: value})}
                >
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN">India</SelectItem>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="AE">United Arab Emirates</SelectItem>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="nationality" className="text-gray-700">Nationality</Label>
                <Select 
                  value={personalInfo.nationality} 
                  onValueChange={(value) => setPersonalInfo({...personalInfo, nationality: value})}
                >
                  <SelectTrigger className="bg-white border-gray-300">
                    <SelectValue placeholder="Select nationality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Indian">Indian</SelectItem>
                    <SelectItem value="American">American</SelectItem>
                    <SelectItem value="Emirati">Emirati</SelectItem>
                    <SelectItem value="British">British</SelectItem>
                    <SelectItem value="Canadian">Canadian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={updatePersonalInfo} className="bg-blue-600 hover:bg-blue-700 text-white">
              Update Information
            </Button>
          </CardContent>
        </Card>
      )}

      {activeTab === 'kyc' && (
        <div className="space-y-6">
          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900 flex items-center gap-2">
                <FileText size={20} />
                KYC Document Upload
              </CardTitle>
              <div className="text-sm text-gray-600">
                Upload required documents for verification. All documents must be in PDF format.
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {renderFileUpload('passport', 'Passport', true)}
              {renderFileUpload('national_id', 'National ID/Driver\'s License', true)}
              {renderFileUpload('proof_of_address', 'Proof of Address (Utility Bill)', true)}
              {renderFileUpload('bank_statement', 'Bank Statement (Last 3 months)')}
            </CardContent>
          </Card>

          <Card className="bg-white border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">KYC Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Badge className={`${
                  profile?.kyc_status === 'approved' ? 'bg-green-600' :
                  profile?.kyc_status === 'under_review' ? 'bg-orange-600' :
                  profile?.kyc_status === 'rejected' ? 'bg-red-600' : 'bg-gray-600'
                } text-white px-4 py-2`}>
                  {profile?.kyc_status?.toUpperCase() || 'PENDING'}
                </Badge>
                {profile?.kyc_status === 'approved' && (
                  <CheckCircle className="text-green-600" size={20} />
                )}
                {profile?.kyc_status === 'rejected' && (
                  <X className="text-red-600" size={20} />
                )}
              </div>
              
              <div className="mt-4 text-sm text-gray-600">
                {profile?.kyc_status === 'pending' && "Please upload all required documents to start the verification process."}
                {profile?.kyc_status === 'under_review' && "Your documents are being reviewed. This typically takes 1-3 business days."}
                {profile?.kyc_status === 'approved' && "Your KYC verification is complete. You can now use all wallet features."}
                {profile?.kyc_status === 'rejected' && "Your KYC verification was rejected. Please contact support or upload new documents."}
              </div>

              {profile?.wallet_approved && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle size={16} />
                    <span className="font-medium">Wallet Approved</span>
                  </div>
                  <div className="text-sm text-green-700 mt-1">
                    Your wallet has been approved and you can now send and receive CBDC.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserSettings;
