import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ShoppingBag, 
  Shield, 
  Users, 
  Zap, 
  BookOpen, 
  Laptop, 
  Home as HomeIcon,
  Trophy,
  Star,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-campus-blue" />,
      title: "VIT Verified Only",
      description: "Exclusive marketplace for verified VIT community members only"
    },
    {
      icon: <Users className="h-8 w-8 text-campus-green" />,
      title: "Trusted Community",
      description: "Buy and sell with confidence within our trusted campus network"
    },
    {
      icon: <Zap className="h-8 w-8 text-campus-orange" />,
      title: "Instant Transactions",
      description: "Quick and secure payments with integrated Razorpay gateway"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-primary" />,
      title: "Academic Focus",
      description: "Find textbooks, study materials, and academic resources easily"
    }
  ];

  const categories = [
    {
      name: "Textbooks & Study Materials",
      icon: <BookOpen className="h-6 w-6" />,
      count: "2,400+",
      color: "text-campus-blue"
    },
    {
      name: "Electronics & Gadgets",
      icon: <Laptop className="h-6 w-6" />,
      count: "890+",
      color: "text-campus-orange"
    },
    {
      name: "Hostel Essentials",
      icon: <HomeIcon className="h-6 w-6" />,
      count: "1,200+",
      color: "text-campus-green"
    },
    {
      name: "Sports & Recreation",
      icon: <Trophy className="h-6 w-6" />,
      count: "650+",
      color: "text-primary"
    }
  ];

  const stats = [
    { label: "Active Students", value: "15,000+" },
    { label: "Products Listed", value: "8,500+" },
    { label: "Successful Transactions", value: "12,000+" },
    { label: "Verified Sellers", value: "2,300+" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-campus-blue/5 to-campus-orange/5"></div>
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="btn-campus px-4 py-2">
                  Exclusively for VIT Community
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Your Campus{' '}
                  <span className="text-hero gradient-campus">
                    Marketplace
                  </span>
                </h1>
                <p className="text-xl text-text-secondary leading-relaxed max-w-lg">
                  Buy and sell textbooks, electronics, and campus essentials with trust and convenience. 
                  Built by VIT students, for VIT students.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <>
                    <Button size="lg" className="btn-hero text-lg px-8 py-6" asChild>
                      <Link to="/products">
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        Browse Products
                      </Link>
                    </Button>
                    {user?.role === 'seller' && (
                      <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                        <Link to="/seller">
                          Start Selling
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button size="lg" className="btn-hero text-lg px-8 py-6" asChild>
                      <Link to="/auth/register">
                        Join VIT Community
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                      <Link to="/products">
                        Browse Products
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              <div className="flex flex-wrap gap-6 pt-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="font-bold text-2xl text-primary">{stat.value}</div>
                    <div className="text-sm text-text-secondary">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-campus-blue/20 rounded-3xl blur-3xl"></div>
              <img
                src={heroImage}
                alt="VIT students using UniCart"
                className="relative rounded-3xl shadow-2xl w-full h-auto animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Why Choose <span className="text-campus gradient-campus">UniCart</span>?
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Experience the most trusted and convenient way to buy and sell within the VIT campus community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-feature hover-lift">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-surface rounded-2xl flex items-center justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-text-secondary">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-24 bg-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Popular Categories
            </h2>
            <p className="text-xl text-text-secondary">
              Find exactly what you need for your academic journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/products?category=${encodeURIComponent(category.name.toLowerCase().replace(/\s+/g, '-'))}`}
                className="block"
              >
                <Card className="card-product p-6">
                  <CardContent className="p-0 text-center space-y-4">
                    <div className={`mx-auto w-12 h-12 rounded-xl bg-surface flex items-center justify-center ${category.color}`}>
                      {category.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                      <p className="text-sm text-text-secondary">{category.count} products</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link to="/products">
                View All Categories
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <Card className="card-elevated p-8 lg:p-12 text-center gradient-surface">
            <CardContent className="p-0 space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold">
                  Ready to Join the VIT Marketplace?
                </h2>
                <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                  Start buying and selling with the most trusted community in VIT. 
                  Verified sellers, secure payments, and campus-wide delivery.
                </p>
              </div>

              <div className="flex items-center justify-center space-x-8 text-sm text-text-secondary">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>VIT Email Verification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Secure Payments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Campus Delivery</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!isAuthenticated && (
                  <>
                    <Button size="lg" className="btn-hero text-lg px-8 py-6" asChild>
                      <Link to="/auth/register">
                        Create Account
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                      <Link to="/auth/login">
                        Sign In
                      </Link>
                    </Button>
                  </>
                )}
                
                {isAuthenticated && (
                  <Button size="lg" className="btn-campus text-lg px-8 py-6" asChild>
                    <Link to="/products">
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      Start Shopping
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
