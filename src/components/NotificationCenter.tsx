
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
    read: index > 2, // Mark first 3 as unread
    created_at: tx.created_at
  }));

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (notificationId: string) => {
    try {
      // In a real implementation, this would update the notification in the database
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
      // In a real implementation, this would update all notifications
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
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative border-slate-600 text-white hover:bg-slate-700"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-medium">Notifications</h3>
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
                  className="text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-slate-400">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <Card key={notification.id} className={`m-2 border-slate-700 ${!notification.read ? 'bg-slate-700/50' : 'bg-slate-800/50'}`}>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={`w-2 h-2 rounded-full ${getSeverityColor(notification.severity)}`} />
                          <h4 className="text-white text-sm font-medium">{notification.title}</h4>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          )}
                        </div>
                        <p className="text-slate-400 text-sm mb-2">{notification.message}</p>
                        <div className="text-xs text-slate-500">
                          {new Date(notification.created_at).toLocaleString()}
                        </div>
                      </div>
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                          className="text-blue-400 hover:text-blue-300 hover:bg-slate-700 text-xs"
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
