-- Fix database schema for blockchain sync with proper types

-- Add missing columns to programmable_rules table
DO $$ 
BEGIN
    -- Add execution_count column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'programmable_rules' AND column_name = 'execution_count') THEN
        ALTER TABLE programmable_rules ADD COLUMN execution_count INTEGER DEFAULT 0;
    END IF;
    
    -- Add blockchain_rule_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'programmable_rules' AND column_name = 'blockchain_rule_id') THEN
        ALTER TABLE programmable_rules ADD COLUMN blockchain_rule_id TEXT;
    END IF;
    
    -- Add tx_hash column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'programmable_rules' AND column_name = 'tx_hash') THEN
        ALTER TABLE programmable_rules ADD COLUMN tx_hash TEXT;
    END IF;
END $$;

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

-- Update rule_executions table to use TEXT for rule_id (matching blockchain_rule_id)
DO $$
BEGIN
    -- Check if rule_executions table exists and update rule_id type
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'rule_executions') THEN
        -- Drop existing foreign key constraint if it exists
        ALTER TABLE rule_executions DROP CONSTRAINT IF EXISTS rule_executions_rule_id_fkey;
        
        -- Update column type to TEXT to match blockchain_rule_id
        ALTER TABLE rule_executions ALTER COLUMN rule_id TYPE TEXT;
    END IF;
END $$;

-- Update the RLS policy for rule_executions with proper type handling
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_programmable_rules_blockchain_rule_id 
ON programmable_rules (blockchain_rule_id);

CREATE INDEX IF NOT EXISTS idx_rule_executions_rule_id 
ON rule_executions (rule_id);

CREATE INDEX IF NOT EXISTS idx_webhook_deliveries_event_type 
ON webhook_deliveries (event_type);

-- Ensure webhook_deliveries RLS policy exists
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