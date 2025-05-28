
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Plus, Send, Clock, CheckCircle, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const SupportTicketSystem = () => {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'medium'
  });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      fetchMessages(selectedTicket.id);
    }
  }, [selectedTicket]);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const fetchMessages = async (ticketId: string) => {
    try {
      const { data, error } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', ticketId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const createTicket = async () => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user?.id,
          subject: newTicket.subject,
          description: newTicket.description,
          priority: newTicket.priority,
          status: 'open'
        })
        .select()
        .single();

      if (error) throw error;

      // Add initial message
      await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: data.id,
          user_id: user?.id,
          message: newTicket.description,
          is_internal: false
        });

      setTickets([data, ...tickets]);
      setNewTicket({ subject: '', description: '', priority: 'medium' });
      setShowNewTicket(false);

      toast({
        title: "Ticket Created",
        description: "Your support ticket has been created successfully.",
        className: "bg-green-600 text-white border-green-700",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create support ticket.",
        variant: "destructive",
      });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    try {
      const { error } = await supabase
        .from('ticket_messages')
        .insert({
          ticket_id: selectedTicket.id,
          user_id: user?.id,
          message: newMessage,
          is_internal: false
        });

      if (error) throw error;

      // Update ticket status to in_progress if it was open
      if (selectedTicket.status === 'open') {
        await supabase
          .from('support_tickets')
          .update({ status: 'in_progress', updated_at: new Date().toISOString() })
          .eq('id', selectedTicket.id);
      }

      fetchMessages(selectedTicket.id);
      setNewMessage('');

      toast({
        title: "Message Sent",
        description: "Your message has been sent to support.",
        className: "bg-blue-600 text-white border-blue-700",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-600';
      case 'in_progress': return 'bg-orange-600';
      case 'resolved': return 'bg-green-600';
      case 'closed': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600';
      case 'high': return 'bg-orange-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[800px]">
      {/* Tickets List */}
      <Card className="lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Support Tickets</CardTitle>
          <Button
            size="sm"
            onClick={() => setShowNewTicket(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus size={16} className="mr-1" />
            New
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-2 max-h-[700px] overflow-y-auto">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedTicket?.id === ticket.id ? 'bg-blue-50 border-blue-200' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{ticket.subject}</span>
                  <Badge className={`${getPriorityColor(ticket.priority)} text-white text-xs`}>
                    {ticket.priority.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 truncate">{ticket.description}</p>
                <div className="flex items-center justify-between mt-2">
                  <Badge className={`${getStatusColor(ticket.status)} text-white text-xs`}>
                    {ticket.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            {tickets.length === 0 && (
              <div className="text-center py-8 text-gray-600">
                <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
                <p>No support tickets</p>
                <p className="text-sm">Create your first ticket to get help</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ticket Details/New Ticket */}
      <Card className="lg:col-span-2">
        {showNewTicket ? (
          <>
            <CardHeader>
              <CardTitle>Create New Ticket</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newTicket.subject}
                  onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                />
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="Detailed description of your issue..."
                  rows={6}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={createTicket}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={!newTicket.subject || !newTicket.description}
                >
                  Create Ticket
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowNewTicket(false)}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </>
        ) : selectedTicket ? (
          <>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{selectedTicket.subject}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{selectedTicket.description}</p>
                </div>
                <div className="text-right">
                  <Badge className={`${getStatusColor(selectedTicket.status)} text-white`}>
                    {selectedTicket.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <div className="text-sm text-gray-600 mt-1">
                    Created: {new Date(selectedTicket.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Messages */}
              <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg ${
                      message.user_id === user?.id
                        ? 'bg-blue-50 border border-blue-200 ml-8'
                        : 'bg-gray-50 border border-gray-200 mr-8'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <User size={16} className="text-gray-600" />
                      <span className="text-sm font-medium">
                        {message.user_id === user?.id ? 'You' : 'Support Agent'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{message.message}</p>
                  </div>
                ))}
              </div>

              {/* Reply */}
              {selectedTicket.status !== 'closed' && (
                <div className="space-y-3">
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your reply..."
                    rows={3}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Send size={16} className="mr-2" />
                    Send Reply
                  </Button>
                </div>
              )}

              {selectedTicket.status === 'closed' && (
                <div className="text-center py-4 text-gray-600">
                  <CheckCircle size={48} className="mx-auto mb-2 text-green-600" />
                  <p>This ticket has been closed</p>
                </div>
              )}
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center text-gray-600">
              <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
              <p>Select a ticket to view details</p>
              <p className="text-sm">or create a new ticket to get started</p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default SupportTicketSystem;
