import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { TrendingUp, Leaf, Target, Award } from "lucide-react";

const RegenerativePracticesCharts = () => {
  // Historical impact data
  const practiceImpactData = [
    { month: 'Jan', soilHealth: 65, carbonSequestration: 12, biodiversity: 58, waterRetention: 45 },
    { month: 'Feb', soilHealth: 67, carbonSequestration: 14, biodiversity: 62, waterRetention: 48 },
    { month: 'Mar', soilHealth: 72, carbonSequestration: 18, biodiversity: 68, waterRetention: 55 },
    { month: 'Apr', soilHealth: 75, carbonSequestration: 22, biodiversity: 72, waterRetention: 62 },
    { month: 'May', soilHealth: 78, carbonSequestration: 26, biodiversity: 75, waterRetention: 68 },
    { month: 'Jun', soilHealth: 82, carbonSequestration: 30, biodiversity: 78, waterRetention: 75 },
    { month: 'Jul', soilHealth: 85, carbonSequestration: 34, biodiversity: 82, waterRetention: 80 },
    { month: 'Aug', soilHealth: 87, carbonSequestration: 36, biodiversity: 85, waterRetention: 83 },
    { month: 'Sep', soilHealth: 89, carbonSequestration: 38, biodiversity: 87, waterRetention: 85 },
    { month: 'Oct', soilHealth: 91, carbonSequestration: 40, biodiversity: 89, waterRetention: 87 },
    { month: 'Nov', soilHealth: 92, carbonSequestration: 42, biodiversity: 90, waterRetention: 88 },
    { month: 'Dec', soilHealth: 94, carbonSequestration: 44, biodiversity: 92, waterRetention: 90 }
  ];

  // Practice adoption timeline
  const adoptionTimeline = [
    { practice: 'Cover Crops', year2022: 20, year2023: 45, year2024: 85, target: 90 },
    { practice: 'No-Till', year2022: 0, year2023: 25, year2024: 60, target: 80 },
    { practice: 'Crop Rotation', year2022: 60, year2023: 75, year2024: 90, target: 95 },
    { practice: 'Composting', year2022: 10, year2023: 30, year2024: 70, target: 85 },
    { practice: 'Precision Irrigation', year2022: 0, year2023: 0, year2024: 40, target: 75 }
  ];

  // Economic impact
  const economicImpact = [
    { metric: 'Yield Increase', baseline: 100, current: 115, potential: 125 },
    { metric: 'Input Cost Reduction', baseline: 100, current: 85, potential: 70 },
    { metric: 'Soil Health Premium', baseline: 100, current: 110, potential: 120 },
    { metric: 'Carbon Credits', baseline: 100, current: 150, potential: 200 },
    { metric: 'Water Efficiency', baseline: 100, current: 120, potential: 140 }
  ];

  // Sustainability radar data
  const sustainabilityRadar = [
    { subject: 'Soil Health', A: 92, B: 95, fullMark: 100 },
    { subject: 'Carbon Sequestration', A: 78, B: 90, fullMark: 100 },
    { subject: 'Biodiversity', A: 85, B: 90, fullMark: 100 },
    { subject: 'Water Conservation', A: 88, B: 95, fullMark: 100 },
    { subject: 'Energy Efficiency', A: 72, B: 85, fullMark: 100 },
    { subject: 'Economic Viability', A: 89, B: 92, fullMark: 100 }
  ];

  // Practice effectiveness comparison
  const practiceEffectiveness = [
    { practice: 'Cover Crops', implementation: 85, soilImpact: 90, carbonImpact: 75, costEffectiveness: 95 },
    { practice: 'No-Till', implementation: 60, soilImpact: 85, carbonImpact: 80, costEffectiveness: 88 },
    { practice: 'Crop Rotation', implementation: 90, soilImpact: 70, carbonImpact: 65, costEffectiveness: 92 },
    { practice: 'Composting', implementation: 70, soilImpact: 95, carbonImpact: 85, costEffectiveness: 78 },
    { practice: 'Precision Irrigation', implementation: 40, soilImpact: 60, carbonImpact: 70, costEffectiveness: 65 }
  ];

  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700">Overall Sustainability</p>
                <p className="text-3xl font-bold text-green-900">94%</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+12% this year</span>
                </div>
              </div>
              <Leaf className="w-12 h-12 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700">Carbon Sequestered</p>
                <p className="text-3xl font-bold text-blue-900">44t</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-600">+267% this year</span>
                </div>
              </div>
              <div className="text-3xl">🌱</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700">Practices Active</p>
                <p className="text-3xl font-bold text-purple-900">5/6</p>
                <div className="flex items-center gap-1 mt-1">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span className="text-sm text-purple-600">83% coverage</span>
                </div>
              </div>
              <div className="text-3xl">⚡</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-700">ROI Improvement</p>
                <p className="text-3xl font-bold text-orange-900">+18%</p>
                <div className="flex items-center gap-1 mt-1">
                  <Award className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-orange-600">Above target</span>
                </div>
              </div>
              <div className="text-3xl">💰</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Impact Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Regenerative Impact Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={practiceImpactData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="soilHealth" stroke="#16a34a" strokeWidth={2} name="Soil Health" />
                <Line type="monotone" dataKey="carbonSequestration" stroke="#2563eb" strokeWidth={2} name="Carbon Sequestration" />
                <Line type="monotone" dataKey="biodiversity" stroke="#7c3aed" strokeWidth={2} name="Biodiversity" />
                <Line type="monotone" dataKey="waterRetention" stroke="#06b6d4" strokeWidth={2} name="Water Retention" />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sustainability Radar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Sustainability Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={sustainabilityRadar}>
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

        {/* Practice Adoption Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-purple-600" />
              Practice Adoption Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={adoptionTimeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="practice" />
                <YAxis />
                <Tooltip formatter={(value: any, name: string) => [
                  `${value}%`,
                  name === 'year2022' ? '2022' : name === 'year2023' ? '2023' : name === 'year2024' ? '2024' : 'Target'
                ]} />
                <Bar dataKey="year2022" fill="#94a3b8" name="year2022" />
                <Bar dataKey="year2023" fill="#64748b" name="year2023" />
                <Bar dataKey="year2024" fill="#16a34a" name="year2024" />
                <Bar dataKey="target" fill="#22c55e" fillOpacity={0.6} name="target" />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Economic Impact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💰 Economic Impact Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={economicImpact} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="metric" type="category" width={120} />
                <Tooltip formatter={(value: any, name: string) => [
                  `${value}%`,
                  name === 'baseline' ? 'Baseline' : name === 'current' ? 'Current' : 'Potential'
                ]} />
                <Bar dataKey="baseline" fill="#e5e7eb" name="baseline" />
                <Bar dataKey="current" fill="#3b82f6" name="current" />
                <Bar dataKey="potential" fill="#10b981" name="potential" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Practice Effectiveness Heatmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🔥 Practice Effectiveness Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {practiceEffectiveness.map((practice, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{practice.practice}</h4>
                  <Badge className={
                    practice.implementation >= 80 ? 'bg-green-100 text-green-800' :
                    practice.implementation >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }>
                    {practice.implementation}% Implemented
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Soil Impact</span>
                      <span className="font-medium">{practice.soilImpact}%</span>
                    </div>
                    <Progress value={practice.soilImpact} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Carbon Impact</span>
                      <span className="font-medium">{practice.carbonImpact}%</span>
                    </div>
                    <Progress value={practice.carbonImpact} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cost Effectiveness</span>
                      <span className="font-medium">{practice.costEffectiveness}%</span>
                    </div>
                    <Progress value={practice.costEffectiveness} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏆 Sustainability Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Carbon Neutral Farming',
                description: 'Achieved net-zero carbon emissions through regenerative practices',
                progress: 94,
                badge: 'Almost There!',
                color: 'green'
              },
              {
                title: 'Soil Health Excellence',
                description: 'Soil organic matter increased by 40% over two years',
                progress: 100,
                badge: 'Completed',
                color: 'green'
              },
              {
                title: 'Water Conservation Leader',
                description: 'Reduced water usage by 30% while maintaining yield',
                progress: 85,
                badge: 'In Progress',
                color: 'blue'
              },
              {
                title: 'Biodiversity Champion',
                description: 'Increased beneficial insect populations by 150%',
                progress: 78,
                badge: 'On Track',
                color: 'purple'
              },
              {
                title: 'Zero-Till Pioneer',
                description: 'Transitioned 60% of farmland to no-till practices',
                progress: 60,
                badge: 'Progressing',
                color: 'yellow'
              },
              {
                title: 'Cover Crop Master',
                description: 'Implemented cover crops on 85% of fields',
                progress: 85,
                badge: 'Nearly Done',
                color: 'green'
              }
            ].map((achievement, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                  <Badge className={`bg-${achievement.color}-100 text-${achievement.color}-800`}>
                    {achievement.badge}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 mb-3">{achievement.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{achievement.progress}%</span>
                  </div>
                  <Progress value={achievement.progress} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegenerativePracticesCharts;