import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Wind, Navigation, MapPin, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AirQualityLocation {
  latitude: number;
  longitude: number;
}

interface AirQualityResponse {
  location: string;
  aqi: number;
  mainPollutant: string;
  status: string;
  level: string;
  timestamp: string;
  coordinates: AirQualityLocation;
  dataSource: string;
}

const AirQuality = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationName, setLocationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [airQualityData, setAirQualityData] = useState<AirQualityResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const presetLocations = [
    { name: "Des Moines, Iowa", lat: 41.5868, lon: -93.6250 },
    { name: "Fresno, California", lat: 36.7378, lon: -119.7871 },
    { name: "Lincoln, Nebraska", lat: 40.8136, lon: -96.7026 },
    { name: "Wichita, Kansas", lat: 37.6872, lon: -97.3301 },
    { name: "Lubbock, Texas", lat: 33.5779, lon: -101.8552 },
    { name: "Washington DC", lat: 38.8977, lon: -77.0365 },
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
    await fetchAirQualityData(parseFloat(latitude), parseFloat(longitude));
  };

  const handlePresetLocation = async (preset: { lat: number; lon: number; name: string }) => {
    setLatitude(preset.lat.toString());
    setLongitude(preset.lon.toString());
    setLocationName(preset.name);
    await fetchAirQualityData(preset.lat, preset.lon);
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
        await fetchAirQualityData(lat, lon);
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
          
          await fetchAirQualityData(lat, lon);
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

  const fetchAirQualityData = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    setAirQualityData(null);

    try {
      const response = await fetch(`/api/air-quality?lat=${lat}&lon=${lon}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(15000)
      });

      if (response.ok) {
        const airQuality: AirQualityResponse = await response.json();
        setAirQualityData(airQuality);
        setError(null);
        
        toast({
          title: "Air quality data retrieved",
          description: `AQI: ${airQuality.aqi} - ${airQuality.status}`,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || `API responded with status ${response.status}`);
      }
    } catch (err) {
      console.error("Error fetching air quality data:", err);
      const errorMessage = err instanceof Error ? err.message : "Unable to fetch air quality data";
      setError(errorMessage);
      
      toast({
        title: "Air quality data unavailable",
        description: errorMessage,
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };

  const getAQIColor = (level: string) => {
    switch (level) {
      case "good": return "bg-green-100 text-green-800 border-green-200";
      case "moderate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "unhealthy-sensitive": return "bg-orange-100 text-orange-800 border-orange-200";
      case "unhealthy": return "bg-red-100 text-red-800 border-red-200";
      case "very-unhealthy": return "bg-purple-100 text-purple-800 border-purple-200";
      case "hazardous": return "bg-gray-900 text-white border-gray-700";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAQIIcon = (level: string) => {
    switch (level) {
      case "good": return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "moderate": return <Wind className="w-6 h-6 text-yellow-600" />;
      default: return <AlertTriangle className="w-6 h-6 text-red-600" />;
    }
  };

  const getHealthAdvice = (level: string) => {
    switch (level) {
      case "good": return "Air quality is excellent for outdoor activities and farming.";
      case "moderate": return "Air quality is acceptable for most farming activities.";
      case "unhealthy-sensitive": return "Sensitive individuals should limit outdoor work.";
      case "unhealthy": return "Consider limiting outdoor activities and wearing masks.";
      case "very-unhealthy": return "Avoid outdoor work. Health warnings of emergency conditions.";
      case "hazardous": return "Emergency conditions. Everyone should avoid outdoor activities.";
      default: return "Monitor air quality conditions for safe farming operations.";
    }
  };

  return (
    <div className="min-h-screen bg-soma-grey py-8 fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Air Quality Monitor</h1>
          <p className="text-gray-600 mt-2">
            Monitor real-time air pollution levels for safe farming operations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wind className="w-5 h-5 text-soma-green" />
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
                    placeholder="e.g., 41.5868"
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
                    placeholder="e.g., -93.6250"
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
                      Checking Air Quality...
                    </>
                  ) : (
                    "Get Air Quality Data"
                  )}
                </Button>
              </form>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Popular Farm Areas:</p>
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

          {/* Air Quality Display */}
          <div className="lg:col-span-2">
            {error && (
              <Card className="mb-6 border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <p className="text-red-800 font-medium">Unable to fetch air quality data</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                  <p className="text-red-600 text-sm mt-2">
                    Please check coordinates or try a different location
                  </p>
                </CardContent>
              </Card>
            )}

            {airQualityData && (
              <div className="space-y-6">
                {/* Main AQI Display */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Air Quality Index</span>
                      <span className="text-sm font-normal text-gray-600">
                        {airQualityData.location}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-4">
                        {getAQIIcon(airQualityData.level)}
                        <div>
                          <div className="text-4xl font-bold text-gray-900">
                            {airQualityData.aqi}
                          </div>
                          <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getAQIColor(airQualityData.level)}`}>
                            {airQualityData.status}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Main Pollutant:</span>
                          <span className="text-sm font-medium">{airQualityData.mainPollutant}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Updated:</span>
                          <span className="text-sm font-medium">
                            {new Date(airQualityData.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Health Advisory for Farmers</h4>
                      <p className="text-sm text-gray-700">{getHealthAdvice(airQualityData.level)}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* AQI Scale Reference */}
                <Card>
                  <CardHeader>
                    <CardTitle>Air Quality Index Scale</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-50 border border-green-200">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <div>
                          <div className="font-medium text-green-800">Good (0-50)</div>
                          <div className="text-xs text-green-600">Safe for all activities</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                        <Wind className="w-4 h-4 text-yellow-600" />
                        <div>
                          <div className="font-medium text-yellow-800">Moderate (51-100)</div>
                          <div className="text-xs text-yellow-600">Acceptable for most people</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-orange-50 border border-orange-200">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                        <div>
                          <div className="font-medium text-orange-800">Unhealthy for Sensitive (151-200)</div>
                          <div className="text-xs text-orange-600">Limit prolonged outdoor work</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Data Source */}
                <div className="text-center text-sm text-gray-500">
                  Data from {airQualityData.dataSource} • Coordinates: {airQualityData.coordinates.latitude.toFixed(4)}, {airQualityData.coordinates.longitude.toFixed(4)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirQuality;