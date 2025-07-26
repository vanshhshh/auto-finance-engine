import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BalanceCheckResult {
  address: string;
  tokenSymbol: string;
  blockchainBalance: string;
  databaseBalance: string;
  discrepancy: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const kaleidoUrl = Deno.env.get('KALEIDO_BASE_URL')!
    const kaleidoAuth = Deno.env.get('KALEIDO_AUTH_TOKEN')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (req.method === 'POST') {
      const { action } = await req.json();

      switch (action) {
        case 'sync_balances':
          const balanceResults = await syncTokenBalances(supabase, kaleidoUrl, kaleidoAuth);
          return new Response(
            JSON.stringify({ success: true, results: balanceResults }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );

        case 'evaluate_rules':
          const ruleResults = await evaluateAllRules(supabase, kaleidoUrl, kaleidoAuth);
          return new Response(
            JSON.stringify({ success: true, evaluated: ruleResults }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );

        case 'health_check':
          const healthStatus = await performHealthCheck(supabase, kaleidoUrl, kaleidoAuth);
          return new Response(
            JSON.stringify({ success: true, health: healthStatus }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );

        default:
          return new Response(
            JSON.stringify({ error: 'Unknown action' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
      }
    }

    // GET endpoint for status
    if (req.method === 'GET') {
      const { data: lastSync } = await supabase
        .from('audit_logs')
        .select('created_at, details')
        .eq('action', 'periodic_sync')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      return new Response(
        JSON.stringify({ 
          success: true, 
          lastSync: lastSync?.created_at || null,
          details: lastSync?.details || null
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in periodic sync:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function syncTokenBalances(supabase: any, kaleidoUrl: string, kaleidoAuth: string): Promise<BalanceCheckResult[]> {
  console.log('Starting balance sync...');
  
  // Get all user wallet addresses from Supabase
  const { data: profiles } = await supabase
    .from('profiles')
    .select('user_id, wallet_address')
    .not('wallet_address', 'is', null);

  const results: BalanceCheckResult[] = [];
  const tokens = ['eINR', 'eUSD', 'eAED'];

  for (const profile of profiles || []) {
    for (const token of tokens) {
      try {
        // Get blockchain balance via Kaleido
        const blockchainBalance = await getBlockchainBalance(
          profile.wallet_address, 
          token, 
          kaleidoUrl, 
          kaleidoAuth
        );

        // Get database balance
        const { data: dbBalance } = await supabase
          .from('token_balances')
          .select('balance')
          .eq('user_id', profile.user_id)
          .eq('token_symbol', token)
          .single();

        const databaseBalance = dbBalance?.balance || '0';
        const discrepancy = blockchainBalance !== databaseBalance;

        results.push({
          address: profile.wallet_address,
          tokenSymbol: token,
          blockchainBalance,
          databaseBalance,
          discrepancy
        });

        // If there's a discrepancy, update the database
        if (discrepancy) {
          console.log(`Balance discrepancy found for ${profile.wallet_address} ${token}: DB=${databaseBalance}, Blockchain=${blockchainBalance}`);
          
          await supabase
            .from('token_balances')
            .upsert({
              user_id: profile.user_id,
              token_symbol: token,
              balance: blockchainBalance,
              updated_at: new Date().toISOString()
            });
        }
      } catch (error) {
        console.error(`Error syncing balance for ${profile.wallet_address} ${token}:`, error);
      }
    }
  }

  // Log sync completion
  await supabase
    .from('audit_logs')
    .insert({
      action: 'periodic_sync',
      details: {
        type: 'balance_sync',
        total_checked: results.length,
        discrepancies_found: results.filter(r => r.discrepancy).length,
        timestamp: new Date().toISOString()
      },
      ip_address: '127.0.0.1',
      user_agent: 'periodic-sync-service',
      created_at: new Date().toISOString()
    });

  return results;
}

async function evaluateAllRules(supabase: any, kaleidoUrl: string, kaleidoAuth: string): Promise<number> {
  console.log('Starting rule evaluation...');
  
  // Get all active rules
  const { data: rules } = await supabase
    .from('programmable_rules')
    .select('*')
    .eq('status', 'deployed')
    .eq('active', true);

  let evaluatedCount = 0;

  for (const rule of rules || []) {
    try {
      // Evaluate rule via Kaleido
      const shouldExecute = await evaluateRule(rule, kaleidoUrl, kaleidoAuth);
      
      if (shouldExecute) {
        // Trigger rule execution
        await executeRule(rule.blockchain_rule_id, kaleidoUrl, kaleidoAuth);
        evaluatedCount++;
      }
    } catch (error) {
      console.error(`Error evaluating rule ${rule.id}:`, error);
    }
  }

  // Log evaluation completion
  await supabase
    .from('audit_logs')
    .insert({
      action: 'periodic_sync',
      details: {
        type: 'rule_evaluation',
        rules_evaluated: rules?.length || 0,
        rules_executed: evaluatedCount,
        timestamp: new Date().toISOString()
      },
      ip_address: '127.0.0.1',
      user_agent: 'periodic-sync-service',
      created_at: new Date().toISOString()
    });

  return evaluatedCount;
}

async function performHealthCheck(supabase: any, kaleidoUrl: string, kaleidoAuth: string) {
  const health = {
    supabase: false,
    kaleido: false,
    timestamp: new Date().toISOString()
  };

  try {
    // Test Supabase connection
    const { data } = await supabase.from('profiles').select('count').limit(1);
    health.supabase = true;
  } catch (error) {
    console.error('Supabase health check failed:', error);
  }

  try {
    // Test Kaleido connection
    const response = await fetch(`${kaleidoUrl}/contracts`, {
      headers: { 'Authorization': kaleidoAuth }
    });
    health.kaleido = response.ok;
  } catch (error) {
    console.error('Kaleido health check failed:', error);
  }

  return health;
}

async function getBlockchainBalance(address: string, token: string, kaleidoUrl: string, kaleidoAuth: string): Promise<string> {
  // Mock implementation - replace with actual Kaleido API call
  const response = await fetch(`${kaleidoUrl}/contracts/GateToken/methods/balanceOf`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': kaleidoAuth
    },
    body: JSON.stringify({
      input: { account: address },
      block: 'latest'
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to get balance: ${response.statusText}`);
  }

  const result = await response.json();
  return result.output || '0';
}

async function evaluateRule(rule: any, kaleidoUrl: string, kaleidoAuth: string): Promise<boolean> {
  // Mock implementation - replace with actual rule evaluation logic
  // This would call the RuleEngine contract to check if conditions are met
  
  const response = await fetch(`${kaleidoUrl}/contracts/RuleEngine/methods/evaluateRule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': kaleidoAuth
    },
    body: JSON.stringify({
      input: { ruleId: rule.blockchain_rule_id },
      block: 'latest'
    })
  });

  if (!response.ok) {
    return false;
  }

  const result = await response.json();
  return result.output === true;
}

async function executeRule(ruleId: string, kaleidoUrl: string, kaleidoAuth: string): Promise<void> {
  // Mock implementation - replace with actual rule execution
  await fetch(`${kaleidoUrl}/contracts/RuleEngine/methods/executeRule`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': kaleidoAuth
    },
    body: JSON.stringify({
      input: { ruleId: ruleId }
    })
  });
}