import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, UserCheck } from "lucide-react";

const Privacy = () => {
  const principles = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Data Protection",
      description: "Your farm data is protected with enterprise-grade security measures."
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Transparency",
      description: "We clearly explain what data we collect and how we use it."
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Secure Storage",
      description: "All data is encrypted in transit and at rest using industry standards."
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: "User Control",
      description: "You maintain full control over your data with easy export and deletion options."
    }
  ];

  return (
    <div className="min-h-screen bg-soma-grey py-8 fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
          <p className="text-gray-600 mt-2">
            Last updated: December 2024
          </p>
        </div>

        {/* Privacy Principles */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Our Privacy Principles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {principles.map((principle, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-soma-green rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    {principle.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{principle.title}</h3>
                    <p className="text-sm text-gray-600">{principle.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Farm Data</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                <li>Soil test results and field measurements</li>
                <li>Crop types and farming practices</li>
                <li>Weather and environmental data</li>
                <li>Equipment and irrigation information</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Account Information</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                <li>Name, email address, and contact details</li>
                <li>Farm location and size</li>
                <li>Subscription and billing information</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Usage Data</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                <li>Platform usage patterns and feature interactions</li>
                <li>AI assistant conversations and recommendations</li>
                <li>Dashboard views and report downloads</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-gray-600">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Service Delivery</h3>
                <p className="text-sm">
                  We use your farm data to provide personalized recommendations, generate reports, 
                  and deliver AI-powered insights to help optimize your farming operations.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Platform Improvement</h3>
                <p className="text-sm">
                  Aggregated, anonymized data helps us improve our AI models and develop 
                  new features to better serve the farming community.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Communication</h3>
                <p className="text-sm">
                  We may contact you with important updates, new features, or educational 
                  content related to sustainable farming practices.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Data Sharing and Third Parties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-green-800">
                <strong>We do not sell your personal farm data to third parties.</strong>
              </p>
            </div>
            <div className="space-y-4 text-gray-600 text-sm">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Research Partners</h3>
                <p>
                  With your explicit consent, we may share anonymized, aggregated data with 
                  agricultural research institutions to advance sustainable farming research.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Service Providers</h3>
                <p>
                  We work with trusted service providers for hosting, analytics, and customer 
                  support, all bound by strict data protection agreements.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Rights and Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Access Your Data</h3>
                  <p className="text-sm text-gray-600">
                    Download a copy of all your farm data and reports anytime.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Update Information</h3>
                  <p className="text-sm text-gray-600">
                    Correct or update your account and farm information.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Delete Your Data</h3>
                  <p className="text-sm text-gray-600">
                    Request complete deletion of your account and associated data.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Data Portability</h3>
                  <p className="text-sm text-gray-600">
                    Export your data in standard formats for use with other platforms.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Us About Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              If you have questions about this privacy policy or how we handle your data, 
              please contact our privacy team:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm"><strong>Email:</strong> privacy@somadashboard.com</p>
              <p className="text-sm"><strong>Address:</strong> 123 Agriculture St, Green Valley, CA 90210</p>
              <p className="text-sm"><strong>Response Time:</strong> We typically respond within 48 hours</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;