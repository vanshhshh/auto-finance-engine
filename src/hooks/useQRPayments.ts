
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useQRPayments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['qr-payments'],
    queryFn: async () => {
      try {
        const { data: requests, error } = await supabase
          .from('payment_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayRequests = requests?.filter(req => 
          new Date(req.created_at) >= todayStart
        ) || [];

        const successfulPayments = requests?.filter(req => 
          req.status === 'completed' && new Date(req.created_at) >= todayStart
        ) || [];

        const totalVolume = successfulPayments.reduce((sum, payment) => 
          sum + (Number(payment.amount) || 0), 0
        );

        return {
          qrCodesGenerated: todayRequests.length,
          successfulPayments: successfulPayments.length,
          totalVolume: totalVolume
        };
      } catch (error) {
        console.error('Error fetching QR payments:', error);
        return {
          qrCodesGenerated: 0,
          successfulPayments: 0,
          totalVolume: 0
        };
      }
    },
    enabled: !!user,
    refetchInterval: 10000,
  });
};
