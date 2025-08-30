import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Plus, Clock, CheckCircle } from 'lucide-react';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { supportTicketSchema, SupportTicketFormData } from '@/lib/validations';
import { SupportTicket } from '@/types';

const Support = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'tickets'>('tickets');
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const api = useApi();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset
  } = useForm<SupportTicketFormData>({
    resolver: zodResolver(supportTicketSchema),
    defaultValues: { priority: 'medium' }
  });

  const onSubmit = async (data: SupportTicketFormData) => {
    try {
      const response = await api.post('/api/support/create', data);
      
      if (response?.success) {
        toast({
          title: "Ticket created",
          description: "Your support ticket has been submitted successfully",
        });
        reset();
        setActiveTab('tickets');
        // Add mock ticket for demo
        const newTicket: SupportTicket = {
          id: Date.now().toString(),
          userId: 'user1',
          title: data.title,
          description: data.description,
          status: 'open',
          priority: data.priority,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setTickets(prev => [newTicket, ...prev]);
      }
    } catch (error) {
      console.error('Create ticket error:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Support Center</h1>
          <p className="text-text-secondary">
            Get help with your UniCart experience. Our team is here to assist you.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={activeTab === 'tickets' ? 'default' : 'outline'}
            onClick={() => setActiveTab('tickets')}
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            My Tickets
          </Button>
          <Button
            variant={activeTab === 'create' ? 'default' : 'outline'}
            onClick={() => setActiveTab('create')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Ticket
          </Button>
        </div>

        {activeTab === 'create' && (
          <Card>
            <CardHeader>
              <CardTitle>Create Support Ticket</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Subject</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of your issue"
                    {...register('title')}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select onValueChange={(value: any) => setValue('priority', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed information about your issue"
                    rows={6}
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                  )}
                </div>

                <Button type="submit" className="btn-hero" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating Ticket...' : 'Submit Ticket'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === 'tickets' && (
          <div className="space-y-4">
            {tickets.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No support tickets yet</h3>
                  <p className="text-text-secondary mb-6">
                    Create your first ticket to get help with any issues
                  </p>
                  <Button onClick={() => setActiveTab('create')}>
                    Create Your First Ticket
                  </Button>
                </CardContent>
              </Card>
            ) : (
              tickets.map((ticket) => (
                <Card key={ticket.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{ticket.title}</h3>
                          <Badge variant="outline" className={getStatusColor(ticket.status)}>
                            {ticket.status}
                          </Badge>
                          <span className={`text-sm font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </div>
                        <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                          {ticket.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-text-muted">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {ticket.createdAt.toLocaleDateString()}
                          </span>
                          <span>Ticket #{ticket.id}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;