import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  ArrowLeft, 
  CreditCard, 
  Wallet, 
  MapPin, 
  Truck, 
  Shield,
  Tag
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/useApi';
import { useToast } from '@/hooks/use-toast';
import { addressSchema, AddressFormData, couponSchema, CouponFormData } from '@/lib/validations';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const api = useApi();
  const { toast } = useToast();
  
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  const {
    register: registerAddress,
    handleSubmit: handleAddressSubmit,
    formState: { errors: addressErrors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.profile?.phone || '',
    }
  });

  const {
    register: registerCoupon,
    handleSubmit: handleCouponSubmit,
    formState: { errors: couponErrors, isSubmitting: isApplyingCoupon },
    reset: resetCoupon,
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema)
  });

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center max-w-md mx-auto">
          <CardContent className="p-0 space-y-4">
            <h2 className="text-2xl font-semibold">Sign in Required</h2>
            <p className="text-text-secondary">
              Please sign in to proceed with checkout
            </p>
            <Button className="btn-hero" asChild>
              <Link to="/auth/login">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center max-w-md mx-auto">
          <CardContent className="p-0 space-y-4">
            <h2 className="text-2xl font-semibold">Cart is Empty</h2>
            <p className="text-text-secondary">
              Add some products to your cart before checkout
            </p>
            <Button className="btn-hero" asChild>
              <Link to="/products">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping - discount;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const onApplyCoupon = async (data: CouponFormData) => {
    try {
      const response = await api.post('/api/orders/applyCoupon', {
        cartId: cart.id,
        code: data.code,
      });

      if (response?.success && response.data) {
        setAppliedCoupon(data.code);
        setDiscount(response.data.discount || 0);
        toast({
          title: "Coupon applied",
          description: `You saved ${formatPrice(response.data.discount || 0)}!`,
        });
        resetCoupon();
      }
    } catch (error) {
      console.error('Apply coupon error:', error);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const onSubmit = async (addressData: AddressFormData) => {
    if (isProcessing) return;
    
    setIsProcessing(true);

    try {
      // Create order - Backend expects POST /api/orders/create
      const orderResponse = await api.post('/api/orders/create', {
        items: cart.items,
        shippingAddress: addressData,
        paymentMethod,
        couponCode: appliedCoupon,
        totalAmount: total,
      });

      console.log('Order creation response:', orderResponse);

      if (!orderResponse?.success && !orderResponse?.data) {
        throw new Error(orderResponse?.message || 'Failed to create order');
      }

      const orderData = orderResponse?.data || orderResponse;
      const { orderId, amount, currency, razorpayOrderId } = orderData;

      if (paymentMethod === 'cod') {
        // Handle COD
        await clearCart();
        navigate(`/orders/${orderId}/success`);
        toast({
          title: "Order placed successfully",
          description: "You will receive a confirmation shortly",
        });
        return;
      }

      // Handle Razorpay payment
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_demo', // Use env variable
        amount: amount, // Amount in paisa
        currency: currency || 'INR',
        order_id: razorpayOrderId,
        name: 'UniCart',
        description: `Order #${orderId}`,
        image: '/unicart-logo.png',
        handler: async (response: any) => {
          try {
            // Verify payment
            const verifyResponse = await api.post('/api/payments/confirm', {
              orderId,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
            });

            if (verifyResponse?.success) {
              await clearCart();
              navigate(`/orders/${orderId}/success`);
              toast({
                title: "Payment successful",
                description: "Your order has been placed successfully",
              });
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast({
              title: "Payment verification failed",
              description: "Please contact support if payment was deducted",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: addressData.name,
          email: user?.email,
          contact: addressData.phone,
        },
        theme: {
          color: '#6366f1',
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast({
              title: "Payment cancelled",
              description: "You can try again anytime",
            });
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/cart">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Cart
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddressSubmit(onSubmit)} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      {...registerAddress('name')}
                    />
                    {addressErrors.name && (
                      <p className="text-sm text-destructive">{addressErrors.name.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      {...registerAddress('phone')}
                    />
                    {addressErrors.phone && (
                      <p className="text-sm text-destructive">{addressErrors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="line1">Address Line 1</Label>
                  <Input
                    id="line1"
                    placeholder="Street address, hostel name, etc."
                    {...registerAddress('line1')}
                  />
                  {addressErrors.line1 && (
                    <p className="text-sm text-destructive">{addressErrors.line1.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="line2">Address Line 2 (Optional)</Label>
                  <Input
                    id="line2"
                    placeholder="Room number, block, etc."
                    {...registerAddress('line2')}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      {...registerAddress('city')}
                    />
                    {addressErrors.city && (
                      <p className="text-sm text-destructive">{addressErrors.city.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      {...registerAddress('state')}
                    />
                    {addressErrors.state && (
                      <p className="text-sm text-destructive">{addressErrors.state.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      {...registerAddress('pincode')}
                    />
                    {addressErrors.pincode && (
                      <p className="text-sm text-destructive">{addressErrors.pincode.message}</p>
                    )}
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Payment Method */}
                <div>
                  <Label className="text-base font-semibold mb-4 block">Payment Method</Label>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={(value: 'razorpay' | 'cod') => setPaymentMethod(value)}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="razorpay" id="razorpay" />
                      <Label htmlFor="razorpay" className="flex items-center gap-2 flex-1 cursor-pointer">
                        <CreditCard className="h-4 w-4" />
                        Pay Online (Razorpay)
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Recommended</span>
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center gap-2 flex-1 cursor-pointer">
                        <Wallet className="h-4 w-4" />
                        Cash on Delivery
                        <span className="text-xs text-text-secondary">+₹20 handling fee</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full btn-hero"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    paymentMethod === 'razorpay' ? 'Opening Payment...' : 'Placing Order...'
                  ) : (
                    paymentMethod === 'razorpay' ? `Pay ${formatPrice(total)}` : `Place Order ${formatPrice(total)}`
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Coupon Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Coupon Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                  <span className="text-sm font-medium text-success">{appliedCoupon}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAppliedCoupon(null);
                      setDiscount(0);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleCouponSubmit(onApplyCoupon)} className="flex gap-2">
                  <Input
                    placeholder="Enter coupon code"
                    {...registerCoupon('code')}
                  />
                  <Button
                    type="submit"
                    variant="outline"
                    disabled={isApplyingCoupon}
                  >
                    {isApplyingCoupon ? 'Applying...' : 'Apply'}
                  </Button>
                </form>
              )}
              {couponErrors.code && (
                <p className="text-sm text-destructive mt-2">{couponErrors.code.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

                {paymentMethod === 'cod' && (
                  <div className="flex justify-between text-sm">
                    <span>COD Handling Fee</span>
                    <span>{formatPrice(20)}</span>
                  </div>
                )}
                
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Coupon Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatPrice(paymentMethod === 'cod' ? total + 20 : total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Security Badge */}
          <Card className="p-4 bg-surface">
            <CardContent className="p-0 text-center space-y-2">
              <Shield className="h-8 w-8 mx-auto text-success" />
              <h4 className="font-medium text-sm">Secure Checkout</h4>
              <div className="text-xs text-text-secondary space-y-1">
                <div>✓ 256-bit SSL Encryption</div>
                <div>✓ PCI DSS Compliant</div>
                <div>✓ Razorpay Secured</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;