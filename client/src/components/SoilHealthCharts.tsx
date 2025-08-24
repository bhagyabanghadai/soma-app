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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from "recharts";
import { TrendingUp, TrendingDown, Zap, Target, AlertTriangle, CheckCircle } from "lucide-react";

const SoilHealthCharts = () => {
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y'>('90d');
  const [historicalData, setHistoricalData] = useState<any[]>([]);

  // Generate realistic soil health trends
  useEffect(() => {
    const days = timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const data = Array.from({ length: Math.min(days, 30) }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (30 - 1 - i));
      
      // Simulate seasonal soil patterns
      const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
      const seasonalFactor = Math.sin((dayOfYear / 365) * 2 * Math.PI) * 0.2 + 0.8;
      
      return {
        date: date.toISOString().split('T')[0],
        dateFormatted: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        pH: Math.max(5.5, Math.min(8.0, 6.5 + Math.random() * 0.6 - 0.3)),
        nitrogen: Math.max(10, Math.min(50, 25 + seasonalFactor * 10 + Math.random() * 8 - 4)),
        phosphorus: Math.max(5, Math.min(30, 15 + seasonalFactor * 5 + Math.random() * 6 - 3)),
        potassium: Math.max(80, Math.min(200, 120 + seasonalFactor * 30 + Math.random() * 20 - 10)),
        organicMatter: Math.max(1.0, Math.min(6.0, 3.5 + seasonalFactor * 1.0 + Math.random() * 0.8 - 0.4)),
        soilHealth: Math.max(40, Math.min(95, 70 + seasonalFactor * 15 + Math.random() * 10 - 5)),
        microbialActivity: Math.max(30, Math.min(90, 60 + seasonalFactor * 20 + Math.random() * 12 - 6)),
        waterRetention: Math.max(15, Math.min(45, 25 + seasonalFactor * 8 + Math.random() * 6 - 3))
      };
    });
    setHistoricalData(data);
  }, [timeRange]);

  // Soil nutrient analysis radar chart data
  const currentNutrients = {
    pH: 6.8,
    nitrogen: 28,
    phosphorus: 18,
    potassium: 145,
    organicMatter: 4.2,
    microbialActivity: 75
  };

  const radarData = [
    { subject: 'pH Balance', A: (currentNutrients.pH / 8.0) * 100, B: 85, fullMark: 100 },
    { subject: 'Nitrogen', A: (currentNutrients.nitrogen / 50) * 100, B: 80, fullMark: 100 },
    { subject: 'Phosphorus', A: (currentNutrients.phosphorus / 30) * 100, B: 75, fullMark: 100 },
    { subject: 'Potassium', A: (currentNutrients.potassium / 200) * 100, B: 90, fullMark: 100 },
    { subject: 'Organic Matter', A: (currentNutrients.organicMatter / 6.0) * 100, B: 70, fullMark: 100 },
    { subject: 'Microbial Activity', A: currentNutrients.microbialActivity, B: 85, fullMark: 100 }
  ];

  // Soil improvement recommendations
  const recommendations = [
    {
      category: 'pH Management',
      action: 'Apply lime to raise pH to optimal 6.5-7.0 range',
      priority: 'Medium',
      impact: 'Improves nutrient availability by 15-20%',
      timeline: '2-3 months',
      cost: '$45/acre'
    },
    {
      category: 'Organic Matter',
      action: 'Add compost or cover crops to increase organic content',
      priority: 'High',
      impact: 'Boosts water retention and microbial activity',
      timeline: '6-12 months',
      cost: '$35/acre'
    },
    {
      category: 'Nitrogen',
      action: 'Reduce synthetic fertilizer, increase legume rotation',
      priority: 'Medium',
      impact: 'Sustainable nitrogen levels with cost savings',
      timeline: '1 growing season',
      cost: '-$25/acre (savings)'
    }
  ];

  // Soil health score calculation
  const calculateSoilHealthScore = () => {
    const scores = [
      Math.min(100, (currentNutrients.pH >= 6.0 && currentNutrients.pH <= 7.5) ? 90 : 60),
      Math.min(100, (currentNutrients.nitrogen / 50) * 100),
      Math.min(100, (currentNutrients.phosphorus / 30) * 100),
      Math.min(100, (currentNutrients.potassium / 200) * 100),
      Math.min(100, (currentNutrients.organicMatter / 6.0) * 100),
      currentNutrients.microbialActivity
    ];
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  const soilHealthScore = calculateSoilHealthScore();

  // Field comparison data
  const fieldComparison = [
    { field: 'North Field', soilHealth: 82, yield: 95, profitability: 88 },
    { field: 'South Field', soilHealth: 76, yield: 87, profitability: 82 },
    { field: 'East Field', soilHealth: 89, yield: 102, profitability: 96 },
    { field: 'West Field', soilHealth: 71, yield: 83, profitability: 78 }
  ];

  return (
    <div className="space-y-8">
      {/* Overall Soil Health Score */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-100">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Overall Soil Health</h2>
              <div className="text-6xl font-bold text-green-600 mb-4">{soilHealthScore}</div>
              <Badge className={
                soilHealthScore >= 85 ? "bg-green-100 text-green-800" :
                soilHealthScore >= 70 ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              }>
                {soilHealthScore >= 85 ? "Excellent" : soilHealthScore >= 70 ? "Good" : "Needs Improvement"}
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-8xl mb-4">🌱</div>
              <p className="text-sm text-gray-600">Based on 6 key indicators</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">Soil Health Trends</h3>
        <div className="flex gap-2">
          {(['30d', '90d', '1y'] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={timeRange === range ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
            </Button>
          ))}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nutrient Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Nutrient Level Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateFormatted" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="nitrogen" stroke="#16a34a" strokeWidth={2} name="Nitrogen" />
                <Line type="monotone" dataKey="phosphorus" stroke="#ea580c" strokeWidth={2} name="Phosphorus" />
                <Line type="monotone" dataKey="potassium" stroke="#7c3aed" strokeWidth={2} name="Potassium" />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Soil Health Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Nutrient Profile Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Current" dataKey="A" stroke="#16a34a" fill="#16a34a" fillOpacity={0.3} />
                <Radar name="Target" dataKey="B" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* pH and Organic Matter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              pH & Organic Matter Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dateFormatted" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Area 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="pH" 
                  stackId="1"
                  stroke="#8b5cf6" 
                  fill="#8b5cf6" 
                  fillOpacity={0.6}
                  name="pH Level"
                />
                <Area 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="organicMatter" 
                  stackId="2"
                  stroke="#059669" 
                  fill="#059669" 
                  fillOpacity={0.4}
                  name="Organic Matter %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Field Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Field Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fieldComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="field" />
                <YAxis />
                <Tooltip formatter={(value: any, name: string) => [`${value}%`, name]} />
                <Bar dataKey="soilHealth" fill="#16a34a" name="Soil Health" />
                <Bar dataKey="yield" fill="#2563eb" name="Yield Index" />
                <Bar dataKey="profitability" fill="#dc2626" name="Profitability" />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔬 Soil Improvement Action Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{rec.category}</h4>
                  <Badge className={
                    rec.priority === 'High' ? 'bg-red-100 text-red-800' :
                    rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }>
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 mb-3">{rec.action}</p>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-600" />
                    <span className="text-gray-600">{rec.impact}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-blue-600" />
                    <span className="text-gray-600">Timeline: {rec.timeline}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-lg">💰</span>
                    <span className={`font-medium ${rec.cost.includes('-') ? 'text-green-600' : 'text-gray-700'}`}>
                      {rec.cost}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Conditions Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'pH Level', value: currentNutrients.pH.toFixed(1), unit: '', status: 'good', icon: '⚖️' },
          { label: 'Nitrogen', value: currentNutrients.nitrogen.toFixed(0), unit: 'ppm', status: 'good', icon: '🌿' },
          { label: 'Phosphorus', value: currentNutrients.phosphorus.toFixed(0), unit: 'ppm', status: 'medium', icon: '🔥' },
          { label: 'Potassium', value: currentNutrients.potassium.toFixed(0), unit: 'ppm', status: 'good', icon: '⚡' },
          { label: 'Organic Matter', value: currentNutrients.organicMatter.toFixed(1), unit: '%', status: 'excellent', icon: '🍃' },
          { label: 'Microbial Activity', value: currentNutrients.microbialActivity.toFixed(0), unit: '%', status: 'good', icon: '🦠' }
        ].map((item, index) => (
          <Card key={index} className="bg-white border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-lg font-bold text-gray-900">{item.value}</div>
                <div className="text-xs text-gray-600">{item.label}</div>
                <div className="text-xs text-gray-500">{item.unit}</div>
                <Badge className={`mt-2 ${
                  item.status === 'excellent' ? 'bg-green-100 text-green-800' :
                  item.status === 'good' ? 'bg-blue-100 text-blue-800' :
                  item.status === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`} size="sm">
                  {item.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SoilHealthCharts;