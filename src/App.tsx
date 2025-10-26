import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import SearchResults from "./pages/SearchResults";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import Support from "./pages/Support";
import Admin from "./pages/Admin";
import SellerDashboard from "./pages/seller/Dashboard";
import SellerProducts from "./pages/seller/Products";
import CreateProduct from "./pages/seller/CreateProduct";
import EditProduct from "./pages/seller/EditProduct";
import DebugTest from "./pages/DebugTest";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:id" element={<ProductDetail />} />
              <Route path="search" element={<SearchResults />} />
              
              {/* Auth Routes */}
              <Route path="auth/login" element={<Login />} />
              <Route path="auth/register" element={<Register />} />
              <Route path="auth/forgot-password" element={<ForgotPassword />} />
              <Route path="auth/reset-password" element={<ResetPassword />} />
              <Route path="auth/google/callback" element={<Login />} />
              
              {/* Protected Routes */}
              <Route path="cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
              
              {/* Admin Routes */}
              <Route path="admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
              
              {/* Seller Routes */}
              <Route path="seller" element={<ProtectedRoute requireSeller><SellerDashboard /></ProtectedRoute>} />
              <Route path="seller/products" element={<ProtectedRoute requireSeller><SellerProducts /></ProtectedRoute>} />
              <Route path="seller/products/new" element={<ProtectedRoute requireSeller><CreateProduct /></ProtectedRoute>} />
              <Route path="seller/products/:id/edit" element={<ProtectedRoute requireSeller><EditProduct /></ProtectedRoute>} />
              <Route path="seller/orders" element={<ProtectedRoute requireSeller><Orders /></ProtectedRoute>} />
              
              {/* Debug Route */}
              <Route path="debug" element={<DebugTest />} />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
