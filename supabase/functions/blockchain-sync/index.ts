import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BlockchainEvent {
  type: 'mint' | 'burn' | 'transfer' | 'rule_created' | 'rule_executed';
  txHash: string;
  blockNumber: number;
  tokenSymbol?: string;
  from?: string;
  to?: string;
  amount?: string;
  ruleId?: string;
  userAddress?: string;
  timestamp: number;
  gasUsed?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    if (req.method === 'POST') {
      const { event }: { event: BlockchainEvent } = await req.json();
      
      console.log('Processing blockchain event:', event);

      // Update token balances for mint/burn/transfer events
      if (['mint', 'burn', 'transfer'].includes(event.type)) {
        await updateTokenBalances(supabase, event);
      }

      // Create transaction record
      await createTransactionRecord(supabase, event);

      // Update rule records if applicable
      if (event.type === 'rule_created' || event.type === 'rule_executed') {
        await updateRuleRecord(supabase, event);
      }

      // Create audit log entry
      await createAuditLog(supabase, event);

      return new Response(
        JSON.stringify({ success: true, message: 'Event processed successfully' }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // GET endpoint to fetch sync status
    if (req.method === 'GET') {
      const { data: lastSync } = await supabase
        .from('audit_logs')
        .select('created_at')
        .eq('action', 'blockchain_sync')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      return new Response(
        JSON.stringify({ 
          success: true, 
          lastSync: lastSync?.created_at || null 
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error processing blockchain event:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
})

async function updateTokenBalances(supabase: any, event: BlockchainEvent) {
  const { tokenSymbol, from, to, amount, type } = event;
  
  if (!tokenSymbol || !amount) return;

  // Get current user ID for the wallet address
  const getUserId = async (walletAddress: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('wallet_address', walletAddress)
      .single();
    return data?.user_id;
  };

  if (type === 'mint' && to) {
    const userId = await getUserId(to);
    if (userId) {
      // Update or insert balance
      const { data: existingBalance } = await supabase
        .from('token_balances')
        .select('balance')
        .eq('user_id', userId)
        .eq('token_symbol', tokenSymbol)
        .single();

      const newBalance = existingBalance 
        ? (parseFloat(existingBalance.balance) + parseFloat(amount)).toString()
        : amount;

      await supabase
        .from('token_balances')
        .upsert({
          user_id: userId,
          token_symbol: tokenSymbol,
          balance: newBalance,
          updated_at: new Date().toISOString()
        });
    }
  }

  if (type === 'burn' && from) {
    const userId = await getUserId(from);
    if (userId) {
      const { data: existingBalance } = await supabase
        .from('token_balances')
        .select('balance')
        .eq('user_id', userId)
        .eq('token_symbol', tokenSymbol)
        .single();

      if (existingBalance) {
        const newBalance = Math.max(0, parseFloat(existingBalance.balance) - parseFloat(amount)).toString();
        
        await supabase
          .from('token_balances')
          .update({
            balance: newBalance,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
          .eq('token_symbol', tokenSymbol);
      }
    }
  }

  if (type === 'transfer' && from && to) {
    // Update sender balance
    const fromUserId = await getUserId(from);
    if (fromUserId) {
      const { data: fromBalance } = await supabase
        .from('token_balances')
        .select('balance')
        .eq('user_id', fromUserId)
        .eq('token_symbol', tokenSymbol)
        .single();

      if (fromBalance) {
        const newFromBalance = Math.max(0, parseFloat(fromBalance.balance) - parseFloat(amount)).toString();
        
        await supabase
          .from('token_balances')
          .update({
            balance: newFromBalance,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', fromUserId)
          .eq('token_symbol', tokenSymbol);
      }
    }

    // Update recipient balance
    const toUserId = await getUserId(to);
    if (toUserId) {
      const { data: toBalance } = await supabase
        .from('token_balances')
        .select('balance')
        .eq('user_id', toUserId)
        .eq('token_symbol', tokenSymbol)
        .single();

      const newToBalance = toBalance 
        ? (parseFloat(toBalance.balance) + parseFloat(amount)).toString()
        : amount;

      await supabase
        .from('token_balances')
        .upsert({
          user_id: toUserId,
          token_symbol: tokenSymbol,
          balance: newToBalance,
          updated_at: new Date().toISOString()
        });
    }
  }
}

async function createTransactionRecord(supabase: any, event: BlockchainEvent) {
  const { type, txHash, from, to, amount, tokenSymbol, userAddress } = event;
  
  // Get user ID
  const getUserId = async (walletAddress: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('wallet_address', walletAddress)
      .single();
    return data?.user_id;
  };

  const userId = userAddress ? await getUserId(userAddress) : 
                 from ? await getUserId(from) : 
                 to ? await getUserId(to) : null;

  if (userId && ['mint', 'burn', 'transfer'].includes(type)) {
    await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        transaction_type: type,
        amount: amount || '0',
        token_symbol: tokenSymbol || 'eINR',
        from_address: from,
        to_address: to,
        tx_hash: txHash,
        status: 'completed',
        created_at: new Date(event.timestamp).toISOString(),
        updated_at: new Date().toISOString()
      });
  }
}

async function updateRuleRecord(supabase: any, event: BlockchainEvent) {
  const { type, ruleId, userAddress, txHash } = event;
  
  if (!ruleId) return;

  // Get user ID from wallet address
  const getUserId = async (walletAddress: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('wallet_address', walletAddress)
      .single();
    return data?.user_id;
  };

  if (type === 'rule_created' && userAddress) {
    const userId = await getUserId(userAddress);
    if (userId) {
      // Update rule with blockchain confirmation
      await supabase
        .from('programmable_rules')
        .update({
          blockchain_rule_id: ruleId,
          tx_hash: txHash,
          status: 'deployed',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('status', 'pending');
    }
  }

  if (type === 'rule_executed' && ruleId) {
    // Log rule execution
    await supabase
      .from('rule_executions')
      .insert({
        rule_id: ruleId,
        executed_at: new Date().toISOString(),
        success: true,
        transaction_id: txHash
      });

    // Update rule last executed timestamp
    await supabase
      .from('programmable_rules')
      .update({
        last_executed: new Date().toISOString(),
        execution_count: supabase.rpc('increment_execution_count', { rule_id: ruleId })
      })
      .eq('blockchain_rule_id', ruleId);
  }
}

async function createAuditLog(supabase: any, event: BlockchainEvent) {
  await supabase
    .from('audit_logs')
    .insert({
      action: 'blockchain_sync',
      details: {
        event_type: event.type,
        tx_hash: event.txHash,
        block_number: event.blockNumber,
        gas_used: event.gasUsed,
        token_symbol: event.tokenSymbol,
        amount: event.amount,
        from: event.from,
        to: event.to,
        rule_id: event.ruleId
      },
      ip_address: '127.0.0.1', // Blockchain event
      user_agent: 'blockchain-sync-service',
      created_at: new Date().toISOString()
    });
}