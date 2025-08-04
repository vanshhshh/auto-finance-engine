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
    const exchangeApiKey = Deno.env.get('EXCHANGE_RATES_API_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Fetching exchange rates with API key...')

    // Fetch real exchange rates from API
    const apiResponse = await fetch(`https://v6.exchangerate-api.com/v6/${exchangeApiKey}/latest/USD`)
    const apiData = await apiResponse.json()

    if (!apiResponse.ok || apiData.result !== 'success') {
      throw new Error(`API Error: ${apiData.error || 'Failed to fetch rates'}`)
    }

    console.log('Successfully fetched exchange rates from API')

    // Process and format the rates
    const rates = apiData.conversion_rates
    const exchangeRates = [
      {
        pair: 'USD/INR',
        rate: rates.INR || 83.12,
        change24h: Math.random() * 2 - 1, // API doesn't provide 24h change, simulate for now
        timestamp: new Date().toISOString()
      },
      {
        pair: 'USD/AED',
        rate: rates.AED || 3.67,
        change24h: Math.random() * 2 - 1,
        timestamp: new Date().toISOString()
      },
      {
        pair: 'EUR/USD',
        rate: rates.EUR ? 1 / rates.EUR : 1.09,
        change24h: Math.random() * 2 - 1,
        timestamp: new Date().toISOString()
      },
      {
        pair: 'GBP/USD',
        rate: rates.GBP ? 1 / rates.GBP : 1.27,
        change24h: Math.random() * 2 - 1,
        timestamp: new Date().toISOString()
      },
      {
        pair: 'INR/AED',
        rate: rates.AED && rates.INR ? rates.AED / rates.INR : 0.044,
        change24h: Math.random() * 2 - 1,
        timestamp: new Date().toISOString()
      },
      {
        pair: 'USD/EUR',
        rate: rates.EUR || 0.92,
        change24h: Math.random() * 2 - 1,
        timestamp: new Date().toISOString()
      }
    ]

    // Store rates in database
    for (const rate of exchangeRates) {
      await supabase
        .from('fx_rates')
        .upsert({
          pair: rate.pair,
          rate: rate.rate.toString(),
          timestamp: rate.timestamp
        });
    }

    console.log('Successfully stored rates in database')

    // Log the operation
    await supabase
      .from('audit_logs')
      .insert({
        action: 'exchange_rates_fetch',
        details: {
          success: true,
          rates_count: exchangeRates.length,
          api_timestamp: apiData.time_last_update_utc,
          timestamp: new Date().toISOString()
        },
        ip_address: '127.0.0.1',
        user_agent: 'exchange-rates-service',
        created_at: new Date().toISOString()
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        rates: exchangeRates,
        api_info: {
          last_update: apiData.time_last_update_utc,
          next_update: apiData.time_next_update_utc
        },
        timestamp: new Date().toISOString() 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch exchange rates',
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