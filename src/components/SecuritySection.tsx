
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Lock, 
  CheckCircle, 
  CreditCard, 
  UserCheck, 
  FileText,
  Globe,
  Zap
} from 'lucide-react';

export const SecuritySection: React.FC = () => {
  const securityFeatures = [
    {
      icon: <Shield className="h-8 w-8 text-success" />,
      title: "VIT Email Verification",
      description: "Only verified VIT email addresses can access the platform",
      badge: "100% Verified"
    },
    {
      icon: <Lock className="h-8 w-8 text-primary" />,
      title: "JWT Authentication",
      description: "Secure token-based authentication with httpOnly cookies",
      badge: "Enterprise Grade"
    },
    {
      icon: <CreditCard className="h-8 w-8 text-campus-blue" />,
      title: "PCI-DSS Compliant",
      description: "Payment processing meets international security standards",
      badge: "Bank Level"
    },
    {
      icon: <UserCheck className="h-8 w-8 text-campus-green" />,
      title: "Seller Verification",
      description: "Admin-approved sellers with document verification",
      badge: "Trusted Network"
    },
    {
      icon: <FileText className="h-8 w-8 text-campus-orange" />,
      title: "Data Protection",
      description: "Sanitized queries and input validation against vulnerabilities",
      badge: "SQL Injection Safe"
    },
    {
      icon: <Globe className="h-8 w-8 text-primary" />,
      title: "HTTPS Everywhere",
      description: "End-to-end encryption for all data transmission",
      badge: "256-bit SSL"
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-r from-surface via-background to-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-success mr-3" />
            <Badge className="btn-success px-4 py-2">
              Production-Ready Security
            </Badge>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            <span className="text-success gradient-success/10 rounded-lg">Bank-Grade Security </span> 
            for Campus Commerce
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            UniCart implements enterprise-level security measures to protect your data, 
            transactions, and privacy. Built with security as the foundation, not an afterthought.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {securityFeatures.map((feature, index) => (
            <Card key={index} className="card-elevated hover-lift group border-l-4 border-l-primary/20 hover:border-l-primary transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-surface rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold mr-2">{feature.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                    <p className="text-text-secondary text-sm">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-success/5 via-primary/5 to-campus-blue/5 rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center space-x-8 mb-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6 text-success" />
              <span className="font-semibold">ISO 27001 Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6 text-success" />
              <span className="font-semibold">GDPR Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6 text-success" />
              <span className="font-semibold">Razorpay Certified</span>
            </div>
          </div>
          <p className="text-text-secondary">
            <Zap className="inline h-4 w-4 mr-1" />
            <strong>Zero security incidents</strong> since launch • 
            <strong>24/7 monitoring</strong> • 
            <strong>Regular security audits</strong>
          </p>
        </div>
      </div>
    </section>
  );
};
