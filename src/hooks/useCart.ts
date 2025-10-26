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
    try {
      const response = await api.get('/api/cart');
  const data = response?.data?.data || response?.data;
  const cartData = data?.cart || data;
      
      console.log('[useCart] Fetched cart:', { response, data, cartData });
      
      if (cartData && (cartData.id || Array.isArray(cartData?.items))) {
        // If product details are missing in items, enrich them by fetching products
        const items = Array.isArray(cartData.items) ? cartData.items : [];
        const needEnrich = items.some((it: any) => !it.product && it.productId);
        let enrichedItems = items;
        if (needEnrich) {
          try {
            const uniqueIds = Array.from(new Set(items.filter((it: any) => it.productId).map((it: any) => it.productId)));
            const productMap: Record<string, any> = {};
            await Promise.all(uniqueIds.map(async (pid) => {
              const pr = await api.get(`/api/products/${pid}`);
              const pdata = pr?.data?.data || pr?.data;
              productMap[String(pid)] = pdata?.product || pdata;
            }));
            enrichedItems = items.map((it: any) => ({
              ...it,
              product: it.product || productMap[String(it.productId)] || it.product,
            }));
          } catch (e) {
            // best-effort, continue with raw items
          }
        }

        setCart({
          id: cartData.id || cartData._id || 'cart',
          userId: cartData.userId || '',
          items: enrichedItems,
          total: cartData.total ?? (Array.isArray(enrichedItems) ? enrichedItems.reduce((s: number, it: any) => s + (it.price * it.quantity), 0) : 0),
          itemCount: cartData.itemCount ?? (Array.isArray(enrichedItems) ? enrichedItems.reduce((s: number, it: any) => s + it.quantity, 0) : 0),
          updatedAt: cartData.updatedAt || new Date(),
        } as any);
      } else {
        // Cart might be empty or not created yet
        setCart(null);
      }
    } catch (error) {
      console.error('[useCart] Failed to fetch cart:', error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, api]);

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

    try {
      console.log('[useCart] Adding item to cart:', request);
      const response = await api.post('/api/cart/add', request);
      
      console.log('[useCart] Add item response:', response);
      
      if (response?.success) {
        // Fetch fresh cart data after successful add
        await fetchCart();
        toast({
          title: "Added to cart",
          description: "Item has been added to your cart",
        });
        return true;
      } else {
        toast({
          title: "Failed to add item",
          description: "Could not add item to cart",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('[useCart] Add item error:', error);
      toast({
        title: "Failed to add item",
        description: "Could not add item to cart",
        variant: "destructive",
      });
      return false;
    }
  }, [api, isAuthenticated, toast, fetchCart]);

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
        const d = response.data as any;
        // Try to keep product details when updating
        const mergedItems = Array.isArray(d.items) ? d.items.map((it: any) => ({
          ...it,
          product: (it.product || cart.items.find(ci => ci.productId === it.productId)?.product),
        })) : cart.items;
        setCart({
          id: d.id || cart.id,
          userId: d.userId || cart.userId,
          items: mergedItems,
          total: d.total ?? (Array.isArray(mergedItems) ? mergedItems.reduce((s: number, it: any) => s + (it.price * it.quantity), 0) : cart.total),
          itemCount: d.itemCount ?? (Array.isArray(mergedItems) ? mergedItems.reduce((s: number, it: any) => s + it.quantity, 0) : cart.itemCount),
          updatedAt: d.updatedAt || new Date(),
        } as any);
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
        const d = response.data as any;
        const mergedItems = Array.isArray(d.items) ? d.items.map((it: any) => ({
          ...it,
          product: (it.product || cart.items.find(ci => ci.productId === it.productId)?.product),
        })) : cart.items;
        setCart({
          id: d.id || cart.id,
          userId: d.userId || cart.userId,
          items: mergedItems,
          total: d.total ?? (Array.isArray(mergedItems) ? mergedItems.reduce((s: number, it: any) => s + (it.price * it.quantity), 0) : cart.total),
          itemCount: d.itemCount ?? (Array.isArray(mergedItems) ? mergedItems.reduce((s: number, it: any) => s + it.quantity, 0) : cart.itemCount),
          updatedAt: d.updatedAt || new Date(),
        } as any);
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
        const d = (response.data as any) || {};
        setCart({
          id: d.id || cart.id,
          userId: d.userId || cart.userId,
          items: d.items || [],
          total: d.total ?? 0,
          itemCount: d.itemCount ?? 0,
          updatedAt: d.updatedAt || new Date(),
        } as any);
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