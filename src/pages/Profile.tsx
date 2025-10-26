import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Settings,
  Package,
  Star,
  Camera,
  Edit
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useApi } from '@/hooks/useApi';
import { Order } from '@/types';

const Profile = () => {
  const { user, updateProfile, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.profile?.phone || '',
    collegeRoll: user?.profile?.collegeRoll || '',
    hostel: user?.profile?.hostel || '',
  });

  // Fetch real orders from API
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await api.get('/api/orders');
      const data = response?.data?.data || response?.data;
      const orderList = data?.orders || (Array.isArray(data) ? data : []);
      setOrders(orderList);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleVerifyAccount = async () => {
    toast({
      title: "Verification email sent",
      description: "Please check your VIT email to verify your account",
    });
    // TODO: Implement backend verification endpoint
  };

  const handleBecomeSellerUpgrade = async () => {
    if (user?.role === 'seller' || user?.role === 'admin') {
      toast({
        title: "Already a seller",
        description: "Your account already has seller privileges",
      });
      return;
    }

    if (!window.confirm('Do you want to upgrade to a seller account? This will allow you to list and sell products.')) {
      return;
    }

    try {
      const response = await api.put('/api/auth/upgrade-to-seller', {});
      if (response?.success) {
        toast({
          title: "Success!",
          description: "Your account has been upgraded to seller. Please refresh the page.",
        });
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch (error) {
      console.error('Seller upgrade error:', error);
      toast({
        title: "Upgrade failed",
        description: "Unable to upgrade account. Please contact support.",
        variant: "destructive",
      });
    }
  };

  const handleChangePassword = async () => {
    // For now, show a coming soon message
    toast({
      title: "Change Password",
      description: "Password change functionality will be available soon. Please use Forgot Password from the login page.",
    });
    // TODO: Implement password change dialog/modal
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    if (!window.confirm('This will permanently delete all your data, orders, and listings. Are you really sure?')) {
      return;
    }

    try {
      const response = await api.delete('/api/auth/delete-account');
      if (response?.success) {
        toast({
          title: "Account deleted",
          description: "Your account has been permanently deleted",
        });
        setTimeout(() => {
          localStorage.clear();
          window.location.href = '/';
        }, 1500);
      }
    } catch (error) {
      console.error('Delete account error:', error);
      toast({
        title: "Delete failed",
        description: "Unable to delete account. Please contact support.",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center max-w-md mx-auto">
          <CardContent className="p-0 space-y-4">
            <User className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-semibold">Sign in Required</h2>
            <p className="text-text-secondary">
              Please sign in to view your profile
            </p>
            <Button className="btn-hero" onClick={() => window.location.href = '/auth/login'}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const success = await updateProfile({
        name: formData.name,
        profile: {
          phone: formData.phone,
          collegeRoll: formData.collegeRoll,
          hostel: formData.hostel,
        },
      } as any);

      if (success) {
        setEditMode(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      delivered: { variant: 'default' as const, label: 'Delivered' },
      processing: { variant: 'secondary' as const, label: 'Processing' },
      shipped: { variant: 'outline' as const, label: 'Shipped' },
      cancelled: { variant: 'destructive' as const, label: 'Cancelled' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.processing;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Header */}
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                      {user?.profile?.avatar ? (
                        <img
                          src={user.profile.avatar}
                          alt={user.name}
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-12 w-12 text-muted-foreground" />
                      )}
                    </div>
                    <Button
                      size="sm"
                      className="absolute -bottom-1 -right-1 rounded-full p-2"
                    >
                      <Camera className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-semibold">{user?.name}</h2>
                      {user?.verified && (
                        <Shield className="h-5 w-5 text-success" />
                      )}
                      <Badge className="btn-campus capitalize">{user?.role}</Badge>
                    </div>
                    <p className="text-text-secondary">{user?.email}</p>
                    {user?.profile?.collegeRoll && (
                      <p className="text-sm text-text-muted">Roll: {user.profile.collegeRoll}</p>
                    )}
                  </div>
                  
                  <Button
                    variant={editMode ? "default" : "outline"}
                    onClick={() => setEditMode(!editMode)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    {editMode ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Profile Form */}
            <Card className="p-6">
              <CardHeader className="p-0 mb-6">
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              
              <CardContent className="p-0">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!editMode}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        disabled={true}
                        className="bg-muted"
                      />
                      <p className="text-xs text-text-muted">
                        Email cannot be changed
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        disabled={!editMode}
                        placeholder="+91 99999 00000"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="collegeRoll">College Roll Number</Label>
                      <Input
                        id="collegeRoll"
                        name="collegeRoll"
                        value={formData.collegeRoll}
                        onChange={handleChange}
                        disabled={!editMode}
                        placeholder="e.g., 23BCA0173"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hostel">Hostel Block</Label>
                      <Input
                        id="hostel"
                        name="hostel"
                        value={formData.hostel}
                        onChange={handleChange}
                        disabled={!editMode}
                        placeholder="e.g., A Block"
                      />
                    </div>
                  </div>

                  {editMode && (
                    <div className="flex gap-3">
                      <Button type="submit" className="btn-hero" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Profile'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditMode(false);
                          setFormData({
                            name: user?.name || '',
                            email: user?.email || '',
                            phone: user?.profile?.phone || '',
                            collegeRoll: user?.profile?.collegeRoll || '',
                            hostel: user?.profile?.hostel || '',
                          });
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card className="p-6">
              <CardHeader className="p-0 mb-6">
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              
              <CardContent className="p-0">
                {ordersLoading ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4 animate-pulse" />
                    <p className="text-text-secondary">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                    <p className="text-text-secondary mb-4">
                      Start shopping to see your orders here
                    </p>
                    <Button className="btn-hero" onClick={() => window.location.href = '/products'}>
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="p-4">
                        <CardContent className="p-0">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold">Order #{order.id.slice(-8)}</h4>
                              <p className="text-sm text-text-secondary">
                                Placed on {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{formatPrice(order.total)}</p>
                              {getStatusBadge(order.status)}
                            </div>
                          </div>
                          
                          <Separator className="my-3" />
                          
                          <div className="space-y-1">
                            {order.cartItems.map((item, index) => (
                              <div key={index} className="text-sm">
                                <span className="font-medium">{item.quantity}x</span> {item.product.title}
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-3 flex gap-2">
                            <Badge variant="outline">{order.paymentMethod.toUpperCase()}</Badge>
                            <Badge variant="outline">{order.paymentStatus}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="p-6">
              <CardHeader className="p-0 mb-6">
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              
              <CardContent className="p-0 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Account Verification</h4>
                      <p className="text-sm text-text-secondary">
                        Verify your VIT email to access all features
                      </p>
                    </div>
                    {user?.verified ? (
                      <Badge className="btn-success">Verified</Badge>
                    ) : (
                      <Button variant="outline" size="sm" onClick={handleVerifyAccount}>
                        Verify Now
                      </Button>
                    )}
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Become a Seller</h4>
                      <p className="text-sm text-text-secondary">
                        Start selling your products on UniCart
                      </p>
                    </div>
                    {user?.role === 'seller' || user?.role === 'admin' ? (
                      <Badge className="btn-campus">Seller Account</Badge>
                    ) : (
                      <Button variant="outline" size="sm" onClick={handleBecomeSellerUpgrade}>
                        Apply Now
                      </Button>
                    )}
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Change Password</h4>
                      <p className="text-sm text-text-secondary">
                        Update your account password
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleChangePassword}>
                      Change Password
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-destructive">Delete Account</h4>
                      <p className="text-sm text-text-secondary">
                        Permanently delete your UniCart account
                      </p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;