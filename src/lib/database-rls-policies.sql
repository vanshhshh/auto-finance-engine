
-- Create security definer function to check user roles without recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Check if user is a known admin first
  IF auth.uid()::text IN ('de121dc9-d461-4716-a2fd-5c4850841446') THEN
    RETURN 'admin';
  END IF;
  
  -- Otherwise check database
  SELECT role INTO user_role 
  FROM public.profiles 
  WHERE user_id = auth.uid();
  
  RETURN COALESCE(user_role, 'user');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Profiles policies
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- KYC Documents policies
DROP POLICY IF EXISTS "Users can view own kyc documents" ON public.kyc_documents;
DROP POLICY IF EXISTS "Users can insert own kyc documents" ON public.kyc_documents;
DROP POLICY IF EXISTS "Admins can view all kyc documents" ON public.kyc_documents;
DROP POLICY IF EXISTS "Admins can update kyc documents" ON public.kyc_documents;

CREATE POLICY "Users can view own kyc documents" 
ON public.kyc_documents 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own kyc documents" 
ON public.kyc_documents 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all kyc documents" 
ON public.kyc_documents 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can update kyc documents" 
ON public.kyc_documents 
FOR UPDATE 
USING (public.get_current_user_role() = 'admin');

-- Token balances policies
DROP POLICY IF EXISTS "Users can view own token balances" ON public.token_balances;
DROP POLICY IF EXISTS "Users can update own token balances" ON public.token_balances;
DROP POLICY IF EXISTS "Admins can view all token balances" ON public.token_balances;

CREATE POLICY "Users can view own token balances" 
ON public.token_balances 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own token balances" 
ON public.token_balances 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all token balances" 
ON public.token_balances 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

-- Transactions policies
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.transactions;

CREATE POLICY "Users can view own transactions" 
ON public.transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions" 
ON public.transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions" 
ON public.transactions 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');
