
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, Settings, AlertTriangle, CheckCircle, Pause, Play } from 'lucide-react';

interface AdminAction {
  id: string;
  type: 'limit_update' | 'user_flag' | 'rule_override' | 'system_control';
  description: string;
  timestamp: string;
  admin: string;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('limits');
  const [mintLimit, setMintLimit] = useState('1000000');
  const [burnLimit, setBurnLimit] = useState('500000');
  const [dailyLimit, setDailyLimit] = useState('50000');
  const [systemEnabled, setSystemEnabled] = useState(true);
  const { toast } = useToast();

  const [recentActions] = useState<AdminAction[]>([
    {
      id: '1',
      type: 'limit_update',
      description: 'Updated daily transaction limit to ₹50,000',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      admin: 'Admin User',
    },
    {
      id: '2',
      type: 'user_flag',
      description: 'Flagged user 0x1234...5678 for KYC verification',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      admin: 'Compliance Officer',
    },
  ]);

  const [flaggedUsers] = useState([
    {
      id: '1',
      address: '0x1234567890abcdef1234567890abcdef12345678',
      reason: 'High volume transactions',
      status: 'pending_review',
      flaggedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: '2',
      address: '0xabcdef1234567890abcdef1234567890abcdef12',
      reason: 'Suspicious pattern',
      status: 'under_investigation',
      flaggedAt: new Date(Date.now() - 172800000).toISOString(),
    },
  ]);

  const [failingRules] = useState([
    {
      id: '1',
      name: 'Auto Payment to Merchant',
      error: 'Insufficient balance',
      failureCount: 3,
      lastFailure: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '2',
      name: 'FX Rate Trigger',
      error: 'Oracle data unavailable',
      failureCount: 1,
      lastFailure: new Date(Date.now() - 7200000).toISOString(),
    },
  ]);

  const handleUpdateLimits = () => {
    toast({
      title: "Limits Updated",
      description: "Minting and burning limits have been updated successfully.",
    });
  };

  const handleUserAction = (userId: string, action: string) => {
    toast({
      title: `User ${action}`,
      description: `User ${userId} has been ${action}.`,
    });
  };

  const tabs = [
    { id: 'limits', label: 'Limits & Controls', icon: Settings },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'rules', label: 'Rule Monitoring', icon: AlertTriangle },
    { id: 'system', label: 'System Override', icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg backdrop-blur-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Limits & Controls */}
      {activeTab === 'limits' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Minting & Burning Limits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="mintLimit">Daily Mint Limit (₹)</Label>
                <Input
                  id="mintLimit"
                  value={mintLimit}
                  onChange={(e) => setMintLimit(e.target.value)}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <Label htmlFor="burnLimit">Daily Burn Limit (₹)</Label>
                <Input
                  id="burnLimit"
                  value={burnLimit}
                  onChange={(e) => setBurnLimit(e.target.value)}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <div>
                <Label htmlFor="dailyLimit">User Daily Limit (₹)</Label>
                <Input
                  id="dailyLimit"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(e.target.value)}
                  className="bg-slate-700 border-slate-600"
                />
              </div>
              <Button onClick={handleUpdateLimits} className="w-full bg-blue-600 hover:bg-blue-700">
                Update Limits
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">System Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Enable New Registrations</Label>
                <Switch checked={systemEnabled} onCheckedChange={setSystemEnabled} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Allow Cross-Border Transfers</Label>
                <Switch checked={true} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Emergency Freeze Mode</Label>
                <Switch checked={false} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Maintenance Mode</Label>
                <Switch checked={false} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* User Management */}
      {activeTab === 'users' && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Flagged Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {flaggedUsers.map((user) => (
                <div key={user.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-blue-300 font-mono text-sm">
                      {user.address.slice(0, 10)}...{user.address.slice(-8)}
                    </code>
                    <Badge variant={user.status === 'pending_review' ? 'secondary' : 'destructive'}>
                      {user.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-300 mb-3">
                    Reason: {user.reason}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleUserAction(user.id, 'approved')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle size={14} className="mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleUserAction(user.id, 'suspended')}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Pause size={14} className="mr-1" />
                      Suspend
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-slate-600"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rule Monitoring */}
      {activeTab === 'rules' && (
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Failing Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {failingRules.map((rule) => (
                <div key={rule.id} className="p-4 bg-red-600/10 border border-red-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{rule.name}</span>
                    <Badge className="bg-red-600">
                      {rule.failureCount} failures
                    </Badge>
                  </div>
                  <div className="text-sm text-red-300 mb-3">
                    Error: {rule.error}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                      Last failure: {new Date(rule.lastFailure).toLocaleString()}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Play size={14} className="mr-1" />
                        Retry
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600">
                        Disable
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Actions */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Admin Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActions.map((action) => (
              <div key={action.id} className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">{action.description}</span>
                  <span className="text-xs text-slate-400">
                    {new Date(action.timestamp).toLocaleString()}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  By: {action.admin}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
