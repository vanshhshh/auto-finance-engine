-- Create blockchain sync tables properly by first checking what exists

-- Add missing columns to programmable_rules if they don't exist
DO $$ 
BEGIN
    -- Check if programmable_rules table exists first
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'programmable_rules') THEN
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
    ELSE
        -- Create programmable_rules table if it doesn't exist
        CREATE TABLE programmable_rules (
            id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            user_id UUID NOT NULL,
            rule_name TEXT NOT NULL,
            rule_type TEXT NOT NULL,
            conditions JSONB NOT NULL,
            action_type TEXT NOT NULL,
            action_config JSONB NOT NULL,
            status TEXT NOT NULL DEFAULT 'active',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            last_executed TIMESTAMP WITH TIME ZONE,
            execution_count INTEGER DEFAULT 0,
            blockchain_rule_id TEXT,
            tx_hash TEXT
        );
        
        -- Enable RLS
        ALTER TABLE programmable_rules ENABLE ROW LEVEL SECURITY;
        
        -- Create policy
        CREATE POLICY "Users can manage own rules" 
        ON programmable_rules 
        FOR ALL 
        USING (user_id = auth.uid());
    END IF;
END $$;

-- Create the rule_executions table (we already handled this above)
-- Just make sure it has proper policy now that programmable_rules exists
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_programmable_rules_blockchain_rule_id 
ON programmable_rules (blockchain_rule_id);

CREATE INDEX IF NOT EXISTS idx_rule_executions_rule_id 
ON rule_executions (rule_id);