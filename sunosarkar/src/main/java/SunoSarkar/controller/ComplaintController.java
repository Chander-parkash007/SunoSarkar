package SunoSarkar.controller;

import SunoSarkar.dto.ComplaintRequestDto;
import SunoSarkar.entity.Complaint;
import SunoSarkar.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/auth/controller")
@CrossOrigin(origins = "*")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

@PostMapping
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<Complaint> fileComplaint(@Valid
                                                   @RequestPart("complaint")ComplaintRequestDto dto,
                                                   @RequestPart(value = "photos", required = false) List<MultipartFile> photos,
                                                   Principal principal) throws IOException {
    String email = principal.getName();
    Complaint complaint = complaintService.fileComplaint(dto,photos,email);
    return ResponseEntity.status(HttpStatus.CREATED).body(complaint);
}
@GetMapping("/my")
public ResponseEntity<List<Complaint>> getMyComplaint(Principal principal){
return ResponseEntity.ok(complaintService.getMyComplaints(principal.getName()));
}

    @PreAuthorize("hasAnyRole('UC_CHAIRMAN','TOWN_OFFICER','MUNICIPAL_WORKER','AC','DC','MAYOR','ADMIN')")
    @GetMapping("/area")
    public ResponseEntity<List<Complaint>> getCompalintsByArea(@RequestParam String ucCode){
    return ResponseEntity.ok(complaintService.getComplaintsByArea(ucCode));
    }
    @PreAuthorize("hasAnyRole('AC','DC','MAYOR','ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<Complaint>> getAllComplaints(){
    return ResponseEntity.ok(complaintService.getAllComlaints());
    }
@GetMapping("/public")
    public ResponseEntity<List<Complaint>> getPublicComplaint(@RequestParam String city){
    return ResponseEntity.ok(complaintService.getAllPublicComplaints(city));
}
    @PreAuthorize("hasAnyRole('UC_CHAIRMAN','TOWN_OFFICER','MUNICIPAL_WORKER','AC','DC','MAYOR','ADMIN')")
@PostMapping("/{id}/status")
    public ResponseEntity<Complaint> updateStatus(@PathVariable Long id,
                                                  @RequestParam String newStatus,
                                                  @RequestParam(required = false) String note,
                                                  Principal principal){
    String email = principal.getName();
    return ResponseEntity.status(HttpStatus.CREATED).body(complaintService.updateStatus(id,
            newStatus,email,note));
    }
@PreAuthorize("hasRole('CITIZEN')")
    @PostMapping("/{id}/confirm")
    public ResponseEntity<String> confirmByCitizen(@PathVariable Long id, Principal principal){
    return ResponseEntity.status(HttpStatus.CREATED).body(complaintService.complaintResolved(id,principal.getName()));
}
@PreAuthorize("hasRole('CITIZEN')")
    @PostMapping("/{id}/upVote")
    public ResponseEntity<String> upVote(@PathVariable Long id){
    return ResponseEntity.status(HttpStatus.CREATED).body(complaintService.upVoteComplaint(id));
}


}
