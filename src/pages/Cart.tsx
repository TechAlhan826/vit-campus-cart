import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowLeft,
  Tag,
  Truck
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';

const Cart = () => {
  const { cart, loading, updateItem, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center max-w-md mx-auto">
          <CardContent className="p-0 space-y-4">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-semibold">Sign in Required</h2>
            <p className="text-text-secondary">
              Please sign in to view your cart and make purchases
            </p>
            <Button className="btn-hero" asChild>
              <Link to="/auth/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-6"></div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
            <div className="h-64 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    console.log('[Cart] Empty cart state:', { cart, hasCart: !!cart, itemsLength: cart?.items?.length });
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/products">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        <Card className="p-12 text-center max-w-md mx-auto">
          <CardContent className="p-0 space-y-4">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-semibold">Your cart is empty</h2>
            <p className="text-text-secondary">
              Discover great products from verified VIT sellers
            </p>
            <Button className="btn-hero" asChild>
              <Link to="/products">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log('[Cart] Rendering cart with items:', cart.items);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      await removeItem(productId);
    } else {
      await updateItem({
        cartId: cart.id,
        productId,
        quantity: newQuantity,
      });
    }
  };

  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 50; // Free shipping over ₹500
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/products">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Continue Shopping
            </Link>
          </Button>
        </div>
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearCart}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear Cart
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const product = item.product || {} as any;
            const images = product.images || [];
            const title = product.title || 'Unknown Product';
            const sellerName = product.seller?.name || 'Unknown Seller';
            const category = product.category || 'Unknown';
            const condition = product.condition || 'unknown';
            const stock = product.stock || 0;
            
            console.log('[Cart] Rendering item:', { item, product, hasProduct: !!item.product });
            
            return (
            <Card key={item.id} className="p-4">
              <CardContent className="p-0">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-surface flex-shrink-0">
                    <img
                      src={images[0] || '/placeholder-product.png'}
                      alt={title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200';
                      }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <Link
                          to={`/products/${product.id || item.productId}`}
                          className="font-medium hover:text-primary transition-colors line-clamp-2"
                        >
                          {title}
                        </Link>
                        <p className="text-sm text-text-secondary mt-1">
                          Sold by {sellerName}
                        </p>
                        <p className="text-xs text-text-muted capitalize">
                          {condition} • {category}
                        </p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.productId)}
                        className="text-destructive hover:text-destructive p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm text-text-secondary">
                          ({stock} available)
                        </span>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold">{formatPrice(item.price * item.quantity)}</p>
                        <p className="text-sm text-text-secondary">
                          {formatPrice(item.price)} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )})}
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Coupon Code */}
          <Card className="p-4">
            <CardContent className="p-0 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Coupon Code
              </h3>
              <div className="flex gap-2">
                <Input placeholder="Enter coupon code" className="flex-1" />
                <Button variant="outline">Apply</Button>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card className="p-6">
            <CardContent className="p-0 space-y-4">
              <h3 className="font-semibold text-lg">Order Summary</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({cart.itemCount} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Truck className="h-3 w-3" />
                    Shipping
                  </span>
                  <span className={shipping === 0 ? 'text-success font-medium' : ''}>
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
                
                {shipping > 0 && (
                  <p className="text-xs text-text-secondary">
                    Free shipping on orders over ₹500
                  </p>
                )}
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              
              <Button size="lg" className="w-full btn-hero" asChild>
                <Link to="/checkout">
                  Proceed to Checkout
                </Link>
              </Button>
              
              <div className="text-center">
                <Link
                  to="/products"
                  className="text-sm text-primary hover:underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          <Card className="p-4 bg-surface">
            <CardContent className="p-0 text-center space-y-2">
              <h4 className="font-medium text-sm">Secure Shopping</h4>
              <div className="text-xs text-text-secondary space-y-1">
                <div>✓ VIT Verified Sellers</div>
                <div>✓ Secure Payment Gateway</div>
                <div>✓ Campus Delivery Available</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;