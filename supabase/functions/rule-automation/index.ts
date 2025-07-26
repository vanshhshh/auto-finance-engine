import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RuleCondition {
  type: 'fx_rate' | 'time' | 'weather' | 'location' | 'balance';
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'in' | 'between';
  value: any;
  currency_pair?: string;
  location_zone?: string;
  weather_condition?: string;
  token_symbol?: string;
}

interface RuleAction {
  type: 'transfer' | 'mint' | 'burn' | 'notify' | 'freeze' | 'split_payment';
  amount?: string;
  recipient?: string;
  token_symbol?: string;
  message?: string;
  recipients?: Array<{ address: string; amount: string }>;
}

interface ProgrammableRule {
  id: string;
  user_id: string;
  name: string;
  conditions: RuleCondition[];
  actions: RuleAction[];
  status: string;
  blockchain_rule_id?: string;
  last_executed?: string;
  execution_count: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const kaleidoUrl = Deno.env.get('KALEIDO_BASE_URL') || 'https://console.kaleido.io'
    const kaleidoAuth = Deno.env.get('KALEIDO_AUTH_TOKEN') || ''
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (req.method === 'POST') {
      const { action, payload } = await req.json();

      switch (action) {
        case 'evaluate_all_rules':
          const evaluationResults = await evaluateAllActiveRules(supabase, kaleidoUrl, kaleidoAuth);
          return new Response(
            JSON.stringify({ success: true, results: evaluationResults }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );

        case 'evaluate_user_rules':
          const userResults = await evaluateUserRules(supabase, payload.userId, kaleidoUrl, kaleidoAuth);
          return new Response(
            JSON.stringify({ success: true, results: userResults }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );

        case 'execute_rule':
          const executeResult = await executeSpecificRule(supabase, payload.ruleId, kaleidoUrl, kaleidoAuth);
          return new Response(
            JSON.stringify({ success: true, result: executeResult }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );

        case 'update_oracles':
          await updateAllOracleData(supabase);
          return new Response(
            JSON.stringify({ success: true, message: 'Oracle data updated' }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );

        default:
          return new Response(
            JSON.stringify({ error: 'Unknown action' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
      }
    }

    // GET endpoint for automation status
    if (req.method === 'GET') {
      const status = await getAutomationStatus(supabase);
      return new Response(
        JSON.stringify({ success: true, status }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in rule automation:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function evaluateAllActiveRules(supabase: any, kaleidoUrl: string, kaleidoAuth: string) {
  console.log('🤖 Starting automated rule evaluation...');
  
  // Get all active rules
  const { data: rules, error } = await supabase
    .from('programmable_rules')
    .select('*')
    .eq('status', 'deployed')
    .not('blockchain_rule_id', 'is', null);

  if (error) {
    console.error('Error fetching rules:', error);
    return { error: error.message };
  }

  console.log(`📋 Found ${rules?.length || 0} active rules to evaluate`);

  const results = {
    total_rules: rules?.length || 0,
    evaluated: 0,
    executed: 0,
    failed: 0,
    errors: [] as string[]
  };

  // Get fresh oracle data
  await updateAllOracleData(supabase);

  for (const rule of rules || []) {
    try {
      results.evaluated++;
      
      const shouldExecute = await evaluateRuleConditions(rule, supabase);
      
      if (shouldExecute) {
        console.log(`✅ Rule "${rule.name}" conditions met, executing...`);
        
        const executed = await executeRuleActions(rule, supabase, kaleidoUrl, kaleidoAuth);
        
        if (executed) {
          results.executed++;
          
          // Update rule execution tracking
          await supabase
            .from('programmable_rules')
            .update({
              last_executed: new Date().toISOString(),
              execution_count: rule.execution_count + 1
            })
            .eq('id', rule.id);

          // Log execution
          await supabase
            .from('rule_executions')
            .insert({
              rule_id: rule.blockchain_rule_id,
              executed_at: new Date().toISOString(),
              success: true,
              reason: 'Automated evaluation - conditions met'
            });
        }
      } else {
        console.log(`⏭️ Rule "${rule.name}" conditions not met, skipping`);
      }
      
    } catch (error) {
      console.error(`❌ Error evaluating rule ${rule.id}:`, error);
      results.failed++;
      results.errors.push(`Rule ${rule.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Log automation run
  await supabase
    .from('audit_logs')
    .insert({
      action: 'rule_automation',
      details: {
        type: 'scheduled_evaluation',
        results,
        timestamp: new Date().toISOString()
      },
      ip_address: '127.0.0.1',
      user_agent: 'rule-automation-service',
      created_at: new Date().toISOString()
    });

  console.log(`🏁 Automation complete: ${results.executed}/${results.total_rules} rules executed`);
  return results;
}

async function evaluateUserRules(supabase: any, userId: string, kaleidoUrl: string, kaleidoAuth: string) {
  const { data: rules } = await supabase
    .from('programmable_rules')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'deployed');

  const results = [];
  
  for (const rule of rules || []) {
    const shouldExecute = await evaluateRuleConditions(rule, supabase);
    results.push({
      rule_id: rule.id,
      rule_name: rule.name,
      should_execute: shouldExecute,
      last_executed: rule.last_executed
    });
  }

  return results;
}

async function evaluateRuleConditions(rule: ProgrammableRule, supabase: any): Promise<boolean> {
  console.log(`🔍 Evaluating conditions for rule: ${rule.name}`);
  
  const conditions = Array.isArray(rule.conditions) ? rule.conditions : [rule.conditions];
  
  for (const condition of conditions) {
    const result = await evaluateSingleCondition(condition, rule.user_id, supabase);
    console.log(`   Condition ${condition.type} ${condition.operator} ${condition.value}: ${result}`);
    
    if (!result) {
      return false; // All conditions must be true (AND logic)
    }
  }
  
  return true;
}

async function evaluateSingleCondition(condition: RuleCondition, userId: string, supabase: any): Promise<boolean> {
  try {
    switch (condition.type) {
      case 'fx_rate':
        return await evaluateFxRateCondition(condition, supabase);
      
      case 'time':
        return evaluateTimeCondition(condition);
      
      case 'weather':
        return await evaluateWeatherCondition(condition, supabase);
      
      case 'location':
        return await evaluateLocationCondition(condition, userId, supabase);
      
      case 'balance':
        return await evaluateBalanceCondition(condition, userId, supabase);
      
      default:
        console.warn(`Unknown condition type: ${condition.type}`);
        return false;
    }
  } catch (error) {
    console.error(`Error evaluating condition ${condition.type}:`, error);
    return false;
  }
}

async function evaluateFxRateCondition(condition: RuleCondition, supabase: any): Promise<boolean> {
  const { data: fxRate } = await supabase
    .from('fx_rates')
    .select('rate')
    .eq('pair', condition.currency_pair)
    .order('timestamp', { ascending: false })
    .limit(1)
    .single();

  if (!fxRate) return false;

  const currentRate = parseFloat(fxRate.rate);
  const targetRate = parseFloat(condition.value);

  switch (condition.operator) {
    case 'gt': return currentRate > targetRate;
    case 'lt': return currentRate < targetRate;
    case 'gte': return currentRate >= targetRate;
    case 'lte': return currentRate <= targetRate;
    case 'eq': return Math.abs(currentRate - targetRate) < 0.0001;
    default: return false;
  }
}

function evaluateTimeCondition(condition: RuleCondition): boolean {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute; // Minutes since midnight

  if (typeof condition.value === 'string') {
    // Format: "HH:MM"
    const [hour, minute] = condition.value.split(':').map(Number);
    const targetTime = hour * 60 + minute;
    
    switch (condition.operator) {
      case 'eq': return Math.abs(currentTime - targetTime) <= 1; // Within 1 minute
      case 'gt': return currentTime > targetTime;
      case 'lt': return currentTime < targetTime;
      default: return false;
    }
  }

  return false;
}

async function evaluateWeatherCondition(condition: RuleCondition, supabase: any): Promise<boolean> {
  // Get latest oracle weather data
  const { data } = await supabase.functions.invoke('oracle-data', {
    body: { type: 'weather', location: condition.location_zone || 'default' }
  });

  if (!data?.success) return false;

  const weatherData = data.data;
  
  switch (condition.weather_condition) {
    case 'temperature':
      const temp = weatherData.temperature;
      const targetTemp = parseFloat(condition.value);
      
      switch (condition.operator) {
        case 'gt': return temp > targetTemp;
        case 'lt': return temp < targetTemp;
        case 'gte': return temp >= targetTemp;
        case 'lte': return temp <= targetTemp;
        default: return false;
      }
    
    case 'condition':
      return weatherData.condition === condition.value;
    
    default:
      return false;
  }
}

async function evaluateLocationCondition(condition: RuleCondition, userId: string, supabase: any): Promise<boolean> {
  // Get user's current location from GPS oracle
  const { data } = await supabase.functions.invoke('oracle-data', {
    body: { type: 'gps', userId }
  });

  if (!data?.success) return false;

  const userLocation = data.data.zone;
  
  switch (condition.operator) {
    case 'eq': return userLocation === condition.value;
    case 'in': return Array.isArray(condition.value) && condition.value.includes(userLocation);
    default: return false;
  }
}

async function evaluateBalanceCondition(condition: RuleCondition, userId: string, supabase: any): Promise<boolean> {
  const { data: balance } = await supabase
    .from('token_balances')
    .select('balance')
    .eq('user_id', userId)
    .eq('token_symbol', condition.token_symbol)
    .single();

  if (!balance) return false;

  const currentBalance = parseFloat(balance.balance);
  const targetBalance = parseFloat(condition.value);

  switch (condition.operator) {
    case 'gt': return currentBalance > targetBalance;
    case 'lt': return currentBalance < targetBalance;
    case 'gte': return currentBalance >= targetBalance;
    case 'lte': return currentBalance <= targetBalance;
    case 'eq': return Math.abs(currentBalance - targetBalance) < 0.0001;
    default: return false;
  }
}

async function executeRuleActions(rule: ProgrammableRule, supabase: any, kaleidoUrl: string, kaleidoAuth: string): Promise<boolean> {
  console.log(`🚀 Executing actions for rule: ${rule.name}`);
  
  const actions = Array.isArray(rule.actions) ? rule.actions : [rule.actions];
  
  for (const action of actions) {
    try {
      switch (action.type) {
        case 'transfer':
          await executeTransferAction(action, rule, supabase, kaleidoUrl, kaleidoAuth);
          break;
        
        case 'mint':
          await executeMintAction(action, rule, supabase, kaleidoUrl, kaleidoAuth);
          break;
        
        case 'burn':
          await executeBurnAction(action, rule, supabase, kaleidoUrl, kaleidoAuth);
          break;
        
        case 'notify':
          await executeNotifyAction(action, rule, supabase);
          break;
        
        case 'freeze':
          await executeFreezeAction(action, rule, supabase, kaleidoUrl, kaleidoAuth);
          break;
        
        case 'split_payment':
          await executeSplitPaymentAction(action, rule, supabase, kaleidoUrl, kaleidoAuth);
          break;
        
        default:
          console.warn(`Unknown action type: ${action.type}`);
      }
    } catch (error) {
      console.error(`Error executing action ${action.type}:`, error);
      return false;
    }
  }
  
  return true;
}

async function executeTransferAction(action: RuleAction, rule: ProgrammableRule, supabase: any, kaleidoUrl: string, kaleidoAuth: string) {
  // Get user's wallet address
  const { data: profile } = await supabase
    .from('profiles')
    .select('wallet_address')
    .eq('user_id', rule.user_id)
    .single();

  if (!profile?.wallet_address) {
    throw new Error('User wallet address not found');
  }

  // Call blockchain transfer via Kaleido
  const transferResponse = await fetch(`${kaleidoUrl}/contracts/CBDCWallet/methods/transfer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': kaleidoAuth
    },
    body: JSON.stringify({
      input: {
        tokenSymbol: action.token_symbol,
        to: action.recipient,
        amount: action.amount
      },
      from: profile.wallet_address
    })
  });

  if (!transferResponse.ok) {
    throw new Error(`Transfer failed: ${transferResponse.statusText}`);
  }

  console.log(`💸 Transferred ${action.amount} ${action.token_symbol} to ${action.recipient}`);
}

async function executeMintAction(action: RuleAction, rule: ProgrammableRule, supabase: any, kaleidoUrl: string, kaleidoAuth: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('wallet_address')
    .eq('user_id', rule.user_id)
    .single();

  // Call blockchain mint via Kaleido
  const mintResponse = await fetch(`${kaleidoUrl}/contracts/GateToken/methods/mint`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': kaleidoAuth
    },
    body: JSON.stringify({
      input: {
        to: action.recipient || profile.wallet_address,
        amount: action.amount
      }
    })
  });

  if (!mintResponse.ok) {
    throw new Error(`Mint failed: ${mintResponse.statusText}`);
  }

  console.log(`🪙 Minted ${action.amount} ${action.token_symbol} to ${action.recipient || profile.wallet_address}`);
}

async function executeBurnAction(action: RuleAction, rule: ProgrammableRule, supabase: any, kaleidoUrl: string, kaleidoAuth: string) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('wallet_address')
    .eq('user_id', rule.user_id)
    .single();

  // Call blockchain burn via Kaleido
  const burnResponse = await fetch(`${kaleidoUrl}/contracts/GateToken/methods/burn`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': kaleidoAuth
    },
    body: JSON.stringify({
      input: {
        from: profile.wallet_address,
        amount: action.amount
      }
    })
  });

  if (!burnResponse.ok) {
    throw new Error(`Burn failed: ${burnResponse.statusText}`);
  }

  console.log(`🔥 Burned ${action.amount} ${action.token_symbol} from ${profile.wallet_address}`);
}

async function executeNotifyAction(action: RuleAction, rule: ProgrammableRule, supabase: any) {
  // Create notification in database
  await supabase
    .from('notifications')
    .insert({
      user_id: rule.user_id,
      type: 'rule_executed',
      title: `Rule "${rule.name}" Executed`,
      message: action.message || `Your rule "${rule.name}" has been automatically executed.`,
      created_at: new Date().toISOString()
    });

  console.log(`🔔 Notification sent to user ${rule.user_id}`);
}

async function executeFreezeAction(action: RuleAction, rule: ProgrammableRule, supabase: any, kaleidoUrl: string, kaleidoAuth: string) {
  // Implement account freeze logic
  console.log(`🧊 Freeze action executed for rule: ${rule.name}`);
  
  // This could call a smart contract method to freeze the account
  // For now, we'll just log it and create a compliance event
  await supabase
    .from('compliance_events')
    .insert({
      user_id: rule.user_id,
      event_type: 'account_freeze',
      severity: 'high',
      description: `Account automatically frozen due to rule: ${rule.name}`,
      metadata: { rule_id: rule.id, action: action },
      created_at: new Date().toISOString()
    });
}

async function executeSplitPaymentAction(action: RuleAction, rule: ProgrammableRule, supabase: any, kaleidoUrl: string, kaleidoAuth: string) {
  if (!action.recipients?.length) {
    throw new Error('Split payment requires recipients');
  }

  // Execute multiple transfers
  for (const recipient of action.recipients) {
    await executeTransferAction(
      {
        type: 'transfer',
        recipient: recipient.address,
        amount: recipient.amount,
        token_symbol: action.token_symbol
      },
      rule,
      supabase,
      kaleidoUrl,
      kaleidoAuth
    );
  }

  console.log(`🔄 Split payment executed: ${action.recipients.length} recipients`);
}

async function executeSpecificRule(supabase: any, ruleId: string, kaleidoUrl: string, kaleidoAuth: string) {
  const { data: rule } = await supabase
    .from('programmable_rules')
    .select('*')
    .eq('id', ruleId)
    .single();

  if (!rule) {
    throw new Error('Rule not found');
  }

  const shouldExecute = await evaluateRuleConditions(rule, supabase);
  
  if (shouldExecute) {
    const executed = await executeRuleActions(rule, supabase, kaleidoUrl, kaleidoAuth);
    return { executed, rule: rule.name };
  }

  return { executed: false, rule: rule.name, reason: 'Conditions not met' };
}

async function updateAllOracleData(supabase: any) {
  console.log('🔄 Updating oracle data...');
  
  try {
    // Update FX rates
    await supabase.functions.invoke('oracle-data', {
      body: { type: 'fx_rates' }
    });

    // Update weather data
    await supabase.functions.invoke('oracle-data', {
      body: { type: 'weather' }
    });

    console.log('✅ Oracle data updated successfully');
  } catch (error) {
    console.error('❌ Error updating oracle data:', error);
  }
}

async function getAutomationStatus(supabase: any) {
  const { data: lastRun } = await supabase
    .from('audit_logs')
    .select('created_at, details')
    .eq('action', 'rule_automation')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const { data: activeRules, count: activeRulesCount } = await supabase
    .from('programmable_rules')
    .select('*', { count: 'exact' })
    .eq('status', 'deployed');

  const { data: recentExecutions, count: executionsCount } = await supabase
    .from('rule_executions')
    .select('*', { count: 'exact' })
    .gte('executed_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  return {
    last_automation_run: lastRun?.created_at || null,
    last_run_details: lastRun?.details || null,
    active_rules_count: activeRulesCount || 0,
    executions_last_24h: executionsCount || 0,
    status: 'operational'
  };
}