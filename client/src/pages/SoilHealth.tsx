import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { calculateSoilHealth } from "@/lib/calculations";
import SoilHealthCharts from "@/components/SoilHealthCharts";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, BarChart3, Leaf, Target } from "lucide-react";

const SoilHealth = () => {
  const { toast } = useToast();
  const [location, setLocation] = useState({ latitude: 42.0308, longitude: -93.6319 });
  const [earthData, setEarthData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    pH: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
  });
  const [results, setResults] = useState<{
    score: number;
    status: string;
    recommendations: string[];
  } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const pH = parseFloat(formData.pH) || 6.5;
    const nitrogen = parseFloat(formData.nitrogen) || 25;
    const phosphorus = parseFloat(formData.phosphorus) || 15;
    const potassium = parseFloat(formData.potassium) || 120;
    
    const analysis = calculateSoilHealth(pH, nitrogen, phosphorus, potassium);
    setResults(analysis);
  };

  const getNutrientStatus = (level: number, thresholds: { good: number; optimal: number }) => {
    if (level >= thresholds.optimal) return { status: "Optimal", color: "text-green-600", progress: 100 };
    if (level >= thresholds.good) return { status: "Good", color: "text-yellow-600", progress: 75 };
    return { status: "Low", color: "text-red-600", progress: 40 };
  };

  // Fetch environmental data
  useEffect(() => {
    const fetchEnvironmentalData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/nasa/earthdata?lat=${location.latitude}&lon=${location.longitude}`);
        if (response.ok) {
          const data = await response.json();
          setEarthData(data);
        }
      } catch (error) {
        console.error("Error fetching environmental data:", error);
      }
      setLoading(false);
    };

    fetchEnvironmentalData();
  }, [location]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Excellent": return "text-green-600";
      case "Good": return "text-green-600";
      case "Moderate": return "text-yellow-600";
      default: return "text-red-600";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Leaf className="w-10 h-10 text-green-600" />
            Advanced Soil Health Analytics
          </h1>
          <p className="text-xl text-gray-700 mb-6">
            Comprehensive soil analysis with AI-powered insights and actionable recommendations
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-600" />
              Real-time Analysis
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              Historical Trends
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-purple-600" />
              Smart Recommendations
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>Soil Test Data</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="pH">Soil pH Level</Label>
                  <Input
                    id="pH"
                    type="number"
                    step="0.1"
                    min="0"
                    max="14"
                    placeholder="6.5"
                    value={formData.pH}
                    onChange={(e) => handleInputChange("pH", e.target.value)}
                    className="focus:ring-soma-green focus:border-soma-green"
                  />
                </div>
                <div>
                  <Label htmlFor="nitrogen">Nitrogen (ppm)</Label>
                  <Input
                    id="nitrogen"
                    type="number"
                    placeholder="25"
                    value={formData.nitrogen}
                    onChange={(e) => handleInputChange("nitrogen", e.target.value)}
                    className="focus:ring-soma-green focus:border-soma-green"
                  />
                </div>
                <div>
                  <Label htmlFor="phosphorus">Phosphorus (ppm)</Label>
                  <Input
                    id="phosphorus"
                    type="number"
                    placeholder="15"
                    value={formData.phosphorus}
                    onChange={(e) => handleInputChange("phosphorus", e.target.value)}
                    className="focus:ring-soma-green focus:border-soma-green"
                  />
                </div>
                <div>
                  <Label htmlFor="potassium">Potassium (ppm)</Label>
                  <Input
                    id="potassium"
                    type="number"
                    placeholder="120"
                    value={formData.potassium}
                    onChange={(e) => handleInputChange("potassium", e.target.value)}
                    className="focus:ring-soma-green focus:border-soma-green"
                  />
                </div>
                <Button type="submit" className="w-full bg-soma-green hover:bg-soma-green/90">
                  Analyze Soil Health
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-6">
                  {/* Health Score */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-4">
                      <span className="text-2xl font-bold text-soma-green">{results.score}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Soil Health Score</h3>
                    <p className={`font-medium ${getStatusColor(results.status)}`}>{results.status} Condition</p>
                  </div>

                  {/* Recommendations */}
                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">🌱 Recommendations</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {results.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Nutrient Levels */}
                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">📊 Nutrient Analysis</h4>
                    <div className="space-y-3">
                      {[
                        { 
                          name: "pH Level", 
                          value: parseFloat(formData.pH) || 6.5,
                          ...getNutrientStatus(parseFloat(formData.pH) || 6.5, { good: 6.0, optimal: 6.5 })
                        },
                        { 
                          name: "Nitrogen", 
                          value: parseFloat(formData.nitrogen) || 25,
                          ...getNutrientStatus(parseFloat(formData.nitrogen) || 25, { good: 20, optimal: 30 })
                        },
                        { 
                          name: "Phosphorus", 
                          value: parseFloat(formData.phosphorus) || 15,
                          ...getNutrientStatus(parseFloat(formData.phosphorus) || 15, { good: 10, optimal: 20 })
                        },
                        { 
                          name: "Potassium", 
                          value: parseFloat(formData.potassium) || 120,
                          ...getNutrientStatus(parseFloat(formData.potassium) || 120, { good: 100, optimal: 150 })
                        },
                      ].map((nutrient, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{nutrient.name}</span>
                            <span className={nutrient.color}>{nutrient.status}</span>
                          </div>
                          <Progress value={nutrient.progress} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p>Enter your soil test data to see analysis results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Charts and Analytics */}
        <div className="mt-12">
          <SoilHealthCharts 
            location={location}
            earthData={earthData}
          />
        </div>
      </div>
    </div>
  );
};

export default SoilHealth;
