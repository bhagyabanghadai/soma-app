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
  Shield,
  Play
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
      savings: "₹45,000 saved",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Maria Rodriguez", 
      location: "California, USA",
      story: "The soil health monitoring helped me identify nutrient deficiencies early. My organic certification process became much smoother.",
      savings: "30% yield increase",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b742?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "James Wilson",
      location: "Iowa, USA", 
      story: "Carbon credit tracking through SOMA earned me an additional $8,000 last year. It's like getting paid to farm sustainably!",
      savings: "$8,000 earned",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* Floating agricultural icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse">
            <Leaf className="w-10 h-10 text-green-400" />
          </div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse" style={{ animationDelay: '2s' }}>
            <Droplets className="w-8 h-8 text-blue-400" />
          </div>
          <div className="absolute bottom-32 left-20 w-18 h-18 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center animate-pulse" style={{ animationDelay: '4s' }}>
            <Globe className="w-9 h-9 text-green-400" />
          </div>
        </div>

        <div className="text-center px-4 relative z-10 max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full border-4 border-white/30 flex items-center justify-center">
                <Leaf className="w-12 h-12 text-green-400" />
              </div>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 text-white leading-tight drop-shadow-2xl">
              Smart Farming<br />
              <span className="text-green-400">Sustainable Future</span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-white/90 leading-relaxed drop-shadow-lg">
            Transform your farm with AI-powered insights, real-time monitoring, and sustainable practices 
            that increase yields while protecting our planet for future generations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/signup">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 text-lg transition-all duration-300 shadow-2xl rounded-lg backdrop-blur-sm"
              >
                Start Your Journey
              </Button>
            </Link>
            
            <Link href="/dashboard">
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/20 hover:bg-white/30 text-white border-white/50 font-bold py-4 px-8 text-lg transition-all duration-300 shadow-2xl rounded-lg backdrop-blur-sm"
              >
                <Play className="w-5 h-5 mr-2" />
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features with Farm Background */}
      <section 
        className="py-20 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url('https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Revolutionary Farm Technology
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Experience the future of agriculture with our comprehensive suite of smart farming tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="hover:shadow-2xl transition-all duration-500 bg-white/95 backdrop-blur-sm border border-gray-200 transform hover:-translate-y-2"
              >
                <CardContent className="p-8 text-center">
                  <div className="relative">
                    <div 
                      className="w-full h-40 mb-6 rounded-lg overflow-hidden shadow-lg"
                      style={{
                        backgroundImage: `url(${feature.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      <div className="w-full h-full bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-4">
                        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white">
                          {feature.icon}
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials with Crop Field Background */}
      <section 
        className="py-20 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Farmers Love SOMA
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Join thousands of farmers worldwide who are transforming their operations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index}
                className="bg-white/95 backdrop-blur-sm border border-white/20 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-green-500 mr-4"
                    />
                    <div>
                      <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                      <div className="text-green-600 font-medium">{testimonial.location}</div>
                    </div>
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.story}"</p>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-green-700 font-bold text-lg">💰 {testimonial.savings}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="bg-white/20 backdrop-blur-md text-white p-8 rounded-lg shadow-2xl">
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-lg">Active Farmers</div>
            </div>
            <div className="bg-green-600/90 backdrop-blur-md text-white p-8 rounded-lg shadow-2xl">
              <div className="text-4xl font-bold mb-2">25%</div>
              <div className="text-lg">Avg. Yield Increase</div>
            </div>
            <div className="bg-white/20 backdrop-blur-md text-white p-8 rounded-lg shadow-2xl">
              <div className="text-4xl font-bold mb-2">30%</div>
              <div className="text-lg">Water Savings</div>
            </div>
            <div className="bg-green-600/90 backdrop-blur-md text-white p-8 rounded-lg shadow-2xl">
              <div className="text-4xl font-bold mb-2">₹2.5M+</div>
              <div className="text-lg">Carbon Credits Earned</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action with Sunset Farm */}
      <section 
        className="py-32 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-white/90 mb-12 leading-relaxed">
            Join the agricultural revolution today. Start with a free account and see 
            how AI can help you grow more while preserving our planet.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/signup">
              <Button 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-12 text-xl transition-all duration-300 shadow-2xl rounded-lg"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="/contact">
              <Button 
                size="lg" 
                variant="outline"
                className="bg-white/20 hover:bg-white/30 text-white border-white/50 font-bold py-6 px-12 text-xl transition-all duration-300 shadow-2xl rounded-lg backdrop-blur-sm"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Leaf className="w-8 h-8 text-green-400 mr-3" />
                <h3 className="text-2xl font-bold">SOMA</h3>
              </div>
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
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-300">© 2024 SOMA. All rights reserved. Made with care for farmers worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;