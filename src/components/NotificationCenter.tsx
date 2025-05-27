
import React, { useState } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useWalletData } from '@/hooks/useWalletData';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { transactions } = useWalletData();
  const { user } = useAuth();
  const { toast } = useToast();

  // Create simulated notifications from transaction data
  const notifications = transactions.slice(0, 5).map((tx, index) => ({
    id: `notif_${tx.id}`,
    type: 'transaction',
    title: `${tx.transaction_type.charAt(0).toUpperCase() + tx.transaction_type.slice(1)} Transaction`,
    message: `${tx.transaction_type === 'send' ? 'Sent' : 'Received'} ${tx.amount} ${tx.token_symbol}`,
    severity: tx.status === 'completed' ? 'success' : tx.status === 'failed' ? 'error' : 'info',
    read: index > 2,
    created_at: tx.created_at
  }));

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase.from('audit_logs').insert({
        action: 'notification_read',
        user_id: user?.id,
        details: { notification_id: notificationId }
      });

      toast({
        title: "Notification marked as read",
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await supabase.from('audit_logs').insert({
        action: 'notifications_read_all',
        user_id: user?.id,
        details: { count: unreadCount }
      });

      toast({
        title: "All notifications marked as read",
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-blue-600';
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-900 font-medium">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    size="sm"
                    onClick={markAllAsRead}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                  >
                    <Check size={12} className="mr-1" />
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-600">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <Card key={notification.id} className={`m-2 border-gray-200 ${!notification.read ? 'bg-blue-50' : 'bg-white'}`}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-2 h-2 rounded-full ${getSeverityColor(notification.severity)}`} />
                          <h4 className="text-gray-900 text-sm font-medium">{notification.title}</h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                        <div className="text-xs text-gray-500">
                          {new Date(notification.created_at).toLocaleString()}
                        </div>
                      </div>
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 text-xs"
                        >
                          <Check size={12} />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
