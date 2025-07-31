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

    const { type, symbol, location, userId } = await req.json();
    
    let data: any = {};
    let shouldStore = true;
    
    switch (type) {
      case 'fx_rates':
        data = await getFxRates(symbol);
        // Store FX rates in database
        if (data && Array.isArray(data.rates)) {
          for (const rate of data.rates) {
            await supabase
              .from('fx_rates')
              .upsert({
                pair: rate.pair,
                rate: rate.rate.toString(),
                timestamp: new Date().toISOString()
              });
          }
        }
        break;
        
      case 'weather':
        data = await getWeatherData(location || 'default');
        break;
        
      case 'gps':
        data = await getGpsData(userId);
        break;
        
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid oracle type' }),
          { 
            status: 400,
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json' 
            } 
          }
        );
    }

    // Log oracle data request
    await supabase
      .from('audit_logs')
      .insert({
        action: 'oracle_data_fetch',
        details: {
          type,
          symbol,
          location,
          userId,
          success: true,
          timestamp: new Date().toISOString()
        },
        ip_address: '127.0.0.1',
        user_agent: 'oracle-data-service',
        created_at: new Date().toISOString()
      });

    return new Response(
      JSON.stringify({ 
        success: true, 
        type, 
        data,
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
    console.error('Error fetching oracle data:', error);
    
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

async function getFxRates(symbol?: string) {
  // Mock FX rates with realistic fluctuation - in production, fetch from real API
  const baseRates = [
    { pair: 'USD/INR', rate: 83.25 },
    { pair: 'USD/AED', rate: 3.67 },
    { pair: 'INR/AED', rate: 0.044 },
    { pair: 'EUR/USD', rate: 1.09 },
    { pair: 'GBP/USD', rate: 1.27 },
    { pair: 'USD/EUR', rate: 0.92 },
    { pair: 'AED/USD', rate: 0.27 },
    { pair: 'INR/USD', rate: 0.012 }
  ];

  // Add realistic market fluctuation
  const fluctuatedRates = baseRates.map(rate => {
    const volatility = Math.random() * 0.06 - 0.03; // ±3% volatility
    const newRate = rate.rate * (1 + volatility);
    
    return {
      ...rate,
      rate: Math.round(newRate * 100000) / 100000, // Round to 5 decimal places
      change_24h: volatility * 100,
      volume: Math.floor(Math.random() * 1000000) + 100000
    };
  });

  if (symbol) {
    const filtered = fluctuatedRates.filter(rate => 
      rate.pair.includes(symbol.toUpperCase())
    );
    return { rates: filtered };
  }

  return { rates: fluctuatedRates };
}

async function getWeatherData(location: string = 'default') {
  // Mock weather data with realistic patterns - in production, fetch from real weather API
  const locations = {
    'default': { baseTemp: 25, conditions: ['sunny', 'partly_cloudy', 'cloudy'] },
    'mumbai': { baseTemp: 28, conditions: ['humid', 'rainy', 'sunny'] },
    'dubai': { baseTemp: 35, conditions: ['sunny', 'hot', 'dusty'] },
    'london': { baseTemp: 15, conditions: ['cloudy', 'rainy', 'foggy'] },
    'new_york': { baseTemp: 20, conditions: ['sunny', 'cloudy', 'snowy'] }
  };

  const locationData = locations[location as keyof typeof locations] || locations.default;
  const randomCondition = locationData.conditions[Math.floor(Math.random() * locationData.conditions.length)];
  
  // Temperature variation based on time of day
  const hour = new Date().getHours();
  const tempVariation = Math.sin((hour - 6) * Math.PI / 12) * 8; // Peak at 2 PM
  
  return {
    location,
    temperature: Math.round(locationData.baseTemp + tempVariation + (Math.random() * 6 - 3)),
    condition: randomCondition,
    humidity: Math.round(40 + Math.random() * 40), // 40-80%
    windSpeed: Math.round(2 + Math.random() * 18), // 2-20 km/h
    pressure: Math.round(1000 + Math.random() * 50), // 1000-1050 hPa
    visibility: Math.round(5 + Math.random() * 15), // 5-20 km
    uv_index: Math.max(0, Math.round((hour > 6 && hour < 20) ? Math.random() * 11 : 0)),
    timestamp: new Date().toISOString()
  };
}

async function getGpsData(userId?: string) {
  // Mock GPS data with zone-based logic - in production, integrate with real location services
  const zones = {
    'safe_zone': { 
      coords: { lat: 40.7589, lng: -73.9851 }, // Times Square
      description: 'Safe Zone - Times Square'
    },
    'business_zone': { 
      coords: { lat: 40.7614, lng: -73.9776 }, // Central Park
      description: 'Business Zone - Central Park'
    },
    'restricted_zone': { 
      coords: { lat: 40.7505, lng: -73.9934 }, // Hell\'s Kitchen
      description: 'Restricted Zone - High Risk Area'
    },
    'international_zone': { 
      coords: { lat: 25.2048, lng: 55.2708 }, // Dubai
      description: 'International Zone - Dubai'
    },
    'home_zone': { 
      coords: { lat: 19.0760, lng: 72.8777 }, // Mumbai
      description: 'Home Zone - Mumbai'
    }
  };

  // Simulate user movement patterns
  const zoneKeys = Object.keys(zones);
  const randomZoneKey = zoneKeys[Math.floor(Math.random() * zoneKeys.length)];
  const selectedZone = zones[randomZoneKey as keyof typeof zones];
  
  // Add some random movement within the zone
  const coordVariation = 0.01; // ~1km variance
  
  return {
    userId: userId || 'anonymous',
    zone: randomZoneKey,
    zone_description: selectedZone.description,
    coordinates: {
      lat: selectedZone.coords.lat + (Math.random() - 0.5) * coordVariation,
      lng: selectedZone.coords.lng + (Math.random() - 0.5) * coordVariation
    },
    accuracy: Math.round(3 + Math.random() * 12), // 3-15 meters
    speed: Math.round(Math.random() * 80), // 0-80 km/h
    heading: Math.round(Math.random() * 360), // 0-360 degrees
    altitude: Math.round(Math.random() * 100), // 0-100 meters
    timestamp: new Date().toISOString()
  };
}