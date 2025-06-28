
-- First, let's update the get_current_user_role function to handle cases better
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

-- Drop and recreate the problematic policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update kyc documents" ON public.kyc_documents;
DROP POLICY IF EXISTS "Admins can view all kyc documents" ON public.kyc_documents;

-- Recreate profiles policies with better logic
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid()::text = 'de121dc9-d461-4716-a2fd-5c4850841446' OR
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (
  auth.uid() = user_id OR 
  auth.uid()::text = 'de121dc9-d461-4716-a2fd-5c4850841446' OR
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

-- Fix KYC document policies
CREATE POLICY "Admins can view all kyc documents" 
ON public.kyc_documents 
FOR SELECT 
USING (
  auth.uid() = user_id OR
  auth.uid()::text = 'de121dc9-d461-4716-a2fd-5c4850841446' OR
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

CREATE POLICY "Admins can update kyc documents" 
ON public.kyc_documents 
FOR UPDATE 
USING (
  auth.uid()::text = 'de121dc9-d461-4716-a2fd-5c4850841446' OR
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

-- Also fix token balances policies to avoid similar issues
DROP POLICY IF EXISTS "Admins can view all token balances" ON public.token_balances;
CREATE POLICY "Admins can view all token balances" 
ON public.token_balances 
FOR SELECT 
USING (
  auth.uid() = user_id OR
  auth.uid()::text = 'de121dc9-d461-4716-a2fd-5c4850841446' OR
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);

-- Fix transactions policies  
DROP POLICY IF EXISTS "Admins can view all transactions" ON public.transactions;
CREATE POLICY "Admins can view all transactions" 
ON public.transactions 
FOR SELECT 
USING (
  auth.uid() = user_id OR
  auth.uid()::text = 'de121dc9-d461-4716-a2fd-5c4850841446' OR
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() AND p.role = 'admin'
  )
);
