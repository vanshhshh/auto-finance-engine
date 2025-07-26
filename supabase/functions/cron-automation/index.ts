import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('⏰ Cron automation triggered at:', new Date().toISOString());

    // Call rule automation service
    const automationResponse = await supabase.functions.invoke('rule-automation', {
      body: { action: 'evaluate_all_rules' }
    });

    console.log('🤖 Rule automation response:', automationResponse);

    // Call periodic sync service  
    const syncResponse = await supabase.functions.invoke('periodic-sync', {
      body: { action: 'sync_balances' }
    });

    console.log('🔄 Sync response:', syncResponse);

    // Update system health metrics
    const healthResponse = await supabase.functions.invoke('periodic-sync', {
      body: { action: 'health_check' }
    });

    console.log('💚 Health check response:', healthResponse);

    // Log cron execution
    await supabase
      .from('audit_logs')
      .insert({
        action: 'cron_automation',
        details: {
          type: 'scheduled_run',
          automation_success: automationResponse.data?.success || false,
          sync_success: syncResponse.data?.success || false,
          health_success: healthResponse.data?.success || false,
          automation_results: automationResponse.data?.results,
          sync_results: syncResponse.data?.results,
          health_status: healthResponse.data?.health,
          timestamp: new Date().toISOString()
        },
        ip_address: '127.0.0.1',
        user_agent: 'cron-automation-service',
        created_at: new Date().toISOString()
      });

    const results = {
      success: true,
      message: 'Cron automation completed successfully',
      timestamp: new Date().toISOString(),
      results: {
        rule_automation: automationResponse.data,
        balance_sync: syncResponse.data,
        health_check: healthResponse.data
      }
    };

    return new Response(
      JSON.stringify(results),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('❌ Error in cron automation:', error);
    
    const errorResponse = {
      success: false,
      error: 'Cron automation failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(errorResponse),
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