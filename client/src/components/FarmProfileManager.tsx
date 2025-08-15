import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Save, MapPin, Tractor, Wheat, Calendar, AlertCircle } from 'lucide-react';

interface FarmProfile {
  id: string;
  farmName: string;
  ownerName: string;
  location: {
    address: string;
    coordinates: { lat: number; lon: number };
  };
  farmSize: number;
  cropTypes: string[];
  soilType: string;
  climateZone: string;
  irrigationMethod: string;
  equipment: string[];
  certifications: string[];
  sustainabilityGoals: string[];
  notes: string;
  established: string;
  lastUpdated: string;
}

interface FarmProfileManagerProps {
  onProfileUpdate?: (profile: FarmProfile) => void;
}

const CROP_OPTIONS = [
  'corn', 'soybeans', 'wheat', 'rice', 'cotton', 'vegetables', 'fruits', 'hay', 'oats', 'barley', 'sorghum', 'sunflower'
];

const SOIL_TYPES = [
  'clay', 'sandy', 'loam', 'silt', 'rocky', 'peat', 'chalk'
];

const CLIMATE_ZONES = [
  'tropical', 'subtropical', 'temperate', 'continental', 'arid', 'semi-arid', 'mediterranean'
];

const IRRIGATION_METHODS = [
  'drip', 'sprinkler', 'flood', 'furrow', 'center-pivot', 'rain-fed', 'subsurface'
];

const EQUIPMENT_OPTIONS = [
  'tractor', 'combine-harvester', 'planter', 'cultivator', 'sprayer', 'mower', 'disc', 'plow', 'seeder'
];

const CERTIFICATIONS = [
  'organic', 'non-gmo', 'sustainable', 'fair-trade', 'rainforest-alliance', 'bird-friendly'
];

