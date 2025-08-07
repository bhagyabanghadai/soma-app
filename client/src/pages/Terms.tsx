import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Scale, AlertTriangle, CheckCircle } from "lucide-react";

const Terms = () => {
  const keyTerms = [
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Service Access",
      description: "Free trial access with premium features available through subscription"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Data Ownership",
      description: "You retain full ownership of your farm data and can export it anytime"
    },
    {
      icon: <Scale className="w-5 h-5" />,
      title: "Fair Use",
      description: "Use our platform responsibly and in accordance with agricultural best practices"
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Limitations",
      description: "Our recommendations are advisory; final farming decisions remain yours"
    }
  ];

  return (
    <div className="min-h-screen bg-soma-grey py-8 fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          <p className="text-gray-600 mt-2">
            Last updated: December 2024
          </p>
        </div>

        {/* Key Terms Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Key Terms at a Glance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {keyTerms.map((term, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-soma-green rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    {term.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{term.title}</h3>
                    <p className="text-sm text-gray-600">{term.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Acceptance of Terms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            <p className="mb-4">
              By accessing and using Soma Dashboard, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to these terms, you should not 
              use our service.
            </p>
            <p>
              These terms apply to all users of the service, including farmers, agricultural 
              consultants, and research institutions.
            </p>
          </CardContent>
        </Card>

        {/* Service Description */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>2. Service Description</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            <p className="mb-4">
              Soma Dashboard provides AI-powered agricultural insights and recommendations to help 
              farmers implement sustainable farming practices. Our services include:
            </p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Soil health analysis and recommendations</li>
              <li>Water usage optimization tools</li>
              <li>Carbon credit estimation</li>
              <li>Regenerative practice guidance</li>
              <li>AI-powered farming assistant</li>
              <li>Sustainability reporting</li>
            </ul>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of our service 
              with reasonable notice to users.
            </p>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>3. User Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Account Security</h3>
                <p className="text-sm">
                  You are responsible for maintaining the confidentiality of your account 
                  credentials and for all activities that occur under your account.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Accurate Information</h3>
                <p className="text-sm">
                  You agree to provide accurate, current, and complete information about your 
                  farm and farming practices for optimal service delivery.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Lawful Use</h3>
                <p className="text-sm">
                  You must use our service in compliance with all applicable laws and regulations, 
                  including environmental and agricultural regulations in your jurisdiction.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>4. Disclaimer and Limitations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-yellow-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-yellow-800">
                <strong>Important:</strong> Soma Dashboard provides advisory recommendations only. 
                All farming decisions and their outcomes remain solely your responsibility.
              </p>
            </div>
            <div className="space-y-4 text-gray-600 text-sm">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">No Warranty</h3>
                <p>
                  Our service is provided "as is" without warranty of any kind. We do not 
                  guarantee specific farming outcomes or results.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Professional Consultation</h3>
                <p>
                  Our AI recommendations should supplement, not replace, professional agricultural 
                  consultation and your own farming expertise.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Environmental Factors</h3>
                <p>
                  Weather, soil conditions, and other environmental factors can affect outcomes. 
                  Always consider local conditions when implementing recommendations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription and Billing */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>5. Subscription and Billing</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 text-sm">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Free Trial</h3>
                <p>
                  New users receive a 30-day free trial with access to basic features. 
                  No credit card required for trial access.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Subscription Plans</h3>
                <p>
                  Continued access to premium features requires a subscription. Billing occurs 
                  monthly or annually based on your selected plan.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Cancellation</h3>
                <p>
                  You may cancel your subscription at any time. Access to premium features 
                  continues until the end of your billing period.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>6. Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 text-sm">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Our Content</h3>
                <p>
                  All software, algorithms, and content provided by Soma Dashboard remain our 
                  intellectual property or that of our licensors.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Your Data</h3>
                <p>
                  You retain all rights to your farm data. We only use your data to provide 
                  services as outlined in our Privacy Policy.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>7. Changes to These Terms</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-600 text-sm">
            <p className="mb-4">
              We may update these terms from time to time. We will notify users of significant 
              changes via email and through in-app notifications.
            </p>
            <p>
              Continued use of our service after changes indicates acceptance of the updated terms.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>8. Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              If you have questions about these terms of service, please contact us:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm"><strong>Email:</strong> legal@somadashboard.com</p>
              <p className="text-sm"><strong>Address:</strong> 123 Agriculture St, Green Valley, CA 90210</p>
              <p className="text-sm"><strong>Phone:</strong> +1 (555) 123-4567</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;