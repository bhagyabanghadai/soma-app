import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Cloud, 
  CheckCircle, 
  Heart, 
  Droplets, 
  Lightbulb,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer 
} from "recharts";
import { weatherData, soilHealthData, carbonData, waterData } from "@/data/mockData";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-soma-grey py-8 fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Farm Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Real-time insights into your farm's performance and sustainability metrics
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Weather Summary</p>
                  <p className="text-2xl font-bold text-gray-900">{weatherData.temperature}°C</p>
                  <p className="text-sm text-gray-600">
                    Humidity: {weatherData.humidity}% | Rain: {weatherData.rainfall}mm
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Cloud className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Soil Health Score</p>
                  <p className="text-2xl font-bold text-soma-green">{soilHealthData.score}/100</p>
                  <p className="text-sm text-green-600">{soilHealthData.status} condition</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">CO₂ Saved</p>
                  <p className="text-2xl font-bold text-soma-green">{carbonData.totalSaved} tons</p>
                  <p className="text-sm text-green-600">This season</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Water Efficiency</p>
                  <p className="text-2xl font-bold text-blue-500">{waterData.efficiency}%</p>
                  <p className="text-sm text-blue-600">Above average</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Carbon Footprint Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Carbon Footprint Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={carbonData.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Line 
                      type="monotone" 
                      dataKey="co2" 
                      stroke="hsl(122, 41%, 35%)" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(122, 41%, 35%)", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Water Usage Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Water Usage vs Rainfall
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waterData.monthlyUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Bar dataKey="usage" fill="#3B82F6" name="Water Usage" />
                    <Bar dataKey="rainfall" fill="hsl(122, 41%, 35%)" name="Rainfall" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center mt-4 space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                  Water Usage
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-soma-green rounded mr-2"></div>
                  Rainfall
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Tip Box */}
        <Card className="gradient-bg text-white">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">💡 AI Tip of the Day</h3>
                <p className="mb-4">
                  Based on current weather patterns and soil moisture levels, consider reducing 
                  irrigation by 15% this week. This could save approximately 2,000 gallons while 
                  maintaining optimal crop growth.
                </p>
                <Link href="/ai-assistant">
                  <Button variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                    Ask AI Assistant
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
