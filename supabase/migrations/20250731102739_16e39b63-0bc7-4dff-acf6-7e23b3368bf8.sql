-- Set up cron job for automated rule evaluation and fix system status table

-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create a system status monitoring table for tracking automation health
CREATE TABLE IF NOT EXISTS system_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'healthy',
  last_check TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_error TEXT,
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on system_status
ALTER TABLE system_status ENABLE ROW LEVEL SECURITY;

-- Create policy for system_status (admin only)
DROP POLICY IF EXISTS "Admins can manage system status" ON system_status;
CREATE POLICY "Admins can manage system status" 
ON system_status 
FOR ALL 
USING (
  (auth.uid()::text = 'de121dc9-d461-4716-a2fd-5c4850841446'::text) OR 
  (EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  ))
);

-- Insert initial system status records
INSERT INTO system_status (service_name, status, metrics) VALUES
  ('rule_automation', 'healthy', '{"rules_evaluated": 0, "rules_executed": 0}'),
  ('blockchain_sync', 'healthy', '{"last_sync": null, "balance_discrepancies": 0}'),
  ('oracle_data', 'healthy', '{"fx_rates_updated": 0, "weather_checks": 0}'),
  ('periodic_sync', 'healthy', '{"sync_runs": 0, "errors": 0}')
ON CONFLICT (service_name) DO UPDATE SET
  status = EXCLUDED.status,
  updated_at = now();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_system_status_service_name ON system_status (service_name);
CREATE INDEX IF NOT EXISTS idx_system_status_last_check ON system_status (last_check);

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_system_status_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_system_status_updated_at ON system_status;
CREATE TRIGGER trigger_update_system_status_updated_at
  BEFORE UPDATE ON system_status
  FOR EACH ROW
  EXECUTE FUNCTION update_system_status_updated_at();

-- Schedule the cron job to run every minute
SELECT cron.schedule(
  'rule-automation-every-minute',
  '* * * * *', -- Every minute
  $$
  SELECT
    net.http_post(
        url:='https://xgzlmfbwtfazmobddwgn.supabase.co/functions/v1/cron-automation',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnemxtZmJ3dGZhem1vYmRkd2duIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzcxMzY4OCwiZXhwIjoyMDYzMjg5Njg4fQ.xCuJ1-Zg7PpZX0MNHfFbXKC5Y4OyGMXZCjQKJoOJ1pU"}'::jsonb,
        body:=concat('{"timestamp": "', now(), '"}')::jsonb
    ) as request_id;
  $$
);

-- Create a more frequent cron job for FX rate updates (every 5 minutes)
SELECT cron.schedule(
  'fx-rates-update-every-5min',
  '*/5 * * * *', -- Every 5 minutes
  $$
  SELECT
    net.http_post(
        url:='https://xgzlmfbwtfazmobddwgn.supabase.co/functions/v1/oracle-data',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnemxtZmJ3dGZhem1vYmRkd2duIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzcxMzY4OCwiZXhwIjoyMDYzMjg5Njg4fQ.xCuJ1-Zg7PpZX0MNHfFbXKC5Y4OyGMXZCjQKJoOJ1pU"}'::jsonb,
        body:='{"type": "fx_rates"}'::jsonb
    ) as request_id;
  $$
);