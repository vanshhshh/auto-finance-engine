
-- Create comprehensive CBDC API infrastructure tables
-- Account Management
CREATE TABLE IF NOT EXISTS cbdc_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_type TEXT NOT NULL CHECK (account_type IN ('personal', 'business', 'sub_account')),
  parent_account_id UUID REFERENCES cbdc_accounts(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled', 'frozen', 'closed')),
  country_code TEXT NOT NULL,
  alias_email TEXT,
  alias_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment Interface Providers (PIPs)
CREATE TABLE IF NOT EXISTS payment_interface_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  country_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'revoked')),
  api_key TEXT NOT NULL UNIQUE,
  public_key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ecosystem Service Interface Providers (ESIPs)
CREATE TABLE IF NOT EXISTS ecosystem_service_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  provider_type TEXT NOT NULL CHECK (provider_type IN ('analytics', 'automation', 'fraud_detection', 'smart_contracts')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'revoked')),
  api_key TEXT NOT NULL UNIQUE,
  permissions JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Account Connections to ESIPs
CREATE TABLE IF NOT EXISTS account_esip_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES cbdc_accounts(id) ON DELETE CASCADE,
  esip_id UUID NOT NULL REFERENCES ecosystem_service_providers(id) ON DELETE CASCADE,
  permissions JSONB NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'revoked')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(account_id, esip_id)
);

-- Programmable Locks (2-party, 3-party, HTLC)
CREATE TABLE IF NOT EXISTS programmable_locks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lock_type TEXT NOT NULL CHECK (lock_type IN ('two_party', 'three_party', 'htlc')),
  account_id UUID NOT NULL REFERENCES cbdc_accounts(id),
  amount NUMERIC NOT NULL,
  token_symbol TEXT NOT NULL,
  recipient_pip TEXT NOT NULL,
  arbiter_pip TEXT, -- For three_party locks
  hash_condition TEXT, -- For HTLC
  time_lock TIMESTAMP WITH TIME ZONE, -- For HTLC
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'released', 'cancelled', 'expired')),
  conditions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Split Payments
CREATE TABLE IF NOT EXISTS split_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiator_account_id UUID NOT NULL REFERENCES cbdc_accounts(id),
  total_amount NUMERIC NOT NULL,
  token_symbol TEXT NOT NULL,
  conditions JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS split_payment_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  split_payment_id UUID NOT NULL REFERENCES split_payments(id) ON DELETE CASCADE,
  recipient_pip TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  transaction_id UUID REFERENCES transactions(id)
);

-- Offline CBDC Operations
CREATE TABLE IF NOT EXISTS offline_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES cbdc_accounts(id),
  operation_type TEXT NOT NULL CHECK (operation_type IN ('download', 'upload')),
  amount NUMERIC NOT NULL,
  token_symbol TEXT NOT NULL,
  device_type TEXT NOT NULL CHECK (device_type IN ('smart_card', 'secure_hardware', 'offline_ledger')),
  device_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Request to Pay (RTP) and Authenticated RTP
