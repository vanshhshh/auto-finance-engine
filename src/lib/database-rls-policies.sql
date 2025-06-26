
-- RLS Policies for profiles table
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.role = 'admin'
  )
);

CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for kyc_documents table
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
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.role = 'admin'
  )
);

CREATE POLICY "Admins can update kyc documents" 
ON public.kyc_documents 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.role = 'admin'
  )
);

-- Token balances RLS policies
DROP POLICY IF EXISTS "Users can view own token balances" ON public.token_balances;
DROP POLICY IF EXISTS "Users can update own token balances" ON public.token_balances;
DROP POLICY IF EXISTS "Admins can view all token balances" ON public.token_balances;

ALTER TABLE public.token_balances ENABLE ROW LEVEL SECURITY;

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
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.role = 'admin'
  )
);

-- Transactions RLS policies
DROP POLICY IF EXISTS "Users can view own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.transactions;

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

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
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.role = 'admin'
  )
);
