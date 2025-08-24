import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LocationSearch } from "@/components/LocationSearch";
import EnvironmentalAnalytics from "@/components/EnvironmentalAnalytics";
import EnvironmentalAlerts from "@/components/EnvironmentalAlerts";
import FarmProfileManager from "@/components/FarmProfileManager";
import StunningImageCard from "@/components/StunningImageCard";
import DashboardCharts from "@/components/DashboardCharts";
import { 
  Loader2, 
  Navigation, 
  MapPin, 
  Leaf, 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  MessageCircle,
  Cloud,
  Sun,
  AlertTriangle,
  CheckCircle,
  Settings,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";



interface LocationData {
  latitude: number;
  longitude: number;
  locationName?: string;
}

interface EarthData {
  ndvi: number;
  landSurfaceTemperature: number;
  evapotranspiration: number;
  vegetationStatus: string;
  temperatureStatus: string;
  droughtRisk: string;
}

interface WeatherData {
  current: {
    temperature: number;
    temperatureUnit: string;
    conditions: string;
    windSpeed: string;
    windDirection: string;
  };
  forecast: Array<{
    name: string;
    temperature: number;
    temperatureUnit: string;
    conditions: string;
    isDaytime: boolean;
  }>;
}

interface AirQualityData {
  aqi: number;
  status: string;
  level: string;
  mainPollutant: string;
  location: string;
}

const SustainabilityDashboard = () => {
  const [location, setLocationState] = useState<LocationData>({ latitude: 0, longitude: 0 });
  const [locationInput, setLocationInput] = useState({ lat: "", lon: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [earthData, setEarthData] = useState<EarthData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);

  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [farmProfile, setFarmProfile] = useState<any>(null);

  const { toast } = useToast();

  // Custom location setter that also saves to localStorage
  const setLocation = (newLocation: LocationData) => {
    setLocationState(newLocation);
    localStorage.setItem('soma-dashboard-location', JSON.stringify(newLocation));
    

    
    // Clear existing data to force refresh
    setEarthData(null);
    setWeatherData(null);
    setAirQualityData(null);
  };

  const presetLocations = [
    { name: "Iowa Corn Belt", lat: 42.0308, lon: -93.6319 },
    { name: "California Central Valley", lat: 36.7783, lon: -119.4179 },
    { name: "Nebraska Farmland", lat: 41.4925, lon: -99.9018 },
    { name: "Kansas Wheat Fields", lat: 38.5267, lon: -96.7265 },
    { name: "Texas Panhandle", lat: 35.2211, lon: -101.8313 },
  ];



  const getCurrentLocation = () => {
    setGeoLoading(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
      setGeoLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        
        setLocation({ latitude: lat, longitude: lon, locationName: "Current Location" });
        setLocationInput({ lat: lat.toString(), lon: lon.toString(), name: "Current Location" });
        
        toast({
          title: "Location detected",
          description: `Loading environmental data for your location`,
        });
        
        setGeoLoading(false);
        await loadAllData(lat, lon);
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          title: "Location access denied",
          description: "Please enter coordinates manually or select a preset location",
          variant: "destructive",
        });
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  const handleManualLocation = async () => {
    if (!locationInput.lat || !locationInput.lon) {
      toast({
        title: "Missing coordinates",
        description: "Please enter both latitude and longitude",
        variant: "destructive",
      });
      return;
    }

    const lat = parseFloat(locationInput.lat);
    const lon = parseFloat(locationInput.lon);
    
    if (isNaN(lat) || isNaN(lon)) {
      toast({
        title: "Invalid coordinates",
        description: "Please enter valid numeric coordinates",
        variant: "destructive",
      });
      return;
    }

    setLocation({ latitude: lat, longitude: lon, locationName: locationInput.name || "Custom Location" });
    await loadAllData(lat, lon);
  };

  const handlePresetLocation = async (preset: { lat: number; lon: number; name: string }) => {
    setLocation({ latitude: preset.lat, longitude: preset.lon, locationName: preset.name });
    setLocationInput({ lat: preset.lat.toString(), lon: preset.lon.toString(), name: preset.name });
    await loadAllData(preset.lat, preset.lon);
  };

  const loadAllData = async (lat: number, lon: number) => {

    setLoading(true);
    
    try {
      // Load all environmental data in parallel
      const [earthResponse, weatherResponse, airQualityResponse] = await Promise.allSettled([
        fetch(`/api/nasa/earthdata?lat=${lat}&lon=${lon}`),
        fetch(`/api/weather?lat=${lat}&lon=${lon}`),
        fetch(`/api/air-quality?lat=${lat}&lon=${lon}`)
      ]);

      // Process Earth Data
      if (earthResponse.status === 'fulfilled' && earthResponse.value.ok) {
        const earthResult = await earthResponse.value.json();
        setEarthData(earthResult);
      }

      // Process Weather Data
      if (weatherResponse.status === 'fulfilled' && weatherResponse.value.ok) {
        const weatherResult = await weatherResponse.value.json();
        setWeatherData(weatherResult);
      }

      // Process Air Quality Data
      if (airQualityResponse.status === 'fulfilled' && airQualityResponse.value.ok) {
        const airQualityResult = await airQualityResponse.value.json();
        setAirQualityData(airQualityResult);
      }

      toast({
        title: "Dashboard updated",
        description: "Environmental data loaded successfully",
      });

    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast({
        title: "Data loading error",
        description: "Some environmental data may be unavailable",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('excellent') || statusLower.includes('good')) return 'bg-green-100 text-green-800';
    if (statusLower.includes('moderate')) return 'bg-yellow-100 text-yellow-800';
    if (statusLower.includes('poor') || statusLower.includes('high')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getAQIColor = (level: string) => {
    switch (level) {
      case "good": return "bg-green-100 text-green-800 border-green-200";
      case "moderate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "unhealthy-sensitive": return "bg-orange-100 text-orange-800 border-orange-200";
      case "unhealthy": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAIInsights = () => {
    if (!earthData && !weatherData && !airQualityData) return [];

    const insights = [];
    
    if (earthData) {
      if (earthData.vegetationStatus === 'Poor' || earthData.vegetationStatus === 'Very Poor') {
        insights.push("Your vegetation index is low. Consider applying organic fertilizer or adjusting irrigation.");
      }
      if (earthData.droughtRisk === 'High') {
        insights.push("High drought risk detected. Increase irrigation frequency and monitor soil moisture.");
      }
      if (earthData.landSurfaceTemperature > 35) {
        insights.push("Surface temperature is very high. Schedule irrigation for early morning or evening.");
      }
    }

    if (airQualityData && airQualityData.level !== 'good') {
      insights.push("Air quality is not optimal. Consider limiting outdoor work during peak pollution hours.");
    }

    if (weatherData && weatherData.current.conditions.toLowerCase().includes('rain')) {
      insights.push("Rain expected. Adjust irrigation schedule and protect sensitive crops.");
    }

    if (insights.length === 0) {
      insights.push("Conditions look favorable for farming operations. Continue monitoring environmental factors.");
    }

    return insights;
  };

  // Load default location and farm profile on component mount
  useEffect(() => {
    // Default to Iowa Corn Belt if no location is set
    if (location.latitude === 0 && location.longitude === 0) {
      handlePresetLocation(presetLocations[0]);
    }
    
    // Load farm profile
    const stored = localStorage.getItem('soma-farm-profile');
    if (stored) {
      try {
        setFarmProfile(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading farm profile:', error);
      }
    }
  }, []);

  const handleProfileUpdate = (profile: any) => {
    setFarmProfile(profile);
    if (profile.location?.coordinates) {
      setLocation({
        latitude: profile.location.coordinates.lat,
        longitude: profile.location.coordinates.lon,
        locationName: profile.location.address
      });
      loadAllData(profile.location.coordinates.lat, profile.location.coordinates.lon);
    }
  };

  return (
    <div className="min-h-screen parallax-bg py-8 fade-in relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-yellow-500/20 to-green-500/20 floating-card"></div>
        <div className="absolute top-40 right-20 w-24 h-24 rounded-full bg-gradient-to-r from-orange-400/20 to-yellow-400/20 floating-card" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-20 w-20 h-20 rounded-full bg-gradient-to-r from-green-400/20 to-emerald-400/20 floating-card" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400/20 to-orange-400/20 floating-card" style={{ animationDelay: '6s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header */}
        <div className="mb-8 text-center">
          <div className="glass-morphism rounded-2xl p-8 mb-6 scale-on-hover">
            <h1 className="text-6xl font-bold gradient-text mb-4 rotate-in">🌱 SOMA Dashboard</h1>
            <p className="text-xl text-gray-800 mb-6 font-semibold">
              ✨ Real-time environmental insights for {location.locationName || 'your farm'}
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => setShowProfileManager(!showProfileManager)}
                className="glass-morphism scale-on-hover neon-glow flex items-center gap-2 text-gray-800 border-green-600/50 hover:bg-yellow-100/20 font-semibold"
                data-testid="button-farm-profile"
                size="lg"
              >
                <Settings className="w-5 h-5" />
                🏡 Farm Profile
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="glass-morphism scale-on-hover neon-glow flex items-center gap-2 text-gray-800 border-green-600/50 hover:bg-yellow-100/20 font-semibold"
                data-testid="button-analytics"
                size="lg"
              >
                <BarChart3 className="w-5 h-5" />
                📊 Analytics
              </Button>
            </div>
          </div>
        </div>



        {/* Critical Alert Banner */}
        {(() => {
          const criticalAlerts = [];
          
          // Weather-based alerts
          if (weatherData?.current?.temperature && weatherData.current.temperature < 2) {
            criticalAlerts.push({
              type: 'critical',
              title: 'Frost Warning Tonight',
              message: 'Temperature dropping below freezing - protect sensitive crops',
              action: 'Cover plants or harvest immediately'
            });
          }
          
          if (airQualityData?.aqi && airQualityData.aqi > 150) {
            criticalAlerts.push({
              type: 'warning',
              title: 'Air Quality Alert',
              message: 'Unhealthy air quality detected',
              action: 'Limit outdoor work and monitor worker health'
            });
          }
          
          if (earthData?.droughtRisk === 'High') {
            criticalAlerts.push({
              type: 'opportunity',
              title: 'High Drought Risk',
              message: 'Increase irrigation frequency',
              action: 'Activate water conservation measures'
            });
          }

          return criticalAlerts.length > 0 && (
            <div className="mb-6 space-y-2">
              {criticalAlerts.map((alert, index) => (
                <Card key={index} className={`border-l-4 card-3d floating-card ${
                  alert.type === 'critical' ? 'border-l-red-500 bg-red-50 neon-glow' :
                  alert.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
                  'border-l-blue-500 bg-blue-50'
                }`} style={{ animationDelay: `${index * 0.2}s` }}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                        <p className="text-sm text-gray-700 mb-1">{alert.message}</p>
                        <p className="text-sm font-medium text-gray-900">{alert.action}</p>
                      </div>
                      <Button variant="outline" size="sm">Dismiss</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          );
        })()}

        {/* Location Intelligence Hub */}
        <Card className="mb-8 card-3d floating-card holographic">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <span>Farm Location Intelligence</span>
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Multi-modal location selection with field-specific insights
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Location Search with Autocomplete Dropdown */}
              <div>
                <Label htmlFor="location-search" className="text-sm font-medium">Search for your farm location</Label>
                <LocationSearch
                  onLocationSelect={(lat, lon, locationName) => {
                    setLocation({ latitude: lat, longitude: lon, locationName });
                    setLocationInput({ lat: lat.toString(), lon: lon.toString(), name: locationName });
                    loadAllData(lat, lon);
                  }}
                  placeholder="Start typing a city, farm name, or address..."
                  className="mt-1"
                />
              </div>

              {/* Alternative Methods */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* GPS Location */}
                <Button
                  onClick={getCurrentLocation}
                  disabled={geoLoading || loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {geoLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Detecting...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 mr-2" />
                      Use My GPS Location
                    </>
                  )}
                </Button>

                {/* Manual Coordinates */}
                <div className="flex space-x-2">
                  <Input
                    type="number"
                    placeholder="Latitude"
                    value={locationInput.lat}
                    onChange={(e) => setLocationInput(prev => ({ ...prev, lat: e.target.value }))}
                    className="flex-1 text-sm"
                  />
                  <Input
                    type="number"
                    placeholder="Longitude"
                    value={locationInput.lon}
                    onChange={(e) => setLocationInput(prev => ({ ...prev, lon: e.target.value }))}
                    className="flex-1 text-sm"
                  />
                  <Button onClick={handleManualLocation} variant="outline" disabled={loading} size="sm">
                    Load
                  </Button>
                </div>
              </div>

              {/* Current Location Display */}
              {location.latitude !== 0 && location.longitude !== 0 && (
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <div className="text-sm">
                      <span className="font-medium text-green-800">Current Location: </span>
                      <span className="text-green-700">
                        {location.locationName || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Environmental Data */}
          <div className="lg:col-span-2 space-y-6">
            {/* Environmental Summary */}
            <Card className="card-3d floating-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Leaf className="w-5 h-5 text-green-600" />
                  <span>Environmental Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                    <span className="ml-2 text-gray-600">Loading environmental data...</span>
                  </div>
                ) : earthData ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center glass-morphism p-6 rounded-xl scale-on-hover">
                      <div className="text-4xl font-bold gradient-text mb-2">🌿 {earthData.ndvi.toFixed(3)}</div>
                      <div className="text-sm text-gray-600 mb-3">Vegetation Index (NDVI)</div>
                      <Badge className={`${getStatusColor(earthData.vegetationStatus)} scale-on-hover`}>{earthData.vegetationStatus}</Badge>
                    </div>
                    <div className="text-center glass-morphism p-6 rounded-xl scale-on-hover">
                      <div className="text-4xl font-bold gradient-text mb-2">🌡️ {earthData.landSurfaceTemperature}°C</div>
                      <div className="text-sm text-gray-600 mb-3">Surface Temperature</div>
                      <Badge className={`${getStatusColor(earthData.temperatureStatus)} scale-on-hover`}>{earthData.temperatureStatus}</Badge>
                    </div>
                    <div className="text-center glass-morphism p-6 rounded-xl scale-on-hover">
                      <div className="text-4xl font-bold gradient-text mb-2">💧 {earthData.evapotranspiration} mm/day</div>
                      <div className="text-sm text-gray-600 mb-3">Evapotranspiration</div>
                      <Badge className={`${getStatusColor(earthData.droughtRisk)} scale-on-hover`}>{earthData.droughtRisk} Drought Risk</Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Select a location to view environmental data
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weather Forecast */}
            <Card className="card-3d floating-card" style={{ animationDelay: '0.5s' }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Cloud className="w-5 h-5 text-blue-600" />
                  <span>3-Day Weather Forecast</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weatherData ? (
                  <div className="space-y-4">
                    {/* Current Weather */}
                    <div className="flex items-center space-x-4 p-6 glass-morphism rounded-xl scale-on-hover holographic">
                      <div className="text-6xl animate-pulse">☀️</div>
                      <div>
                        <div className="text-3xl font-bold gradient-text">
                          {weatherData.current.temperature}°{weatherData.current.temperatureUnit}
                        </div>
                        <div className="text-lg text-gray-700 font-medium">{weatherData.current.conditions}</div>
                        <div className="text-sm text-gray-600">
                          💨 Wind: {weatherData.current.windSpeed} {weatherData.current.windDirection}
                        </div>
                      </div>
                    </div>
                    
                    {/* 3-Day Forecast */}
                    <div className="grid grid-cols-3 gap-4">
                      {weatherData.forecast.slice(0, 3).map((period, index) => (
                        <div key={index} className="text-center p-4 glass-morphism rounded-xl scale-on-hover floating-card" style={{ animationDelay: `${index * 0.3}s` }}>
                          <div className="text-sm font-medium text-gray-900 mb-2">{period.name}</div>
                          <div className="my-3">
                            <div className="text-4xl">
                              {period.isDaytime ? '☀️' : '🌙'}
                            </div>
                          </div>
                          <div className="text-xl font-bold gradient-text">{period.temperature}°{period.temperatureUnit}</div>
                          <div className="text-xs text-gray-600 mt-1">{period.conditions}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Weather data will appear here
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Air Quality & AI */}
          <div className="space-y-6">
            {/* Air Quality Index */}
            <Card className="card-3d floating-card shimmer">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wind className="w-5 h-5 text-purple-600" />
                  <span>Air Quality Index</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {airQualityData ? (
                  <div className="text-center space-y-4 glass-morphism p-6 rounded-xl">
                    <div className="text-6xl mb-4">🌬️</div>
                    <div className="text-5xl font-bold gradient-text">{airQualityData.aqi}</div>
                    <div className={`inline-block px-4 py-2 rounded-full text-base font-medium border scale-on-hover ${getAQIColor(airQualityData.level)}`}>
                      {airQualityData.status}
                    </div>
                    <div className="text-sm text-gray-600">
                      🏭 Main pollutant: {airQualityData.mainPollutant}
                    </div>
                    <div className="text-xs text-gray-500">
                      📍 {airQualityData.location}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Air quality data will appear here
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Suggestions */}
            <Card className="card-3d floating-card neon-glow" style={{ animationDelay: '1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  <span>Smart Suggestions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getAIInsights().map((insight, index) => (
                    <div key={index} className="flex items-start space-x-2 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-green-800">{insight}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Assistant now available globally via floating chat widget */}
          </div>
        </div>

        {/* Enhanced Components */}
        {showProfileManager && (
          <div className="mb-8">
            <FarmProfileManager onProfileUpdate={handleProfileUpdate} />
          </div>
        )}

        {showAnalytics && (
          <div className="mb-8">
            <EnvironmentalAnalytics 
              earthData={earthData}
              weatherData={weatherData}
              airQualityData={airQualityData}
            />
          </div>
        )}

        {/* Historical Charts and Analytics */}
        <DashboardCharts location={location} />

        {/* Environmental Alerts */}
        <div className="mb-8">
          <EnvironmentalAlerts
            earthData={earthData}
            weatherData={weatherData}
            airQualityData={airQualityData}
            location={location}
          />
        </div>

        {/* Priority Action Board */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              📋 Today's Critical Tasks
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">Auto-generated priority actions based on current conditions</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(() => {
                const tasks = [];
                
                // Weather-driven tasks
                if (weatherData?.current?.windSpeed?.includes('High')) {
                  tasks.push({
                    task: 'Delay fertilizer application',
                    reason: 'Wind advisory',
                    priority: 'High',
                    status: 'scheduled',
                    icon: '⚠️'
                  });
                }
                
                if (earthData?.droughtRisk === 'High') {
                  tasks.push({
                    task: 'Irrigate Zone B: 2 hours before rain',
                    reason: 'High drought risk',
                    priority: 'High', 
                    status: 'pending',
                    icon: '💧'
                  });
                }

                // AI-recommended tasks
                if (earthData?.ndvi && earthData.ndvi < 0.5) {
                  tasks.push({
                    task: 'Scout for pest damage',
                    reason: 'Low vegetation index',
                    priority: 'Medium',
                    status: 'pending',
                    icon: '🔍'
                  });
                }

                tasks.push({
                  task: 'Equipment maintenance check',
                  reason: 'Tractor #3 due in 15 hours',
                  priority: 'Medium',
                  status: 'completed',
                  icon: '🚜'
                });

                return tasks.map((task, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{task.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{task.task}</p>
                        <p className="text-xs text-gray-600">{task.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={
                        task.priority === 'High' ? 'bg-red-100 text-red-800' :
                        task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }>
                        {task.priority}
                      </Badge>
                      <div className="text-lg">
                        {task.status === 'completed' ? '✅' :
                         task.status === 'pending' ? '⏳' : '⏰'}
                      </div>
                    </div>
                  </div>
                ));
              })()}
              
              <Button variant="outline" className="w-full mt-4">
                View All Tasks
              </Button>
            </div>
          </CardContent>
        </Card>


        {/* Enhanced Data Sources Footer */}
        <Card className="mb-4 card-3d neon-glow">
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-800 font-medium">
                🛰️ Data Sources: NASA MODIS/VIIRS • 🌤️ National Weather Service • 🌬️ AQICN
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-800 font-medium">All systems operational</span>
                <span className="text-xs text-green-700">Updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Chat Box is now globally available via App.tsx */}
    </div>
  );
};

export default SustainabilityDashboard;