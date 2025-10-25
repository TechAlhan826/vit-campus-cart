import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Star, 
  ShoppingCart, 
  User, 
  Shield, 
  MapPin, 
  MessageCircle,
  Share2,
  Heart,
  ArrowLeft,
  Plus,
  Minus
} from 'lucide-react';
import { Product } from '@/types';
import { useApi } from '@/hooks/useApi';
import { useCart } from '@/hooks/useCart';
import { useToast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const api = useApi();
  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    
    try {
      const response = await api.get(`/api/products/${id}`);
      
      if (response?.success && response.data) {
        setProduct(response.data);
      } else {
        setProduct(null);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    const success = await addItem({
      productId: product.id,
      quantity: quantity,
    });

    if (success) {
      toast({
        title: "Added to cart",
        description: `${quantity}x ${product.title} added to your cart`,
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-muted rounded-lg"></div>
              <div className="flex gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="w-20 h-20 bg-muted rounded"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4"></div>
              <div className="h-6 bg-muted rounded w-1/2"></div>
              <div className="h-24 bg-muted rounded"></div>
              <div className="h-12 bg-muted rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center">
          <CardContent className="p-0">
            <h2 className="text-2xl font-semibold mb-4">Product Not Found</h2>
            <p className="text-text-secondary mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/products">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/products">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </Button>
        <span className="text-text-muted">•</span>
        <span className="text-sm text-text-secondary">{product.category}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-surface">
            <img
              src={product.images[selectedImageIndex]}
              alt={product.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${
                    selectedImageIndex === index 
                      ? 'border-primary' 
                      : 'border-transparent hover:border-muted-foreground'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge
                variant={product.condition === 'new' ? 'default' : 'secondary'}
              >
                {product.condition === 'new' ? 'New' : 'Used'}
              </Badge>
              {product.featured && (
                <Badge className="btn-campus">Featured</Badge>
              )}
              <Badge variant="outline">{product.category}</Badge>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-text-secondary" />
                <span className="font-medium">{product.seller.name}</span>
                {product.seller.verified && (
                  <Shield className="h-4 w-4 text-success" />
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-campus-yellow text-campus-yellow" />
                <span className="font-medium">{product.seller.rating}</span>
              </div>
            </div>
            
            <p className="text-4xl font-bold text-primary mb-6">
              {formatPrice(product.price)}
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">Description</h3>
            <div className="text-text-secondary whitespace-pre-line">
              {product.description}
            </div>
          </div>

          <Separator />

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-text-secondary">
                  ({product.stock} available)
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                size="lg"
                className="btn-hero flex-1"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
              
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <Button variant="outline" className="w-full" size="lg">
              <MessageCircle className="h-5 w-5 mr-2" />
              Contact Seller
            </Button>
          </div>

          <Separator />

          {/* Tags */}
          {product.tags.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Product Details */}
          <Card className="p-4">
            <CardContent className="p-0">
              <h3 className="font-semibold mb-3">Product Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-text-secondary">Condition</div>
                <div className="capitalize">{product.condition}</div>
                
                <div className="text-text-secondary">Category</div>
                <div>{product.category}</div>
                
                <div className="text-text-secondary">Listed on</div>
                <div>{new Date(product.createdAt).toLocaleDateString()}</div>
                
                <div className="text-text-secondary">Product ID</div>
                <div className="font-mono text-xs">{product.id}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;