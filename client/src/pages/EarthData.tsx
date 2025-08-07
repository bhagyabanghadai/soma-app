import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Satellite, Thermometer, Droplets, Leaf } from "lucide-react";
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
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<EarthDataResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const presetLocations = [
    { name: "Iowa Corn Belt", lat: 42.0308, lon: -93.6319 },
    { name: "California Central Valley", lat: 36.7783, lon: -119.4179 },
    { name: "Nebraska Farmland", lat: 41.4925, lon: -99.9018 },
    { name: "Kansas Wheat Fields", lat: 38.5267, lon: -96.7265 },
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
    await fetchEarthData(preset.lat, preset.lon);
  };

  const fetchEarthData = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(
        `http://localhost:8080/api/nasa/earthdata?lat=${lat}&lon=${lon}`
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const earthData: EarthDataResponse = await response.json();
      setData(earthData);
      
      toast({
        title: "Data retrieved successfully",
        description: `Environmental data loaded for coordinates ${lat}, ${lon}`,
      });
    } catch (err) {
      console.error("Error fetching Earth data:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch data");
      
      toast({
        title: "Data unavailable",
        description: "Unable to fetch NASA Earth data. Backend may be offline.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
                <p className="text-sm font-medium text-gray-700 mb-3">Quick Select:</p>
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