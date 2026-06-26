package SunoSarkar.controller;

import SunoSarkar.entity.EmergencyContact;
import SunoSarkar.service.EmergencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergency")
@CrossOrigin(origins = "*")
public class EmergencyController {
    @Autowired
    private EmergencyService service;
    @GetMapping("/{city}")
    public ResponseEntity<List<EmergencyContact>> getByCity(@PathVariable String city){
        return ResponseEntity.ok(service.getByCityAndNational(city));
    }
    @PostMapping
    public ResponseEntity<EmergencyContact> add(EmergencyContact contact){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(contact));
    }
}