CREATE TABLE IF NOT EXISTS payment_requests_advanced (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_account_id UUID NOT NULL REFERENCES cbdc_accounts(id),
  payer_pip TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  token_symbol TEXT NOT NULL,
  description TEXT,
  is_authenticated BOOLEAN DEFAULT FALSE,
  authentication_method TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired', 'completed')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Fund/Defund Operations (Mint/Withdraw CBDC)
CREATE TABLE IF NOT EXISTS fund_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES cbdc_accounts(id),
  operation_type TEXT NOT NULL CHECK (operation_type IN ('fund', 'defund')),
  amount NUMERIC NOT NULL,
  token_symbol TEXT NOT NULL,
  bank_account_id TEXT,
  country_code TEXT NOT NULL,
  bank_method TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  reference_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Country-specific Banking Methods
CREATE TABLE IF NOT EXISTS country_banking_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  method_name TEXT NOT NULL,
  method_type TEXT NOT NULL CHECK (method_type IN ('bank_transfer', 'card', 'mobile_money', 'digital_wallet')),
  provider_name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  configuration JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Request Logs for Security and Audit
CREATE TABLE IF NOT EXISTS api_request_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  pip_id UUID REFERENCES payment_interface_providers(id),
  esip_id UUID REFERENCES ecosystem_service_providers(id),
  user_id UUID REFERENCES auth.users(id),
  request_headers JSONB,
  request_body JSONB,
  response_status INTEGER,
  response_body JSONB,
  ip_address INET,
  idempotency_key TEXT,
  jws_signature TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Developer Sandbox Environments
CREATE TABLE IF NOT EXISTS developer_sandboxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  developer_id UUID NOT NULL REFERENCES auth.users(id),
  sandbox_name TEXT NOT NULL,
  api_key TEXT NOT NULL UNIQUE,
  environment_config JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conditional Triggers for Programmability
CREATE TABLE IF NOT EXISTS conditional_triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES cbdc_accounts(id),
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('time_based', 'weather', 'fx_rate', 'geo_location', 'oracle')),
  conditions JSONB NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('payment', 'lock', 'unlock', 'split_pay')),
  action_config JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'executed', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_executed TIMESTAMP WITH TIME ZONE
);

-- Trade Finance and Escrow
CREATE TABLE IF NOT EXISTS trade_finance_escrows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_account_id UUID NOT NULL REFERENCES cbdc_accounts(id),
  seller_account_id UUID NOT NULL REFERENCES cbdc_accounts(id),
  escrow_amount NUMERIC NOT NULL,
  token_symbol TEXT NOT NULL,
  trade_terms JSONB NOT NULL,
  documents_required TEXT[],
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'funded', 'documents_uploaded', 'released', 'disputed', 'cancelled')),
  arbiter_pip TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  released_at TIMESTAMP WITH TIME ZONE
);

