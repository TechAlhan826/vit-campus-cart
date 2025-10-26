
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
  CheckCircle,
  Gift,
  HeadphonesIcon,
  Award,
  TrendingUp,
  Globe
} from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';
import { useAuth } from '@/contexts/AuthContext';
import { TeamSection } from '@/components/TeamSection';
import { SecuritySection } from '@/components/SecuritySection';
import { VITCategoriesSection } from '@/components/VITCategoriesSection';

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  const uniqueFeatures = [
    {
      icon: <Shield className="h-8 w-8 text-campus-blue" />,
      title: "VIT-Only Verified Network",
      description: "Exclusive access for verified VIT community members with admin-approved sellers"
    },
    {
      icon: <Users className="h-8 w-8 text-campus-green" />,
      title: "Campus-Centric Categories",
      description: "Tailored product categories for student life, academics, and campus essentials"
    },
    {
      icon: <Zap className="h-8 w-8 text-campus-orange" />,
      title: "Secure Payment Gateway",
      description: "PCI-DSS compliant payments with Razorpay integration and gift card support"
    },
    {
      icon: <Gift className="h-8 w-8 text-primary" />,
      title: "Gift Card Redemption",
      description: "Unique gift card system for seamless transactions within the platform"
    },
    {
      icon: <HeadphonesIcon className="h-8 w-8 text-success" />,
      title: "Integrated Support System",
      description: "Dedicated ticketing system for campus-specific queries and quick resolution"
    },
    {
      icon: <Award className="h-8 w-8 text-warning" />,
      title: "Seller Verification Process",
      description: "Rigorous admin approval with document verification for trusted marketplace"
    }
  ];

  const vitStats = [
    { label: "VIT Community Members", value: "45,000+", growth: "+12%" },
    { label: "Active Student Sellers", value: "3,200+", growth: "+28%" },
    { label: "Campus Transactions", value: "18,500+", growth: "+45%" },
    { label: "Verified Products", value: "12,800+", growth: "+35%" },
    { label: "Average Rating", value: "4.8/5", growth: "98% satisfaction" },
    { label: "Response Time", value: "<2hrs", growth: "Support tickets" }
  ];

  const comparisonPoints = [
    "Campus-only trusted network vs broad untargeted marketplace",
    "Integrated VIT verification vs limited verification systems", 
    "Student-focused categories vs generic broad categories",
    "Campus-centric support vs standard customer service",
    "Academic calendar integration vs generic shopping experience",
    "Local delivery within campus vs external shipping only"
  ];

  const futureFeatures = [
    { 
      title: "Enhanced Delivery", 
      description: "COD integration with Shiprocket for flexible delivery options",
      status: "In Development" 
    },
    { 
      title: "Live Chat Support", 
      description: "Real-time assistance for instant query resolution",
      status: "In Development" 
    },
    { 
      title: "Digital Marketplace", 
      description: "E-books, software licenses, and online course materials",
      status: "Planned" 
    },
    { 
      title: "White-label Solution", 
      description: "Expand UniCart to other educational institutions worldwide",
      status: "Future Vision" 
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-campus-blue/5 to-campus-orange/5">
        <div className="absolute inset-0 bg-grid-primary/5 [mask-image:linear-gradient(0deg,transparent,black)]"></div>
        <div className="container mx-auto px-4 py-16 lg:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="btn-campus px-4 py-2">
                    <Globe className="mr-2 h-4 w-4" />
                    VIT Exclusive
                  </Badge>
                  <Badge variant="outline" className="px-4 py-2 border-success text-success">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    18,500+ Transactions
                  </Badge>
                </div>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Your Campus{' '}
                  <span className="text-hero gradient-campus/10 rounded-lg">
                    Marketplace
                  </span>
                  <br />
                  <span className="text-2xl lg:text-4xl text-primary">
                    Built by VITians, for VITians
                  </span>
                </h1>
                <p className="text-xl text-text-secondary leading-relaxed max-w-lg">
                  The most trusted marketplace for VIT community. Buy and sell textbooks, electronics, 
                  and campus essentials with verified sellers, secure payments, and campus-wide delivery.
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
                      <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary hover:bg-primary/10" asChild>
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
                        <Users className="mr-2 h-5 w-5" />
                        Join VIT Community
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary hover:bg-primary/10" asChild>
                      <Link to="/products">
                        Browse Products
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
                {vitStats.slice(0, 6).map((stat, index) => (
                  <div key={index} className="text-center p-3 rounded-xl bg-surface/50 backdrop-blur">
                    <div className="font-bold text-xl text-primary">{stat.value}</div>
                    <div className="text-sm text-text-secondary">{stat.label}</div>
                    <div className="text-xs text-success">{stat.growth}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-campus-blue/20 rounded-3xl blur-3xl animate-pulse"></div>
              <img
                src={heroImage}
                alt="VIT students using UniCart marketplace"
                className="relative rounded-3xl shadow-2xl w-full h-auto animate-float"
              />
              <div className="absolute -bottom-6 -right-6 bg-success text-white px-4 py-2 rounded-xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-semibold">4.8/5 Rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="btn-success px-4 py-2 mb-4">
              Why Choose UniCart?
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="text-campus gradient-campus/10 rounded-lg">Production-Ready Features </span> 
              for Campus Commerce
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Experience the most trusted, secure, and feature-rich marketplace designed 
              specifically for the VIT campus community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {uniqueFeatures.map((feature, index) => (
              <Card key={index} className="card-feature hover-lift group">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-surface rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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

      {/* VIT Categories Section */}
      <VITCategoriesSection />

      {/* Security Section */}
      <SecuritySection />

      {/* Team Section */}
      <TeamSection />

      {/* Competitive Advantage */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-surface via-background to-surface">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="btn-campus px-4 py-2 mb-4">
                Our Competitive Edge
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Why <span className="text-campus gradient-campus/10 rounded-lg/10 rounded-lg">UniCart</span> Beats 
                Generic Marketplaces
              </h2>
              <div className="space-y-4">
                {comparisonPoints.map((point, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-0.5" />
                    <p className="text-text-secondary">{point}</p>
                  </div>
                ))}
              </div>
            </div>
            <Card className="card-elevated p-8">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold mb-6 text-center">UniCart vs Others</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                    <span>Campus Verification</span>
                    <Badge className="btn-success">UniCart ✓</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                    <span>Student-Focused Categories</span>
                    <Badge className="btn-success">UniCart ✓</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                    <span>Campus Delivery</span>
                    <Badge className="btn-success">UniCart ✓</Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                    <span>Academic Integration</span>
                    <Badge className="btn-success">UniCart ✓</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="btn-campus px-4 py-2 mb-4">
              Future Roadmap
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="text-campus gradient-campus/10 rounded-lg">Global Vision</span>, 
              Campus Focus
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Built for VIT, designed for scale. Our roadmap includes features that will 
              revolutionize campus commerce worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {futureFeatures.map((feature, index) => (
              <Card key={index} className="card-product group">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge 
                      variant={feature.status === 'In Development' ? 'default' : 'outline'}
                      className={
                        feature.status === 'In Development' ? 'btn-success' : 
                        feature.status === 'Coming Soon' ? 'btn-campus' : ''
                      }
                    >
                      {feature.status}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-secondary">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <Card className="card-elevated p-8 lg:p-12 text-center gradient-surface">
            <CardContent className="p-0 space-y-8">
              <div className="space-y-4">
                <Badge className="btn-hero px-6 py-3 text-lg">
                  Join 45,000+ VITians
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold">
                  Ready to Experience the Future of Campus Commerce?
                </h2>
                <p className="text-xl text-text-secondary max-w-2xl mx-auto">
                  Join the most trusted, secure, and feature-rich marketplace built exclusively 
                  for the VIT community. Start your journey today.
                </p>
              </div>

              <div className="flex items-center justify-center flex-wrap gap-8 text-sm text-text-secondary">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>VIT Email Verification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Bank-Grade Security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Campus Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>24/7 Support</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!isAuthenticated && (
                  <>
                    <Button size="lg" className="btn-hero text-lg px-8 py-6" asChild>
                      <Link to="/auth/register">
                        <Users className="mr-2 h-5 w-5" />
                        Create Account
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary hover:bg-primary/10" asChild>
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

              <div className="pt-8 border-t border-card-border">
                <p className="text-text-muted text-sm">
                  Made with ❤️ by <span className="font-semibold text-primary">DataXplorers</span> • 
                  Built for VIT, Ready for the World • 
                  <a href="https://techyalhan.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    techyalhan.com
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
