
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Award, Code, Database } from 'lucide-react';

interface TeamMember {
  name: string;
  rollNumber: string;
  role: string;
  expertise: string[];
  icon: React.ReactNode;
}

export const TeamSection: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      name: "Mohammed Alhan N",
      rollNumber: "23BCA0173",
      role: "Lead Developer & Architect",
      expertise: ["Full-Stack Development", "Node.js", "MongoDB", "API Development", "Payment Gateways", "Security", "System Architecture", "DevOps"],
      icon: <Code className="h-6 w-6" />
    },
    {
      name: "Vivek Joseph Emmanuel",
      rollNumber: "23BCA0235", 
      role: "Frontend Specialist",
      expertise: ["React/Next.js", "UI/UX Design", "TypeScript", "Testing"],
      icon: <Award className="h-6 w-6" />
    },
    {
      name: "Aravind S",
      rollNumber: "23BCA0167",
      role: "Frontend",
      expertise: ["Register Page", "Product Purchase"],
      icon: <Users className="h-6 w-6" />
    },
    {
      name: "Nishant G", 
      rollNumber: "23BCA0252",
      role: "Frontend",
      expertise: ["Login Page", "Home Page"],
      icon: <Users className="h-6 w-6" />
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-surface via-background to-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="btn-campus px-4 py-2 mb-4">
            Meet the DataXplorers Team
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Built by <span className="text-campus gradient-campus/10 rounded-lg">VIT Students</span>, 
            for <span className="text-primary">VIT Community</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            UniCart is crafted with passion by the DataXplorers team - four dedicated VIT students 
            who understand the campus marketplace needs firsthand.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {teamMembers.map((member, index) => (
            <Card key={index} className="card-feature hover-lift group">
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/10 to-campus-blue/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                  {member.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <Badge variant="outline" className="text-xs mb-2">
                    {member.rollNumber}
                  </Badge>
                  <p className="text-sm text-primary font-medium mb-3">{member.role}</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {member.expertise.map((skill, skillIndex) => (
                      <Badge key={skillIndex} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-text-secondary">
            <span className="font-semibold text-primary">DataXplorers</span> - 
            Exploring data, building solutions, empowering the VIT community
          </p>
          <p className="text-sm text-text-muted mt-2">
            Created with ❤️ by <a href="https://techyalhan.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Alhan</a>
          </p>
        </div>
      </div>
    </section>
  );
};
