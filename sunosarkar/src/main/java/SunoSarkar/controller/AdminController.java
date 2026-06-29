package SunoSarkar.controller;

import SunoSarkar.entity.Complaint;
import SunoSarkar.entity.Officer;
import SunoSarkar.entity.User;
import SunoSarkar.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;
@GetMapping("/users")
    public ResponseEntity<List<User>> getAllComplaints(){
        return ResponseEntity.ok(adminService.getAllUsers());
    }
    @GetMapping("/officers")
    public ResponseEntity<List<Officer>> getAllOfficers(){
        return ResponseEntity.ok(adminService.getAllOfficers());
    }
    @GetMapping("/officers/pending")
public ResponseEntity<List<Officer>> getPendingOfficers(){
        return ResponseEntity.ok(adminService.getPendingOfficer());
}
@PutMapping("/officers/{id}/verify")
public ResponseEntity<String> verifyOfficer(@PathVariable Long id){
        return ResponseEntity.status(HttpStatus.CREATED).body(adminService.verifyOfficer(id));
}
@PutMapping("/users/{id}/deactivate")
    public ResponseEntity<String> deactivateUsers(@PathVariable Long id){
    return ResponseEntity.status(HttpStatus.CREATED).body(adminService.deactivateUser(id));
}
@GetMapping("stats")
    public ResponseEntity<Map<String, Object>> platfromStats(){
    return ResponseEntity.ok(adminService.getPlatformStats());
}


}
