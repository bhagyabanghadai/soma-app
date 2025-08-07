package com.soma.controller;

import com.soma.dto.TipDto;
import com.soma.model.Tip;
import com.soma.service.TipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tips")
@RequiredArgsConstructor
@Tag(name = "Regenerative Tips", description = "Regenerative farming tips management")
public class TipController {
    
    private final TipService tipService;
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new tip (Admin only)")
    public ResponseEntity<Tip> createTip(@Valid @RequestBody TipDto tipDto) {
        Tip tip = tipService.createTip(tipDto);
        return ResponseEntity.ok(tip);
    }
    
    @GetMapping
    @Operation(summary = "Get all tips")
    public ResponseEntity<List<Tip>> getAllTips() {
        List<Tip> tips = tipService.getAllTips();
        return ResponseEntity.ok(tips);
    }
    
    @GetMapping("/{id}")
    @Operation(summary = "Get tip by ID")
    public ResponseEntity<Tip> getTipById(@PathVariable Long id) {
        Tip tip = tipService.getTipById(id);
        return ResponseEntity.ok(tip);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update tip (Admin only)")
    public ResponseEntity<Tip> updateTip(@PathVariable Long id, @Valid @RequestBody TipDto tipDto) {
        Tip updatedTip = tipService.updateTip(id, tipDto);
        return ResponseEntity.ok(updatedTip);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete tip (Admin only)")
    public ResponseEntity<Void> deleteTip(@PathVariable Long id) {
        tipService.deleteTip(id);
        return ResponseEntity.noContent().build();
    }
}