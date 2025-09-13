
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Laptop, 
  Home as HomeIcon,
  Trophy,
  Shirt,
  Car,
  Coffee,
  Briefcase,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export const VITCategoriesSection: React.FC = () => {
  const vitCategories = [
    {
      name: "Academic Essentials",
      description: "Textbooks, Study Materials, Lab Equipment",
      icon: <BookOpen className="h-6 w-6" />,
      count: "2,847+",
      trending: true,
      color: "text-campus-blue",
      bgColor: "bg-campus-blue/10",
      items: ["Engineering Textbooks", "Lab Manuals", "Calculator", "Stationery"]
    },
    {
      name: "Electronics & Gadgets", 
      description: "Laptops, Phones, Gaming, Tech Accessories",
      icon: <Laptop className="h-6 w-6" />,
      count: "1,293+",
      trending: true,
      color: "text-campus-orange",
      bgColor: "bg-campus-orange/10",
      items: ["MacBooks", "Gaming Laptops", "Smartphones", "Headphones"]
    },
    {
      name: "Hostel & Living",
      description: "Furniture, Appliances, Room Decor",
      icon: <HomeIcon className="h-6 w-6" />,
      count: "876+",
      trending: false,
      color: "text-campus-green", 
      bgColor: "bg-campus-green/10",
      items: ["Mini Fridge", "Study Chair", "Bed Sheets", "Storage"]
    },
    {
      name: "Sports & Fitness",
      description: "Equipment, Gear, Uniforms, Supplements",
      icon: <Trophy className="h-6 w-6" />,
      count: "592+",
      trending: false,
      color: "text-primary",
      bgColor: "bg-primary/10", 
      items: ["Cricket Kit", "Gym Equipment", "Cycling Gear", "Sportswear"]
    },
    {
      name: "Fashion & Lifestyle",
      description: "Clothing, Accessories, Personal Care",
      icon: <Shirt className="h-6 w-6" />,
      count: "1,156+",
      trending: true,
      color: "text-campus-yellow",
      bgColor: "bg-campus-yellow/10",
      items: ["College Hoodies", "Footwear", "Watches", "Grooming"]
    },
    {
      name: "Transport & Travel",
      description: "Vehicles, Travel Gear, Commute Solutions",
      icon: <Car className="h-6 w-6" />,
      count: "234+", 
      trending: false,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      items: ["Bicycles", "Scooters", "Travel Bags", "Helmets"]
    },
    {
      name: "Food & Essentials",
      description: "Snacks, Daily Needs, Kitchen Items",
      icon: <Coffee className="h-6 w-6" />,
      count: "445+",
      trending: false,
      color: "text-warning",
      bgColor: "bg-warning/10",
      items: ["Instant Food", "Coffee/Tea", "Personal Care", "Cleaning"]
    },
    {
      name: "Professional & Career",
      description: "Interview Prep, Certifications, Tools",
      icon: <Briefcase className="h-6 w-6" />,
      count: "187+",
      trending: true,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      items: ["Interview Clothes", "Certificates", "Career Books", "Portfolios"]
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-background via-surface to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="btn-campus px-4 py-2 mb-4">
            VIT-Specific Categories
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Everything a <span className="text-campus gradient-campus/10 rounded-lg">VITian Needs</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            From first-year essentials to final-year placement prep - discover categories 
            tailored specifically for VIT campus life and academic journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {vitCategories.map((category, index) => (
            <Link
              key={index}
              to={`/products?category=${encodeURIComponent(category.name.toLowerCase().replace(/\s+/g, '-'))}`}
              className="block group"
            >
              <Card className="card-product h-full border-2 hover:border-primary/30 transition-all duration-300">
                <CardContent className="p-6 space-y-4 h-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl ${category.bgColor} flex items-center justify-center ${category.color} group-hover:scale-110 transition-transform duration-300`}>
                      {category.icon}
                    </div>
                    {category.trending && (
                      <Badge className="btn-success text-xs px-2 py-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Hot
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-text-secondary mb-3">
                      {category.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {category.items.slice(0, 2).map((item, itemIndex) => (
                        <Badge key={itemIndex} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                      {category.items.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{category.items.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-card-border">
                    <span className="text-sm font-medium text-primary">
                      {category.count} products
                    </span>
                    <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" className="mr-4" asChild>
            <Link to="/products">
              Browse All Categories
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" className="btn-campus" asChild>
            <Link to="/auth/register">
              Join VIT Community
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
