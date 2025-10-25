import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import axios from '@/lib/axios';
import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Settings,
  Shield,
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalSellers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  activeProducts: number;
  newUsersToday: number;
}

interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'seller' | 'admin';
  verified: boolean;
  createdAt: Date;
}

interface RecentOrder {
  id: string;
  userId: string;
  userName: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: Date;
}

const Admin = () => {
  const { isAdmin, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: { pathname: '/admin' } } });
      return;
    }
    if (!isAdmin) {
      toast({
        title: 'Access Denied',
        description: 'You do not have admin privileges',
        variant: 'destructive',
      });
      navigate('/');
      return;
    }
    fetchDashboardData();
  }, [isAuthenticated, isAdmin, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch dashboard stats
      const statsRes = await axios.get('/api/admin/stats');
      setStats(statsRes.data?.stats || statsRes.data || null);

      // Fetch recent users
      const usersRes = await axios.get('/api/admin/users/recent');
      setRecentUsers(usersRes.data?.users || usersRes.data || []);

      // Fetch recent orders
      const ordersRes = await axios.get('/api/admin/orders/recent');
      setRecentOrders(ordersRes.data?.orders || ordersRes.data || []);
    } catch (err: any) {
      console.error('Failed to fetch admin data:', err);
      const errorMsg = err.response?.data?.msg || err.response?.data?.message || 'Failed to load admin dashboard';
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-10 w-20" />
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
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>
        <Button variant="outline" onClick={fetchDashboardData}>
          <BarChart3 className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              +{stats?.newUsersToday || 0} today
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.activeProducts || 0} active
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalOrders || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.pendingOrders || 0} pending
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{stats?.totalRevenue?.toLocaleString('en-IN') || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Recent Users</TabsTrigger>
          <TabsTrigger value="orders">Recent Orders</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sellers</span>
                    <span className="font-semibold">{stats?.totalSellers || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Products</span>
                    <span className="font-semibold">{stats?.activeProducts || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Pending Orders</span>
                    <span className="font-semibold text-yellow-600">
                      {stats?.pendingOrders || 0}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">System Status: Operational</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-600">
                    <Settings className="h-4 w-4" />
                    <span className="text-sm">Auto-moderation: Active</span>
                  </div>
                  <div className="flex items-center gap-2 text-orange-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">Pending Reviews: 0</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Registrations</CardTitle>
            </CardHeader>
            <CardContent>
              {recentUsers.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No recent users</p>
              ) : (
                <div className="space-y-2">
                  {recentUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                          {user.role}
                        </Badge>
                        {user.verified && (
                          <Badge variant="outline" className="bg-green-500/10 text-green-700">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {recentOrders.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No recent orders</p>
              ) : (
                <div className="space-y-2">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium">Order #{order.id.slice(-8)}</p>
                        <p className="text-sm text-muted-foreground">{order.userName}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-semibold">₹{order.total}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline">{order.status}</Badge>
                        <Badge variant="outline">{order.paymentStatus}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Admin Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Admin configuration panel coming soon...
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <Button variant="outline" className="justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Platform Settings
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    User Management
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Package className="h-4 w-4 mr-2" />
                    Product Moderation
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
