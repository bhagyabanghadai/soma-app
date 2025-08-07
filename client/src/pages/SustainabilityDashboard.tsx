import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { LocationSearch } from "@/components/LocationSearch";
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
  CheckCircle
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
  const [location, setLocation] = useState<LocationData>({ latitude: 0, longitude: 0 });
  const [locationInput, setLocationInput] = useState({ lat: "", lon: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [earthData, setEarthData] = useState<EarthData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [airQualityData, setAirQualityData] = useState<AirQualityData | null>(null);
  const [showChat, setShowChat] = useState(false);
  const { toast } = useToast();

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

  // Load default location on component mount
  useEffect(() => {
    // Default to Iowa Corn Belt if no location is set
    if (location.latitude === 0 && location.longitude === 0) {
      handlePresetLocation(presetLocations[0]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Sustainability Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Real-time environmental insights for {location.locationName || 'your farm'}
          </p>
        </div>

        {/* Location Input with Smart Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-green-600" />
              <span>Farm Location</span>
            </CardTitle>
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
            <Card>
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
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{earthData.ndvi.toFixed(3)}</div>
                      <div className="text-sm text-gray-600">Vegetation Index (NDVI)</div>
                      <Badge className={getStatusColor(earthData.vegetationStatus)}>{earthData.vegetationStatus}</Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{earthData.landSurfaceTemperature}°C</div>
                      <div className="text-sm text-gray-600">Surface Temperature</div>
                      <Badge className={getStatusColor(earthData.temperatureStatus)}>{earthData.temperatureStatus}</Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{earthData.evapotranspiration} mm/day</div>
                      <div className="text-sm text-gray-600">Evapotranspiration</div>
                      <Badge className={getStatusColor(earthData.droughtRisk)}>{earthData.droughtRisk} Drought Risk</Badge>
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
            <Card>
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
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                      <Sun className="w-8 h-8 text-yellow-500" />
                      <div>
                        <div className="text-xl font-bold">
                          {weatherData.current.temperature}°{weatherData.current.temperatureUnit}
                        </div>
                        <div className="text-sm text-gray-600">{weatherData.current.conditions}</div>
                        <div className="text-xs text-gray-500">
                          Wind: {weatherData.current.windSpeed} {weatherData.current.windDirection}
                        </div>
                      </div>
                    </div>
                    
                    {/* 3-Day Forecast */}
                    <div className="grid grid-cols-3 gap-4">
                      {weatherData.forecast.slice(0, 3).map((period, index) => (
                        <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm font-medium text-gray-900">{period.name}</div>
                          <div className="my-2">
                            {period.isDaytime ? 
                              <Sun className="w-6 h-6 text-yellow-500 mx-auto" /> : 
                              <Cloud className="w-6 h-6 text-gray-600 mx-auto" />
                            }
                          </div>
                          <div className="text-lg font-bold">{period.temperature}°{period.temperatureUnit}</div>
                          <div className="text-xs text-gray-600">{period.conditions}</div>
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wind className="w-5 h-5 text-purple-600" />
                  <span>Air Quality Index</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {airQualityData ? (
                  <div className="text-center space-y-4">
                    <div className="text-3xl font-bold text-gray-900">{airQualityData.aqi}</div>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getAQIColor(airQualityData.level)}`}>
                      {airQualityData.status}
                    </div>
                    <div className="text-sm text-gray-600">
                      Main pollutant: {airQualityData.mainPollutant}
                    </div>
                    <div className="text-xs text-gray-500">
                      {airQualityData.location}
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
            <Card>
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

            {/* AI Assistant Chat */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                    <span>AI Assistant</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setShowChat(!showChat)}
                    variant="outline"
                  >
                    {showChat ? 'Close' : 'Open Chat'}
                  </Button>
                </CardTitle>
              </CardHeader>
              {showChat && (
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-center text-gray-600 mb-4">
                      Ask me anything about sustainable farming practices!
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {["How to improve soil health?", "Water management tips?", "Best cover crops?", "Pest control strategies?"].map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            try {
                              const response = await fetch('/api/ai/chat', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ question: suggestion })
                              });
                              const data = await response.json();
                              toast({
                                title: "AI Recommendation",
                                description: data.response.substring(0, 100) + "...",
                              });
                            } catch (error) {
                              toast({
                                title: "AI Assistant",
                                description: "Visit the AI Assistant page for full chat functionality",
                                variant: "default",
                              });
                            }
                          }}
                          className="text-xs"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                    <div className="text-center">
                      <Button
                        onClick={() => window.location.href = '/ai-assistant'}
                        className="bg-blue-600 hover:bg-blue-700"
                        size="sm"
                      >
                        Open Full AI Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>

        {/* Data Sources Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Environmental data from NASA MODIS/VIIRS, Weather from National Weather Service, Air Quality from AQICN
        </div>
      </div>
    </div>
  );
};

export default SustainabilityDashboard;