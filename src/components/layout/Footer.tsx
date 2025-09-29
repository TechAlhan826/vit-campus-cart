import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Mail, MapPin, Phone, Heart } from 'lucide-react';
import unicartLogo from '@/assets/unicart-logo.png';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-card-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src={unicartLogo} alt="UniCart" className="h-8 w-8" />
              <span className="font-bold text-xl text-campus gradient-secondary">
                UniCart
              </span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              The exclusive marketplace for VIT community. Buy and sell textbooks, electronics, 
              and campus essentials with trust and convenience.
            </p>
            <div className="flex items-center space-x-2 text-xs text-text-muted">
              <MapPin className="h-4 w-4" />
              <span>VIT Campus, Vellore, Tamil Nadu</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products"
                  className="text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  Browse Products
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/auth/register"
                  className="text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link
                  to="/support"
                  className="text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Popular Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/products?category=textbooks"
                  className="text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  Textbooks & Study Materials
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=electronics"
                  className="text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  Electronics
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=hostel"
                  className="text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  Hostel Essentials
                </Link>
              </li>
              <li>
                <Link
                  to="/products?category=sports"
                  className="text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  Sports & Recreation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Team */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Mail className="h-4 w-4" />
                <span>support@unicart.vit</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Phone className="h-4 w-4" />
                <span>+91 99999 00000</span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-text-primary mb-2 text-sm">Built by DataXplorers</h4>
              <div className="text-xs text-text-muted space-y-1">
                <div>Mohammed Alhan N (23BCA0173)</div>
                <div>Vivek Joseph Emmanuel (23BCA0235)</div>
                <div>Aravind S (23BCA0167)</div>
                <div>Nishant G (23BCA0252)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-card-border mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4 text-xs text-text-muted">
              <Link to="/privacy" className="hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <span>•</span>
              <Link to="/about" className="hover:text-primary transition-colors">
                About UniCart
              </Link>
            </div>

            <div className="flex items-center space-x-1 text-xs text-text-muted">
              <span>Made with</span>
              <Heart className="h-3 w-3 text-destructive fill-destructive" />
              <span>for VIT Community © 2024</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};