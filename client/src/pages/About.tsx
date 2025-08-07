import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Target, Users, Award } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Sustainability First",
      description: "We believe in farming practices that protect and regenerate our planet for future generations."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Data-Driven Decisions",
      description: "Empowering farmers with AI-powered insights to make informed, sustainable choices."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Impact",
      description: "Supporting farming communities with tools that improve both yields and environmental health."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Innovation Excellence",
      description: "Combining cutting-edge technology with proven agricultural wisdom."
    }
  ];

  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Agricultural Scientist",
      description: "20+ years in sustainable agriculture research"
    },
    {
      name: "Marcus Rodriguez",
      role: "Lead AI Engineer",
      description: "Expert in machine learning for agricultural applications"
    },
    {
      name: "Emma Thompson",
      role: "Sustainability Director",
      description: "Former UN consultant on regenerative farming practices"
    }
  ];

  return (
    <div className="min-h-screen bg-soma-grey py-8 fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">About Soma Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Revolutionizing agriculture through AI-powered sustainability insights
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                To empower farmers worldwide with intelligent technology that makes sustainable agriculture 
                accessible, profitable, and scalable. We envision a future where every farm contributes to 
                environmental restoration while feeding the world.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-soma-green rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    {value.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Story Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Story</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none text-gray-600">
              <p className="mb-4">
                Founded in 2023, Soma Dashboard emerged from a simple observation: farmers had access to more 
                data than ever before, but lacked the tools to transform that data into actionable insights 
                for sustainable farming.
              </p>
              <p className="mb-4">
                Our team of agricultural scientists, AI engineers, and sustainability experts came together 
                with a shared vision—to create a platform that makes regenerative agriculture both accessible 
                and profitable for farmers of all sizes.
              </p>
              <p>
                Today, Soma Dashboard serves thousands of farmers worldwide, helping them reduce environmental 
                impact while improving yields and profitability. We're proud to be at the forefront of the 
                sustainable agriculture revolution.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Team Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Leadership Team</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {team.map((member, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <h3 className="font-semibold text-gray-900">{member.name}</h3>
                  <p className="text-soma-green font-medium text-sm mb-2">{member.role}</p>
                  <p className="text-xs text-gray-600">{member.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Impact Section */}
        <Card>
          <CardHeader>
            <CardTitle>Our Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-soma-green mb-2">10,000+</div>
                <div className="text-gray-600">Farmers Served</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-soma-green mb-2">50M+</div>
                <div className="text-gray-600">Acres Optimized</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-soma-green mb-2">2M+</div>
                <div className="text-gray-600">Tons CO₂ Sequestered</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;