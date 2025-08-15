// API Response Normalization and Enhancement Layer
// Phase 1 improvement: Data standardization and caching

export interface NormalizedTemperature {
  celsius: number;
  fahrenheit: number;
  unit: 'C' | 'F';
}

export interface DataQualityScore {
  freshness: number; // 1-5
  consistency: number; // 1-5  
  accuracy: number; // 1-5
  overall: number; // 1-5
}

export interface CachedData {
  data: any;
  timestamp: number;
  location: { lat: number; lon: number };
  expiresAt: number;
}

class APIDataManager {
  private cache = new Map<string, CachedData>();
  
  // Cache expiration times (in minutes)
  private readonly CACHE_EXPIRY = {
    weather: 15,
    airQuality: 30,
    earthData: 240, // 4 hours
  };

  /**
   * Normalize temperature data from various sources
   */
  normalizeTemperature(temp: number, unit: string): NormalizedTemperature {
    const cleanUnit = unit.toUpperCase().charAt(0) as 'C' | 'F';
    
    let celsius: number;
    let fahrenheit: number;
    
    if (cleanUnit === 'F') {
      fahrenheit = temp;
      celsius = (temp - 32) * 5/9;
    } else {
      celsius = temp;
      fahrenheit = (temp * 9/5) + 32;
    }

    // Validate temperature ranges
    if (celsius < -90 || celsius > 60) {
      console.warn(`Suspicious temperature reading: ${celsius}°C`);
    }

    return {
      celsius: Math.round(celsius * 10) / 10,
      fahrenheit: Math.round(fahrenheit * 10) / 10,
      unit: cleanUnit
    };
  }

  /**
   * Validate NDVI values and flag anomalies
   */
  validateNDVI(ndvi: number): { value: number; isValid: boolean; warning?: string } {
    if (ndvi < -1 || ndvi > 1) {
      return {
        value: Math.max(-1, Math.min(1, ndvi)),
        isValid: false,
        warning: `NDVI value ${ndvi} is outside valid range [-1, 1]`
      };
    }
    
    return { value: ndvi, isValid: true };
  }

  /**
   * Cross-validate temperature data between NASA and NWS
   */
  crossValidateTemperature(nasaTemp: number, nwsTemp: number, unit: string): {
    isConsistent: boolean;
    difference: number;
    warning?: string;
  } {
    const nasa = this.normalizeTemperature(nasaTemp, unit);
    const nws = this.normalizeTemperature(nwsTemp, unit);
    
    const difference = Math.abs(nasa.celsius - nws.celsius);
    const isConsistent = difference <= 5; // 5°C tolerance
    
    return {
      isConsistent,
      difference,
      warning: !isConsistent ? 
        `Temperature mismatch: NASA ${nasa.celsius}°C vs NWS ${nws.celsius}°C` : 
        undefined
    };
  }

  /**
   * Calculate data quality score based on freshness, consistency, and accuracy
   */
  calculateDataQuality(data: {
    timestamp?: string | number;
    hasLocationMatch?: boolean;
    hasConsistentValues?: boolean;
    sourceReliability?: number;
  }): DataQualityScore {
    let freshness = 3;
    let consistency = 3; 
    let accuracy = 3;

    // Freshness scoring
    if (data.timestamp) {
      const age = Date.now() - (typeof data.timestamp === 'string' ? 
        new Date(data.timestamp).getTime() : data.timestamp);
      const ageMinutes = age / (1000 * 60);
      
      if (ageMinutes <= 15) freshness = 5;
      else if (ageMinutes <= 60) freshness = 4;
      else if (ageMinutes <= 240) freshness = 3;
      else if (ageMinutes <= 1440) freshness = 2;
      else freshness = 1;
    }

    // Consistency scoring
    if (data.hasConsistentValues !== undefined) {
      consistency = data.hasConsistentValues ? 5 : 2;
    }

    // Accuracy scoring  
    if (data.sourceReliability) {
      accuracy = Math.min(5, Math.max(1, data.sourceReliability));
    }

    const overall = Math.round((freshness + consistency + accuracy) / 3);

    return { freshness, consistency, accuracy, overall };
  }

