import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Zap,
  RefreshCw,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useRuleExecutions, useAutomationStatus, useSystemStatus } from '@/hooks/useRuleAutomation';

export const AutomationAnalytics = () => {
  const { data: automationStatus } = useAutomationStatus();
  const { data: systemStatus } = useSystemStatus();
  const { data: recentExecutions } = useRuleExecutions();

  const executionsByType = recentExecutions?.reduce((acc: any, execution: any) => {
    acc[execution.success ? 'successful' : 'failed'] = (acc[execution.success ? 'successful' : 'failed'] || 0) + 1;
    return acc;
  }, {}) || {};

  const healthyServices = systemStatus?.filter(s => s.status === 'healthy').length || 0;
  const totalServices = systemStatus?.length || 4;
  const healthPercentage = totalServices > 0 ? (healthyServices / totalServices) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Automation Analytics</h2>
          <p className="text-muted-foreground">Monitor rule automation performance and system health</p>
        </div>
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{automationStatus?.active_rules_count || 0}</div>
            <p className="text-xs text-muted-foreground">Currently being monitored</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Executions (24h)</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{automationStatus?.executions_last_24h || 0}</div>
            <p className="text-xs text-muted-foreground">Rules executed today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {recentExecutions?.length > 0 
                ? Math.round(((executionsByType.successful || 0) / recentExecutions.length) * 100)
                : 100}%
            </div>
            <p className="text-xs text-muted-foreground">Successful executions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(healthPercentage)}%</div>
            <p className="text-xs text-muted-foreground">Services operational</p>
          </CardContent>
        </Card>
      </div>

      {/* System Status Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Services</CardTitle>
            <CardDescription>Health status of automation components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemStatus?.map((service) => (
                <div key={service.service_name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {service.status === 'healthy' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="font-medium capitalize">
                      {service.service_name.replace('_', ' ')}
                    </span>
                  </div>
                  <Badge 
                    variant={service.status === 'healthy' ? 'default' : 'secondary'}
                    className={service.status === 'healthy' ? 'bg-green-100 text-green-700' : ''}
                  >
                    {service.status}
                  </Badge>
                </div>
              ))}
              
              <div className="pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Overall Health</span>
                  <span>{healthyServices}/{totalServices}</span>
                </div>
                <Progress value={healthPercentage} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Execution Statistics</CardTitle>
            <CardDescription>Recent rule execution performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 border rounded">
                  <div className="text-2xl font-bold text-green-600">
                    {executionsByType.successful || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Successful</div>
                </div>
                <div className="text-center p-3 border rounded">
                  <div className="text-2xl font-bold text-red-600">
                    {executionsByType.failed || 0}
                  </div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Success Rate</span>
                  <span className="font-medium">
                    {recentExecutions?.length > 0 
                      ? Math.round(((executionsByType.successful || 0) / recentExecutions.length) * 100)
                      : 100}%
                  </span>
                </div>
                <Progress 
                  value={recentExecutions?.length > 0 
                    ? ((executionsByType.successful || 0) / recentExecutions.length) * 100
                    : 100} 
                  className="h-2" 
                />
              </div>
              
              {automationStatus?.last_automation_run && (
                <div className="text-sm text-muted-foreground">
                  Last run: {new Date(automationStatus.last_automation_run).toLocaleString()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Rule Executions</CardTitle>
          <CardDescription>Latest automated rule activity</CardDescription>
        </CardHeader>
        <CardContent>
          {recentExecutions && recentExecutions.length > 0 ? (
            <div className="space-y-3">
              {recentExecutions.slice(0, 10).map((execution: any) => (
                <div key={execution.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center space-x-3">
                    {execution.success ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    <div>
                      <div className="font-medium">Rule #{execution.rule_id}</div>
                      <div className="text-sm text-muted-foreground">
                        {execution.reason || 'Automated execution'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {new Date(execution.executed_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(execution.executed_at).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No recent executions</p>
              <p className="text-sm text-muted-foreground">Rule executions will appear here once automation begins</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};