import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  MoreVertical,
  Package
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types';

const SellerProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const api = useApi();
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get('/api/products?sellerId=me');
      if (response?.success) {
        setProducts(response.data?.items || []);
      }
    } catch (error) {
      // Mock data for demo
      setProducts([
        {
          id: '1',
          title: 'Digital Signal Processing by Proakis',
          description: 'Third edition textbook in excellent condition',
          price: 450,
          images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'],
          category: 'Textbooks & Study Materials',
          condition: 'used',
          stock: 1,
          sellerId: user?.id || 'seller1',
          seller: {
            id: user?.id || 'seller1',
            name: user?.name || 'You',
            verified: true,
            rating: 4.8
          },
          featured: false,
          status: 'active',
          tags: ['textbook', 'engineering'],
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15'),
        },
        {
          id: '2',
          title: 'HP Laptop - Core i5, 8GB RAM',
          description: 'Gaming and programming laptop, barely used',
          price: 35000,
          images: ['https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400'],
          category: 'Electronics & Gadgets',
          condition: 'used',
          stock: 1,
          sellerId: user?.id || 'seller1',
          seller: {
            id: user?.id || 'seller1',
            name: user?.name || 'You',
            verified: true,
            rating: 4.8
          },
          featured: true,
          status: 'active',
          tags: ['laptop', 'gaming'],
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-10'),
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await api.delete(`/api/products/${productId}`);
      if (response?.success) {
        setProducts(products.filter(p => p.id !== productId));
        toast({
          title: "Product deleted",
          description: "Your product has been removed successfully",
        });
      }
    } catch (error) {
      console.error('Delete product error:', error);
      toast({
        title: "Delete failed",
        description: "Unable to delete product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const toggleProductStatus = async (productId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      const response = await api.put(`/api/products/${productId}`, {
        status: newStatus
      });
      
      if (response?.success) {
        setProducts(products.map(p => 
          p.id === productId ? { ...p, status: newStatus as 'active' | 'sold' | 'inactive' } : p
        ));
        toast({
          title: "Status updated",
          description: `Product is now ${newStatus}`,
        });
      }
    } catch (error) {
      console.error('Update status error:', error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold">My Products</h1>
          <p className="text-text-secondary mt-1">
            Manage your product listings and inventory
          </p>
        </div>
        <Button className="btn-hero" asChild>
          <Link to="/seller/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="text-sm text-text-secondary">
              {filteredProducts.length} of {products.length} products
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-muted rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                    <div className="h-3 bg-muted rounded w-1/3"></div>
                  </div>
                  <div className="h-8 w-32 bg-muted rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? 'No products found' : 'No products yet'}
            </h3>
            <p className="text-text-secondary mb-6">
              {searchQuery 
                ? 'Try adjusting your search criteria' 
                : 'Start by adding your first product to begin selling'
              }
            </p>
            <Button className="btn-hero" asChild>
              <Link to="/seller/products/new">Add Your First Product</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-20 h-20 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200';
                    }}
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-2 mb-2">
                          {product.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                            {product.status}
                          </Badge>
                          {product.featured && (
                            <Badge className="btn-campus">Featured</Badge>
                          )}
                          <Badge variant="outline">{product.condition}</Badge>
                        </div>
                        <p className="text-sm text-text-secondary">
                          {product.category} • Listed on {product.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link to={`/products/${product.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link to={`/seller/products/${product.id}/edit`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toggleProductStatus(product.id, product.status)}
                          >
                            {product.status === 'active' ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-2xl font-bold">{formatPrice(product.price)}</p>
                    <p className="text-sm text-text-secondary">
                      {product.stock} in stock
                    </p>
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

export default SellerProducts;