const FarmProfileManager: React.FC<FarmProfileManagerProps> = ({ onProfileUpdate }) => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<FarmProfile>({
    id: 'default-farm',
    farmName: '',
    ownerName: '',
    location: {
      address: '',
      coordinates: { lat: 0, lon: 0 }
    },
    farmSize: 0,
    cropTypes: [],
    soilType: '',
    climateZone: '',
    irrigationMethod: '',
    equipment: [],
    certifications: [],
    sustainabilityGoals: [],
    notes: '',
    established: '',
    lastUpdated: new Date().toISOString()
  });

  const [editingGoal, setEditingGoal] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Load profile from localStorage on component mount
  useEffect(() => {
    const stored = localStorage.getItem('soma-farm-profile');
    if (stored) {
      try {
        const parsedProfile = JSON.parse(stored);
        setProfile(parsedProfile);
      } catch (error) {
        console.error('Error loading farm profile:', error);
      }
    } else {
      // Set default profile for Iowa Corn Belt
      const defaultProfile: FarmProfile = {
        id: 'default-farm',
        farmName: 'Sample Farm',
        ownerName: 'Farm Owner',
        location: {
          address: 'Iowa Corn Belt, USA',
          coordinates: { lat: 42.0308, lon: -93.6319 }
        },
        farmSize: 200,
        cropTypes: ['corn', 'soybeans'],
        soilType: 'loam',
        climateZone: 'continental',
        irrigationMethod: 'center-pivot',
        equipment: ['tractor', 'combine-harvester', 'planter'],
        certifications: ['sustainable'],
        sustainabilityGoals: ['Reduce carbon footprint by 20%', 'Improve soil health'],
        notes: 'Focus on sustainable farming practices and soil conservation.',
        established: '2020',
        lastUpdated: new Date().toISOString()
      };
      setProfile(defaultProfile);
      localStorage.setItem('soma-farm-profile', JSON.stringify(defaultProfile));
    }
  }, []);

  const handleSave = () => {
    const updatedProfile = {
      ...profile,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem('soma-farm-profile', JSON.stringify(updatedProfile));
    setProfile(updatedProfile);
    
    if (onProfileUpdate) {
      onProfileUpdate(updatedProfile);
    }
    
    toast({
      title: "Profile saved",
      description: "Your farm profile has been updated successfully.",
    });
  };

  const addCropType = (cropType: string) => {
    if (!profile.cropTypes.includes(cropType)) {
      setProfile({
        ...profile,
        cropTypes: [...profile.cropTypes, cropType]
      });
    }
  };

  const removeCropType = (cropType: string) => {
    setProfile({
      ...profile,
      cropTypes: profile.cropTypes.filter(c => c !== cropType)
    });
  };

  const addEquipment = (equipment: string) => {
    if (!profile.equipment.includes(equipment)) {
      setProfile({
        ...profile,
        equipment: [...profile.equipment, equipment]
      });
    }
  };

  const removeEquipment = (equipment: string) => {
    setProfile({
      ...profile,
      equipment: profile.equipment.filter(e => e !== equipment)
    });
  };

  const addCertification = (certification: string) => {
    if (!profile.certifications.includes(certification)) {
      setProfile({
        ...profile,
        certifications: [...profile.certifications, certification]
      });
    }
  };

  const removeCertification = (certification: string) => {
    setProfile({
      ...profile,
      certifications: profile.certifications.filter(c => c !== certification)
    });
  };

  const addSustainabilityGoal = () => {
    if (editingGoal.trim() && !profile.sustainabilityGoals.includes(editingGoal.trim())) {
      setProfile({
        ...profile,
        sustainabilityGoals: [...profile.sustainabilityGoals, editingGoal.trim()]
      });
      setEditingGoal('');
    }
  };

  const removeSustainabilityGoal = (goal: string) => {
    setProfile({
      ...profile,
      sustainabilityGoals: profile.sustainabilityGoals.filter(g => g !== goal)
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tractor className="w-5 h-5" />
            Farm Profile Management
          </CardTitle>
          <p className="text-sm text-gray-600">
            Manage your farm information to get personalized recommendations
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="farmName">Farm Name</Label>
              <Input
                id="farmName"
                value={profile.farmName}
                onChange={(e) => setProfile({ ...profile, farmName: e.target.value })}
                placeholder="Enter your farm name"
                data-testid="input-farm-name"
              />
            </div>
            <div>
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input
                id="ownerName"
                value={profile.ownerName}
                onChange={(e) => setProfile({ ...profile, ownerName: e.target.value })}
                placeholder="Enter owner name"
                data-testid="input-owner-name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="farmSize">Farm Size (acres)</Label>
              <Input
                id="farmSize"
                type="number"
                value={profile.farmSize}
                onChange={(e) => setProfile({ ...profile, farmSize: parseInt(e.target.value) || 0 })}
                placeholder="Enter farm size"
                data-testid="input-farm-size"
              />
            </div>
            <div>
              <Label htmlFor="established">Year Established</Label>
              <Input
                id="established"
                type="number"
                value={profile.established}
                onChange={(e) => setProfile({ ...profile, established: e.target.value })}
                placeholder="Year established"
                data-testid="input-established"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="address">Farm Address</Label>
            <div className="flex gap-2">
              <MapPin className="w-5 h-5 text-gray-400 mt-2" />
              <Input
                id="address"
                value={profile.location.address}
                onChange={(e) => setProfile({ 
                  ...profile, 
                  location: { ...profile.location, address: e.target.value }
                })}
                placeholder="Enter farm address"
                className="flex-1"
                data-testid="input-address"
              />
            </div>
          </div>

          {/* Crop Types */}
          <div>
            <Label>Crop Types</Label>
            <div className="space-y-2">
              <Select onValueChange={addCropType}>
                <SelectTrigger data-testid="select-crop-types">
                  <SelectValue placeholder="Add crop types" />
                </SelectTrigger>
                <SelectContent>
                  {CROP_OPTIONS.map((crop) => (
                    <SelectItem key={crop} value={crop}>{crop.charAt(0).toUpperCase() + crop.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2">
                {profile.cropTypes.map((crop) => (
                  <Badge key={crop} variant="secondary" className="cursor-pointer" onClick={() => removeCropType(crop)}>
                    {crop} ×
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Environmental Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Soil Type</Label>
              <Select value={profile.soilType} onValueChange={(value) => setProfile({ ...profile, soilType: value })}>
                <SelectTrigger data-testid="select-soil-type">
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent>
                  {SOIL_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Climate Zone</Label>
              <Select value={profile.climateZone} onValueChange={(value) => setProfile({ ...profile, climateZone: value })}>
                <SelectTrigger data-testid="select-climate-zone">
                  <SelectValue placeholder="Select climate" />
                </SelectTrigger>
                <SelectContent>
                  {CLIMATE_ZONES.map((zone) => (
                    <SelectItem key={zone} value={zone}>{zone.charAt(0).toUpperCase() + zone.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Irrigation Method</Label>
              <Select value={profile.irrigationMethod} onValueChange={(value) => setProfile({ ...profile, irrigationMethod: value })}>
                <SelectTrigger data-testid="select-irrigation">
                  <SelectValue placeholder="Select irrigation" />
                </SelectTrigger>
                <SelectContent>
                  {IRRIGATION_METHODS.map((method) => (
                    <SelectItem key={method} value={method}>{method.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Advanced Settings Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full"
            data-testid="button-toggle-advanced"
          >
            {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
          </Button>

          {showAdvanced && (
            <div className="space-y-4 border-t pt-4">
              {/* Equipment */}
              <div>
                <Label>Farm Equipment</Label>
                <div className="space-y-2">
                  <Select onValueChange={addEquipment}>
                    <SelectTrigger data-testid="select-equipment">
                      <SelectValue placeholder="Add equipment" />
                    </SelectTrigger>
                    <SelectContent>
                      {EQUIPMENT_OPTIONS.map((equipment) => (
                        <SelectItem key={equipment} value={equipment}>
                          {equipment.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2">
                    {profile.equipment.map((item) => (
                      <Badge key={item} variant="outline" className="cursor-pointer" onClick={() => removeEquipment(item)}>
                        {item.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div>
                <Label>Certifications</Label>
                <div className="space-y-2">
                  <Select onValueChange={addCertification}>
                    <SelectTrigger data-testid="select-certifications">
                      <SelectValue placeholder="Add certifications" />
                    </SelectTrigger>
                    <SelectContent>
                      {CERTIFICATIONS.map((cert) => (
                        <SelectItem key={cert} value={cert}>
                          {cert.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2">
                    {profile.certifications.map((cert) => (
                      <Badge key={cert} className="cursor-pointer bg-green-100 text-green-800" onClick={() => removeCertification(cert)}>
                        {cert.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sustainability Goals */}
              <div>
                <Label>Sustainability Goals</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={editingGoal}
                      onChange={(e) => setEditingGoal(e.target.value)}
                      placeholder="Add a sustainability goal"
                      onKeyPress={(e) => e.key === 'Enter' && addSustainabilityGoal()}
                      data-testid="input-sustainability-goal"
                    />
                    <Button onClick={addSustainabilityGoal} disabled={!editingGoal.trim()} data-testid="button-add-goal">
                      Add
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {profile.sustainabilityGoals.map((goal, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                        <span className="text-sm">{goal}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSustainabilityGoal(goal)}
                          className="text-red-500 hover:text-red-700"
                          data-testid={`button-remove-goal-${index}`}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={profile.notes}
                  onChange={(e) => setProfile({ ...profile, notes: e.target.value })}
                  placeholder="Additional information about your farm operations, practices, or goals"
                  rows={3}
                  data-testid="textarea-notes"
                />
              </div>
            </div>
          )}

          {/* Save Button */}
          <Button onClick={handleSave} className="w-full" data-testid="button-save-profile">
            <Save className="w-4 h-4 mr-2" />
            Save Farm Profile
          </Button>

          {/* Last Updated */}
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Last updated: {new Date(profile.lastUpdated).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FarmProfileManager;