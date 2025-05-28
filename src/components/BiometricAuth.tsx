
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Fingerprint, Eye, Mic, Shield, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BiometricAuth = () => {
  const [biometricSupport, setBiometricSupport] = useState({
    fingerprint: false,
    faceID: false,
    voiceRecognition: false,
    webAuthn: false
  });
  const [enrolledMethods, setEnrolledMethods] = useState({
    fingerprint: false,
    faceID: false,
    voiceRecognition: false
  });
  const [authenticating, setAuthenticating] = useState('');
  const { toast } = useToast();

  React.useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    // Check for WebAuthn support
    const webAuthnSupported = window.PublicKeyCredential !== undefined;
    
    // Check for basic biometric API support (simplified detection)
    const fingerprintSupported = 'credentials' in navigator;
    const faceIDSupported = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;
    const voiceSupported = 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices;

    setBiometricSupport({
      fingerprint: fingerprintSupported,
      faceID: faceIDSupported,
      voiceRecognition: voiceSupported,
      webAuthn: webAuthnSupported
    });
  };

  const enrollBiometric = async (method: string) => {
    setAuthenticating(method);
    
    try {
      if (method === 'fingerprint' && biometricSupport.webAuthn) {
        // WebAuthn fingerprint enrollment
        const credential = await navigator.credentials.create({
          publicKey: {
            challenge: new Uint8Array(32),
            rp: { name: "Gate Finance", id: "gatefi.app" },
            user: {
              id: new Uint8Array(16),
              name: "user@example.com",
              displayName: "User"
            },
            pubKeyCredParams: [{ alg: -7, type: "public-key" }],
            authenticatorSelection: {
              authenticatorAttachment: "platform",
              userVerification: "required"
            },
            timeout: 60000,
            attestation: "direct"
          }
        });

        if (credential) {
          setEnrolledMethods(prev => ({ ...prev, fingerprint: true }));
          toast({
            title: "Fingerprint Enrolled",
            description: "Your fingerprint has been successfully registered.",
            className: "bg-green-600 text-white border-green-700",
          });
        }
      } else if (method === 'faceID') {
        // Simulate Face ID enrollment
        await new Promise(resolve => setTimeout(resolve, 2000));
        setEnrolledMethods(prev => ({ ...prev, faceID: true }));
        toast({
          title: "Face ID Enrolled",
          description: "Your face has been successfully registered.",
          className: "bg-green-600 text-white border-green-700",
        });
      } else if (method === 'voiceRecognition') {
        // Voice recognition enrollment simulation
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        
        await new Promise(resolve => setTimeout(resolve, 3000));
        setEnrolledMethods(prev => ({ ...prev, voiceRecognition: true }));
        toast({
          title: "Voice Enrolled",
          description: "Your voice pattern has been successfully registered.",
          className: "bg-green-600 text-white border-green-700",
        });
      }
    } catch (error) {
      console.error('Biometric enrollment error:', error);
      toast({
        title: "Enrollment Failed",
        description: "Failed to enroll biometric authentication. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAuthenticating('');
    }
  };

  const authenticateWithBiometric = async (method: string) => {
    setAuthenticating(method);
    
    try {
      if (method === 'fingerprint' && enrolledMethods.fingerprint) {
        const credential = await navigator.credentials.get({
          publicKey: {
            challenge: new Uint8Array(32),
            timeout: 60000,
            userVerification: "required"
          }
        });

        if (credential) {
          toast({
            title: "Authentication Successful",
            description: "Fingerprint authentication completed.",
            className: "bg-green-600 text-white border-green-700",
          });
        }
      } else {
        // Simulate other biometric authentication
        await new Promise(resolve => setTimeout(resolve, 2000));
        toast({
          title: "Authentication Successful",
          description: `${method} authentication completed.`,
          className: "bg-green-600 text-white border-green-700",
        });
      }
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Biometric authentication was not successful.",
        variant: "destructive",
      });
    } finally {
      setAuthenticating('');
    }
  };

  const removeBiometric = (method: string) => {
    setEnrolledMethods(prev => ({ ...prev, [method]: false }));
    toast({
      title: "Biometric Removed",
      description: `${method} authentication has been disabled.`,
      className: "bg-blue-600 text-white border-blue-700",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="text-blue-600" size={20} />
            Biometric Authentication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Fingerprint */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Fingerprint className="text-blue-600" size={24} />
                  <div>
                    <div className="font-medium">Fingerprint Authentication</div>
                    <div className="text-sm text-gray-600">Use your fingerprint to authenticate</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {biometricSupport.fingerprint ? (
                    <CheckCircle className="text-green-600" size={20} />
                  ) : (
                    <XCircle className="text-red-600" size={20} />
                  )}
                  <Badge className={`${
                    biometricSupport.fingerprint ? 'bg-green-600' : 'bg-red-600'
                  } text-white`}>
                    {biometricSupport.fingerprint ? 'Supported' : 'Not Supported'}
                  </Badge>
                </div>
              </div>
              
              {biometricSupport.fingerprint && (
                <div className="flex gap-2">
                  {!enrolledMethods.fingerprint ? (
                    <Button
                      onClick={() => enrollBiometric('fingerprint')}
                      disabled={authenticating === 'fingerprint'}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {authenticating === 'fingerprint' ? 'Enrolling...' : 'Enroll Fingerprint'}
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => authenticateWithBiometric('fingerprint')}
                        disabled={authenticating === 'fingerprint'}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {authenticating === 'fingerprint' ? 'Authenticating...' : 'Test Authentication'}
                      </Button>
                      <Button
                        onClick={() => removeBiometric('fingerprint')}
                        variant="outline"
                        className="border-red-400 text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Face ID */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Eye className="text-green-600" size={24} />
                  <div>
                    <div className="font-medium">Face ID</div>
                    <div className="text-sm text-gray-600">Use facial recognition to authenticate</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {biometricSupport.faceID ? (
                    <CheckCircle className="text-green-600" size={20} />
                  ) : (
                    <XCircle className="text-red-600" size={20} />
                  )}
                  <Badge className={`${
                    biometricSupport.faceID ? 'bg-green-600' : 'bg-red-600'
                  } text-white`}>
                    {biometricSupport.faceID ? 'Supported' : 'Not Supported'}
                  </Badge>
                </div>
              </div>
              
              {biometricSupport.faceID && (
                <div className="flex gap-2">
                  {!enrolledMethods.faceID ? (
                    <Button
                      onClick={() => enrollBiometric('faceID')}
                      disabled={authenticating === 'faceID'}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {authenticating === 'faceID' ? 'Enrolling...' : 'Enroll Face ID'}
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => authenticateWithBiometric('faceID')}
                        disabled={authenticating === 'faceID'}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        {authenticating === 'faceID' ? 'Authenticating...' : 'Test Authentication'}
                      </Button>
                      <Button
                        onClick={() => removeBiometric('faceID')}
                        variant="outline"
                        className="border-red-400 text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Voice Recognition */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Mic className="text-purple-600" size={24} />
                  <div>
                    <div className="font-medium">Voice Recognition</div>
                    <div className="text-sm text-gray-600">Use your voice pattern to authenticate</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {biometricSupport.voiceRecognition ? (
                    <CheckCircle className="text-green-600" size={20} />
                  ) : (
                    <XCircle className="text-red-600" size={20} />
                  )}
                  <Badge className={`${
                    biometricSupport.voiceRecognition ? 'bg-green-600' : 'bg-red-600'
                  } text-white`}>
                    {biometricSupport.voiceRecognition ? 'Supported' : 'Not Supported'}
                  </Badge>
                </div>
              </div>
              
              {biometricSupport.voiceRecognition && (
                <div className="flex gap-2">
                  {!enrolledMethods.voiceRecognition ? (
                    <Button
                      onClick={() => enrollBiometric('voiceRecognition')}
                      disabled={authenticating === 'voiceRecognition'}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {authenticating === 'voiceRecognition' ? 'Enrolling...' : 'Enroll Voice'}
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => authenticateWithBiometric('voiceRecognition')}
                        disabled={authenticating === 'voiceRecognition'}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {authenticating === 'voiceRecognition' ? 'Authenticating...' : 'Test Authentication'}
                      </Button>
                      <Button
                        onClick={() => removeBiometric('voiceRecognition')}
                        variant="outline"
                        className="border-red-400 text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Status */}
      <Card>
        <CardHeader>
          <CardTitle>Biometric Security Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>Enrolled Methods</span>
              <span className="font-medium">
                {Object.values(enrolledMethods).filter(v => v).length} of 3
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>Security Level</span>
              <Badge className={`${
                Object.values(enrolledMethods).filter(v => v).length >= 2 ? 'bg-green-600' :
                Object.values(enrolledMethods).some(v => v) ? 'bg-orange-600' : 'bg-red-600'
              } text-white`}>
                {Object.values(enrolledMethods).filter(v => v).length >= 2 ? 'High' :
                 Object.values(enrolledMethods).some(v => v) ? 'Medium' : 'Low'}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span>Device Support</span>
              <Badge className={`${
                Object.values(biometricSupport).filter(v => v).length >= 2 ? 'bg-green-600' : 'bg-orange-600'
              } text-white`}>
                {Object.values(biometricSupport).filter(v => v).length >= 2 ? 'Good' : 'Limited'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BiometricAuth;
