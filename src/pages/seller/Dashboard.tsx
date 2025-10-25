import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Package, 
  TrendingUp, 
  Users, 
  IndianRupee,
  Eye,
  Edit,
  Trash2,
  Star
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/useApi';
import { Product } from '@/types';

const SellerDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const api = useApi();

  React.useEffect(() => {
    fetchSellerProducts();
  }, []);

  const fetchSellerProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/products/seller/me');
      const data = response?.data?.data || response?.data;
      const productList = data?.products || (Array.isArray(data) ? data : []);
      setProducts(productList);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'text-blue-500' },
    { label: 'Active Listings', value: products.filter(p => p.status === 'active').length, icon: TrendingUp, color: 'text-green-500' },
    { label: 'Total Views', value: '1.2K', icon: Eye, color: 'text-purple-500' },
    { label: 'Revenue', value: '₹15,450', icon: IndianRupee, color: 'text-orange-500' },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <p className="text-text-secondary mt-1">
            Welcome back, {user?.name}! Manage your products and track performance.
          </p>
        </div>
        <Button className="btn-hero" asChild>
          <Link to="/seller/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Link to="/seller/products/new" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                List New Product
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">
                Add a new product to your store and start selling
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/seller/products" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Manage Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">
                Edit, update, or remove your existing products
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/seller/orders" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                View Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">
                Check new orders and manage fulfillment
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Products */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Products</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link to="/seller/products">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-muted rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-3 bg-muted rounded w-1/4"></div>
                    </div>
                    <div className="h-8 w-20 bg-muted rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products yet</h3>
              <p className="text-text-secondary mb-4">
                Start by adding your first product to begin selling
              </p>
              <Button className="btn-hero" asChild>
                <Link to="/seller/products/new">Add Your First Product</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {products.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200';
                    }}
                  />
                  
                  <div className="flex-1">
                    <h4 className="font-medium line-clamp-1">{product.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                        {product.status}
                      </Badge>
                      <span className="text-sm text-text-secondary">
                        {product.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(product.price)}</p>
                    <p className="text-sm text-text-secondary">
                      {product.stock} in stock
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/products/${product.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/seller/products/${product.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerDashboard;