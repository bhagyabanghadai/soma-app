import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { calculateCarbonCredits } from "@/lib/calculations";
import { Leaf, DollarSign, TrendingUp } from "lucide-react";

const CarbonCredit = () => {
  const [formData, setFormData] = useState({
    landSize: "",
    duration: "1",
    practices: [] as string[],
  });
  const [results, setResults] = useState<{
    totalCarbon: number;
    earnings: number;
    annualCarbon: number;
    annualEarnings: number;
    breakdown: { practice: string; carbon: number; earnings: number }[];
  } | null>(null);

  const practiceOptions = [
    { id: "cover-crops", label: "Cover Crops", value: 0.5 },
    { id: "no-till", label: "No-Till Farming", value: 0.8 },
    { id: "crop-rotation", label: "Crop Rotation", value: 0.3 },
    { id: "composting", label: "Organic Composting", value: 0.4 },
    { id: "agroforestry", label: "Agroforestry", value: 0.2 },
  ];

  const handlePracticeChange = (practiceId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      practices: checked
        ? [...prev.practices, practiceId]
        : prev.practices.filter(p => p !== practiceId)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const landSize = parseFloat(formData.landSize) || 0;
    const duration = parseFloat(formData.duration) || 1;
    
    if (landSize === 0 || formData.practices.length === 0) return;
    
    const analysis = calculateCarbonCredits(landSize, formData.practices, duration);
    setResults(analysis);
  };

  return (
    <div className="min-h-screen bg-soma-grey py-8 fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Carbon Credit Estimator</h1>
          <p className="text-gray-600 mt-2">
            Calculate your potential carbon credit earnings from regenerative farming practices
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card>
            <CardHeader>
              <CardTitle>Carbon Calculation</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="land-size">Land Size (acres)</Label>
                  <Input
                    id="land-size"
                    type="number"
                    placeholder="100"
                    value={formData.landSize}
                    onChange={(e) => setFormData(prev => ({ ...prev, landSize: e.target.value }))}
                    className="focus:ring-soma-green focus:border-soma-green"
                  />
                </div>
                
                <div>
                  <Label>Practices Adopted</Label>
                  <div className="space-y-2 mt-2">
                    {practiceOptions.map((practice) => (
                      <div key={practice.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={practice.id}
                          checked={formData.practices.includes(practice.id)}
                          onCheckedChange={(checked) => 
                            handlePracticeChange(practice.id, checked as boolean)
                          }
                        />
                        <label 
                          htmlFor={practice.id} 
                          className="text-sm cursor-pointer"
                        >
                          {practice.label} (+{practice.value} tons CO₂/acre/year)
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="duration">Duration (years)</Label>
                  <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 year</SelectItem>
                      <SelectItem value="3">3 years</SelectItem>
                      <SelectItem value="5">5 years</SelectItem>
                      <SelectItem value="10">10 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button type="submit" className="w-full bg-soma-green hover:bg-soma-green/90">
                  Calculate Carbon Credits
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Carbon Credit Estimation</CardTitle>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-6">
                  {/* CO2 Saved */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-4">
                      <span className="text-xl font-bold text-soma-green">{results.totalCarbon}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">Total CO₂ Sequestered</h3>
                    <p className="text-green-600 font-medium">Tons over selected period</p>
                  </div>

                  {/* Earnings */}
                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Estimated Earnings
                      </h4>
                      <span className="text-2xl font-bold text-soma-yellow">
                        ${results.earnings.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Based on current carbon credit prices ($20/ton CO₂)
                    </p>
                    <div className="bg-yellow-50 p-3 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        💡 <strong>Tip:</strong> Carbon credit prices can vary. This is an estimate for planning purposes.
                      </p>
                    </div>
                  </div>

                  {/* Annual Projection */}
                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Annual Projection
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="text-lg font-bold text-green-600">{results.annualCarbon} tons</div>
                        <div className="text-xs text-gray-600">CO₂/year</div>
                      </div>
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <div className="text-lg font-bold text-yellow-600">${results.annualEarnings.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">Earnings/year</div>
                      </div>
                    </div>
                  </div>

                  {/* Breakdown */}
                  {results.breakdown.length > 0 && (
                    <div className="border-t pt-6">
                      <h4 className="font-semibold text-gray-900 mb-3">📊 Breakdown by Practice</h4>
                      <div className="space-y-2 text-sm">
                        {results.breakdown.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <span className="text-gray-600">{item.practice}</span>
                            <span className="font-medium">{item.carbon.toFixed(1)} tons CO₂</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p>Enter your land details and practices to calculate carbon credit potential</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Comparison Chart */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Conventional vs Regenerative CO₂ Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <h3 className="font-medium text-gray-900 mb-4">Conventional Farming</h3>
                <div className="h-32 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">+2.5 tons</div>
                    <div className="text-sm text-red-700">CO₂ emissions per acre/year</div>
                  </div>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 text-left">
                  <li>• Heavy tillage releases stored carbon</li>
                  <li>• Synthetic fertilizer production</li>
                  <li>• Fuel consumption for equipment</li>
                </ul>
              </div>
              <div className="text-center">
                <h3 className="font-medium text-gray-900 mb-4">Regenerative Farming</h3>
                <div className="h-32 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">-1.8 tons</div>
                    <div className="text-sm text-green-700">CO₂ sequestered per acre/year</div>
                  </div>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 text-left">
                  <li>• Cover crops capture carbon</li>
                  <li>• No-till preserves soil carbon</li>
                  <li>• Reduced synthetic inputs</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CarbonCredit;
