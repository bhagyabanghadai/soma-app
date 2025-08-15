import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Leaf, Thermometer, Droplets, Wind } from 'lucide-react';

interface AnalyticsProps {
  earthData?: any;
  weatherData?: any;
  airQualityData?: any;
  historicalData?: any[];
}

const EnvironmentalAnalytics: React.FC<AnalyticsProps> = ({
  earthData,
  weatherData,
  airQualityData,
  historicalData = []
}) => {
  // Generate trend data for visualization
  const generateTrendData = () => {
    const now = Date.now();
    const data = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      data.push({
        date: date.toISOString().split('T')[0],
        ndvi: earthData ? earthData.ndvi + (Math.random() - 0.5) * 0.1 : Math.random() * 0.8 + 0.2,
        temperature: weatherData ? weatherData.current.temperature + (Math.random() - 0.5) * 10 : Math.random() * 20 + 15,
        aqi: airQualityData ? airQualityData.aqi + (Math.random() - 0.5) * 20 : Math.random() * 100 + 50,
        soilMoisture: Math.random() * 40 + 30,
        evapotranspiration: earthData ? earthData.evapotranspiration + (Math.random() - 0.5) * 2 : Math.random() * 8 + 2
      });
    }
    
    return data;
  };

  const trendData = generateTrendData();

  const calculateHealthScore = () => {
    let score = 100;
    let factors = [];

    if (earthData) {
      const ndviScore = earthData.ndvi * 100;
      score = (score + ndviScore) / 2;
      
      if (earthData.vegetationStatus === 'Poor') {
        score -= 20;
        factors.push('Low vegetation health');
      }
      
      if (earthData.droughtRisk === 'High') {
        score -= 15;
        factors.push('High drought risk');
      }
    }

    if (airQualityData) {
      const aqiScore = Math.max(0, 100 - airQualityData.aqi);
      score = (score + aqiScore) / 2;
      
      if (airQualityData.aqi > 100) {
        factors.push('Poor air quality');
      }
    }

    return {
      score: Math.max(0, Math.min(100, Math.round(score))),
      factors
    };
  };

  const healthScore = calculateHealthScore();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (score >= 40) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="space-y-6">
      {/* Overall Health Score */}
      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              Farm Environmental Health Score
            </span>
            <Badge className={getScoreBadgeColor(healthScore.score)}>
              {getScoreBadge(healthScore.score)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(healthScore.score)}`}>
                {healthScore.score}/100
              </div>
              <Progress value={healthScore.score} className="mt-2" />
            </div>
            
            {healthScore.factors.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Areas for improvement:</h4>
                <div className="space-y-1">
                  {healthScore.factors.map((factor, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-600">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Environmental Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NDVI Trend */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <TrendingUp className="w-5 h-5" />
              Vegetation Health Trend (NDVI)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={trendData.slice(-7)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [value.toFixed(3), 'NDVI']}
                />
                <Area type="monotone" dataKey="ndvi" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Temperature & AQI */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <Thermometer className="w-5 h-5" />
              Temperature & Air Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData.slice(-7)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis yAxisId="temp" />
                <YAxis yAxisId="aqi" orientation="right" />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number, name: string) => [
                    name === 'temperature' ? `${value.toFixed(1)}°C` : value.toFixed(0),
                    name === 'temperature' ? 'Temperature' : 'AQI'
                  ]}
                />
                <Line yAxisId="temp" type="monotone" dataKey="temperature" stroke="#ef4444" strokeWidth={2} />
                <Line yAxisId="aqi" type="monotone" dataKey="aqi" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {earthData && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Droplets className="w-4 h-4 text-blue-500" />
                Evapotranspiration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {earthData.evapotranspiration.toFixed(1)} mm/day
              </div>
              <p className="text-sm text-gray-600 mt-1">Water loss from soil and plants</p>
            </CardContent>
          </Card>
        )}

        {earthData && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Thermometer className="w-4 h-4 text-red-500" />
                Land Surface Temp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {earthData.landSurfaceTemperature.toFixed(1)}°C
              </div>
              <p className="text-sm text-gray-600 mt-1">Ground temperature reading</p>
            </CardContent>
          </Card>
        )}

        {airQualityData && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Wind className="w-4 h-4 text-purple-500" />
                Air Quality Index
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {airQualityData.aqi}
              </div>
              <p className="text-sm text-gray-600 mt-1">{airQualityData.status}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Monthly Summary Bar Chart */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <BarChart className="w-5 h-5" />
            30-Day Environmental Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendData.slice(-30).filter((_, index) => index % 3 === 0)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value: number, name: string) => [
                  name === 'soilMoisture' ? `${value.toFixed(1)}%` : value.toFixed(2),
                  name === 'soilMoisture' ? 'Soil Moisture' : 'NDVI'
                ]}
              />
              <Bar dataKey="soilMoisture" fill="#3b82f6" name="soilMoisture" />
              <Bar dataKey="ndvi" fill="#10b981" name="ndvi" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentalAnalytics;