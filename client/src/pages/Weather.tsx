import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Cloud, Sun, Navigation, MapPin, Thermometer, Wind, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WeatherLocation {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
}

interface CurrentWeather {
  temperature: number;
  temperatureUnit: string;
  conditions: string;
  detailedForecast: string;
  windSpeed: string;
  windDirection: string;
  isDaytime: boolean;
  icon: string;
  period: string;
}

interface ForecastPeriod {
  name: string;
  temperature: number;
  temperatureUnit: string;
  conditions: string;
  detailedForecast: string;
  windSpeed: string;
  windDirection: string;
  isDaytime: boolean;
  icon: string;
}

interface WeatherResponse {
  location: WeatherLocation;
  current: CurrentWeather;
  forecast: ForecastPeriod[];
  timestamp: string;
  dataSource: string;
}

const Weather = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationName, setLocationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const presetLocations = [
    { name: "Iowa Corn Belt", lat: 42.0308, lon: -93.6319 },
    { name: "California Central Valley", lat: 36.7783, lon: -119.4179 },
    { name: "Nebraska Farmland", lat: 41.4925, lon: -99.9018 },
    { name: "Kansas Wheat Fields", lat: 38.5267, lon: -96.7265 },
    { name: "Texas Panhandle", lat: 35.2211, lon: -101.8313 },
    { name: "Washington DC (Test)", lat: 38.8977, lon: -77.0365 },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!latitude || !longitude) {
      toast({
        title: "Missing coordinates",
        description: "Please enter both latitude and longitude",
        variant: "destructive",
      });
      return;
    }
    await fetchWeatherData(parseFloat(latitude), parseFloat(longitude));
  };

  const handlePresetLocation = async (preset: { lat: number; lon: number; name: string }) => {
    setLatitude(preset.lat.toString());
    setLongitude(preset.lon.toString());
    setLocationName(preset.name);
    await fetchWeatherData(preset.lat, preset.lon);
  };

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
        
        setLatitude(lat.toString());
        setLongitude(lon.toString());
        setLocationName("Current Location");
        
        toast({
          title: "Location detected",
          description: `Found your location: ${lat.toFixed(4)}, ${lon.toFixed(4)}`,
        });
        
        setGeoLoading(false);
        await fetchWeatherData(lat, lon);
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast({
          title: "Location access denied",
          description: "Please allow location access or enter coordinates manually",
          variant: "destructive",
        });
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  const searchLocationByName = async () => {
    if (!locationName.trim()) {
      toast({
        title: "Enter location name",
        description: "Please enter a city, farm, or location name",
        variant: "destructive",
      });
      return;
    }

    setSearchLoading(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`
      );
      
      if (response.ok) {
        const results = await response.json();
        if (results.length > 0) {
          const lat = parseFloat(results[0].lat);
          const lon = parseFloat(results[0].lon);
          
          setLatitude(lat.toString());
          setLongitude(lon.toString());
          
          toast({
            title: "Location found",
            description: `Found: ${results[0].display_name}`,
          });
          
          await fetchWeatherData(lat, lon);
        } else {
          toast({
            title: "Location not found",
            description: "Try a different location name or use coordinates",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      toast({
        title: "Search failed",
        description: "Could not search for location. Try coordinates instead.",
        variant: "destructive",
      });
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchWeatherData = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    setWeatherData(null);

    try {
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(10000)
      });

      if (response.ok) {
        const weather: WeatherResponse = await response.json();
        setWeatherData(weather);
        setError(null);
        
        toast({
          title: "Weather data retrieved",
          description: `Current conditions for ${weather.location.city}, ${weather.location.state}`,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || `API responded with status ${response.status}`);
      }
    } catch (err) {
      console.error("Error fetching weather data:", err);
      const errorMessage = err instanceof Error ? err.message : "Unable to fetch weather data";
      setError(errorMessage);
      
      toast({
        title: "Weather data unavailable",
        description: errorMessage,
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  const getWeatherIcon = (iconUrl: string, isDaytime: boolean, conditions: string) => {
    const conditionsLower = conditions.toLowerCase();
    
    if (conditionsLower.includes('sunny') || conditionsLower.includes('clear')) {
      return <Sun className="w-8 h-8 text-yellow-500" />;
    }
    if (conditionsLower.includes('cloud') || conditionsLower.includes('overcast')) {
      return <Cloud className="w-8 h-8 text-gray-600" />;
    }
    if (conditionsLower.includes('rain') || conditionsLower.includes('shower')) {
      return <Cloud className="w-8 h-8 text-blue-600" />;
    }
    
    return isDaytime ? <Sun className="w-8 h-8 text-yellow-500" /> : <Cloud className="w-8 h-8 text-gray-600" />;
  };

  return (
    <div className="min-h-screen bg-soma-grey py-8 fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Weather Forecast</h1>
          <p className="text-gray-600 mt-2">
            Get current conditions and 3-day weather forecast for your farm location
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cloud className="w-5 h-5 text-soma-green" />
                <span>Farm Location</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Auto-detect Location */}
              <div className="space-y-3">
                <Button
                  onClick={getCurrentLocation}
                  disabled={geoLoading || loading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {geoLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Detecting Location...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 mr-2" />
                      Use My Current Location
                    </>
                  )}
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">OR</span>
                </div>
              </div>

              {/* Search by Location Name */}
              <div className="space-y-3">
                <Label htmlFor="locationName">Search by Place Name</Label>
                <div className="flex space-x-2">
                  <Input
                    id="locationName"
                    type="text"
                    placeholder="e.g., Des Moines, Iowa"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="flex-1"
                    onKeyPress={(e) => e.key === 'Enter' && searchLocationByName()}
                  />
                  <Button
                    onClick={searchLocationByName}
                    disabled={searchLoading || loading}
                    variant="outline"
                  >
                    {searchLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">OR</span>
                </div>
              </div>

              {/* Manual Coordinates */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="any"
                    placeholder="e.g., 38.8977"
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    placeholder="e.g., -77.0365"
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    className="w-full"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-soma-green hover:bg-green-600"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Getting Weather...
                    </>
                  ) : (
                    "Get Weather Forecast"
                  )}
                </Button>
              </form>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Popular Farm Locations:</p>
                <div className="space-y-2">
                  {presetLocations.map((preset, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handlePresetLocation(preset)}
                      className="w-full text-left justify-start"
                      disabled={loading}
                    >
                      {preset.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weather Display */}
          <div className="lg:col-span-2">
            {error && (
              <Card className="mb-6 border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <p className="text-red-800 font-medium">Unable to fetch weather data</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                  <p className="text-red-600 text-sm mt-2">
                    Please check coordinates or try a different location within the United States
                  </p>
                </CardContent>
              </Card>
            )}

            {weatherData && (
              <div className="space-y-6">
                {/* Current Weather */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Current Weather</span>
                      <span className="text-sm font-normal text-gray-600">
                        {weatherData.location.city}, {weatherData.location.state}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-4">
                        {getWeatherIcon(weatherData.current.icon, weatherData.current.isDaytime, weatherData.current.conditions)}
                        <div>
                          <div className="text-3xl font-bold text-gray-900">
                            {weatherData.current.temperature}°{weatherData.current.temperatureUnit}
                          </div>
                          <div className="text-lg text-gray-600">
                            {weatherData.current.conditions}
                          </div>
                          <div className="text-sm text-gray-500">
                            {weatherData.current.period}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Wind className="w-4 h-4 text-gray-600" />
                          <span className="text-sm">
                            Wind: {weatherData.current.windSpeed} {weatherData.current.windDirection}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{weatherData.current.detailedForecast}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* 3-Day Forecast */}
                <Card>
                  <CardHeader>
                    <CardTitle>3-Day Forecast</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {weatherData.forecast.slice(0, 6).map((period, index) => (
                        <Card key={index} className="border-gray-200">
                          <CardContent className="p-4">
                            <div className="text-center space-y-2">
                              <div className="font-medium text-sm text-gray-900">
                                {period.name}
                              </div>
                              <div className="flex justify-center">
                                {getWeatherIcon(period.icon, period.isDaytime, period.conditions)}
                              </div>
                              <div className="text-xl font-bold text-gray-900">
                                {period.temperature}°{period.temperatureUnit}
                              </div>
                              <div className="text-sm text-gray-600">
                                {period.conditions}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center justify-center space-x-1">
                                <Wind className="w-3 h-3" />
                                <span>{period.windSpeed}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Data Source */}
                <div className="text-center text-sm text-gray-500">
                  Data from {weatherData.dataSource} • Updated: {new Date(weatherData.timestamp).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;