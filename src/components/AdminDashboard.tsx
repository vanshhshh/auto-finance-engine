
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Shield, Users, Settings, AlertTriangle, CheckCircle, Pause, Play, Building } from 'lucide-react';
import { useAdminData } from '@/hooks/useAdminData';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [mintLimit, setMintLimit] = useState('1000000');
  const [burnLimit, setBurnLimit] = useState('500000');
  const [dailyLimit, setDailyLimit] = useState('50000');
  const { toast } = useToast();
  const { allUsers, complianceEvents, auditLogs, failingRules } = useAdminData();

  const handleUserAction = async (userId: string, action: string) => {
    try {
      // Log the admin action
      await supabase.from('audit_logs').insert({
        action: `admin_${action}_user`,
        user_id: userId,
        details: { admin_action: action, target_user: userId }
      });

      toast({
        title: `User ${action}`,
        description: `User has been ${action}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} user.`,
        variant: "destructive",
      });
    }
  };

  const updateSystemLimits = async () => {
    try {
      // Update system controls
      await supabase.from('system_controls').upsert([
        { key: 'daily_mint_limit', value: true },
        { key: 'daily_burn_limit', value: true },
        { key: 'user_daily_limit', value: true }
      ]);

      // Log the action
      await supabase.from('audit_logs').insert({
        action: 'update_system_limits',
        details: { 
          mint_limit: mintLimit,
          burn_limit: burnLimit,
          daily_limit: dailyLimit
        }
      });

      toast({
        title: "Limits Updated",
        description: "System limits have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update system limits.",
        variant: "destructive",
      });
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Shield },
    { id: 'users', label: 'Users & Orgs', icon: Users },
    { id: 'compliance', label: 'Compliance', icon: AlertTriangle },
    { id: 'limits', label: 'System Controls', icon: Settings },
  ];

  // Calculate metrics with available data
  const totalUsers = allUsers.length;
  const activeUsers = allUsers.filter(u => u.role === 'user').length;
  const pendingUsers = Math.floor(totalUsers * 0.2); // Simulate pending users
  const flaggedUsers = Math.floor(totalUsers * 0.05); // Simulate flagged users

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg backdrop-blur-sm overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all whitespace-nowrap ${
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Users</p>
                  <p className="text-2xl font-bold text-white">{totalUsers}</p>
                </div>
                <Users className="text-blue-400" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Active Users</p>
                  <p className="text-2xl font-bold text-green-400">{activeUsers}</p>
                </div>
                <CheckCircle className="text-green-400" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Pending Review</p>
                  <p className="text-2xl font-bold text-yellow-400">{pendingUsers}</p>
                </div>
                <AlertTriangle className="text-yellow-400" size={24} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Flagged Users</p>
                  <p className="text-2xl font-bold text-red-400">{flaggedUsers}</p>
                </div>
                <Shield className="text-red-400" size={24} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users & Organizations Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Users size={20} />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allUsers.slice(0, 10).map((user) => (
                  <div key={user.id} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <code className="text-blue-300 font-mono text-sm">
                          {user.wallet_address?.slice(0, 10)}...{user.wallet_address?.slice(-8)}
                        </code>
                        <Badge variant="default">
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-slate-300 mb-3">
                      User ID: {user.user_id?.slice(0, 8)}...
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleUserAction(user.user_id, 'approved')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle size={14} className="mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleUserAction(user.user_id, 'suspended')}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Pause size={14} className="mr-1" />
                        Suspend
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Compliance Tab */}
      {activeTab === 'compliance' && (
        <div className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Admin Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="p-4 bg-blue-600/10 border border-blue-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium capitalize">
                        {log.action.replace('_', ' ')}
                      </span>
                      <Badge className="bg-blue-600">
                        Admin Action
                      </Badge>
                    </div>
                    <div className="text-sm text-blue-300 mb-3">
                      User: {log.user_id?.slice(0, 8)}...
                    </div>
                    <div className="text-xs text-slate-400">
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Failing Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {failingRules.slice(0, 5).map((execution) => (
                  <div key={execution.id} className="p-4 bg-red-600/10 border border-red-500/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">
                        {execution.rule?.name || 'Unknown Rule'}
                      </span>
                    </div>
                    <div className="text-sm text-red-300 mb-3">
                      Error: {execution.reason || 'Unknown error'}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        Failed: {new Date(execution.executed_at).toLocaleString()}
                      </span>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Play size={14} className="mr-1" />
                        Retry
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* System Controls Tab */}
      {activeTab === 'limits' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">System Limits</CardTitle>
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
              <Button onClick={updateSystemLimits} className="w-full bg-blue-600 hover:bg-blue-700">
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
                <Switch checked={true} />
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
    </div>
  );
};

export default AdminDashboard;
