
-- Insert bucket only if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
SELECT 'kyc-documents', 'kyc-documents', false
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'kyc-documents'
);

-- Drop existing storage policies to avoid conflicts
DROP POLICY IF EXISTS "Users can upload their own KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own profile" ON storage.objects;

-- Create RLS policies for storage bucket
CREATE POLICY "Users can upload their own KYC documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'kyc-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own KYC documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'kyc-documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all KYC documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'kyc-documents' 
  AND EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.user_id = auth.uid() 
    AND p.role = 'admin'
  )
);

-- Drop existing profile policy to avoid conflicts
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Add policy to allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Ensure RLS is enabled on tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;

-- Fix the trigger function to ensure it works properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create profile with a simulated wallet address
  INSERT INTO public.profiles (user_id, role, wallet_address, kyc_status, wallet_approved)
  VALUES (
    NEW.id, 
    'user',
    '0x' || substr(replace(NEW.id::text, '-', ''), 1, 40),
    'pending',
    false
  );
  
  -- Create initial token balances as 0 for new users
  INSERT INTO public.token_balances (user_id, token_symbol, balance) VALUES
    (NEW.id, 'eINR', 0),
    (NEW.id, 'eUSD', 0),
    (NEW.id, 'eAED', 0);
    
  RETURN NEW;
END;
$$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
