package SunoSarkar.controller;

import SunoSarkar.dto.ComplaintRequestDto;
import SunoSarkar.entity.Complaint;
import SunoSarkar.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@CrossOrigin(origins = "*")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @PreAuthorize("hasRole('CITIZEN')")
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Complaint> fileComplaint(
            @RequestPart("complaint") String complaintJson,
            @RequestPart(value = "photos", required = false) List<MultipartFile> photos,
            Principal principal) throws IOException {

        // manually parse JSON string to DTO
        ObjectMapper mapper = new ObjectMapper();
        ComplaintRequestDto dto = mapper.readValue(complaintJson, ComplaintRequestDto.class);

        Complaint complaint = complaintService.fileComplaint(dto, photos, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(complaint);
    }

@GetMapping("/my")
public ResponseEntity<List<Complaint>> getMyComplaint(Principal principal){
return ResponseEntity.ok(complaintService.getMyComplaints(principal.getName()));
}

    @GetMapping("/area")
    @PreAuthorize("hasAnyRole('UC_CHAIRMAN','TOWN_OFFICER','MUNICIPAL_WORKER','AC','DC','MAYOR','ADMIN')")
    public ResponseEntity<Page<Complaint>> getByArea(
            @RequestParam String ucCode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(complaintService.getComplaintsByArea(ucCode, page, size));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('AC','DC','MAYOR','ADMIN')")
    public ResponseEntity<Page<Complaint>> getAllComplaints(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(complaintService.getAllComplaints(page, size));
    }
    @GetMapping("/public")
    public ResponseEntity<Page<Complaint>> getPublicComplaints(
            @RequestParam String city,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(complaintService.getPublicComplaints(city, page, size));
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
