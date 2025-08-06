import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle, 
  Droplets, 
  Heart, 
  DollarSign, 
  Lightbulb, 
  FileText,
  ArrowRight 
} from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Soil Health Monitoring",
      description: "Real-time analysis of soil pH, nutrients, and organic matter to optimize crop growth.",
      link: "/soil-health",
      color: "bg-soma-green",
    },
    {
      icon: <Droplets className="w-6 h-6" />,
      title: "Water Efficiency",
      description: "Smart irrigation recommendations to reduce water waste and improve crop yields.",
      link: "/water-usage",
      color: "bg-blue-500",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Regenerative Practices",
      description: "Implement sustainable farming methods that restore soil health and biodiversity.",
      link: "/practices",
      color: "bg-green-500",
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Carbon Credit Estimator",
      description: "Calculate potential earnings from carbon sequestration and sustainable practices.",
      link: "/carbon-credits",
      color: "bg-soma-yellow text-gray-900",
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "AI Assistant",
      description: "Get personalized recommendations and answers to your farming questions 24/7.",
      link: "/ai-assistant",
      color: "bg-purple-500",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Sustainability Reports",
      description: "Generate comprehensive reports on your farm's environmental impact and progress.",
      link: "/reports",
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section 
        className="relative h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(46, 125, 50, 0.7), rgba(46, 125, 50, 0.7)), url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')`
        }}
      >
        <div className="text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 floating-animation">
            Grow Smarter.<br />Greener. Together.
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Harness the power of AI to optimize your farm's sustainability, increase yields, 
            and protect our planet for future generations.
          </p>
          <Link href="/dashboard">
            <Button 
              size="lg" 
              className="bg-soma-yellow hover:bg-yellow-500 text-gray-900 font-bold py-4 px-8 text-lg transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              View Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Overview */}
      <section className="py-16 bg-soma-grey">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Empowering Sustainable Agriculture
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides real-time insights and AI-powered recommendations 
              to help you make informed decisions for a sustainable future.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4 text-white`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <Link href={feature.link}>
                    <Button variant="ghost" className="text-soma-green font-medium hover:text-green-700 p-0">
                      Learn More <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How Soma Empowers Farmers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Soma Empowers Farmers
            </h2>
            <p className="text-xl text-gray-600">
              From data collection to actionable insights, see how our platform transforms farming.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-soma-green rounded-full flex items-center justify-center mx-auto mb-4 floating-animation">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Data Collection</h3>
              <p className="text-gray-600">Monitor soil, water, and environmental conditions</p>
            </div>
            
            <div className="hidden md:flex justify-center">
              <ArrowRight className="w-8 h-8 text-soma-green" />
            </div>
            
            <div className="text-center">
              <div 
                className="w-16 h-16 bg-soma-green rounded-full flex items-center justify-center mx-auto mb-4 floating-animation"
                style={{ animationDelay: '1s' }}
              >
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">AI Analysis</h3>
              <p className="text-gray-600">Process data with advanced machine learning</p>
            </div>
            
            <div className="hidden md:flex justify-center">
              <ArrowRight className="w-8 h-8 text-soma-green" />
            </div>
            
            <div className="text-center">
              <div 
                className="w-16 h-16 bg-soma-green rounded-full flex items-center justify-center mx-auto mb-4 floating-animation"
                style={{ animationDelay: '2s' }}
              >
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Smart Recommendations</h3>
              <p className="text-gray-600">Receive personalized farming insights</p>
            </div>
            
            <div className="hidden md:flex justify-center">
              <ArrowRight className="w-8 h-8 text-soma-green" />
            </div>
            
            <div className="text-center">
              <div 
                className="w-16 h-16 bg-soma-yellow rounded-full flex items-center justify-center mx-auto mb-4 floating-animation"
                style={{ animationDelay: '3s' }}
              >
                <span className="text-gray-900 font-bold text-xl">4</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Sustainable Growth</h3>
              <p className="text-gray-600">Implement changes for better yields and planet health</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
