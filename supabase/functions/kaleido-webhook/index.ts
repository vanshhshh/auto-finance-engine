import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface KaleidoWebhookEvent {
  eventId: string;
  timestamp: string;
  blockNumber: number;
  transactionHash: string;
  eventName: string;
  contractAddress: string;
  eventData: {
    from?: string;
    to?: string;
    value?: string;
    amount?: string;
    tokenSymbol?: string;
    ruleId?: string;
    userId?: string;
    recipient?: string;
    conditions?: string;
    actionType?: string;
  };
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
      const webhookEvent: KaleidoWebhookEvent = await req.json();
      
      console.log('Received Kaleido webhook:', webhookEvent);

      // Transform Kaleido event to our internal format
      const blockchainEvent = await transformKaleidoEvent(webhookEvent);
      
      if (blockchainEvent) {
        // Call our blockchain-sync function
        const syncResponse = await fetch(`${supabaseUrl}/functions/v1/blockchain-sync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`
          },
          body: JSON.stringify({ event: blockchainEvent })
        });

        if (!syncResponse.ok) {
          throw new Error(`Sync failed: ${syncResponse.statusText}`);
        }

        // Store webhook delivery record
        await supabase
          .from('webhook_deliveries')
          .insert({
            webhook_id: webhookEvent.eventId,
            event_type: webhookEvent.eventName,
            payload: webhookEvent,
            success: true,
            response_status: 200,
            delivered_at: new Date().toISOString()
          });
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Webhook processed successfully' }),
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
    console.error('Error processing Kaleido webhook:', error);
    
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
});

async function transformKaleidoEvent(kaleidoEvent: KaleidoWebhookEvent) {
  const { eventName, eventData, transactionHash, blockNumber, timestamp } = kaleidoEvent;

  // Map Kaleido event names to our internal event types
  let eventType: string | null = null;
  
  switch (eventName) {
    case 'Transfer':
      // Determine if it's mint, burn, or transfer based on addresses
      if (eventData.from === '0x0000000000000000000000000000000000000000') {
        eventType = 'mint';
      } else if (eventData.to === '0x0000000000000000000000000000000000000000') {
        eventType = 'burn';
      } else {
        eventType = 'transfer';
      }
      break;
    case 'RuleCreated':
      eventType = 'rule_created';
      break;
    case 'RuleExecuted':
      eventType = 'rule_executed';
      break;
    default:
      console.log(`Unknown event type: ${eventName}`);
      return null;
  }

  return {
    type: eventType,
    txHash: transactionHash,
    blockNumber: blockNumber,
    timestamp: new Date(timestamp).getTime(),
    tokenSymbol: eventData.tokenSymbol || 'eINR',
    from: eventData.from,
    to: eventData.to || eventData.recipient,
    amount: eventData.value || eventData.amount,
    ruleId: eventData.ruleId,
    userAddress: eventData.userId,
  };
}