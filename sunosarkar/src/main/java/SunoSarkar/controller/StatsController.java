package SunoSarkar.controller;

import SunoSarkar.service.StatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "*")
public class StatsController {

    @Autowired
    private StatsService statsService;

    // Overall city stats
    @GetMapping("/city/{city}")
    public ResponseEntity<Map<String, Object>> getCityStats(@PathVariable String city) {
        return ResponseEntity.ok(statsService.getCityStats(city));
    }

    // Category breakdown
    @GetMapping("/categories/{city}")
    public ResponseEntity<Map<String, Long>> getCategoryBreakdown(@PathVariable String city) {
        return ResponseEntity.ok(statsService.getCategoryBreakdown(city));
    }

    // Status breakdown
    @GetMapping("/status/{city}")
    public ResponseEntity<Map<String, Long>> getStatusBreakdown(@PathVariable String city) {
        return ResponseEntity.ok(statsService.getStatusBreakdown(city));
    }
}
