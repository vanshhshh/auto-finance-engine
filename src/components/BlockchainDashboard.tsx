import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, Clock, Zap, Activity, Database, Globe, Cpu } from 'lucide-react';
import { useBlockchain, useBlockchainBalance, useBlockchainRules } from '@/hooks/useBlockchain';
import { useRuleAutomation, useAutomationStatus, useSystemStatus } from '@/hooks/useRuleAutomation';
import { useToast } from '@/hooks/use-toast';

export const BlockchainDashboard = () => {
  const { walletAddress, isConnected, connectWallet, isInitialized } = useBlockchain();
  const { data: automationStatus } = useAutomationStatus();
  const { data: systemStatus } = useSystemStatus();
  const { toast } = useToast();

  const balanceEINR = useBlockchainBalance('eINR', walletAddress || undefined);
  const balanceUSD = useBlockchainBalance('eUSD', walletAddress || undefined);
  const balanceAED = useBlockchainBalance('eAED', walletAddress || undefined);
  const userRules = useBlockchainRules(walletAddress || undefined);

  const { evaluateAllRules, updateOracles } = useRuleAutomation();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': case 'operational': case 'active': return 'bg-green-500';
      case 'warning': case 'pending': return 'bg-yellow-500';
      case 'error': case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': case 'operational': case 'active': return CheckCircle;
      case 'warning': case 'pending': return Clock;
      case 'error': case 'failed': return AlertCircle;
      default: return Activity;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Blockchain & Automation Dashboard</h1>
          <p className="text-muted-foreground">Monitor your CBDC wallet, smart contracts, and automated rules</p>
        </div>
        {!isConnected && (
          <Button onClick={connectWallet} size="lg">
            <Zap className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        )}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="balances">Token Balances</TabsTrigger>
          <TabsTrigger value="rules">Smart Rules</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="oracles">Oracle Data</TabsTrigger>
          <TabsTrigger value="system">System Status</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Wallet Status</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </div>
                <p className="text-xs text-muted-foreground">
                  {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'No wallet connected'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Smart Rules</CardTitle>
                <Cpu className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userRules.data?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Active automated rules</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Automation Status</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{automationStatus?.status || 'Unknown'}</div>
                <p className="text-xs text-muted-foreground">
                  {automationStatus?.active_rules_count || 0} rules being monitored
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {systemStatus?.filter(s => s.status === 'healthy').length || 0}/
                  {systemStatus?.length || 4}
                </div>
                <p className="text-xs text-muted-foreground">Services healthy</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest blockchain and automation events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {automationStatus?.last_automation_run && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Last automation run completed</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(automationStatus.last_automation_run).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
                
                {userRules.data?.map((rule, index) => (
                  <div key={rule.id} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Rule #{rule.id} active</p>
                      <p className="text-xs text-muted-foreground">
                        Last executed: {rule.lastExecuted || 'Never'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balances" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { symbol: 'eINR', query: balanceEINR, color: 'bg-orange-500' },
              { symbol: 'eUSD', query: balanceUSD, color: 'bg-green-500' },
              { symbol: 'eAED', query: balanceAED, color: 'bg-blue-500' }
            ].map(({ symbol, query, color }) => (
              <Card key={symbol}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{symbol} Balance</CardTitle>
                  <div className={`h-4 w-4 rounded-full ${color}`}></div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {query.data ? parseFloat(query.data).toFixed(2) : '0.00'}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {query.isLoading ? 'Loading...' : 'On-chain balance'}
                  </p>
                  {query.error && (
                    <p className="text-xs text-red-500">
                      Error: {query.error.message}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Balance Sync Status</CardTitle>
              <CardDescription>Real-time synchronization between blockchain and database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Sync Status</span>
                  <Badge variant="outline" className="bg-green-50">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Synchronized
                  </Badge>
                </div>
                <Progress value={100} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Last sync: {new Date().toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Smart Contract Rules</CardTitle>
              <CardDescription>Your automated blockchain rules and their status</CardDescription>
            </CardHeader>
            <CardContent>
              {userRules.isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : userRules.data && userRules.data.length > 0 ? (
                <div className="space-y-4">
                  {userRules.data.map((rule) => (
                    <div key={rule.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Rule #{rule.id}</h4>
                        <Badge variant={rule.isActive ? "default" : "secondary"}>
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Type:</span> {rule.ruleType}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Action:</span> {rule.action}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Created:</span>{' '}
                          {new Date(Number(rule.createdAt) * 1000).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="text-muted-foreground">Last Executed:</span>{' '}
                          {rule.lastExecuted > 0 
                            ? new Date(Number(rule.lastExecuted) * 1000).toLocaleDateString()
                            : 'Never'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Cpu className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No smart rules found</p>
                  <p className="text-sm text-muted-foreground">Connect your wallet to view your automated rules</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Rule Automation</CardTitle>
                <CardDescription>Automated rule evaluation and execution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Active Rules</span>
                    <span>{automationStatus?.active_rules_count || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Executions (24h)</span>
                    <span>{automationStatus?.executions_last_24h || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Last Run</span>
                    <span>
                      {automationStatus?.last_automation_run 
                        ? new Date(automationStatus.last_automation_run).toLocaleTimeString()
                        : 'Never'
                      }
                    </span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => evaluateAllRules.mutate()}
                  disabled={evaluateAllRules.isPending}
                  className="w-full"
                >
                  {evaluateAllRules.isPending ? 'Evaluating...' : 'Trigger Rule Evaluation'}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Oracle Updates</CardTitle>
                <CardDescription>Real-time data feeds for rule conditions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center p-2 border rounded">
                    <div className="font-medium">FX Rates</div>
                    <div className="text-green-600">Live</div>
                  </div>
                  <div className="text-center p-2 border rounded">
                    <div className="font-medium">Weather</div>
                    <div className="text-green-600">Live</div>
                  </div>
                  <div className="text-center p-2 border rounded">
                    <div className="font-medium">Location</div>
                    <div className="text-green-600">Live</div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => updateOracles.mutate()}
                  disabled={updateOracles.isPending}
                  variant="outline"
                  className="w-full"
                >
                  {updateOracles.isPending ? 'Updating...' : 'Force Oracle Update'}
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Automation Schedule</CardTitle>
              <CardDescription>Cron jobs and automated processes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">Rule Evaluation</div>
                    <div className="text-sm text-muted-foreground">Every 60 seconds</div>
                  </div>
                  <Badge variant="outline" className="bg-green-50">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Active
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">FX Rate Updates</div>
                    <div className="text-sm text-muted-foreground">Every 5 minutes</div>
                  </div>
                  <Badge variant="outline" className="bg-green-50">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Active
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="font-medium">Balance Sync</div>
                    <div className="text-sm text-muted-foreground">On blockchain events</div>
                  </div>
                  <Badge variant="outline" className="bg-green-50">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="oracles" className="space-y-4">
          <OracleDataDisplay />
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <SystemHealthMonitor systemStatus={systemStatus} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const OracleDataDisplay = () => {
  const [fxData, setFxData] = useState<any>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [gpsData, setGpsData] = useState<any>(null);
  
  const { fetchFxRates, fetchWeatherData, fetchGpsData } = require('@/hooks/useRuleAutomation').useOracleData();

  const loadOracleData = async () => {
    try {
      const [fx, weather, gps] = await Promise.all([
        fetchFxRates(),
        fetchWeatherData(),
        fetchGpsData()
      ]);
      setFxData(fx.data);
      setWeatherData(weather.data);
      setGpsData(gps.data);
    } catch (error) {
      console.error('Failed to load oracle data:', error);
    }
  };

  React.useEffect(() => {
    loadOracleData();
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">FX Rates</CardTitle>
          <CardDescription>Live currency exchange rates</CardDescription>
        </CardHeader>
        <CardContent>
          {fxData?.rates ? (
            <div className="space-y-2">
              {fxData.rates.slice(0, 5).map((rate: any) => (
                <div key={rate.pair} className="flex justify-between items-center">
                  <span className="font-medium">{rate.pair}</span>
                  <div className="text-right">
                    <div className="font-bold">{rate.rate.toFixed(4)}</div>
                    <div className={`text-xs ${rate.change_24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {rate.change_24h >= 0 ? '+' : ''}{rate.change_24h?.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">Loading...</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weather Data</CardTitle>
          <CardDescription>Current weather conditions</CardDescription>
        </CardHeader>
        <CardContent>
          {weatherData ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="font-medium">{weatherData.location}</span>
              </div>
              <div className="flex justify-between">
                <span>Temperature:</span>
                <span className="font-medium">{weatherData.temperature}°C</span>
              </div>
              <div className="flex justify-between">
                <span>Condition:</span>
                <span className="font-medium capitalize">{weatherData.condition}</span>
              </div>
              <div className="flex justify-between">
                <span>Humidity:</span>
                <span className="font-medium">{weatherData.humidity}%</span>
              </div>
              <div className="flex justify-between">
                <span>Wind Speed:</span>
                <span className="font-medium">{weatherData.windSpeed} km/h</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">Loading...</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">GPS Location</CardTitle>
          <CardDescription>Current location zone</CardDescription>
        </CardHeader>
        <CardContent>
          {gpsData ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Zone:</span>
                <Badge variant="outline">{gpsData.zone}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                {gpsData.zone_description}
              </div>
              <div className="flex justify-between">
                <span>Coordinates:</span>
                <span className="font-mono text-xs">
                  {gpsData.coordinates.lat.toFixed(4)}, {gpsData.coordinates.lng.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Accuracy:</span>
                <span className="font-medium">{gpsData.accuracy}m</span>
              </div>
              <div className="flex justify-between">
                <span>Speed:</span>
                <span className="font-medium">{gpsData.speed} km/h</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">Loading...</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const SystemHealthMonitor = ({ systemStatus }: { systemStatus: any[] | undefined }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>System Services</CardTitle>
          <CardDescription>Health status of all system components</CardDescription>
        </CardHeader>
        <CardContent>
          {systemStatus ? (
            <div className="grid gap-4 md:grid-cols-2">
              {systemStatus.map((service) => {
                const StatusIcon = getStatusIcon(service.status);
                return (
                  <div key={service.service_name} className="flex items-center space-x-3 p-3 border rounded">
                    <StatusIcon className={`h-5 w-5 ${
                      service.status === 'healthy' ? 'text-green-500' : 
                      service.status === 'warning' ? 'text-yellow-500' : 'text-red-500'
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium capitalize">{service.service_name.replace('_', ' ')}</div>
                      <div className="text-sm text-muted-foreground">
                        Last check: {new Date(service.last_check).toLocaleTimeString()}
                      </div>
                    </div>
                    <Badge 
                      variant="outline"
                      className={`${
                        service.status === 'healthy' ? 'bg-green-50 text-green-700' :
                        service.status === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-red-50 text-red-700'
                      }`}
                    >
                      {service.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">Loading system status...</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'healthy': case 'operational': case 'active': return CheckCircle;
    case 'warning': case 'pending': return Clock;
    case 'error': case 'failed': return AlertCircle;
    default: return Activity;
  }
};