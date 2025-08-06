import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { sustainabilityMetrics } from "@/data/mockData";
import { Download, TrendingUp, CheckCircle, ArrowUp } from "lucide-react";

const SustainabilityReport = () => {
  const handleDownloadReport = () => {
    // In production, this would generate and download a real PDF
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'soma-sustainability-report-2024.pdf';
    // Simulate download
    alert('🎉 Sustainability report downloaded! In production, this would generate and download a comprehensive PDF report.');
  };

  const certifications = [
    { name: "Regenerative Organic", status: "Certified", emoji: "🌱", color: "bg-green-50 text-green-700" },
    { name: "Water Stewardship", status: "Gold Level", emoji: "💧", color: "bg-blue-50 text-blue-700" },
    { name: "Carbon Neutral", status: "In Progress", emoji: "🏅", color: "bg-yellow-50 text-yellow-700" },
    { name: "Biodiversity", status: "Verified", emoji: "🦋", color: "bg-purple-50 text-purple-700" },
  ];

  const environmentalImpacts = [
    { label: "Reduced water usage by 32%", type: "positive" },
    { label: "Improved soil organic matter by 18%", type: "positive" },
    { label: "Increased biodiversity index by 25%", type: "positive" },
    { label: "Reduced synthetic fertilizer use by 40%", type: "positive" },
  ];

  const improvements = [
    { label: "Expand cover crop coverage to 100%", type: "improvement" },
    { label: "Implement precision irrigation", type: "improvement" },
    { label: "Add windbreaks for erosion control", type: "improvement" },
    { label: "Integrate livestock for rotational grazing", type: "improvement" },
  ];

  return (
    <div className="min-h-screen bg-soma-grey py-8 fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sustainability Report</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive overview of your farm's environmental impact and progress
          </p>
        </div>

        {/* Report Preview */}
        <Card>
          <CardContent className="p-8">
            {/* Header */}
            <div className="border-b pb-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    🌱 Soma Sustainability Report
                  </h2>
                  <p className="text-gray-600">Generated on December 2024</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Farm ID: SMS-2024-001</div>
                  <div className="text-sm text-gray-500">Report Period: Jan - Dec 2024</div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-soma-green">{sustainabilityMetrics.soilHealthScore}</div>
                <div className="text-sm text-gray-600">Soil Health Score</div>
                <div className="text-xs text-green-600 flex items-center justify-center gap-1">
                  <ArrowUp className="w-3 h-3" />
                  {sustainabilityMetrics.improvementFromLastYear.soil}% from last year
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-500">{sustainabilityMetrics.waterEfficiency}%</div>
                <div className="text-sm text-gray-600">Water Efficiency</div>
                <div className="text-xs text-blue-600 flex items-center justify-center gap-1">
                  <ArrowUp className="w-3 h-3" />
                  {sustainabilityMetrics.improvementFromLastYear.water}% improvement
                </div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl font-bold text-soma-green">{sustainabilityMetrics.co2Sequestered}</div>
                <div className="text-sm text-gray-600">Tons CO₂ Sequestered</div>
                <div className="text-xs text-green-600 flex items-center justify-center gap-1">
                  <ArrowUp className="w-3 h-3" />
                  {sustainabilityMetrics.improvementFromLastYear.carbon}% increase
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Monthly Progress */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Monthly Sustainability Progress
                </h3>
                <div className="h-48 flex items-end justify-between space-x-1">
                  {sustainabilityMetrics.monthlyProgress.map((progress, index) => (
                    <div 
                      key={index}
                      className="bg-soma-green w-8 hover:bg-soma-green/80 transition-colors cursor-pointer"
                      style={{ height: `${(progress / 100) * 100}%` }}
                      title={`Month ${index + 1}: ${progress}%`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Jan</span>
                  <span>Jun</span>
                  <span>Dec</span>
                </div>
              </div>

              {/* Practice Implementation */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Regenerative Practices Adopted</h3>
                <div className="space-y-3">
                  {Object.entries(sustainabilityMetrics.practiceAdoption).map(([practice, percentage]) => (
                    <div key={practice}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm capitalize">
                          {practice.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-sm text-green-600">{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="border-t pt-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Impact Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    🌍 Positive Impact
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {environmentalImpacts.map((impact, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {impact.label}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">🎯 Areas for Improvement</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {improvements.map((improvement, index) => (
                      <li key={index} className="flex items-center">
                        <span className="text-yellow-500 mr-2 flex-shrink-0">→</span>
                        {improvement.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="border-t pt-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Sustainability Certifications</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {certifications.map((cert, index) => (
                  <div key={index} className={`text-center p-3 ${cert.color} rounded-lg`}>
                    <div className="text-2xl mb-1">{cert.emoji}</div>
                    <div className="text-xs font-medium">{cert.name}</div>
                    <div className="text-xs">{cert.status}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-6 text-center">
              <p className="text-sm text-gray-500 mb-4">
                This report is generated using AI-powered analysis and verified data collection methods.
              </p>
              <Button 
                onClick={handleDownloadReport}
                className="bg-soma-green hover:bg-soma-green/90 gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SustainabilityReport;
