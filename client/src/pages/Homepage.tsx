import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Leaf, 
  Droplets, 
  Zap, 
  Globe,
  ArrowRight,
  Star,
  Users,
  TrendingUp,
  Shield
} from "lucide-react";

const Homepage = () => {
  const features = [
    {
      icon: <Leaf className="w-8 h-8" />,
      title: "Soil Health Monitoring",
      description: "Real-time analysis of soil nutrients, pH levels, and organic matter to optimize crop growth and yields.",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      icon: <Droplets className="w-8 h-8" />,
      title: "Water Usage & Efficiency", 
      description: "Smart irrigation systems and water management tools to reduce waste and improve sustainability.",
      image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Environmental Alerts",
      description: "Instant notifications about weather changes, pest threats, and optimal farming conditions.",
      image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Carbon Credit Tracking",
      description: "Monitor and calculate your farm's carbon sequestration to earn valuable carbon credits.",
      image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Patel",
      location: "Maharashtra, India",
      story: "SOMA reduced my water usage by 20% this season while increasing my crop yield by 15%. The AI recommendations are incredibly accurate!",
      savings: "₹45,000 saved"
    },
    {
      name: "Maria Rodriguez", 
      location: "California, USA",
      story: "The soil health monitoring helped me identify nutrient deficiencies early. My organic certification process became much smoother.",
      savings: "30% yield increase"
    },
    {
      name: "James Wilson",
      location: "Iowa, USA", 
      story: "Carbon credit tracking through SOMA earned me an additional $8,000 last year. It's like getting paid to farm sustainably!",
      savings: "$8,000 earned"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        }}
      >

        <div className="text-center px-4 relative z-10 max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
                alt="Modern farming technology" 
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 leading-tight">
              Smarter Farming,<br />
              <span className="text-green-700">Sustainable Future.</span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-gray-800 leading-relaxed">
            Transform your farm with AI-powered insights, real-time monitoring, and sustainable practices 
            that increase yields while protecting our planet for future generations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/signup">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 text-lg transition-all duration-300 shadow-lg rounded-lg"
              >
                Get Started (Sign Up)
              </Button>
            </Link>
            
            <Link href="/dashboard">
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white hover:bg-gray-50 text-green-600 border-green-600 font-bold py-4 px-8 text-lg transition-all duration-300 shadow-lg rounded-lg"
              >
                Demo Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for Modern Farmers
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Our comprehensive platform provides cutting-edge tools to optimize your farming operations 
              and maximize both profitability and sustainability.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="hover:shadow-lg transition-all duration-300 bg-white border border-gray-200"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-lg overflow-hidden shadow-md">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-6 mx-auto text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials/Impact Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Real Farmers, Real Results
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Join thousands of farmers worldwide who are already transforming their operations with SOMA.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index}
                className="bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300"
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-500 text-2xl">
                      <Star className="w-6 h-6 fill-current" />
                      <Star className="w-6 h-6 fill-current" />
                      <Star className="w-6 h-6 fill-current" />
                      <Star className="w-6 h-6 fill-current" />
                      <Star className="w-6 h-6 fill-current" />
                    </div>
                  </div>
                  <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.story}"</p>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                    <div className="text-green-600 font-medium">{testimonial.location}</div>
                    <div className="text-green-700 font-bold mt-2">Savings: {testimonial.savings}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="bg-green-600 text-white p-8 rounded-lg shadow-md">
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-lg">Active Farmers</div>
            </div>
            <div className="bg-white border border-gray-200 text-gray-900 p-8 rounded-lg shadow-md">
              <div className="text-4xl font-bold mb-2">25%</div>
              <div className="text-lg">Avg. Yield Increase</div>
            </div>
            <div className="bg-green-600 text-white p-8 rounded-lg shadow-md">
              <div className="text-4xl font-bold mb-2">30%</div>
              <div className="text-lg">Water Savings</div>
            </div>
            <div className="bg-white border border-gray-200 text-gray-900 p-8 rounded-lg shadow-md">
              <div className="text-4xl font-bold mb-2">₹2.5M+</div>
              <div className="text-lg">Carbon Credits Earned</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">SOMA</h3>
              <p className="text-gray-300 mb-4">
                Empowering farmers with AI-driven insights for a sustainable future.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-green-400 hover:text-white transition-colors">Facebook</a>
                <a href="#" className="text-green-400 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-green-400 hover:text-white transition-colors">Instagram</a>
                <a href="#" className="text-green-400 hover:text-white transition-colors">LinkedIn</a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-300 hover:text-white transition-colors">About</Link></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms</Link></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-green-700 mt-12 pt-8 text-center">
            <p className="text-gray-300">© 2024 SOMA. All rights reserved. Made with care for farmers worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;