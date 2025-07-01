
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Play, Copy, Book, Zap, Database, Lock, Users } from 'lucide-react';

export const DeveloperSandbox = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('');
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState('');
  const [apiKey, setApiKey] = useState('');

  const apiEndpoints = [
    {
      category: 'Account Management',
      icon: Users,
      endpoints: [
        { method: 'POST', path: '/api/v1/accounts/open', description: 'Create new CBDC account' },
        { method: 'GET', path: '/api/v1/accounts/{id}/balance', description: 'Get account balance' },
        { method: 'POST', path: '/api/v1/accounts/{id}/freeze', description: 'Freeze account' },
        { method: 'DELETE', path: '/api/v1/accounts/{id}/alias', description: 'Delete account alias' },
      ]
    },
    {
      category: 'Payments',
      icon: Zap,
      endpoints: [
        { method: 'POST', path: '/api/v1/payments/pay', description: 'Send payment' },
        { method: 'POST', path: '/api/v1/payments/split-pay', description: 'Split payment to multiple recipients' },
        { method: 'POST', path: '/api/v1/payments/request-to-pay', description: 'Request payment from payer' },
        { method: 'POST', path: '/api/v1/payments/fund', description: 'Fund account with CBDC' },
        { method: 'POST', path: '/api/v1/payments/defund', description: 'Withdraw CBDC from account' },
      ]
    },
    {
      category: 'Programmable Locks',
      icon: Lock,
      endpoints: [
        { method: 'POST', path: '/api/v1/locks/two-party', description: 'Create two-party lock' },
        { method: 'POST', path: '/api/v1/locks/three-party', description: 'Create three-party lock' },
        { method: 'POST', path: '/api/v1/locks/htlc', description: 'Create HTLC lock' },
        { method: 'POST', path: '/api/v1/locks/{id}/release', description: 'Release programmable lock' },
        { method: 'GET', path: '/api/v1/locks/by-account/{accountId}', description: 'Get locks by account' },
      ]
    },
    {
      category: 'ESIP Connectivity',
      icon: Database,
      endpoints: [
        { method: 'POST', path: '/api/v1/esip/connect', description: 'Connect account to ESIP' },
        { method: 'DELETE', path: '/api/v1/esip/disconnect', description: 'Disconnect account from ESIP' },
        { method: 'GET', path: '/api/v1/esip/permissions', description: 'Get ESIP permissions' },
      ]
    },
  ];

  const sampleRequests = {
    'POST /api/v1/accounts/open': {
      account_type: 'personal',
      country_code: 'US',
      alias_email: 'user@example.com',
      initial_deposit: 1000
    },
    'POST /api/v1/payments/pay': {
      from_account: 'acc_123',
      to_pip: 'pip_456',
      amount: 100.50,
      token_symbol: 'eUSD',
      description: 'Payment for services'
    },
    'POST /api/v1/locks/htlc': {
      account_id: 'acc_123',
      amount: 500,
      token_symbol: 'eINR',
      recipient_pip: 'pip_789',
      hash_condition: 'sha256_hash_here',
      time_lock: '2024-12-31T23:59:59Z'
    }
  };

  const handleEndpointSelect = (endpoint: string) => {
    setSelectedEndpoint(endpoint);
    const sample = sampleRequests[endpoint as keyof typeof sampleRequests];
    if (sample) {
      setRequestBody(JSON.stringify(sample, null, 2));
    }
  };

  const executeRequest = async () => {
    // Mock API call simulation
    setResponse(JSON.stringify({
      status: 'success',
      timestamp: new Date().toISOString(),
      data: {
        id: 'req_' + Math.random().toString(36).substr(2, 9),
        status: 'completed',
        message: 'Request executed successfully in sandbox environment'
      }
    }, null, 2));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Developer Sandbox</h2>
        <p className="text-gray-600">
          Test CBDC API endpoints in a safe sandbox environment
        </p>
      </div>

      <Tabs defaultValue="api-explorer" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="api-explorer">API Explorer</TabsTrigger>
          <TabsTrigger value="documentation">Documentation</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="api-explorer">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* API Endpoints */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  API Endpoints
                </CardTitle>
                <CardDescription>
                  Select an endpoint to test in the sandbox
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>API Key</Label>
                    <Input
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="Enter your sandbox API key"
                      type="password"
                    />
                  </div>

                  <div className="space-y-4">
                    {apiEndpoints.map((category) => (
                      <div key={category.category}>
                        <h4 className="font-medium text-sm flex items-center gap-2 mb-2">
                          <category.icon className="w-4 h-4" />
                          {category.category}
                        </h4>
                        <div className="space-y-1">
                          {category.endpoints.map((endpoint) => (
                            <div
                              key={`${endpoint.method} ${endpoint.path}`}
                              className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                                selectedEndpoint === `${endpoint.method} ${endpoint.path}`
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200'
                              }`}
                              onClick={() => handleEndpointSelect(`${endpoint.method} ${endpoint.path}`)}
                            >
                              <div className="flex items-center gap-2">
                                <Badge variant={endpoint.method === 'GET' ? 'default' : 'secondary'}>
                                  {endpoint.method}
                                </Badge>
                                <code className="text-sm">{endpoint.path}</code>
                              </div>
                              <p className="text-xs text-gray-600 mt-1">{endpoint.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Request/Response */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="w-5 h-5" />
                  Request & Response
                </CardTitle>
                <CardDescription>
                  {selectedEndpoint || 'Select an endpoint to test'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Request Body</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(requestBody)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      placeholder="Enter JSON request body"
                      className="font-mono text-sm"
                      rows={8}
                    />
                  </div>

                  <Button
                    onClick={executeRequest}
                    disabled={!selectedEndpoint || !apiKey}
                    className="w-full"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Execute Request
                  </Button>

                  {response && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>Response</Label>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(response)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={response}
                        readOnly
                        className="font-mono text-sm bg-gray-50"
                        rows={8}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documentation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Book className="w-5 h-5" />
                API Documentation
              </CardTitle>
              <CardDescription>
                Complete CBDC API reference and guides
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Quick Start Guide</h3>
                  <div className="prose prose-sm max-w-none">
                    <ol className="space-y-2">
                      <li>1. Obtain your API key from the developer portal</li>
                      <li>2. Set up authentication headers with your API key</li>
                      <li>3. Create a CBDC account using the /accounts/open endpoint</li>
                      <li>4. Fund your account using supported banking methods</li>
                      <li>5. Start making payments and using advanced features</li>
                    </ol>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Authentication</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <code className="text-sm">
                      {`Headers:
x-api-key: your_api_key_here
x-fapi-financial-id: your_financial_id
x-jws-signature: signature_for_non_repudiation
Content-Type: application/json`}
                    </code>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Rate Limits</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Sandbox: 1000 requests per hour</li>
                    <li>• Production: Based on your plan</li>
                    <li>• Webhook delivery: 10 retries with exponential backoff</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Error Codes</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>400 - Bad Request</span>
                      <span className="text-gray-600">Invalid request format</span>
                    </div>
                    <div className="flex justify-between">
                      <span>401 - Unauthorized</span>
                      <span className="text-gray-600">Invalid API key</span>
                    </div>
                    <div className="flex justify-between">
                      <span>403 - Forbidden</span>
                      <span className="text-gray-600">Insufficient permissions</span>
                    </div>
                    <div className="flex justify-between">
                      <span>429 - Too Many Requests</span>
                      <span className="text-gray-600">Rate limit exceeded</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle>Webhook Configuration</CardTitle>
              <CardDescription>
                Configure webhook endpoints for real-time notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Webhook URL</Label>
                  <Input placeholder="https://your-app.com/webhooks/cbdc" />
                </div>
                <div>
                  <Label>Events</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {[
                      'payment.completed',
                      'payment.failed',
                      'account.created',
                      'account.frozen',
                      'lock.created',
                      'lock.released',
                      'trigger.executed',
                      'compliance.alert'
                    ].map((event) => (
                      <div key={event} className="flex items-center space-x-2">
                        <input type="checkbox" id={event} className="rounded" />
                        <label htmlFor={event} className="text-sm">{event}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <Button>Save Webhook Configuration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>API Analytics</CardTitle>
              <CardDescription>
                Monitor your API usage and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">1,247</div>
                  <div className="text-sm text-gray-600">API Calls Today</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">99.8%</div>
                  <div className="text-sm text-gray-600">Success Rate</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">45ms</div>
                  <div className="text-sm text-gray-600">Avg Response Time</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