  /**
   * Cache data with location-based key and expiration
   */
  cacheData(type: keyof typeof this.CACHE_EXPIRY, data: any, location: { lat: number; lon: number }): void {
    const key = `${type}_${location.lat}_${location.lon}`;
    const expirationMs = this.CACHE_EXPIRY[type] * 60 * 1000;
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      location,
      expiresAt: Date.now() + expirationMs
    });
  }

  /**
   * Retrieve cached data if still valid
   */
  getCachedData(type: keyof typeof this.CACHE_EXPIRY, location: { lat: number; lon: number }): CachedData | null {
    const key = `${type}_${location.lat}_${location.lon}`;
    const cached = this.cache.get(key);
    
    if (!cached || Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return cached;
  }

  /**
   * Check if data is stale (past 50% of expiration time)
   */
  isDataStale(type: keyof typeof this.CACHE_EXPIRY, location: { lat: number; lon: number }): boolean {
    const cached = this.getCachedData(type, location);
    if (!cached) return true;
    
    const halfLife = (this.CACHE_EXPIRY[type] * 60 * 1000) / 2;
    const age = Date.now() - cached.timestamp;
    
    return age > halfLife;
  }

  /**
   * Clear cache for location change
   */
  clearCacheForLocation(location: { lat: number; lon: number }): void {
    const keysToDelete = Array.from(this.cache.keys()).filter(key => 
      key.includes(`_${location.lat}_${location.lon}`)
    );
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  /**
   * Enhanced API fetch with caching and normalization
   */
  async fetchWithCache<T>(
    url: string,
    type: keyof typeof this.CACHE_EXPIRY,
    location: { lat: number; lon: number },
    transformer?: (data: any) => T
  ): Promise<{ data: T; quality: DataQualityScore; fromCache: boolean; isStale: boolean }> {
    
    // Check cache first
    const cached = this.getCachedData(type, location);
    const isStale = this.isDataStale(type, location);
    
    if (cached && !isStale) {
      return {
        data: transformer ? transformer(cached.data) : cached.data,
        quality: this.calculateDataQuality({ 
          timestamp: cached.timestamp,
          hasLocationMatch: true,
          sourceReliability: 4
        }),
        fromCache: true,
        isStale: false
      };
    }

    // Fetch fresh data
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const rawData = await response.json();
      const processedData = transformer ? transformer(rawData) : rawData;
      
      // Cache the raw data
      this.cacheData(type, rawData, location);
      
      return {
        data: processedData,
        quality: this.calculateDataQuality({
          timestamp: Date.now(),
          hasLocationMatch: true,
          sourceReliability: 5
        }),
        fromCache: false,
        isStale: false
      };
      
    } catch (error) {
      // Return stale cache if available during error
      if (cached) {
        console.warn(`Using stale ${type} data due to fetch error:`, error);
        return {
          data: transformer ? transformer(cached.data) : cached.data,
          quality: this.calculateDataQuality({ 
            timestamp: cached.timestamp,
            hasLocationMatch: true,
            sourceReliability: 2
          }),
          fromCache: true,
          isStale: true
        };
      }
      
      throw error;
    }
  }
}

// Export singleton instance
export const apiDataManager = new APIDataManager();

// Utility functions for UI components
export const formatDataAge = (timestamp: number): string => {
  const ageMs = Date.now() - timestamp;
  const ageMinutes = Math.floor(ageMs / (1000 * 60));
  
  if (ageMinutes < 1) return 'Just now';
  if (ageMinutes < 60) return `${ageMinutes}m ago`;
  
  const ageHours = Math.floor(ageMinutes / 60);
  if (ageHours < 24) return `${ageHours}h ago`;
  
  const ageDays = Math.floor(ageHours / 24);
  return `${ageDays}d ago`;
};

export const getQualityColor = (quality: number): string => {
  if (quality >= 4) return 'text-green-600';
  if (quality >= 3) return 'text-yellow-600';
  return 'text-red-600';
};

export const getQualityLabel = (quality: number): string => {
  if (quality >= 4) return 'Excellent';
  if (quality >= 3) return 'Good';
  if (quality >= 2) return 'Fair';
  return 'Poor';
};