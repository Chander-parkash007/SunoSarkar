package SunoSarkar.controller;

import SunoSarkar.dto.ComplaintRequestDto;
import SunoSarkar.entity.Complaint;
import SunoSarkar.entity.ComplaintPhoto;
import SunoSarkar.service.ComplaintService;
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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.transaction.annotation.Transactional;


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
        ObjectMapper mapper = new ObjectMapper();
        ComplaintRequestDto dto = mapper.readValue(complaintJson, ComplaintRequestDto.class);
        Complaint complaint = complaintService.fileComplaint(dto, photos, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(complaint);
    }
@Transactional
    @GetMapping("/my")
    public ResponseEntity<List<Complaint>> getMyComplaint(Principal principal) {
        return ResponseEntity.ok(complaintService.getMyComplaints(principal.getName()));
    }
    @Transactional
    @GetMapping("/area")
    @PreAuthorize("hasAnyRole('UC_CHAIRMAN','TOWN_OFFICER','MUNICIPAL_WORKER','AC','DC','MAYOR','ADMIN')")
    public ResponseEntity<Map<String, Object>> getByArea(
            @RequestParam String ucCode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Complaint> result = complaintService.getComplaintsByArea(ucCode, page, size);
        return ResponseEntity.ok(buildPageResponse(result));
    }
    @Transactional
    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('AC','DC','MAYOR','ADMIN')")
    public ResponseEntity<Map<String, Object>> getAllComplaints(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Complaint> result = complaintService.getAllComplaints(page, size);
        return ResponseEntity.ok(buildPageResponse(result));
    }
    @Transactional
    @GetMapping("/public")
    public ResponseEntity<Map<String, Object>> getPublicComplaints(
            @RequestParam String city,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Complaint> result = complaintService.getPublicComplaints(city, page, size);
        return ResponseEntity.ok(buildPageResponse(result));
    }

    @PreAuthorize("hasAnyRole('UC_CHAIRMAN','TOWN_OFFICER','MUNICIPAL_WORKER','AC','DC','MAYOR','ADMIN')")
    @PostMapping("/{id}/status")
    public ResponseEntity<Complaint> updateStatus(@PathVariable Long id,
                                                  @RequestParam String newStatus,
                                                  @RequestParam(required = false) String note,
                                                  Principal principal) {
        String email = principal.getName();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(complaintService.updateStatus(id, newStatus, email, note));
    }

    @PreAuthorize("hasRole('CITIZEN')")
    @PostMapping("/{id}/confirm")
    public ResponseEntity<String> confirmByCitizen(@PathVariable Long id, Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(complaintService.complaintResolved(id, principal.getName()));
    }

    @PreAuthorize("hasRole('CITIZEN')")
    @PostMapping("/{id}/upVote")
    public ResponseEntity<String> upVote(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(complaintService.upVoteComplaint(id));
    }
    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> test() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "working");
        response.put("time", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }

    private Map<String, Object> buildPageResponse(Page<Complaint> page) {
        System.out.println("=== buildPageResponse called, size: " + page.getContent().size());
        Map<String, Object> response = new HashMap<>();
        List<Map<String, Object>> content = new ArrayList<>();
        for (Complaint c : page.getContent()) {
            System.out.println("=== processing complaint id: " + c.getId());
            Map<String, Object> item = new HashMap<>();
            item.put("id", c.getId());
            item.put("title", c.getTitle());
            item.put("description", c.getDescription());
            item.put("category", c.getCategory() != null ? c.getCategory().name() : null);
            item.put("priority", c.getPriority() != null ? c.getPriority().name() : null);
            item.put("status", c.getStatus() != null ? c.getStatus().name() : null);
            item.put("locationLink", c.getLocationLink());
            item.put("city", c.getCity());
            item.put("ucCode", c.getUcCode());
            item.put("areaAddress", c.getAreaAddress());
            item.put("upVoteCount", c.getUpVoteCount());
            item.put("isConfirmedResolved", c.getIsConfirmedResolved());
            item.put("userFeedback", c.getUserFeedback());
            item.put("feedbackRating", c.getFeedbackRating());
            item.put("createdAt", c.getCreatedAt() != null ? c.getCreatedAt().toString() : null);
            item.put("resolvedAt", c.getResolvedAt() != null ? c.getResolvedAt().toString() : null);
            List<String> photoUrls = new ArrayList<>();
            if (c.getPhotos() != null) {
                for (ComplaintPhoto p : c.getPhotos()) {
                    photoUrls.add(p.getPhotoUrl());
                }
            }
            item.put("photoUrls", photoUrls);
            item.put("userName", c.getUser() != null ? c.getUser().getFullName() : null);
            item.put("userEmail", c.getUser() != null ? c.getUser().getEmail() : null);
            item.put("userCity", c.getUser() != null ? c.getUser().getCity() : null);
            item.put("userProfilePhoto", c.getUser() != null ? c.getUser().getProfilePhoto() : null);
            content.add(item);
        }
        response.put("content", content);
        response.put("totalElements", page.getTotalElements());
        response.put("totalPages", page.getTotalPages());
        response.put("currentPage", page.getNumber());
        response.put("size", page.getSize());
        response.put("last", page.isLast());
        response.put("first", page.isFirst());
        System.out.println("=== buildPageResponse complete");
        return response;
    }

}
