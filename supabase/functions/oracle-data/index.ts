import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { dataType } = await req.json();
    
    let oracleData;
    
    switch (dataType) {
      case 'fx_rate':
        oracleData = await fetchFxRates();
        break;
      case 'weather':
        oracleData = await fetchWeatherData();
        break;
      case 'location':
        oracleData = await fetchLocationData();
        break;
      default:
        throw new Error('Unsupported data type');
    }

    return new Response(
      JSON.stringify({ success: true, data: oracleData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
})

async function fetchFxRates() {
  // Mock FX data - replace with real API
  return {
    'USD/INR': 83.25,
    'USD/AED': 3.67,
    'INR/AED': 0.044,
    timestamp: Date.now()
  };
}

async function fetchWeatherData() {
  // Mock weather data
  return {
    temperature: 28,
    humidity: 65,
    condition: 'clear',
    location: 'Delhi',
    timestamp: Date.now()
  };
}

async function fetchLocationData() {
  // Mock location data
  return {
    latitude: 28.6139,
    longitude: 77.2090,
    city: 'Delhi',
    country: 'India',
    timestamp: Date.now()
  };
}