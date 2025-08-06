import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { practicesData } from "@/data/mockData";
import { calculatePracticeImpact } from "@/lib/calculations";
import { Leaf, Clock, TrendingUp } from "lucide-react";

const RegenerativePractices = () => {
  const [selectedPractices, setSelectedPractices] = useState<string[]>([]);

  const handlePracticeChange = (practiceId: string, checked: boolean) => {
    setSelectedPractices(prev => 
      checked 
        ? [...prev, practiceId]
        : prev.filter(id => id !== practiceId)
    );
  };

  const impact = calculatePracticeImpact(selectedPractices);
  const hasSelectedPractices = selectedPractices.length > 0;

  const getRecommendations = () => {
    if (selectedPractices.length === 0) {
      return [{
        title: "Getting Started",
        content: "Select practices above to see personalized benefits and implementation guidance.",
        type: "info"
      }];
    }

    const recommendations = [
      {
        title: "Implementation Priority",
        content: "Start with cover cropping and no-till farming for maximum soil health benefits.",
        type: "priority"
      },
      {
        title: "Expected Timeline",
        content: "You should see initial results within 6-12 months, with full benefits in 2-3 years.",
        type: "timeline"
      },
      {
        title: "Cost Considerations",
        content: "Initial investment will be offset by reduced input costs and improved yields over time.",
        type: "cost"
      }
    ];

    return recommendations;
  };

  return (
    <div className="min-h-screen bg-soma-grey py-8 fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Regenerative Farming Practices</h1>
          <p className="text-gray-600 mt-2">
            Select the practices you're implementing to get personalized benefits analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Practices Checklist */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-soma-green" />
                  Select Your Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {practicesData.map((practice) => (
                    <div 
                      key={practice.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={practice.id}
                          checked={selectedPractices.includes(practice.id)}
                          onCheckedChange={(checked) => 
                            handlePracticeChange(practice.id, checked as boolean)
                          }
                        />
                        <div>
                          <label 
                            htmlFor={practice.id} 
                            className="font-medium text-gray-900 cursor-pointer"
                          >
                            {practice.name}
                          </label>
                          <p className="text-sm text-gray-600">{practice.description}</p>
                        </div>
                      </div>
                      <div className="text-green-500 font-medium text-sm">
                        {practice.benefit}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendations Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    🤖 AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getRecommendations().map((rec, index) => (
                      <div key={index} className="bg-soma-grey p-4 rounded-lg">
                        <h3 className="font-medium text-gray-900 mb-2">{rec.title}</h3>
                        <p className="text-sm text-gray-600">{rec.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Benefits Summary */}
              {hasSelectedPractices && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Expected Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Soil Health Improvement</span>
                        <span className="font-medium text-green-600">+{impact.soil}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Carbon Sequestration</span>
                        <span className="font-medium text-green-600">+{impact.carbon}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Water Efficiency</span>
                        <span className="font-medium text-blue-600">+{impact.water}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Biodiversity</span>
                        <span className="font-medium text-green-600">+{impact.biodiversity}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Implementation Timeline */}
              {hasSelectedPractices && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Implementation Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">Month 1-2: Planning and preparation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-600">Month 3-6: Initial implementation</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600">Month 6+: Monitor and optimize</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegenerativePractices;
