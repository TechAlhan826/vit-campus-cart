import { useState, useEffect, useCallback } from 'react';
import { Cart, AddCartItemRequest, UpdateCartItemRequest, APIResponse } from '@/types';
import { useApi } from './useApi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from './use-toast';

export const useCart = () => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const api = useApi();
  const { toast } = useToast();

  // Fetch cart data
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const response = await api.get('/api/cart');
    if (response?.success && response.data) {
      setCart(response.data);
    } else {
      setCart(null);
    }
    setLoading(false);
  }, [isAuthenticated]);

  // Add item to cart
  const addItem = useCallback(async (request: AddCartItemRequest): Promise<boolean> => {
    if (!isAuthenticated) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to add items to cart",
        variant: "destructive",
      });
      return false;
    }

    // Optimistic update
    const optimisticUpdate = (prevCart: Cart | null) => {
      if (!prevCart) {
        return {
          id: 'temp',
          userId: 'temp',
          items: [],
          total: 0,
          itemCount: 0,
          updatedAt: new Date(),
        };
      }

      const existingItem = prevCart.items.find(item => item.productId === request.productId);
      
      if (existingItem) {
        return {
          ...prevCart,
          items: prevCart.items.map(item =>
            item.productId === request.productId
              ? { ...item, quantity: item.quantity + request.quantity }
              : item
          ),
        };
      } else {
        // Note: We don't have the full product data here for optimistic update
        // In a real app, you might want to pass the product data or fetch it first
        return prevCart;
      }
    };

    const originalCart = cart;
    setCart(optimisticUpdate);

    try {
      const response = await api.post('/api/cart/add', request);
      
      if (response?.success && response.data) {
        setCart(response.data);
        toast({
          title: "Added to cart",
          description: "Item has been added to your cart",
        });
        return true;
      } else {
        // Rollback optimistic update
        setCart(originalCart);
        return false;
      }
    } catch (error) {
      // Rollback optimistic update
      setCart(originalCart);
      return false;
    }
  }, [api, isAuthenticated, toast, cart]);

  // Update item quantity
  const updateItem = useCallback(async (request: UpdateCartItemRequest): Promise<boolean> => {
    if (!cart) return false;

    // Optimistic update
    const originalCart = cart;
    setCart({
      ...cart,
      items: cart.items.map(item =>
        item.productId === request.productId
          ? { ...item, quantity: request.quantity }
          : item
      ),
    });

    try {
      const response = await api.put('/api/cart/update', request);
      
      if (response?.success && response.data) {
        setCart(response.data);
        return true;
      } else {
        // Rollback optimistic update
        setCart(originalCart);
        return false;
      }
    } catch (error) {
      // Rollback optimistic update
      setCart(originalCart);
      return false;
    }
  }, [api, cart]);

  // Remove item from cart
  const removeItem = useCallback(async (productId: string): Promise<boolean> => {
    if (!cart) return false;

    // Optimistic update
    const originalCart = cart;
    setCart({
      ...cart,
      items: cart.items.filter(item => item.productId !== productId),
    });

    try {
      const response = await api.delete(`/api/cart/remove/${productId}`);
      
      if (response?.success && response.data) {
        setCart(response.data);
        toast({
          title: "Item removed",
          description: "Item has been removed from your cart",
        });
        return true;
      } else {
        // Rollback optimistic update
        setCart(originalCart);
        return false;
      }
    } catch (error) {
      // Rollback optimistic update
      setCart(originalCart);
      return false;
    }
  }, [api, cart, toast]);

  // Clear cart
  const clearCart = useCallback(async (): Promise<boolean> => {
    if (!cart) return false;

    const originalCart = cart;
    setCart({ ...cart, items: [], total: 0, itemCount: 0 });

    try {
      const response = await api.delete('/api/cart/clear');
      
      if (response?.success) {
        setCart(response.data || { ...cart, items: [], total: 0, itemCount: 0 });
        toast({
          title: "Cart cleared",
          description: "All items have been removed from your cart",
        });
        return true;
      } else {
        setCart(originalCart);
        return false;
      }
    } catch (error) {
      setCart(originalCart);
      return false;
    }
  }, [api, cart, toast]);

  // Load cart on mount and auth changes
  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return {
    cart,
    loading,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    refreshCart: fetchCart,
  };
};