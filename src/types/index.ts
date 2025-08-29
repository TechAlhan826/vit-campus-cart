// Global Types for UniCart
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'seller' | 'admin';
  profile: {
    phone?: string;
    collegeRoll?: string;
    hostel?: string;
    location?: {
      lat: number;
      lng: number;
    };
    avatar?: string;
  };
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  condition: 'new' | 'used';
  stock: number;
  sellerId: string;
  seller: {
    id: string;
    name: string;
    verified: boolean;
    rating: number;
  };
  featured: boolean;
  status: 'active' | 'sold' | 'inactive';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  itemCount: number;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  cartItems: CartItem[];
  total: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'razorpay' | 'cod';
  shippingAddress: {
    name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  couponCode?: string;
  discount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  productCount: number;
}

export interface SupportTicket {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  attachments?: string[];
  response?: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'seller';
  collegeRoll?: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CreateProductRequest {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: 'new' | 'used';
  stock: number;
  images: string[];
  tags?: string[];
}

export interface AddCartItemRequest {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  cartId: string;
  productId: string;
  quantity: number;
}

export interface OrderCreateRequest {
  cartId: string;
  shippingAddress: {
    name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: 'razorpay' | 'cod';
  couponCode?: string;
}

export interface ProductsQuery {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: 'new' | 'used';
  sortBy?: 'price' | 'date' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}