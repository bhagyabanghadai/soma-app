import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { calculateWaterUsage } from "@/lib/calculations";
import { cropTypes, irrigationMethods } from "@/data/mockData";
import { Droplets, Calendar } from "lucide-react";

const WaterUsage = () => {
  const [formData, setFormData] = useState({
    cropType: "",
    irrigationMethod: "",
    rainfall: "",
    fieldSize: "",
  });
  const [results, setResults] = useState<{
    totalUsage: number;
    efficiency: number;
    tips: string[];
    weeklySchedule: { day: string; amount: number }[];
  } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const rainfall = parseFloat(formData.rainfall) || 0;
    const fieldSize = parseFloat(formData.fieldSize) || 10;
    
    if (!formData.cropType || !formData.irrigationMethod) return;
    
    const analysis = calculateWaterUsage(
      formData.cropType,
      formData.irrigationMethod,
      rainfall,
      fieldSize
    );
    setResults(analysis);
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return "text-green-600";
    if (efficiency >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-soma-grey py-8 fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Water Usage Optimization</h1>
          <p className="text-gray-600 mt-2">
            Optimize your irrigation strategy based on crop type and conditions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>Irrigation Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="crop-type">Crop Type</Label>
                  <Select value={formData.cropType} onValueChange={(value) => handleInputChange("cropType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop type" />
                    </SelectTrigger>
                    <SelectContent>
                      {cropTypes.map((crop) => (
                        <SelectItem key={crop.value} value={crop.value}>
                          {crop.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="irrigation-method">Irrigation Method</Label>
                  <Select value={formData.irrigationMethod} onValueChange={(value) => handleInputChange("irrigationMethod", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      {irrigationMethods.map((method) => (
                        <SelectItem key={method.value} value={method.value}>
                          {method.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="rainfall">Last Rainfall (mm)</Label>
                  <Input
                    id="rainfall"
                    type="number"
                    placeholder="25"
                    value={formData.rainfall}
                    onChange={(e) => handleInputChange("rainfall", e.target.value)}
                    className="focus:ring-soma-green focus:border-soma-green"
                  />
                </div>
                <div>
                  <Label htmlFor="field-size">Field Size (acres)</Label>
                  <Input
                    id="field-size"
                    type="number"
                    placeholder="10"
                    value={formData.fieldSize}
                    onChange={(e) => handleInputChange("fieldSize", e.target.value)}
                    className="focus:ring-soma-green focus:border-soma-green"
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600">
                  Calculate Water Needs
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Water Optimization Results</CardTitle>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-6">
                  {/* Water Usage */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 mb-4">
                      <span className="text-xl font-bold text-blue-500">
                        {results.totalUsage.toLocaleString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Estimated Water Usage</h3>
                    <p className="text-blue-600 font-medium">Gallons per week</p>
                  </div>

                  {/* Efficiency Score */}
                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-gray-900">💧 Efficiency Score</h4>
                      <span className={`text-2xl font-bold ${getEfficiencyColor(results.efficiency)}`}>
                        {results.efficiency}%
                      </span>
                    </div>
                    <Progress 
                      value={results.efficiency} 
                      className="h-3"
                    />
                  </div>

                  {/* AI Tips */}
                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-gray-900 mb-3">🤖 AI Water-Saving Tips</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {results.tips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weekly Schedule */}
                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Recommended Schedule
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {results.weeklySchedule.map((schedule, index) => (
                        <div key={index} className="bg-blue-50 p-2 rounded">
                          <span className="font-medium">{schedule.day}:</span> {schedule.amount} gal
                        </div>
                      ))}
                      <div className="bg-gray-50 p-2 rounded col-span-2">
                        <span className="font-medium">Other days:</span> Monitor only
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Droplets className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p>Fill out the irrigation planning form to see recommendations</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WaterUsage;