-- Cross-border Atomic Swaps via HTLC
CREATE TABLE IF NOT EXISTS atomic_swaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initiator_account_id UUID NOT NULL REFERENCES cbdc_accounts(id),
  counterparty_pip TEXT NOT NULL,
  send_amount NUMERIC NOT NULL,
  send_token TEXT NOT NULL,
  receive_amount NUMERIC NOT NULL,
  receive_token TEXT NOT NULL,
  hash_lock TEXT NOT NULL,
  time_lock TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'initiated' CHECK (status IN ('initiated', 'locked', 'redeemed', 'refunded', 'expired')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default country banking methods
INSERT INTO country_banking_methods (country_code, method_name, method_type, provider_name, configuration) VALUES
-- India
('IN', 'UPI Transfer', 'mobile_money', 'NPCI', '{"upi_id_required": true, "instant": true}'),
('IN', 'NEFT Transfer', 'bank_transfer', 'RBI', '{"account_number_required": true, "ifsc_required": true}'),
('IN', 'RTGS Transfer', 'bank_transfer', 'RBI', '{"account_number_required": true, "ifsc_required": true, "min_amount": 200000}'),
('IN', 'PayTM Wallet', 'digital_wallet', 'PayTM', '{"phone_number_required": true}'),

-- United States
('US', 'ACH Transfer', 'bank_transfer', 'Federal Reserve', '{"routing_number_required": true, "account_number_required": true}'),
('US', 'Wire Transfer', 'bank_transfer', 'Federal Reserve', '{"routing_number_required": true, "account_number_required": true, "swift_code": true}'),
('US', 'Zelle', 'digital_wallet', 'Early Warning Services', '{"email_or_phone_required": true}'),
('US', 'Venmo', 'digital_wallet', 'PayPal', '{"username_required": true}'),

-- UAE
('AE', 'ADCB Transfer', 'bank_transfer', 'ADCB', '{"iban_required": true, "swift_code": "ADCBAEAA"}'),
('AE', 'Emirates NBD', 'bank_transfer', 'Emirates NBD', '{"iban_required": true, "swift_code": "EBILAEAD"}'),
('AE', 'CBD Now', 'digital_wallet', 'CBD', '{"phone_number_required": true}'),
('AE', 'Liv by Emirates NBD', 'digital_wallet', 'Emirates NBD', '{"phone_number_required": true}'),

-- United Kingdom
('GB', 'Faster Payments', 'bank_transfer', 'Bank of England', '{"sort_code_required": true, "account_number_required": true}'),
('GB', 'CHAPS', 'bank_transfer', 'Bank of England', '{"sort_code_required": true, "account_number_required": true, "high_value": true}'),
('GB', 'Revolut', 'digital_wallet', 'Revolut', '{"phone_number_required": true}'),

-- European Union
('EU', 'SEPA Transfer', 'bank_transfer', 'ECB', '{"iban_required": true, "bic_code": true}'),
('EU', 'SEPA Instant', 'bank_transfer', 'ECB', '{"iban_required": true, "instant": true}'),
('EU', 'N26 Transfer', 'digital_wallet', 'N26', '{"phone_number_required": true}'),

-- China
('CN', 'Alipay', 'digital_wallet', 'Ant Group', '{"phone_number_required": true}'),
('CN', 'WeChat Pay', 'digital_wallet', 'Tencent', '{"phone_number_required": true}'),
('CN', 'UnionPay', 'card', 'China UnionPay', '{"card_number_required": true}'),

-- Japan
('JP', 'J-Debit', 'card', 'J-Debit', '{"card_number_required": true}'),
('JP', 'PayPay', 'digital_wallet', 'PayPay', '{"phone_number_required": true}'),
('JP', 'Line Pay', 'digital_wallet', 'LINE', '{"line_id_required": true}'),

-- Singapore
('SG', 'PayNow', 'mobile_money', 'MAS', '{"nric_or_phone_required": true, "instant": true}'),
('SG', 'DBS PayLah!', 'digital_wallet', 'DBS', '{"phone_number_required": true}'),
('SG', 'GrabPay', 'digital_wallet', 'Grab', '{"phone_number_required": true}');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_cbdc_accounts_user_id ON cbdc_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_cbdc_accounts_parent ON cbdc_accounts(parent_account_id);
CREATE INDEX IF NOT EXISTS idx_programmable_locks_account ON programmable_locks(account_id);
CREATE INDEX IF NOT EXISTS idx_split_payments_initiator ON split_payments(initiator_account_id);
CREATE INDEX IF NOT EXISTS idx_api_request_logs_pip ON api_request_logs(pip_id);
CREATE INDEX IF NOT EXISTS idx_api_request_logs_created ON api_request_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_country_banking_methods_country ON country_banking_methods(country_code);
CREATE INDEX IF NOT EXISTS idx_conditional_triggers_account ON conditional_triggers(account_id);
CREATE INDEX IF NOT EXISTS idx_trade_finance_buyer ON trade_finance_escrows(buyer_account_id);
CREATE INDEX IF NOT EXISTS idx_atomic_swaps_initiator ON atomic_swaps(initiator_account_id);

-- Enable RLS on all tables
ALTER TABLE cbdc_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_interface_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecosystem_service_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_esip_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE programmable_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE split_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE split_payment_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE offline_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_requests_advanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE fund_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE country_banking_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_request_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE developer_sandboxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE conditional_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_finance_escrows ENABLE ROW LEVEL SECURITY;
ALTER TABLE atomic_swaps ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- CBDC Accounts - users can manage their own accounts, admins can manage all
CREATE POLICY "Users can manage own accounts" ON cbdc_accounts
FOR ALL USING (
  user_id = auth.uid() OR 
  auth.uid()::text = 'de121dc9-d461-4716-a2fd-5c4850841446' OR
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
);

-- Payment Interface Providers - admins only
CREATE POLICY "Admins can manage PIPs" ON payment_interface_providers
FOR ALL USING (
  auth.uid()::text = 'de121dc9-d461-4716-a2fd-5c4850841446' OR
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
);

-- Country banking methods - public read, admin write
CREATE POLICY "Public can view banking methods" ON country_banking_methods
FOR SELECT USING (true);

CREATE POLICY "Admins can manage banking methods" ON country_banking_methods
FOR INSERT WITH CHECK (
  auth.uid()::text = 'de121dc9-d461-4716-a2fd-5c4850841446' OR
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
);

-- Programmable locks - users can manage their own
CREATE POLICY "Users can manage own locks" ON programmable_locks
FOR ALL USING (
  EXISTS (SELECT 1 FROM cbdc_accounts a WHERE a.id = account_id AND a.user_id = auth.uid()) OR
  auth.uid()::text = 'de121dc9-d461-4716-a2fd-5c4850841446' OR
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
);

-- Similar policies for other tables...
CREATE POLICY "Users can manage own split payments" ON split_payments
FOR ALL USING (
  EXISTS (SELECT 1 FROM cbdc_accounts a WHERE a.id = initiator_account_id AND a.user_id = auth.uid()) OR
  auth.uid()::text = 'de121dc9-d461-4716-a2fd-5c4850841446' OR
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
);

CREATE POLICY "Users can manage own operations" ON offline_operations
FOR ALL USING (
  EXISTS (SELECT 1 FROM cbdc_accounts a WHERE a.id = account_id AND a.user_id = auth.uid()) OR
  auth.uid()::text = 'de121dc9-d461-4716-a2fd-5c4850841446' OR
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
);

CREATE POLICY "Users can manage own payment requests" ON payment_requests_advanced
FOR ALL USING (
  EXISTS (SELECT 1 FROM cbdc_accounts a WHERE a.id = requester_account_id AND a.user_id = auth.uid()) OR
  auth.uid()::text = 'de121dc9-d461-4716-a2fd-5c4850841446' OR
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
);

CREATE POLICY "Users can manage own fund operations" ON fund_operations
FOR ALL USING (
  EXISTS (SELECT 1 FROM cbdc_accounts a WHERE a.id = account_id AND a.user_id = auth.uid()) OR
  auth.uid()::text = 'de121dc9-d461-4716-a2fd-5c4850841446' OR
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
);

CREATE POLICY "Users can manage own triggers" ON conditional_triggers
FOR ALL USING (
  EXISTS (SELECT 1 FROM cbdc_accounts a WHERE a.id = account_id AND a.user_id = auth.uid()) OR
  auth.uid()::text = 'de121dc9-d461-4716-a2fd-5c4850841446' OR
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
);

CREATE POLICY "Users can manage own escrows" ON trade_finance_escrows
FOR ALL USING (
  EXISTS (SELECT 1 FROM cbdc_accounts a WHERE (a.id = buyer_account_id OR a.id = seller_account_id) AND a.user_id = auth.uid()) OR
  auth.uid()::text = 'de121dc9-d461-4716-a2fd-5c4850841446' OR
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
);

CREATE POLICY "Users can manage own swaps" ON atomic_swaps
FOR ALL USING (
  EXISTS (SELECT 1 FROM cbdc_accounts a WHERE a.id = initiator_account_id AND a.user_id = auth.uid()) OR
  auth.uid()::text = 'de121dc9-d461-4716-a2fd-5c4850841446' OR
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
);

-- API logs - admins only
CREATE POLICY "Admins can view API logs" ON api_request_logs
FOR SELECT USING (
  auth.uid()::text = 'de121dc9-d461-4716-a2fd-5c4850841446' OR
  EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = auth.uid() AND p.role = 'admin')
);

-- Developer sandboxes - users can manage their own
CREATE POLICY "Users can manage own sandboxes" ON developer_sandboxes
FOR ALL USING (developer_id = auth.uid());
