import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertTriangle, 
  CheckCircle, 
  Thermometer, 
  Droplets, 
  Wind, 
  Leaf, 
  Bell, 
  X, 
  Eye,
  EyeOff 
} from 'lucide-react';

interface AlertData {
  id: string;
  type: 'warning' | 'error' | 'success' | 'info';
  category: 'weather' | 'soil' | 'air-quality' | 'irrigation' | 'general';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dismissed: boolean;
  actionable: boolean;
  recommendations?: string[];
}

interface EnvironmentalAlertsProps {
  earthData?: any;
  weatherData?: any;
  airQualityData?: any;
  location?: {
    latitude: number;
    longitude: number;
    locationName?: string;
  };
}

const EnvironmentalAlerts: React.FC<EnvironmentalAlertsProps> = ({
  earthData,
  weatherData,
  airQualityData,
  location
}) => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [showDismissed, setShowDismissed] = useState(false);

  // Generate alerts based on environmental data
  useEffect(() => {
    const newAlerts: AlertData[] = [];

    // Soil/Vegetation Alerts
    if (earthData) {
      if (earthData.ndvi < 0.3) {
        newAlerts.push({
          id: `soil-ndvi-${Date.now()}`,
          type: 'error',
          category: 'soil',
          title: 'Low Vegetation Health',
          message: `NDVI reading of ${earthData.ndvi.toFixed(3)} indicates poor vegetation health. Immediate attention required.`,
          timestamp: new Date(),
          priority: 'high',
          dismissed: false,
          actionable: true,
          recommendations: [
            'Test soil pH and nutrient levels',
            'Apply appropriate fertilizers based on soil test',
            'Consider cover cropping for soil improvement',
            'Check irrigation system for proper functioning'
          ]
        });
      }

      if (earthData.droughtRisk === 'High') {
        newAlerts.push({
          id: `drought-${Date.now()}`,
          type: 'warning',
          category: 'irrigation',
          title: 'High Drought Risk',
          message: 'Current conditions indicate high drought risk. Water management is critical.',
          timestamp: new Date(),
          priority: 'high',
          dismissed: false,
          actionable: true,
          recommendations: [
            'Increase irrigation frequency',
            'Monitor soil moisture levels daily',
            'Consider drought-resistant crop varieties',
            'Implement water conservation techniques'
          ]
        });
      }

      if (earthData.landSurfaceTemperature > 40) {
        newAlerts.push({
          id: `temp-high-${Date.now()}`,
          type: 'warning',
          category: 'weather',
          title: 'Extreme Surface Temperature',
          message: `Land surface temperature of ${earthData.landSurfaceTemperature.toFixed(1)}°C is extremely high.`,
          timestamp: new Date(),
          priority: 'medium',
          dismissed: false,
          actionable: true,
          recommendations: [
            'Schedule irrigation for early morning or evening',
            'Provide shade for sensitive crops',
            'Monitor plants for heat stress symptoms'
          ]
        });
      }

      if (earthData.evapotranspiration > 8) {
        newAlerts.push({
          id: `et-high-${Date.now()}`,
          type: 'info',
          category: 'irrigation',
          title: 'High Water Loss',
          message: `Evapotranspiration rate of ${earthData.evapotranspiration.toFixed(1)} mm/day indicates high water loss.`,
          timestamp: new Date(),
          priority: 'medium',
          dismissed: false,
          actionable: true,
          recommendations: [
            'Adjust irrigation schedule to compensate',
            'Consider mulching to reduce evaporation',
            'Check irrigation efficiency'
          ]
        });
      }
    }

    // Weather Alerts
    if (weatherData) {
      if (weatherData.current.temperature < 0) {
        newAlerts.push({
          id: `freeze-warning-${Date.now()}`,
          type: 'error',
          category: 'weather',
          title: 'Freeze Warning',
          message: `Temperature has dropped to ${weatherData.current.temperature}°C. Protect sensitive crops.`,
          timestamp: new Date(),
          priority: 'critical',
          dismissed: false,
          actionable: true,
          recommendations: [
            'Cover sensitive plants with frost cloth',
            'Run sprinklers if available (ice formation provides insulation)',
            'Harvest ready crops before damage occurs',
            'Check heating systems for greenhouse operations'
          ]
        });
      }

      if (weatherData.current.conditions.toLowerCase().includes('storm')) {
        newAlerts.push({
          id: `storm-warning-${Date.now()}`,
          type: 'warning',
          category: 'weather',
          title: 'Storm Warning',
          message: 'Severe weather conditions detected. Take protective measures.',
          timestamp: new Date(),
          priority: 'high',
          dismissed: false,
          actionable: true,
          recommendations: [
            'Secure loose equipment and materials',
            'Protect livestock in sheltered areas',
            'Check drainage systems',
            'Monitor for flooding risks'
          ]
        });
      }
    }

    // Air Quality Alerts
    if (airQualityData) {
      if (airQualityData.aqi > 150) {
        newAlerts.push({
          id: `aqi-unhealthy-${Date.now()}`,
          type: 'error',
          category: 'air-quality',
          title: 'Unhealthy Air Quality',
          message: `AQI of ${airQualityData.aqi} is unhealthy. Limit outdoor activities.`,
          timestamp: new Date(),
          priority: 'medium',
          dismissed: false,
          actionable: true,
          recommendations: [
            'Limit outdoor fieldwork during peak pollution hours',
            'Use protective equipment when working outside',
            'Monitor sensitive crops for air pollution damage',
            'Consider delaying non-essential outdoor activities'
          ]
        });
      } else if (airQualityData.aqi > 100) {
        newAlerts.push({
          id: `aqi-sensitive-${Date.now()}`,
          type: 'warning',
          category: 'air-quality',
          title: 'Air Quality Advisory',
          message: `AQI of ${airQualityData.aqi} may affect sensitive individuals.`,
          timestamp: new Date(),
          priority: 'low',
          dismissed: false,
          actionable: false
        });
      }
    }

    // Success alerts
    if (earthData && earthData.ndvi > 0.7 && earthData.vegetationStatus === 'Good') {
      newAlerts.push({
        id: `health-good-${Date.now()}`,
        type: 'success',
        category: 'soil',
        title: 'Excellent Crop Health',
        message: `NDVI of ${earthData.ndvi.toFixed(3)} indicates excellent vegetation health.`,
        timestamp: new Date(),
        priority: 'low',
        dismissed: false,
        actionable: false
      });
    }

    // Only add alerts that aren't already present
    setAlerts(currentAlerts => {
      const existingIds = new Set(currentAlerts.map(alert => alert.id.split('-')[0]));
      const filteredNewAlerts = newAlerts.filter(alert => 
        !existingIds.has(alert.id.split('-')[0])
      );
      return [...currentAlerts, ...filteredNewAlerts].slice(-10); // Keep last 10 alerts
    });

  }, [earthData, weatherData, airQualityData]);

  const dismissAlert = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, dismissed: true } : alert
    ));
  };

  const clearAllAlerts = () => {
    setAlerts(alerts.map(alert => ({ ...alert, dismissed: true })));
  };

  const getAlertIcon = (type: string, category: string) => {
    if (type === 'success') return <CheckCircle className="w-5 h-5 text-green-500" />;
    if (type === 'error') return <AlertTriangle className="w-5 h-5 text-red-500" />;
    if (type === 'warning') return <AlertTriangle className="w-5 h-5 text-yellow-500" />;

    switch (category) {
      case 'weather': return <Thermometer className="w-5 h-5 text-blue-500" />;
      case 'soil': return <Leaf className="w-5 h-5 text-green-500" />;
      case 'air-quality': return <Wind className="w-5 h-5 text-purple-500" />;
      case 'irrigation': return <Droplets className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAlertColor = (type: string, priority: string) => {
    if (priority === 'critical') return 'border-red-500 bg-red-50';
    if (type === 'error') return 'border-red-300 bg-red-50';
    if (type === 'warning') return 'border-yellow-300 bg-yellow-50';
    if (type === 'success') return 'border-green-300 bg-green-50';
    return 'border-blue-300 bg-blue-50';
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    
    return (
      <Badge className={colors[priority as keyof typeof colors]}>
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const visibleAlerts = showDismissed ? alerts : alerts.filter(alert => !alert.dismissed);
  const activeAlerts = alerts.filter(alert => !alert.dismissed);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-500" />
              Environmental Alerts
              {activeAlerts.length > 0 && (
                <Badge variant="destructive">{activeAlerts.length}</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDismissed(!showDismissed)}
                className="flex items-center gap-1"
                data-testid="button-toggle-dismissed"
              >
                {showDismissed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showDismissed ? 'Hide' : 'Show'} Dismissed
              </Button>
              {activeAlerts.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllAlerts}
                  data-testid="button-clear-alerts"
                >
                  Clear All
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {visibleAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p>No active alerts. All systems are operating normally.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {visibleAlerts
                .sort((a, b) => {
                  const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                  return priorityOrder[b.priority as keyof typeof priorityOrder] - 
                         priorityOrder[a.priority as keyof typeof priorityOrder];
                })
                .map((alert) => (
                  <Alert key={alert.id} className={`${getAlertColor(alert.type, alert.priority)} ${alert.dismissed ? 'opacity-60' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        {getAlertIcon(alert.type, alert.category)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm">{alert.title}</h4>
                            {getPriorityBadge(alert.priority)}
                          </div>
                          <AlertDescription className="text-sm mb-2">
                            {alert.message}
                          </AlertDescription>
                          <div className="text-xs text-gray-500">
                            {alert.timestamp.toLocaleString()}
                          </div>
                          
                          {alert.recommendations && alert.recommendations.length > 0 && (
                            <div className="mt-3">
                              <h5 className="text-xs font-medium text-gray-700 mb-1">Recommended Actions:</h5>
                              <ul className="text-xs text-gray-600 space-y-1">
                                {alert.recommendations.map((rec, index) => (
                                  <li key={index} className="flex items-start gap-1">
                                    <span>•</span>
                                    <span>{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {!alert.dismissed && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissAlert(alert.id)}
                          className="text-gray-500 hover:text-gray-700 p-1"
                          data-testid={`button-dismiss-alert-${alert.id}`}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </Alert>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnvironmentalAlerts;