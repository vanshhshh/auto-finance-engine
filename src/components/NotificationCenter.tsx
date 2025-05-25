
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Notification {
  id: string;
  type: 'transaction' | 'rule' | 'compliance' | 'system';
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  created_at: string;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    // Simulate real-time notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'transaction',
        title: 'Transaction Completed',
        message: 'Your transfer of 1,000 eINR has been processed successfully',
        severity: 'success',
        read: false,
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'rule',
        title: 'Rule Executed',
        message: 'Auto-payment rule triggered: 500 eUSD sent to merchant',
        severity: 'info',
        read: false,
        created_at: new Date(Date.now() - 300000).toISOString(),
      },
      {
        id: '3',
        type: 'compliance',
        title: 'Compliance Alert',
        message: 'Daily transaction limit approaching (85% used)',
        severity: 'warning',
        read: true,
        created_at: new Date(Date.now() - 600000).toISOString(),
      },
    ];

    setNotifications(mockNotifications);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (severity: string) => {
    switch (severity) {
      case 'success': return <CheckCircle className="text-green-400" size={16} />;
      case 'warning': return <AlertTriangle className="text-yellow-400" size={16} />;
      case 'error': return <AlertTriangle className="text-red-400" size={16} />;
      default: return <Info className="text-blue-400" size={16} />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
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
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 min-w-[18px] h-4">
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute top-12 right-0 w-80 bg-slate-800 border-slate-700 z-50 max-h-96 overflow-y-auto">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-sm">Notifications</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={14} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-4 text-slate-400 text-sm">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    notification.read 
                      ? 'bg-slate-700/30 border-slate-600/50' 
                      : 'bg-blue-600/10 border-blue-500/30'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1">
                      {getIcon(notification.severity)}
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">
                          {notification.title}
                        </div>
                        <div className="text-slate-300 text-xs mt-1">
                          {notification.message}
                        </div>
                        <div className="text-slate-500 text-xs mt-1">
                          {new Date(notification.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="text-slate-400 hover:text-white p-1 flex-shrink-0"
                    >
                      <X size={12} />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationCenter;
