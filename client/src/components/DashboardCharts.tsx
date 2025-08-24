import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { TrendingUp, TrendingDown, Calendar, Eye, BarChart3 } from "lucide-react";

interface DashboardChartsProps {
  location: { latitude: number; longitude: number };
}

const DashboardCharts = ({ location }: DashboardChartsProps) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Generate realistic historical data based on current location
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const data = Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        
        // Simulate seasonal patterns and realistic variations
        const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
        const seasonalFactor = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 0.3 + 0.7;
        const randomVariation = Math.random() * 0.4 - 0.2;
        
        return {
          date: date.toISOString().split('T')[0],
          dateFormatted: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          ndvi: Math.max(0.1, Math.min(1.0, (0.6 + seasonalFactor * 0.3 + randomVariation * 0.1))),
          temperature: Math.round(18 + seasonalFactor * 15 + randomVariation * 5),
          soilMoisture: Math.max(10, Math.min(50, 25 + seasonalFactor * 10 + randomVariation * 8)),
          aqi: Math.max(10, Math.min(150, 45 + randomVariation * 25)),
          carbonSequestration: Math.max(0, 2.5 + seasonalFactor * 1.5 + randomVariation * 0.8),
          waterUsage: Math.max(100, 800 + seasonalFactor * 400 + randomVariation * 200),
          yieldPrediction: Math.max(60, 85 + seasonalFactor * 10 + randomVariation * 8)
        };
      });
      setHistoricalData(data);
      setLoading(false);
    }, 500);
  }, [timeRange, location]);

  // Calculate trends
  const calculateTrend = (data: any[], key: string) => {
    if (data.length < 2) return 0;
    const recent = data.slice(-7).reduce((sum, item) => sum + item[key], 0) / 7;
    const previous = data.slice(-14, -7).reduce((sum, item) => sum + item[key], 0) / 7;
    return ((recent - previous) / previous) * 100;
  };

  const ndviTrend = calculateTrend(historicalData, 'ndvi');
  const tempTrend = calculateTrend(historicalData, 'temperature');
  const moistureTrend = calculateTrend(historicalData, 'soilMoisture');
  const carbonTrend = calculateTrend(historicalData, 'carbonSequestration');

  // Soil composition pie chart data
  const soilComposition = [
    { name: 'Clay', value: 35, color: '#8B4513' },
    { name: 'Sand', value: 25, color: '#F4A460' },
    { name: 'Silt', value: 30, color: '#DEB887' },
    { name: 'Organic Matter', value: 10, color: '#228B22' }
  ];

  // Monthly yield comparison
  const monthlyYield = [
    { month: 'Jan', thisYear: 0, lastYear: 0, predicted: 75 },
    { month: 'Feb', thisYear: 0, lastYear: 0, predicted: 78 },
    { month: 'Mar', thisYear: 82, lastYear: 78, predicted: 85 },
    { month: 'Apr', thisYear: 88, lastYear: 84, predicted: 90 },
    { month: 'May', thisYear: 92, lastYear: 89, predicted: 95 },
    { month: 'Jun', thisYear: 95, lastYear: 91, predicted: 98 },
    { month: 'Jul', thisYear: 0, lastYear: 94, predicted: 96 },
    { month: 'Aug', thisYear: 0, lastYear: 96, predicted: 94 },
    { month: 'Sep', thisYear: 0, lastYear: 92, predicted: 90 },
    { month: 'Oct', thisYear: 0, lastYear: 85, predicted: 85 },
    { month: 'Nov', thisYear: 0, lastYear: 0, predicted: 80 },
    { month: 'Dec', thisYear: 0, lastYear: 0, predicted: 78 }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="h-64 bg-gray-200 rounded-lg"></CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-green-600" />
          Environmental Analytics
        </h2>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={timeRange === range ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics with Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">NDVI Trend</p>
                <p className="text-2xl font-bold text-green-900">
                  {historicalData[historicalData.length - 1]?.ndvi.toFixed(3) || 'N/A'}
                </p>
              </div>
              <div className="flex items-center gap-1">
                {ndviTrend > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${ndviTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(ndviTrend).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Soil Moisture</p>
                <p className="text-2xl font-bold text-blue-900">
                  {historicalData[historicalData.length - 1]?.soilMoisture || 'N/A'}%
                </p>
              </div>
              <div className="flex items-center gap-1">
                {moistureTrend > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${moistureTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(moistureTrend).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700">Temperature</p>
                <p className="text-2xl font-bold text-orange-900">
                  {historicalData[historicalData.length - 1]?.temperature || 'N/A'}°C
                </p>
              </div>
              <div className="flex items-center gap-1">
                {tempTrend > 0 ? (
                  <TrendingUp className="w-4 h-4 text-red-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-blue-600" />
                )}
                <span className={`text-sm font-medium ${tempTrend > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                  {Math.abs(tempTrend).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-700">Carbon Sequestration</p>
                <p className="text-2xl font-bold text-emerald-900">
                  {historicalData[historicalData.length - 1]?.carbonSequestration.toFixed(1) || 'N/A'} t/ha
                </p>
              </div>
              <div className="flex items-center gap-1">
                {carbonTrend > 0 ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${carbonTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(carbonTrend).toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NDVI & Temperature Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Vegetation Health & Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateFormatted" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    typeof value === 'number' ? value.toFixed(name === 'ndvi' ? 3 : 1) : value,
                    name === 'ndvi' ? 'NDVI' : 'Temperature (°C)'
                  ]}
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="ndvi" 
                  stroke="#16a34a" 
                  strokeWidth={3}
                  dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#ea580c" 
                  strokeWidth={2}
                  dot={{ fill: '#ea580c', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Soil Moisture & Water Usage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              Water Management Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateFormatted" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    typeof value === 'number' ? value.toFixed(0) : value,
                    name === 'soilMoisture' ? 'Soil Moisture (%)' : 'Water Usage (L/ha)'
                  ]}
                />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="soilMoisture" 
                  stackId="1"
                  stroke="#2563eb" 
                  fill="#3b82f6" 
                  fillOpacity={0.6}
                />
                <Area 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="waterUsage" 
                  stackId="2"
                  stroke="#0ea5e9" 
                  fill="#38bdf8" 
                  fillOpacity={0.4}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Soil Composition */}
        <Card>
          <CardHeader>
            <CardTitle>Soil Composition Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={soilComposition}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {soilComposition.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly Yield Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Yield Performance Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyYield}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any, name: string) => [
                  `${value}%`,
                  name === 'thisYear' ? 'This Year' : name === 'lastYear' ? 'Last Year' : 'Predicted'
                ]} />
                <Bar dataKey="lastYear" fill="#94a3b8" name="lastYear" />
                <Bar dataKey="thisYear" fill="#16a34a" name="thisYear" />
                <Bar dataKey="predicted" fill="#22c55e" fillOpacity={0.6} name="predicted" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Based on Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🤖 Data-Driven Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ndviTrend < -5 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-red-100 text-red-800">Alert</Badge>
                  <span className="font-medium">Vegetation Decline</span>
                </div>
                <p className="text-sm text-gray-700">
                  NDVI has decreased by {Math.abs(ndviTrend).toFixed(1)}% over the past week. Consider soil testing and nutrition supplements.
                </p>
              </div>
            )}
            
            {moistureTrend < -10 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-yellow-100 text-yellow-800">Warning</Badge>
                  <span className="font-medium">Soil Moisture Low</span>
                </div>
                <p className="text-sm text-gray-700">
                  Soil moisture dropping rapidly. Increase irrigation frequency and monitor weather forecasts.
                </p>
              </div>
            )}
            
            {carbonTrend > 5 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                  <span className="font-medium">Carbon Improvement</span>
                </div>
                <p className="text-sm text-gray-700">
                  Carbon sequestration is up {carbonTrend.toFixed(1)}%! Your sustainable practices are working well.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;