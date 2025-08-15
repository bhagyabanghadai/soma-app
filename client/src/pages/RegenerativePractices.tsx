import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useQuery } from "@tanstack/react-query";
import { 
  Leaf, 
  Target, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  CheckCircle2,
  Plus,
  Trash2,
  Save,
  AlertCircle,
  BarChart3,
  MapPin
} from "lucide-react";

interface Practice {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeToResults: string;
  costLevel: 'Low' | 'Medium' | 'High';
  soilHealthImpact: number;
  carbonImpact: number;
  waterImpact: number;
  biodiversityImpact: number;
  implementation: {
    steps: string[];
    timeline: string;
    requirements: string[];
  };
}

interface UserPractice {
  practiceId: string;
  status: 'planned' | 'implementing' | 'completed';
  startDate: string;
  notes: string;
  progress: number;
}

interface FarmProfile {
  location: string;
  farmSize: number;
  cropTypes: string[];
  currentPractices: UserPractice[];
  soilType: string;
  climateZone: string;
}

// Comprehensive regenerative practices database
const regenerativePractices: Practice[] = [
  {
    id: 'cover-crops',
    name: 'Cover Cropping',
    description: 'Plant cover crops during off-season to improve soil health and prevent erosion',
    category: 'Soil Health',
    difficulty: 'Easy',
    timeToResults: '3-6 months',
    costLevel: 'Low',
    soilHealthImpact: 25,
    carbonImpact: 20,
    waterImpact: 15,
    biodiversityImpact: 30,
    implementation: {
      steps: [
        'Choose appropriate cover crop species for your region and soil type',
        'Calculate seeding rates based on field size',
        'Prepare seedbed with minimal tillage',
        'Plant cover crops immediately after harvest',
        'Monitor growth and document progress'
      ],
      timeline: 'Plant in fall, terminate in spring before cash crop planting',
      requirements: ['Seeds', 'Seeding equipment', 'Soil test results']
    }
  },
  {
    id: 'no-till',
    name: 'No-Till Farming',
    description: 'Eliminate or greatly reduce soil tillage to preserve soil structure',
    category: 'Soil Conservation',
    difficulty: 'Medium',
    timeToResults: '1-2 years',
    costLevel: 'Medium',
    soilHealthImpact: 30,
    carbonImpact: 25,
    waterImpact: 20,
    biodiversityImpact: 15,
    implementation: {
      steps: [
        'Invest in no-till planting equipment',
        'Develop residue management plan',
        'Adjust fertilizer and pesticide strategies',
        'Monitor soil compaction carefully',
        'Track soil health improvements over time'
      ],
      timeline: 'Transition over 2-3 growing seasons',
      requirements: ['No-till planter', 'Residue management tools', 'Soil health monitoring']
    }
  },
  {
    id: 'crop-rotation',
    name: 'Diverse Crop Rotation',
    description: 'Rotate different crop types to break pest cycles and improve soil nutrients',
    category: 'Crop Management',
    difficulty: 'Easy',
    timeToResults: '1 growing season',
    costLevel: 'Low',
    soilHealthImpact: 20,
    carbonImpact: 15,
    waterImpact: 10,
    biodiversityImpact: 25,
    implementation: {
      steps: [
        'Analyze current rotation and identify gaps',
        'Research compatible crop combinations',
        'Plan 3-4 year rotation schedule',
        'Adjust equipment needs for new crops',
        'Track economic and environmental benefits'
      ],
      timeline: 'Plan in winter, implement next growing season',
      requirements: ['Crop planning software', 'Market research', 'Seed sources']
    }
  },
  {
    id: 'compost',
    name: 'Composting & Organic Matter',
    description: 'Add organic matter through composting to improve soil biology',
    category: 'Soil Health',
    difficulty: 'Medium',
    timeToResults: '6-12 months',
    costLevel: 'Medium',
    soilHealthImpact: 35,
    carbonImpact: 30,
    waterImpact: 25,
    biodiversityImpact: 20,
    implementation: {
      steps: [
        'Identify organic matter sources (crop residues, manure, food waste)',
        'Set up composting area with proper drainage',
        'Monitor temperature and moisture during composting',
        'Apply finished compost at recommended rates',
        'Test soil organic matter levels regularly'
      ],
      timeline: '3-6 months for composting, apply seasonally',
      requirements: ['Organic materials', 'Composting area', 'Application equipment']
    }
  },
  {
    id: 'precision-irrigation',
    name: 'Precision Irrigation',
    description: 'Use smart irrigation systems to optimize water use efficiency',
    category: 'Water Management',
    difficulty: 'Hard',
    timeToResults: '1 growing season',
    costLevel: 'High',
    soilHealthImpact: 10,
    carbonImpact: 15,
    waterImpact: 40,
    biodiversityImpact: 10,
    implementation: {
      steps: [
        'Install soil moisture sensors throughout fields',
        'Set up automated irrigation control system',
        'Create irrigation zones based on soil and crop needs',
        'Program irrigation schedules based on weather data',
        'Monitor water usage and adjust as needed'
      ],
      timeline: 'Install in spring, optimize throughout growing season',
      requirements: ['Moisture sensors', 'Automated controllers', 'Weather station', 'Technical training']
    }
  },
  {
    id: 'integrated-pest',
    name: 'Integrated Pest Management',
    description: 'Use biological and cultural methods to manage pests sustainably',
    category: 'Pest Control',
    difficulty: 'Medium',
    timeToResults: '1-2 years',
    costLevel: 'Medium',
    soilHealthImpact: 15,
    carbonImpact: 20,
    waterImpact: 15,
    biodiversityImpact: 35,
    implementation: {
      steps: [
        'Scout fields regularly for pest and beneficial insects',
        'Establish economic thresholds for pest intervention',
        'Introduce beneficial insects and habitat',
        'Use targeted treatments only when necessary',
        'Monitor and document pest management effectiveness'
      ],
      timeline: 'Implement gradually over 2-3 seasons',
      requirements: ['Pest identification guides', 'Beneficial insect sources', 'Monitoring tools']
    }
  }
];

