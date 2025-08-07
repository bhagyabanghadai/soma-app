package com.soma.dto;

import java.time.LocalDateTime;

public class EarthDataResponse {
    
    private Double latitude;
    private Double longitude;
    private Double ndvi; // Normalized Difference Vegetation Index
    private Double landSurfaceTemperature; // in Celsius
    private Double evapotranspiration; // mm/day
    private String vegetationStatus;
    private String temperatureStatus;
    private String droughtRisk;
    private LocalDateTime timestamp;
    private String dataSource;
    
    // Constructors
    public EarthDataResponse() {}
    
    public EarthDataResponse(Double latitude, Double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.timestamp = LocalDateTime.now();
        this.dataSource = "NASA MODIS/GIBS";
    }
    
    // Getters and Setters
    public Double getLatitude() {
        return latitude;
    }
    
    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }
    
    public Double getLongitude() {
        return longitude;
    }
    
    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
    
    public Double getNdvi() {
        return ndvi;
    }
    
    public void setNdvi(Double ndvi) {
        this.ndvi = ndvi;
        this.vegetationStatus = calculateVegetationStatus(ndvi);
    }
    
    public Double getLandSurfaceTemperature() {
        return landSurfaceTemperature;
    }
    
    public void setLandSurfaceTemperature(Double landSurfaceTemperature) {
        this.landSurfaceTemperature = landSurfaceTemperature;
        this.temperatureStatus = calculateTemperatureStatus(landSurfaceTemperature);
    }
    
    public Double getEvapotranspiration() {
        return evapotranspiration;
    }
    
    public void setEvapotranspiration(Double evapotranspiration) {
        this.evapotranspiration = evapotranspiration;
        this.droughtRisk = calculateDroughtRisk(evapotranspiration);
    }
    
    public String getVegetationStatus() {
        return vegetationStatus;
    }
    
    public void setVegetationStatus(String vegetationStatus) {
        this.vegetationStatus = vegetationStatus;
    }
    
    public String getTemperatureStatus() {
        return temperatureStatus;
    }
    
    public void setTemperatureStatus(String temperatureStatus) {
        this.temperatureStatus = temperatureStatus;
    }
    
    public String getDroughtRisk() {
        return droughtRisk;
    }
    
    public void setDroughtRisk(String droughtRisk) {
        this.droughtRisk = droughtRisk;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public String getDataSource() {
        return dataSource;
    }
    
    public void setDataSource(String dataSource) {
        this.dataSource = dataSource;
    }
    
    // Helper methods for status calculation
    private String calculateVegetationStatus(Double ndvi) {
        if (ndvi == null) return "Unknown";
        if (ndvi > 0.7) return "Excellent";
        if (ndvi > 0.5) return "Good";
        if (ndvi > 0.3) return "Moderate";
        if (ndvi > 0.1) return "Poor";
        return "Very Poor";
    }
    
    private String calculateTemperatureStatus(Double temp) {
        if (temp == null) return "Unknown";
        if (temp > 35) return "Very Hot";
        if (temp > 30) return "Hot";
        if (temp > 25) return "Warm";
        if (temp > 15) return "Moderate";
        if (temp > 5) return "Cool";
        return "Cold";
    }
    
    private String calculateDroughtRisk(Double et) {
        if (et == null) return "Unknown";
        if (et < 2.0) return "High";
        if (et < 4.0) return "Moderate";
        return "Low";
    }
}