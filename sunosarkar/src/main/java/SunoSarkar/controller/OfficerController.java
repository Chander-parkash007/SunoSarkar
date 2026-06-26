package SunoSarkar.controller;

import SunoSarkar.entity.Complaint;
import SunoSarkar.service.ComplaintService;
import SunoSarkar.service.OfficerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/officer")
@CrossOrigin(origins = "*")
public class OfficerController {
    @Autowired
    private OfficerService officerService;
    @Autowired
    private ComplaintService complaintService;

    @PreAuthorize("hasAnyRole('UC_CHAIRMAN','TOWN_OFFICER','MUNICIPAL_WORKER','AC','DC','MAYOR','ADMIN')")
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String,Object>> getDashboard(Principal principal){
        return ResponseEntity.ok(officerService.getDashboard(principal.getName()));
    }

    @PreAuthorize("hasAnyRole('UC_CHAIRMAN','TOWN_OFFICER','MUNICIPAL_WORKER','AC','DC','MAYOR','ADMIN')")
    @GetMapping("/pending")
    public ResponseEntity<List<Complaint>> getPendingCompaint(Principal principal){
        return ResponseEntity.ok(officerService.getPendingComplaints(principal.getName()));
    }

    @GetMapping
    public ResponseEntity<Map<String,Object>> getLeaderBoard(){
        return ResponseEntity.ok(officerService.getLeaderBoard());
    }
}