const RegenerativePractices = () => {
  const [farmProfile, setFarmProfile] = useState<FarmProfile | null>(null);
  const [selectedPractice, setSelectedPractice] = useState<Practice | null>(null);
  const [userPractices, setUserPractices] = useState<UserPractice[]>([]);
  const [newPractice, setNewPractice] = useState<Partial<UserPractice>>({});
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Get live environmental data for context
  const { data: environmentalData } = useQuery({
    queryKey: ['/api/nasa/earthdata', 42.0308, -93.6319],
    enabled: !!farmProfile,
  });

  // Initialize farm profile
  useEffect(() => {
    const stored = localStorage.getItem('soma-farm-profile');
    if (stored) {
      const profile = JSON.parse(stored);
      setFarmProfile(profile);
      setUserPractices(profile.currentPractices || []);
    } else {
      const defaultProfile: FarmProfile = {
        location: "Iowa Corn Belt",
        farmSize: 200,
        cropTypes: ["corn", "soybeans"],
        currentPractices: [],
        soilType: "Prairie Soil",
        climateZone: "Temperate Continental"
      };
      setFarmProfile(defaultProfile);
      setUserPractices([]);
    }
  }, []);

  // Save practices to localStorage
  const savePractices = () => {
    if (farmProfile) {
      const updatedProfile = { ...farmProfile, currentPractices: userPractices };
      localStorage.setItem('soma-farm-profile', JSON.stringify(updatedProfile));
      setFarmProfile(updatedProfile);
    }
  };

  // Add a practice to user's implementation plan
  const addPractice = (practiceId: string) => {
    const newUserPractice: UserPractice = {
      practiceId,
      status: 'planned',
      startDate: new Date().toISOString().split('T')[0],
      notes: '',
      progress: 0
    };
    setUserPractices([...userPractices, newUserPractice]);
  };

  // Update practice progress
  const updatePractice = (practiceId: string, updates: Partial<UserPractice>) => {
    setUserPractices(practices => 
      practices.map(p => 
        p.practiceId === practiceId ? { ...p, ...updates } : p
      )
    );
  };

  // Remove practice
  const removePractice = (practiceId: string) => {
    setUserPractices(practices => practices.filter(p => p.practiceId !== practiceId));
  };

  // Calculate overall farm sustainability score
  const calculateSustainabilityScore = () => {
    if (userPractices.length === 0) return 0;

    const totalImpact = userPractices.reduce((acc, userPractice) => {
      const practice = regenerativePractices.find(p => p.id === userPractice.practiceId);
      if (practice && userPractice.status === 'completed') {
        return acc + practice.soilHealthImpact + practice.carbonImpact + 
               practice.waterImpact + practice.biodiversityImpact;
      }
      return acc;
    }, 0);

    return Math.min(100, Math.round((totalImpact / 4) / userPractices.length));
  };

  // Get AI recommendations based on environmental data
  const getAIRecommendations = () => {
    const recommendations = [];
    
    if ((environmentalData as any)?.ndvi < 0.5) {
      recommendations.push({
        priority: 'High',
        practice: 'cover-crops',
        reason: 'Low vegetation index indicates need for soil health improvement',
        timeframe: 'Next planting season'
      });
    }

    if ((environmentalData as any)?.droughtRisk === 'High') {
      recommendations.push({
        priority: 'High', 
        practice: 'precision-irrigation',
        reason: 'High drought risk requires water conservation strategies',
        timeframe: 'Before next dry season'
      });
    }

    // Add based on farm size and current practices
    if (farmProfile && farmProfile.farmSize > 100 && !userPractices.some(p => p.practiceId === 'no-till')) {
      recommendations.push({
        priority: 'Medium',
        practice: 'no-till',
        reason: 'Large farm size would benefit significantly from no-till practices',
        timeframe: '1-2 years for full transition'
      });
    }

    return recommendations;
  };

  const categories = Array.from(new Set(regenerativePractices.map(p => p.category)));
  const filteredPractices = filterCategory === 'all' 
    ? regenerativePractices 
    : regenerativePractices.filter(p => p.category === filterCategory);
  
  const sustainabilityScore = calculateSustainabilityScore();
  const recommendations = getAIRecommendations();

  if (!farmProfile) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p>Loading farm profile...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Regenerative Practices Manager</h1>
          <p className="text-gray-600 mt-2">
            Plan, implement, and track sustainable farming practices for {farmProfile.location}
          </p>
        </div>

        {/* Farm Overview & Score */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {sustainabilityScore}
                </div>
                <div className="text-sm text-gray-600">Sustainability Score</div>
                <Progress value={sustainabilityScore} className="h-2 mt-3" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {userPractices.length}
                  </div>
                  <div className="text-sm text-gray-600">Active Practices</div>
                </div>
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {userPractices.filter(p => p.status === 'completed').length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {farmProfile.farmSize}
                  </div>
                  <div className="text-sm text-gray-600">Acres</div>
                </div>
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        {recommendations.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🤖 Smart Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((rec, index) => {
                  const practice = regenerativePractices.find(p => p.id === rec.practice);
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className={
                          rec.priority === 'High' ? 'bg-red-100 text-red-800' :
                          rec.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }>
                          {rec.priority}
                        </Badge>
                        <span className="text-sm text-gray-600">{rec.timeframe}</span>
                      </div>
                      <h4 className="font-medium text-gray-900 mb-1">{practice?.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{rec.reason}</p>
                      {!userPractices.some(p => p.practiceId === rec.practice) && (
                        <Button 
                          size="sm" 
                          onClick={() => addPractice(rec.practice)}
                          className="w-full"
                        >
                          Add to Plan
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Practices Library */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-green-600" />
                    Available Practices
                  </CardTitle>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPractices.map((practice) => {
                    const isImplemented = userPractices.some(p => p.practiceId === practice.id);
                    return (
                      <div 
                        key={practice.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedPractice(practice)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">{practice.name}</h3>
                            {isImplemented && (
                              <Badge className="bg-green-100 text-green-800">Active</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{practice.difficulty}</Badge>
                            <Badge variant="outline">{practice.costLevel} Cost</Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{practice.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            Results in {practice.timeToResults}
                          </span>
                          {!isImplemented && (
                            <Button 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                addPractice(practice.id);
                              }}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* My Implementation Plan */}
          <div>
            <div className="sticky top-8 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    My Implementation Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {userPractices.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No practices added yet</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Add practices from the library to start your sustainability journey
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userPractices.map((userPractice) => {
                        const practice = regenerativePractices.find(p => p.id === userPractice.practiceId);
                        if (!practice) return null;

                        return (
                          <div key={userPractice.practiceId} className="border rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{practice.name}</h4>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removePractice(userPractice.practiceId)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="space-y-3">
                              <div>
                                <Label>Status</Label>
                                <Select 
                                  value={userPractice.status}
                                  onValueChange={(value) => 
                                    updatePractice(userPractice.practiceId, { status: value as any })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="planned">Planned</SelectItem>
                                    <SelectItem value="implementing">Implementing</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div>
                                <Label>Start Date</Label>
                                <Input
                                  type="date"
                                  value={userPractice.startDate}
                                  onChange={(e) => 
                                    updatePractice(userPractice.practiceId, { startDate: e.target.value })
                                  }
                                />
                              </div>

                              <div>
                                <Label>Progress (%)</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={userPractice.progress}
                                  onChange={(e) => 
                                    updatePractice(userPractice.practiceId, { progress: parseInt(e.target.value) || 0 })
                                  }
                                />
                                <Progress value={userPractice.progress} className="h-2 mt-2" />
                              </div>

                              <div>
                                <Label>Notes</Label>
                                <Textarea
                                  value={userPractice.notes}
                                  onChange={(e) => 
                                    updatePractice(userPractice.practiceId, { notes: e.target.value })
                                  }
                                  placeholder="Implementation notes..."
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      
                      <Button onClick={savePractices} className="w-full">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Practice Detail Modal */}
        {selectedPractice && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedPractice.name}</CardTitle>
                  <Button variant="outline" onClick={() => setSelectedPractice(null)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-gray-600">{selectedPractice.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="font-medium">Difficulty</Label>
                    <Badge variant="outline" className="block text-center mt-1">
                      {selectedPractice.difficulty}
                    </Badge>
                  </div>
                  <div>
                    <Label className="font-medium">Cost Level</Label>
                    <Badge variant="outline" className="block text-center mt-1">
                      {selectedPractice.costLevel}
                    </Badge>
                  </div>
                </div>

                <div>
                  <Label className="font-medium mb-2 block">Expected Impact</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Soil Health</span>
                        <span className="text-sm">+{selectedPractice.soilHealthImpact}%</span>
                      </div>
                      <Progress value={selectedPractice.soilHealthImpact} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Carbon Impact</span>
                        <span className="text-sm">+{selectedPractice.carbonImpact}%</span>
                      </div>
                      <Progress value={selectedPractice.carbonImpact} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Water Efficiency</span>
                        <span className="text-sm">+{selectedPractice.waterImpact}%</span>
                      </div>
                      <Progress value={selectedPractice.waterImpact} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Biodiversity</span>
                        <span className="text-sm">+{selectedPractice.biodiversityImpact}%</span>
                      </div>
                      <Progress value={selectedPractice.biodiversityImpact} className="h-2" />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="font-medium mb-2 block">Implementation Steps</Label>
                  <ol className="list-decimal list-inside space-y-2">
                    {selectedPractice.implementation.steps.map((step, index) => (
                      <li key={index} className="text-sm text-gray-600">{step}</li>
                    ))}
                  </ol>
                </div>

                <div>
                  <Label className="font-medium mb-2 block">Timeline</Label>
                  <p className="text-sm text-gray-600">{selectedPractice.implementation.timeline}</p>
                </div>

                <div>
                  <Label className="font-medium mb-2 block">Requirements</Label>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedPractice.implementation.requirements.map((req, index) => (
                      <li key={index} className="text-sm text-gray-600">{req}</li>
                    ))}
                  </ul>
                </div>

                {!userPractices.some(p => p.practiceId === selectedPractice.id) && (
                  <Button 
                    onClick={() => {
                      addPractice(selectedPractice.id);
                      setSelectedPractice(null);
                    }}
                    className="w-full"
                  >
                    Add to My Plan
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegenerativePractices;