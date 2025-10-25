import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import unicartLogo from '@/assets/unicart-logo.png';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isSeller, isAdmin } = useAuth();
  const { cart } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-card-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover-lift">
            <img
              src={unicartLogo}
              alt="UniCart"
              className="h-8 w-8"
            />
            <span className="font-bold text-xl text-campus gradient-secondary">
              UniCart
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search for textbooks, electronics, and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 w-full focus:ring-primary focus:border-primary"
                />
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/products" className="text-sm hover:text-primary transition-colors">
              Browse
            </Link>
            
            {isSeller && (
              <>
                <Link to="/seller" className="text-sm hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Link to="/seller/products" className="text-sm hover:text-primary transition-colors">
                  My Products
                </Link>
                <Link to="/seller/products/new" className="text-sm hover:text-primary transition-colors bg-primary text-primary-foreground px-3 py-1.5 rounded-md">
                  + Add Product
                </Link>
              </>
            )}

            {isAdmin && (
              <Link to="/admin" className="text-sm hover:text-primary transition-colors">
                Admin
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-surface rounded-lg transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {cart && cart.itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs btn-campus">
                  {cart.itemCount}
                </Badge>
              )}
            </Link>

            {/* Notifications */}
            {isAuthenticated && (
              <Button variant="ghost" size="sm" className="relative p-2">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-2 w-2 p-0 bg-destructive"></Badge>
              </Button>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      {user?.profile?.avatar ? (
                        <img 
                          src={user.profile.avatar} 
                          alt={user.name} 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">Orders</Link>
                  </DropdownMenuItem>
                  {isSeller && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/seller">Seller Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/seller/products">My Products</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/seller/products/new">Add Product</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/support">Support</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth/login">Sign In</Link>
                </Button>
                <Button size="sm" className="btn-hero" asChild>
                  <Link to="/auth/register">Join VIT</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Search */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-card-border">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              <Link
                to="/products"
                className="block py-2 text-sm hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Browse Products
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="block py-2 text-sm hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block py-2 text-sm hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  {isSeller && (
                    <>
                      <Link
                        to="/seller"
                        className="block py-2 text-sm hover:text-primary transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Seller Dashboard
                      </Link>
                      <Link
                        to="/seller/products"
                        className="block py-2 text-sm hover:text-primary transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Products
                      </Link>
                      <Link
                        to="/seller/products/new"
                        className="block py-2 text-sm hover:text-primary transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Add Product
                      </Link>
                    </>
                  )}
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="block py-2 text-sm hover:text-primary transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/support"
                    className="block py-2 text-sm hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Support
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 text-sm hover:text-primary transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className="block py-2 text-sm hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth/register"
                    className="block py-2 text-sm hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Join VIT
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};