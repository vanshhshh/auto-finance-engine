
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Shield, Smartphone, Mail, Key, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const MultiFactorAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [authApp, setAuthApp] = useState('');
  const [mfaEnabled, setMfaEnabled] = useState({
    sms: false,
    email: true,
    app: false
  });
  const [verificationStep, setVerificationStep] = useState<'setup' | 'verify'>('setup');
  const { user } = useAuth();
  const { toast } = useToast();

  const enableSMSAuth = async () => {
    if (!phoneNumber) {
      toast({
        title: "Phone Required",
        description: "Please enter your phone number.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate SMS sending
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Store verification code (in real app, this would be sent via SMS)
      await supabase
        .from('mfa_verifications')
        .insert({
          user_id: user?.id,
          method: 'sms',
          code: code,
          phone_number: phoneNumber,
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
        });

      setVerificationStep('verify');
      toast({
        title: "SMS Sent",
        description: `Verification code sent to ${phoneNumber}. Code: ${code} (Demo)`,
        className: "bg-blue-600 text-white border-blue-700",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send SMS verification.",
        variant: "destructive",
      });
    }
  };

  const verifySMSCode = async () => {
    try {
      const { data } = await supabase
        .from('mfa_verifications')
        .select('*')
        .eq('user_id', user?.id)
        .eq('method', 'sms')
        .eq('code', smsCode)
        .gt('expires_at', new Date().toISOString())
        .single();

      if (data) {
        setMfaEnabled(prev => ({ ...prev, sms: true }));
        setVerificationStep('setup');
        toast({
          title: "SMS MFA Enabled",
          description: "SMS multi-factor authentication has been enabled.",
          className: "bg-blue-600 text-white border-blue-700",
        });
      } else {
        toast({
          title: "Invalid Code",
          description: "The verification code is invalid or expired.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Failed to verify SMS code.",
        variant: "destructive",
      });
    }
  };

  const enableEmailAuth = async () => {
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      await supabase
        .from('mfa_verifications')
        .insert({
          user_id: user?.id,
          method: 'email',
          code: code,
          email: user?.email,
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
        });

      toast({
        title: "Email Sent",
        description: `Verification code sent to your email. Code: ${code} (Demo)`,
        className: "bg-blue-600 text-white border-blue-700",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email verification.",
        variant: "destructive",
      });
    }
  };

  const generateAuthAppSecret = () => {
    const secret = Array.from({ length: 32 }, () => 
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'[Math.floor(Math.random() * 32)]
    ).join('');
    setAuthApp(secret);
    
    toast({
      title: "Authenticator Secret Generated",
      description: "Scan the QR code or enter the secret manually in your authenticator app.",
      className: "bg-blue-600 text-white border-blue-700",
    });
  };

  const disableMFA = async (method: string) => {
    try {
      setMfaEnabled(prev => ({ ...prev, [method]: false }));
      toast({
        title: "MFA Disabled",
        description: `${method.toUpperCase()} multi-factor authentication has been disabled.`,
        className: "bg-blue-600 text-white border-blue-700",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disable MFA.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="text-blue-600" size={20} />
            Multi-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* SMS Authentication */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Smartphone className="text-green-600" size={20} />
                  <div>
                    <div className="font-medium">SMS Authentication</div>
                    <div className="text-sm text-gray-600">Receive codes via text message</div>
                  </div>
                </div>
                <Badge className={`${mfaEnabled.sms ? 'bg-green-600' : 'bg-gray-600'} text-white`}>
                  {mfaEnabled.sms ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              
              {!mfaEnabled.sms ? (
                verificationStep === 'setup' ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1234567890"
                      />
                    </div>
                    <Button 
                      onClick={enableSMSAuth}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Send Verification Code
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="smsCode">Verification Code</Label>
                      <Input
                        id="smsCode"
                        value={smsCode}
                        onChange={(e) => setSmsCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={verifySMSCode}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Check size={16} className="mr-1" />
                        Verify
                      </Button>
                      <Button 
                        onClick={() => setVerificationStep('setup')}
                        variant="outline"
                      >
                        <X size={16} className="mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                )
              ) : (
                <Button 
                  onClick={() => disableMFA('sms')}
                  variant="outline"
                  className="border-red-400 text-red-600 hover:bg-red-50"
                >
                  Disable SMS MFA
                </Button>
              )}
            </div>

            {/* Email Authentication */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-blue-600" size={20} />
                  <div>
                    <div className="font-medium">Email Authentication</div>
                    <div className="text-sm text-gray-600">Receive codes via email</div>
                  </div>
                </div>
                <Badge className={`${mfaEnabled.email ? 'bg-green-600' : 'bg-gray-600'} text-white`}>
                  {mfaEnabled.email ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              
              {!mfaEnabled.email ? (
                <Button 
                  onClick={enableEmailAuth}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Enable Email MFA
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Email: {user?.email}</span>
                  <Button 
                    onClick={() => disableMFA('email')}
                    variant="outline"
                    size="sm"
                    className="border-red-400 text-red-600 hover:bg-red-50"
                  >
                    Disable
                  </Button>
                </div>
              )}
            </div>

            {/* Authenticator App */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Key className="text-purple-600" size={20} />
                  <div>
                    <div className="font-medium">Authenticator App</div>
                    <div className="text-sm text-gray-600">Use Google Authenticator or similar apps</div>
                  </div>
                </div>
                <Badge className={`${mfaEnabled.app ? 'bg-green-600' : 'bg-gray-600'} text-white`}>
                  {mfaEnabled.app ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
              
              {!mfaEnabled.app ? (
                <div className="space-y-3">
                  {authApp ? (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="text-sm font-medium mb-2">Secret Key:</div>
                      <div className="font-mono text-sm break-all bg-white p-2 rounded border">
                        {authApp}
                      </div>
                      <div className="text-xs text-gray-600 mt-2">
                        Enter this secret in your authenticator app, then verify with a generated code.
                      </div>
                    </div>
                  ) : null}
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={generateAuthAppSecret}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {authApp ? 'Regenerate Secret' : 'Generate Secret'}
                    </Button>
                    {authApp && (
                      <Button 
                        onClick={() => setMfaEnabled(prev => ({ ...prev, app: true }))}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Enable App MFA
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={() => disableMFA('app')}
                  variant="outline"
                  className="border-red-400 text-red-600 hover:bg-red-50"
                >
                  Disable App MFA
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Status */}
      <Card>
        <CardHeader>
          <CardTitle>Security Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>Two-Factor Authentication</span>
              <Badge className={`${
                Object.values(mfaEnabled).some(v => v) ? 'bg-green-600' : 'bg-red-600'
              } text-white`}>
                {Object.values(mfaEnabled).some(v => v) ? 'Protected' : 'Vulnerable'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>Active MFA Methods</span>
              <span className="font-medium">
                {Object.values(mfaEnabled).filter(v => v).length} of 3
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>Security Level</span>
              <Badge className={`${
                Object.values(mfaEnabled).filter(v => v).length >= 2 ? 'bg-green-600' :
                Object.values(mfaEnabled).some(v => v) ? 'bg-orange-600' : 'bg-red-600'
              } text-white`}>
                {Object.values(mfaEnabled).filter(v => v).length >= 2 ? 'High' :
                 Object.values(mfaEnabled).some(v => v) ? 'Medium' : 'Low'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiFactorAuth;
