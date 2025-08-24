import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { Droplets, TrendingUp, Calendar, Target, AlertTriangle, CheckCircle } from "lucide-react";

interface WaterUsageChartsProps {
  location?: { latitude: number; longitude: number };
  earthData?: {
    ndvi: number;
    landSurfaceTemperature: number;
    evapotranspiration: number;
    vegetationStatus: string;
    temperatureStatus: string;
    droughtRisk: string;
  } | null;
  weatherData?: {
    current: {
      temperature: number;
      temperatureUnit: string;
      conditions: string;
    };
    forecast: Array<{
      name: string;
      temperature: number;
      temperatureUnit: string;
      conditions: string;
      isDaytime: boolean;
    }>;
  } | null;
}

const WaterUsageCharts = ({ location, earthData, weatherData }: WaterUsageChartsProps) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [historicalData, setHistoricalData] = useState<any[]>([]);

  // Generate water usage data based on real environmental factors
  useEffect(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    
    // Base calculations on real environmental data
    const currentTemp = weatherData?.current?.temperature || 20;
    const currentET = earthData?.evapotranspiration || 4;
    const baseNdvi = earthData?.ndvi || 0.6;
    
    const data = Array.from({ length: Math.min(days, 30) }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (30 - 1 - i));
      
      // Calculate based on environmental conditions
      const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
      const seasonalFactor = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 0.4 + 0.6;
      const tempFactor = Math.max(0.5, Math.min(1.5, currentTemp / 25)); // Temperature impact
      const vegetationFactor = Math.max(0.7, Math.min(1.3, baseNdvi / 0.6)); // Vegetation density impact
      const randomVariation = (Math.random() - 0.5) * 0.2;
      
      return {
        date: date.toISOString().split('T')[0],
        dateFormatted: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        totalUsage: Math.max(500, Math.round(currentET * 300 * tempFactor * seasonalFactor + randomVariation * 200)),
        irrigation: Math.max(300, Math.round(currentET * 200 * tempFactor * vegetationFactor * seasonalFactor + randomVariation * 150)),
        livestock: Math.max(50, Math.round(150 * tempFactor + randomVariation * 25)),
        household: Math.max(80, Math.round(120 * tempFactor + randomVariation * 20)),
        efficiency: Math.max(60, Math.min(95, 75 + (baseNdvi * 30) + seasonalFactor * 15 + randomVariation * 10)),
        soilMoisture: Math.max(15, Math.min(45, currentET * 6 + seasonalFactor * 12 + randomVariation * 8)),
        rainfall: Math.max(0, Math.round(Math.random() * 25 * (1 - seasonalFactor * 0.5))), // Less rain in hot seasons
        evapotranspiration: Math.max(2, currentET * (0.8 + seasonalFactor * 0.4 + randomVariation)),
        costPerGallon: 0.003 + Math.random() * 0.002
      };
    });
    setHistoricalData(data);
  }, [timeRange, earthData, weatherData]);

  // Water usage by source pie chart
  const currentUsage = historicalData[historicalData.length - 1] || {
    irrigation: 850,
    livestock: 180,
    household: 120,
    other: 50
  };

  const usageBySource = [
    { name: 'Irrigation', value: currentUsage.irrigation, color: '#3b82f6' },
    { name: 'Livestock', value: currentUsage.livestock, color: '#10b981' },
    { name: 'Household', value: currentUsage.household, color: '#f59e0b' },
    { name: 'Other', value: 50, color: '#6b7280' }
  ];

  // Generate monthly water costs based on environmental data
  const generateMonthlyCosts = () => {
    const currentTemp = weatherData?.current?.temperature || 20;
    const currentET = earthData?.evapotranspiration || 4;
    const baseNdvi = earthData?.ndvi || 0.6;
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return months.map((month, index) => {
      // Seasonal temperature variation
      const seasonalTemp = currentTemp * (0.7 + 0.6 * Math.sin((index / 12) * 2 * Math.PI - Math.PI/2));
      const seasonalET = currentET * (0.8 + 0.4 * Math.sin((index / 12) * 2 * Math.PI - Math.PI/2));
      const vegetationFactor = Math.max(0.7, Math.min(1.3, baseNdvi / 0.6));
      
      const baseCost = seasonalET * seasonalTemp * vegetationFactor * 15;
      const cost = Math.max(300, Math.round(baseCost));
      const budget = Math.round(cost * 1.1); // 10% buffer
      const savings = budget - cost;
      
      return { month, cost, budget, savings };
    });
  };

  const monthlyWaterCosts = generateMonthlyCosts();

  // Efficiency recommendations
  const efficiencyTips = [
    {
      category: 'Irrigation Timing',
      improvement: 'Switch to early morning irrigation',
      potentialSavings: '15-20%',
      implementation: 'Reprogram irrigation timers',
      cost: '$50',
      timeline: '1 week'
    },
    {
      category: 'Drip Irrigation',
      improvement: 'Install drip irrigation in vegetable plots',
      potentialSavings: '30-40%',
      implementation: 'Professional installation required',
      cost: '$1,200',
      timeline: '2-3 weeks'
    },
    {
      category: 'Soil Moisture Sensors',
      improvement: 'Add smart soil moisture monitoring',
      potentialSavings: '25-35%',
      implementation: 'Sensor installation + app setup',
      cost: '$300',
      timeline: '3-5 days'
    },
    {
      category: 'Rainwater Harvesting',
      improvement: 'Install rainwater collection system',
      potentialSavings: '10-15%',
      implementation: 'Gutter and tank installation',
      cost: '$800',
      timeline: '1-2 weeks'
    }
  ];

  // Calculate water efficiency metrics
  const calculateEfficiencyMetrics = () => {
    if (historicalData.length === 0) return { current: 0, trend: 0, target: 85 };
    
    const recent = historicalData.slice(-7);
    const previous = historicalData.slice(-14, -7);
    
    const currentEfficiency = recent.reduce((sum, day) => sum + day.efficiency, 0) / recent.length;
    const previousEfficiency = previous.length > 0 
      ? previous.reduce((sum, day) => sum + day.efficiency, 0) / previous.length 
      : currentEfficiency;
    
    const trend = ((currentEfficiency - previousEfficiency) / previousEfficiency) * 100;
    
    return {
      current: Math.round(currentEfficiency),
      trend: Math.round(trend * 10) / 10,
      target: 85
    };
  };

  const efficiencyMetrics = calculateEfficiencyMetrics();

  // Weekly irrigation schedule optimization
  const weeklySchedule = [
    { day: 'Mon', planned: 180, actual: 165, optimal: 160, weather: 'sunny' },
    { day: 'Tue', planned: 200, actual: 210, optimal: 190, weather: 'partly-cloudy' },
    { day: 'Wed', planned: 150, actual: 0, optimal: 0, weather: 'rainy' },
    { day: 'Thu', planned: 170, actual: 175, optimal: 170, weather: 'sunny' },
    { day: 'Fri', planned: 190, actual: 185, optimal: 180, weather: 'sunny' },
    { day: 'Sat', planned: 160, actual: 140, optimal: 150, weather: 'windy' },
    { day: 'Sun', planned: 180, actual: 170, optimal: 175, weather: 'sunny' }
  ];

  return (
    <div className="space-y-8">
      {/* Water Efficiency Score */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-100">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Water Efficiency Score</h2>
              <div className="text-6xl font-bold text-blue-600 mb-4">{efficiencyMetrics.current}%</div>
              <div className="flex items-center gap-2">
                <Badge className={
                  efficiencyMetrics.current >= 85 ? "bg-green-100 text-green-800" :
                  efficiencyMetrics.current >= 70 ? "bg-yellow-100 text-yellow-800" :
                  "bg-red-100 text-red-800"
                }>
                  {efficiencyMetrics.current >= 85 ? "Excellent" : efficiencyMetrics.current >= 70 ? "Good" : "Needs Improvement"}
                </Badge>
                <div className="flex items-center gap-1">
                  {efficiencyMetrics.trend > 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
                  )}
                  <span className={`text-sm font-medium ${efficiencyMetrics.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(efficiencyMetrics.trend)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-8xl mb-4">💧</div>
              <p className="text-sm text-gray-600">Target: {efficiencyMetrics.target}%</p>
              <Progress value={efficiencyMetrics.current} className="w-24 mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Water Usage Analytics</h3>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              
              onClick={() => setTimeRange(range)}
              className={timeRange === range ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </Button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Water Usage Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="w-5 h-5 text-blue-600" />
              Daily Water Usage Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateFormatted" />
                <YAxis />
                <Tooltip formatter={(value: any) => [`${value} gallons`, 'Usage']} />
                <Area 
                  type="monotone" 
                  dataKey="irrigation" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.8}
                  name="Irrigation"
                />
                <Area 
                  type="monotone" 
                  dataKey="livestock" 
                  stackId="1"
                  stroke="#10b981" 
                  fill="#10b981" 
                  fillOpacity={0.8}
                  name="Livestock"
                />
                <Area 
                  type="monotone" 
                  dataKey="household" 
                  stackId="1"
                  stroke="#f59e0b" 
                  fill="#f59e0b" 
                  fillOpacity={0.8}
                  name="Household"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Usage Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Current Usage Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={usageBySource}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}gal`}
                  >
                    {usageBySource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value} gallons`, 'Usage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Efficiency vs Soil Moisture */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Efficiency vs Soil Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateFormatted" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="efficiency" 
                  stroke="#8b5cf6" 
                  strokeWidth={3}
                  name="Efficiency %"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="soilMoisture" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  name="Soil Moisture %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Schedule Optimization */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Weekly Irrigation Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklySchedule}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value: any, name: string) => [
                  `${value} gallons`,
                  name === 'planned' ? 'Planned' : name === 'actual' ? 'Actual' : 'Optimal'
                ]} />
                <Bar dataKey="planned" fill="#94a3b8" name="planned" />
                <Bar dataKey="actual" fill="#3b82f6" name="actual" />
                <Bar dataKey="optimal" fill="#10b981" fillOpacity={0.7} name="optimal" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Cost Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💰 Annual Water Cost Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={monthlyWaterCosts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: any, name: string) => [
                `$${value}`,
                name === 'cost' ? 'Actual Cost' : name === 'budget' ? 'Budget' : 'Savings'
              ]} />
              <Bar dataKey="budget" fill="#e5e7eb" name="budget" />
              <Bar dataKey="cost" fill="#3b82f6" name="cost" />
              <Bar dataKey="savings" fill="#10b981" name="savings" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Efficiency Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            💡 Water Efficiency Action Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {efficiencyTips.map((tip, index) => (
              <div key={index} className="border rounded-lg p-4 bg-blue-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{tip.category}</h4>
                  <Badge className="bg-blue-100 text-blue-800">
                    {tip.potentialSavings} savings
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 mb-3">{tip.improvement}</p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    <span className="text-gray-600">{tip.implementation}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-blue-600" />
                    <span className="text-gray-600">Timeline: {tip.timeline}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-lg">💰</span>
                    <span className="font-medium text-gray-700">{tip.cost}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Metrics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { label: 'Daily Average', value: '1,240', unit: 'gal', icon: '💧', status: 'normal' },
          { label: 'This Week', value: '8,680', unit: 'gal', icon: '📊', status: 'high' },
          { label: 'Efficiency', value: efficiencyMetrics.current.toString(), unit: '%', icon: '⚡', status: 'good' },
          { label: 'Cost per Gallon', value: '$0.004', unit: '', icon: '💰', status: 'normal' },
          { label: 'Irrigation Hours', value: '28', unit: 'hrs', icon: '⏰', status: 'optimal' },
          { label: 'Soil Moisture', value: '32', unit: '%', icon: '🌱', status: 'good' }
        ].map((metric, index) => (
          <Card key={index} className="bg-white border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl mb-2">{metric.icon}</div>
                <div className="text-lg font-bold text-gray-900">{metric.value}</div>
                <div className="text-xs text-gray-600">{metric.label}</div>
                <div className="text-xs text-gray-500">{metric.unit}</div>
                <Badge className={`mt-2 ${
                  metric.status === 'optimal' ? 'bg-green-100 text-green-800' :
                  metric.status === 'good' ? 'bg-blue-100 text-blue-800' :
                  metric.status === 'normal' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`} >
                  {metric.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WaterUsageCharts;