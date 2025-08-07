package com.soma.dto;

public class EarthDataRequest {
    
    private Double lat;
    private Double lon;
    
    // Constructors
    public EarthDataRequest() {}
    
    public EarthDataRequest(Double lat, Double lon) {
        this.lat = lat;
        this.lon = lon;
    }
    
    // Getters and Setters
    public Double getLat() {
        return lat;
    }
    
    public void setLat(Double lat) {
        this.lat = lat;
    }
    
    public Double getLon() {
        return lon;
    }
    
    public void setLon(Double lon) {
        this.lon = lon;
    }
}