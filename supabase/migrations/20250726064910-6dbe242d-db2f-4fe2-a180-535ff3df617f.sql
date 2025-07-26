-- Add missing tables and columns for blockchain sync

-- Add execution_count to programmable_rules if it doesn't exist
ALTER TABLE programmable_rules 
ADD COLUMN IF NOT EXISTS execution_count INTEGER DEFAULT 0;

-- Add blockchain_rule_id to programmable_rules if it doesn't exist
ALTER TABLE programmable_rules 
ADD COLUMN IF NOT EXISTS blockchain_rule_id TEXT;

-- Add tx_hash to programmable_rules if it doesn't exist
ALTER TABLE programmable_rules 
ADD COLUMN IF NOT EXISTS tx_hash TEXT;

-- Create function to increment execution count
CREATE OR REPLACE FUNCTION increment_execution_count(rule_id TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE programmable_rules 
  SET execution_count = execution_count + 1
  WHERE blockchain_rule_id = rule_id
  RETURNING execution_count INTO new_count;
  
  RETURN COALESCE(new_count, 0);
END;
$$;

-- Ensure webhook_deliveries table exists (it should from earlier migrations)
CREATE TABLE IF NOT EXISTS webhook_deliveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  webhook_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  success BOOLEAN DEFAULT false,
  response_status INTEGER,
  response_body TEXT,
  delivered_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ensure rule_executions table exists (it should from earlier migrations)
CREATE TABLE IF NOT EXISTS rule_executions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_id TEXT NOT NULL,
  executed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  success BOOLEAN NOT NULL,
  transaction_id TEXT,
  oracle_data JSONB,
  reason TEXT
);

-- Enable RLS on new tables if not already enabled
ALTER TABLE webhook_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_executions ENABLE ROW LEVEL SECURITY;

-- Create policies for webhook_deliveries (admin only)
DROP POLICY IF EXISTS "Admins can view webhook deliveries" ON webhook_deliveries;
CREATE POLICY "Admins can view webhook deliveries" 
ON webhook_deliveries 
FOR ALL 
USING (
  (auth.uid()::text = 'de121dc9-d461-4716-a2fd-5c4850841446'::text) OR 
  (EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  ))
);

-- Update existing policy for rule_executions to handle text rule_id
DROP POLICY IF EXISTS "Users can view executions of their rules" ON rule_executions;
CREATE POLICY "Users can view executions of their rules" 
ON rule_executions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM programmable_rules pr
    WHERE pr.blockchain_rule_id = rule_executions.rule_id 
    AND pr.user_id = auth.uid()
  ) OR
  (auth.uid()::text = 'de121dc9-d461-4716-a2fd-5c4850841446'::text) OR 
  (EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  ))
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_programmable_rules_blockchain_rule_id 
ON programmable_rules (blockchain_rule_id);

CREATE INDEX IF NOT EXISTS idx_rule_executions_rule_id 
ON rule_executions (rule_id);

CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_event_type 
ON webhook_deliveries (event_type);