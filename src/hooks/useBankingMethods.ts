
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useBankingMethods = (countryCode?: string) => {
  return useQuery({
    queryKey: ['banking-methods', countryCode],
    queryFn: async () => {
      let query = supabase
        .from('country_banking_methods')
        .select('*')
        .eq('is_active', true);
      
      if (countryCode) {
        query = query.eq('country_code', countryCode);
      }
      
      const { data, error } = await query.order('method_name');
      
      if (error) throw error;
      return data || [];
    },
  });
};
