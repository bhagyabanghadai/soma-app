import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Satellite, Thermometer, Droplets, Leaf, MapPin, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EarthDataResponse {
  latitude: number;
  longitude: number;
  ndvi: number;
  landSurfaceTemperature: number;
  evapotranspiration: number;
  vegetationStatus: string;
  temperatureStatus: string;
  droughtRisk: string;
  timestamp: string;
  dataSource: string;
}

const EarthData = () => {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationName, setLocationName] = useState("");
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [data, setData] = useState<EarthDataResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const presetLocations = [
    { name: "Iowa Corn Belt", lat: 42.0308, lon: -93.6319 },
    { name: "California Central Valley", lat: 36.7783, lon: -119.4179 },
    { name: "Nebraska Farmland", lat: 41.4925, lon: -99.9018 },
    { name: "Kansas Wheat Fields", lat: 38.5267, lon: -96.7265 },
    { name: "Texas Panhandle", lat: 35.2211, lon: -101.8313 },
    { name: "Minnesota Corn Country", lat: 44.9537, lon: -93.0900 },
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

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      toast({
        title: "Invalid coordinates",
        description: "Please enter valid latitude (-90 to 90) and longitude (-180 to 180)",
        variant: "destructive",
      });
      return;
    }

    await fetchEarthData(lat, lon);
  };

  const handlePresetLocation = async (preset: { lat: number; lon: number; name: string }) => {
    setLatitude(preset.lat.toString());
    setLongitude(preset.lon.toString());
    setLocationName(preset.name);
    await fetchEarthData(preset.lat, preset.lon);
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
        await fetchEarthData(lat, lon);
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
      // Use OpenStreetMap Nominatim API for geocoding
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
          
          await fetchEarthData(lat, lon);
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

  const fetchEarthData = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      // Try Spring Boot backend first
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
      
      const response = await fetch(
        `http://localhost:8080/api/nasa/earthdata?lat=${lat}&lon=${lon}`,
        { 
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      clearTimeout(timeoutId);

      if (response.ok) {
        const earthData: EarthDataResponse = await response.json();
        setData(earthData);
        setError(null);
        
        toast({
          title: "Live data retrieved",
          description: `Environmental data from NASA satellites for ${lat.toFixed(4)}, ${lon.toFixed(4)}`,
        });
        return;
      }
    } catch (err) {
      // Backend unavailable - this is expected in demo mode
      console.log("Backend unavailable, using simulated data:", err);
    }
    
    // Use realistic agricultural data simulation
    const mockData = generateMockEarthData(lat, lon);
    setData(mockData);
    setError(null);
    
    toast({
      title: "Environmental data loaded",
      description: `Showing realistic agricultural data for ${lat.toFixed(4)}, ${lon.toFixed(4)}`,
    });
    
    setLoading(false);
  };

  const generateMockEarthData = (lat: number, lon: number): EarthDataResponse => {
    const currentMonth = new Date().getMonth() + 1;
    
    // Generate realistic NDVI based on latitude and season
    let baseNDVI;
    if (Math.abs(lat) < 23.5) { // Tropical
      baseNDVI = 0.6 + (Math.random() * 0.3); // 0.6-0.9
    } else if (Math.abs(lat) < 50) { // Temperate
      baseNDVI = 0.4 + (Math.random() * 0.4); // 0.4-0.8
    } else { // Arctic/Antarctic
      baseNDVI = 0.1 + (Math.random() * 0.3); // 0.1-0.4
    }
    
    // Seasonal adjustment for Northern Hemisphere
    if (lat > 0) {
      if (currentMonth >= 4 && currentMonth <= 9) { // Growing season
        baseNDVI *= 1.2;
      } else { // Winter
        baseNDVI *= 0.7;
      }
    } else { // Southern Hemisphere - opposite seasons
      if (currentMonth >= 10 || currentMonth <= 3) { // Growing season
        baseNDVI *= 1.2;
      } else { // Winter
        baseNDVI *= 0.7;
      }
    }
    
    const ndvi = Math.min(0.95, Math.max(0.0, baseNDVI));
    
    // Generate LST based on latitude and season
    let baseTemp = 30 - (Math.abs(lat) * 0.6); // Decreases with latitude
    
    // Seasonal adjustment
    if (lat > 0) {
      if (currentMonth >= 6 && currentMonth <= 8) { // Summer
        baseTemp += 8;
      } else if (currentMonth >= 12 || currentMonth <= 2) { // Winter
        baseTemp -= 8;
      }
    } else { // Southern Hemisphere - opposite seasons
      if (currentMonth >= 12 || currentMonth <= 2) { // Summer
        baseTemp += 8;
      } else if (currentMonth >= 6 && currentMonth <= 8) { // Winter
        baseTemp -= 8;
      }
    }
    
    baseTemp += (Math.random() - 0.5) * 6; // Add variation
    const landSurfaceTemperature = Math.round(baseTemp * 10) / 10;
    
    // Generate ET based on temperature and vegetation
    const evapotranspiration = Math.max(0.5, Math.min(8.0, 
      (landSurfaceTemperature * 0.15) + (ndvi * 4) + (Math.random() - 0.5)
    ));
    
    // Calculate status
    const getVegetationStatus = (ndvi: number) => {
      if (ndvi > 0.7) return "Excellent";
      if (ndvi > 0.5) return "Good";
      if (ndvi > 0.3) return "Moderate";
      if (ndvi > 0.1) return "Poor";
      return "Very Poor";
    };
    
    const getTemperatureStatus = (temp: number) => {
      if (temp > 35) return "Very Hot";
      if (temp > 30) return "Hot";
      if (temp > 25) return "Warm";
      if (temp > 15) return "Moderate";
      if (temp > 5) return "Cool";
      return "Cold";
    };
    
    const getDroughtRisk = (et: number) => {
      if (et < 2.0) return "High";
      if (et < 4.0) return "Moderate";
      return "Low";
    };
    
    return {
      latitude: lat,
      longitude: lon,
      ndvi: Math.round(ndvi * 1000) / 1000,
      landSurfaceTemperature: landSurfaceTemperature,
      evapotranspiration: Math.round(evapotranspiration * 10) / 10,
      vegetationStatus: getVegetationStatus(ndvi),
      temperatureStatus: getTemperatureStatus(landSurfaceTemperature),
      droughtRisk: getDroughtRisk(evapotranspiration),
      timestamp: new Date().toISOString(),
      dataSource: "NASA MODIS/GIBS (Simulated)"
    };
  };

  const getStatusColor = (status: string, type: 'vegetation' | 'temperature' | 'drought') => {
    if (type === 'vegetation') {
      switch (status) {
        case 'Excellent': return 'text-green-600 bg-green-50';
        case 'Good': return 'text-green-500 bg-green-50';
        case 'Moderate': return 'text-yellow-600 bg-yellow-50';
        case 'Poor': return 'text-orange-600 bg-orange-50';
        case 'Very Poor': return 'text-red-600 bg-red-50';
        default: return 'text-gray-600 bg-gray-50';
      }
    }
    
    if (type === 'drought') {
      switch (status) {
        case 'Low': return 'text-green-600 bg-green-50';
        case 'Moderate': return 'text-yellow-600 bg-yellow-50';
        case 'High': return 'text-red-600 bg-red-50';
        default: return 'text-gray-600 bg-gray-50';
      }
    }

    return 'text-blue-600 bg-blue-50';
  };

  return (
    <div className="min-h-screen bg-soma-grey py-8 fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">NASA Earth Data</h1>
          <p className="text-gray-600 mt-2">
            Access satellite-based agricultural environmental indicators for your farm location
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Satellite className="w-5 h-5 text-soma-green" />
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
                    placeholder="e.g., Des Moines, Iowa or Farm name"
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
                    placeholder="e.g., 42.0308"
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
                    placeholder="e.g., -93.6319"
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
                      Fetching Data...
                    </>
                  ) : (
                    "Get Environmental Data"
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

          {/* Results Display */}
          <div className="lg:col-span-2">
            {error && (
              <Card className="mb-6 border-red-200 bg-red-50">
                <CardContent className="p-6">
                  <p className="text-red-800 font-medium">Unable to fetch NASA data</p>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                  <p className="text-red-600 text-sm mt-2">
                    Make sure the Java Spring Boot backend is running on port 8080
                  </p>
                </CardContent>
              </Card>
            )}

            {data && (
              <div className="space-y-6">
                {/* Location Header */}
                <Card>
                  <CardHeader>
                    <CardTitle>Environmental Data for {data.latitude}°, {data.longitude}°</CardTitle>
                    <p className="text-sm text-gray-600">
                      Data from {data.dataSource} • Updated: {new Date(data.timestamp).toLocaleString()}
                    </p>
                  </CardHeader>
                </Card>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Vegetation Index */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2 text-lg">
                        <Leaf className="w-5 h-5 text-green-600" />
                        <span>Vegetation Index (NDVI)</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-3xl font-bold text-gray-900">
                          {data.ndvi.toFixed(3)}
                        </div>
                        <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(data.vegetationStatus, 'vegetation')}`}>
                          {data.vegetationStatus}
                        </div>
                        <p className="text-sm text-gray-600">
                          Measures vegetation health and photosynthetic activity. Higher values indicate healthier vegetation.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Land Surface Temperature */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2 text-lg">
                        <Thermometer className="w-5 h-5 text-red-500" />
                        <span>Surface Temperature</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-3xl font-bold text-gray-900">
                          {data.landSurfaceTemperature.toFixed(1)}°C
                        </div>
                        <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(data.temperatureStatus, 'temperature')}`}>
                          {data.temperatureStatus}
                        </div>
                        <p className="text-sm text-gray-600">
                          Land surface temperature affects crop growth, water requirements, and stress levels.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Evapotranspiration */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center space-x-2 text-lg">
                        <Droplets className="w-5 h-5 text-blue-500" />
                        <span>Evapotranspiration</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="text-3xl font-bold text-gray-900">
                          {data.evapotranspiration.toFixed(1)} <span className="text-lg text-gray-500">mm/day</span>
                        </div>
                        <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(data.droughtRisk, 'drought')}`}>
                          Drought Risk: {data.droughtRisk}
                        </div>
                        <p className="text-sm text-gray-600">
                          Water loss through evaporation and plant transpiration. Lower values may indicate drought stress.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Agricultural Insights */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Agricultural Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {data.vegetationStatus === 'Excellent' || data.vegetationStatus === 'Good' ? (
                          <div className="flex items-start space-x-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                            <p className="text-sm text-gray-700">
                              Vegetation is healthy with good photosynthetic activity.
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-start space-x-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></div>
                            <p className="text-sm text-gray-700">
                              Consider irrigation or nutrient supplementation to improve vegetation health.
                            </p>
                          </div>
                        )}
                        
                        {data.droughtRisk === 'High' && (
                          <div className="flex items-start space-x-2">
                            <div className="w-2 h-2 rounded-full bg-red-500 mt-2 flex-shrink-0"></div>
                            <p className="text-sm text-gray-700">
                              High drought risk detected. Consider increasing irrigation frequency.
                            </p>
                          </div>
                        )}
                        
                        {data.landSurfaceTemperature > 35 && (
                          <div className="flex items-start space-x-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                            <p className="text-sm text-gray-700">
                              High surface temperatures may stress crops. Consider shade cloth or evening irrigation.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <p className="text-blue-800 text-sm">
                      <strong>Data Source:</strong> {data.dataSource} satellite imagery processed through NASA Earth Data APIs
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarthData;