import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Search } from "lucide-react";
import { Card } from "@/components/ui/card";

interface LocationSearchProps {
  onLocationSelect: (lat: number, lon: number, locationName: string) => void;
  placeholder?: string;
  className?: string;
}

interface LocationSuggestion {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
  display_name: string;
}

export const LocationSearch = ({ 
  onLocationSelect, 
  placeholder = "Search for a location...",
  className = ""
}: LocationSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Popular farm locations for quick access
  const popularLocations: LocationSuggestion[] = [
    { name: "Ames, Iowa", country: "USA", state: "Iowa", lat: 42.0308, lon: -93.6319, display_name: "Ames, Iowa, USA" },
    { name: "Lubbock, Texas", country: "USA", state: "Texas", lat: 35.2211, lon: -101.8313, display_name: "Lubbock, Texas, USA" },
    { name: "Lincoln, Nebraska", country: "USA", state: "Nebraska", lat: 40.8136, lon: -96.7026, display_name: "Lincoln, Nebraska, USA" },
    { name: "Manhattan, Kansas", country: "USA", state: "Kansas", lat: 39.1836, lon: -96.5717, display_name: "Manhattan, Kansas, USA" },
    { name: "Champaign, Illinois", country: "USA", state: "Illinois", lat: 40.1164, lon: -88.2434, display_name: "Champaign, Illinois, USA" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchTerm.length < 2) {
      setSuggestions(searchTerm.length === 0 ? popularLocations : []);
      setShowSuggestions(searchTerm.length === 0);
      return;
    }

    const debounceTimer = setTimeout(async () => {
      setIsLoading(true);
      try {
        // Using Nominatim (OpenStreetMap) geocoding service - free and reliable
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=8&q=${encodeURIComponent(searchTerm)}&countrycodes=us,ca&addressdetails=1`
        );
        
        if (response.ok) {
          const data = await response.json();
          const formattedSuggestions: LocationSuggestion[] = data.map((item: any) => ({
            name: item.address?.city || item.address?.town || item.address?.village || item.display_name.split(',')[0],
            country: item.address?.country || 'Unknown',
            state: item.address?.state,
            lat: parseFloat(item.lat),
            lon: parseFloat(item.lon),
            display_name: item.display_name
          }));
          
          setSuggestions(formattedSuggestions);
          setShowSuggestions(true);
          setSelectedIndex(-1);
        }
      } catch (error) {
        console.error('Error fetching location suggestions:', error);
        // Fallback to popular locations on error
        setSuggestions(popularLocations.filter(loc => 
          loc.name.toLowerCase().includes(searchTerm.toLowerCase())
        ));
        setShowSuggestions(true);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleLocationSelect(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleLocationSelect = (location: LocationSuggestion) => {
    setSearchTerm(location.display_name.split(',').slice(0, 2).join(', '));
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onLocationSelect(location.lat, location.lon, location.display_name);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Reverse geocoding to get location name
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            
            if (response.ok) {
              const data = await response.json();
              const locationName = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
              setSearchTerm(locationName.split(',').slice(0, 2).join(', '));
              onLocationSelect(latitude, longitude, locationName);
            }
          } catch (error) {
            console.error('Error getting location name:', error);
            const locationName = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            setSearchTerm(locationName);
            onLocationSelect(latitude, longitude, locationName);
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error('Error getting current location:', error);
          setIsLoading(false);
        }
      );
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => {
              // Only show suggestions if user has already typed something
              if (searchTerm.length > 0 && suggestions.length > 0) {
                setShowSuggestions(true);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="pl-10 pr-4"
            disabled={isLoading}
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCurrentLocation}
          disabled={isLoading}
          className="px-3"
        >
          <MapPin className="w-4 h-4" />
        </Button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute z-50 w-full mt-1 p-0 shadow-lg border">
          <div className="max-h-64 overflow-y-auto">
            {searchTerm.length === 0 && (
              <div className="px-4 py-2 text-sm text-gray-500 font-medium border-b">
                Popular Farm Locations
              </div>
            )}
            {suggestions.map((suggestion, index) => (
              <div
                key={`${suggestion.lat}-${suggestion.lon}-${index}`}
                className={`px-4 py-3 cursor-pointer border-b last:border-b-0 ${
                  index === selectedIndex
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleLocationSelect(suggestion)}
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {suggestion.name}
                      {suggestion.state && `, ${suggestion.state}`}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {suggestion.display_name}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};