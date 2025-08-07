package com.soma.controller;

import com.soma.dto.EarthDataResponse;
import com.soma.service.EarthDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/nasa")
@CrossOrigin(origins = "*")
public class EarthDataController {
    
    private static final Logger logger = LoggerFactory.getLogger(EarthDataController.class);
    
    @Autowired
    private EarthDataService earthDataService;
    
    @GetMapping("/earthdata")
    public ResponseEntity<EarthDataResponse> getEarthData(
            @RequestParam Double lat,
            @RequestParam Double lon) {
        
        try {
            logger.info("Received EarthData request for coordinates: lat={}, lon={}", lat, lon);
            
            if (lat == null || lon == null) {
                logger.error("Missing required parameters: lat or lon");
                return ResponseEntity.badRequest().build();
            }
            
            EarthDataResponse response = earthDataService.getEarthData(lat, lon);
            
            logger.info("Successfully processed EarthData request for coordinates: lat={}, lon={}", lat, lon);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error processing EarthData request for coordinates: lat={}, lon={}", lat, lon, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/earthdata/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("NASA EarthData service is running");
    }
}