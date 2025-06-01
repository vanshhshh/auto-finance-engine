
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FileText, Upload, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const KYCOnboarding = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [personalInfo, setPersonalInfo] = useState({
    country_of_residence: '',
    nationality: '',
  });

  const [documents, setDocuments] = useState({
    passport: null as File | null,
    national_id: null as File | null,
    proof_of_address: null as File | null,
  });

  const handlePersonalInfoSubmit = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update(personalInfo)
        .eq('user_id', user.id);

      if (error) throw error;

      setStep(2);
      toast({
        title: "Personal Information Saved",
        description: "Please upload your documents to continue.",
        className: "bg-blue-600 text-white border-blue-700",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save personal information.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentUpload = async (documentType: string, file: File) => {
    if (!user || !file) return;

    try {
      setLoading(true);
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

      toast({
        title: "Document Uploaded",
        description: `${documentType} has been uploaded successfully.`,
        className: "bg-blue-600 text-white border-blue-700",
      });
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const completeKYC = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({ 
          kyc_documents_uploaded: true,
          kyc_status: 'under_review'
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setStep(3);
      toast({
        title: "KYC Submitted",
        description: "Your documents have been submitted for review.",
        className: "bg-blue-600 text-white border-blue-700",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete KYC process.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FileText className="text-blue-600" size={32} />
          </div>
          <CardTitle className="text-2xl">KYC Verification</CardTitle>
          <p className="text-gray-600">Complete your identity verification to access your wallet</p>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="country">Country of Residence</Label>
                  <Select 
                    value={personalInfo.country_of_residence} 
                    onValueChange={(value) => setPersonalInfo({...personalInfo, country_of_residence: value})}
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="nationality">Nationality</Label>
                  <Select 
                    value={personalInfo.nationality} 
                    onValueChange={(value) => setPersonalInfo({...personalInfo, nationality: value})}
                  >
                    <SelectTrigger>
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

              <Button 
                onClick={handlePersonalInfoSubmit}
                disabled={loading || !personalInfo.country_of_residence || !personalInfo.nationality}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Saving...' : 'Continue'}
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Document Upload</h3>
              <p className="text-gray-600">Please upload the following documents in PDF format:</p>
              
              <div className="space-y-4">
                {['passport', 'national_id', 'proof_of_address'].map((docType) => (
                  <div key={docType} className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setDocuments({...documents, [docType]: file});
                          handleDocumentUpload(docType, file);
                        }
                      }}
                      className="hidden"
                      id={`upload-${docType}`}
                    />
                    <label
                      htmlFor={`upload-${docType}`}
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">
                        Upload {docType.replace('_', ' ').toUpperCase()} (PDF)
                      </span>
                    </label>
                  </div>
                ))}
              </div>

              <Button 
                onClick={completeKYC}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Submitting...' : 'Submit for Review'}
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-4">
              <CheckCircle className="mx-auto text-green-600" size={64} />
              <h3 className="text-lg font-semibold text-green-600">KYC Submitted Successfully</h3>
              <p className="text-gray-600">
                Your documents have been submitted for review. This typically takes 1-3 business days.
                We'll notify you once the verification is complete.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KYCOnboarding;
