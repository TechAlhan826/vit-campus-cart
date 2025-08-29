import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ShoppingCart, User, Shield } from 'lucide-react';
import { Product } from '@/types';
import { useCart } from '@/hooks/useCart';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const { addItem } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    await addItem({
      productId: product.id,
      quantity: 1,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (viewMode === 'list') {
    return (
      <Link to={`/products/${product.id}`}>
        <Card className="card-product flex">
          <div className="w-48 h-32 flex-shrink-0">
            <img
              src={product.images[0] || '/placeholder-product.png'}
              alt={product.title}
              className="w-full h-full object-cover rounded-l-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400';
              }}
            />
          </div>
          <CardContent className="flex-1 p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant={product.condition === 'new' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {product.condition === 'new' ? 'New' : 'Used'}
                  </Badge>
                  {product.featured && (
                    <Badge className="btn-campus text-xs">Featured</Badge>
                  )}
                </div>
                
                <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.title}</h3>
                <p className="text-sm text-text-secondary mb-2 line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm text-text-secondary">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{product.seller.name}</span>
                    {product.seller.verified && (
                      <Shield className="h-3 w-3 text-success" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-campus-yellow text-campus-yellow" />
                    <span>{product.seller.rating}</span>
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                </div>
              </div>
              
              <div className="text-right ml-4">
                <p className="text-2xl font-bold text-primary mb-2">
                  {formatPrice(product.price)}
                </p>
                <Button
                  size="sm"
                  className="btn-hero"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={`/products/${product.id}`}>
      <Card className="card-product overflow-hidden">
        <div className="aspect-square relative">
          <img
            src={product.images[0] || '/placeholder-product.png'}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400';
            }}
          />
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <Badge
              variant={product.condition === 'new' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {product.condition === 'new' ? 'New' : 'Used'}
            </Badge>
            {product.featured && (
              <Badge className="btn-campus text-xs">Featured</Badge>
            )}
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-1 line-clamp-2">{product.title}</h3>
          <p className="text-sm text-text-secondary mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1 text-sm text-text-secondary">
              <User className="h-4 w-4" />
              <span className="truncate">{product.seller.name}</span>
              {product.seller.verified && (
                <Shield className="h-3 w-3 text-success" />
              )}
            </div>
            
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-campus-yellow text-campus-yellow" />
              <span>{product.seller.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-primary">
              {formatPrice(product.price)}
            </p>
            <Button
              size="sm"
              className="btn-hero scale-click"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
          
          <Badge variant="outline" className="text-xs mt-2">
            {product.category}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;