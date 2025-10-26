import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useApi } from '@/hooks/useApi';
import { Order } from '@/types';
import { Package, Clock, CheckCircle, XCircle, Truck, CreditCard, MapPin } from 'lucide-react';

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const api = useApi();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isSellerView = location.pathname.startsWith('/seller/orders');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: { pathname: '/orders' } } });
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // For seller view, try seller-specific endpoint; otherwise, default to buyer orders
      let response = isSellerView ? await api.get('/api/orders/seller') : await api.get('/api/orders');
      if (!response && isSellerView) {
        // Fallback to query param-based
        response = await api.get('/api/orders?role=seller');
      }
      const data = response?.data?.data || response?.data;
      const orderList = data?.orders || (Array.isArray(data) ? data : []);
      setOrders(orderList);
    } catch (err: any) {
      console.error('Failed to fetch orders:', err);
      const errorMsg = err.response?.data?.msg || err.response?.data?.message || 'Failed to load orders';
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'paid':
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-300';
      case 'paid':
      case 'processing':
        return 'bg-blue-500/10 text-blue-700 border-blue-300';
      case 'shipped':
        return 'bg-purple-500/10 text-purple-700 border-purple-300';
      case 'delivered':
        return 'bg-green-500/10 text-green-700 border-green-300';
      case 'cancelled':
        return 'bg-red-500/10 text-red-700 border-red-300';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-300';
    }
  };

  const getPaymentStatusColor = (status: Order['paymentStatus']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/10 text-green-700';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-700';
      case 'failed':
        return 'bg-red-500/10 text-red-700';
      case 'refunded':
        return 'bg-blue-500/10 text-blue-700';
      default:
        return 'bg-gray-500/10 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
  <h1 className="text-3xl font-bold">{isSellerView ? 'Seller Orders' : 'My Orders'}</h1>
        <Button variant="outline" onClick={fetchOrders}>
          Refresh
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-4">
              Start shopping to see your orders here
            </p>
            <Button onClick={() => navigate('/products')}>Browse Products</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="card-hover">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg mb-2">
                      Order #{order.id.slice(-8)}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getStatusColor(order.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </Badge>
                    <Badge variant="outline" className={getPaymentStatusColor(order.paymentStatus)}>
                      <CreditCard className="h-3 w-3 mr-1" />
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Items ({order.cartItems.length})
                    </h3>
                    <div className="space-y-2">
                      {order.cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between bg-muted/50 p-2 rounded">
                          <div className="flex items-center gap-3">
                            {item.product.images?.[0] && (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.title}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium text-sm">{item.product.title}</p>
                              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <p className="font-semibold">₹{item.price * item.quantity}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Shipping Address
                    </h3>
                    <div className="bg-muted/50 p-3 rounded text-sm">
                      <p className="font-medium">{order.shippingAddress.name}</p>
                      <p>{order.shippingAddress.phone}</p>
                      <p>{order.shippingAddress.line1}</p>
                      {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                      <p>
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </p>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        <p>Payment: {order.paymentMethod.toUpperCase()}</p>
                        {order.discount && <p>Discount: -₹{order.discount}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-2xl font-bold text-primary">₹{order.total}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
