package SunoSarkar.service;

import SunoSarkar.dto.ComplaintRequestDto;
import SunoSarkar.entity.*;
import SunoSarkar.enums.ComplaintStatus;
import SunoSarkar.respository.*;
import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ComplaintService {

@Autowired
    private ComplaintRepository complaintRepository;
@Autowired
    private ComplaintHistoryRepository complaintHistoryRepository;
@Autowired
    private ComplaintPhotoRepository complaintPhotoRepository;
@Autowired
    private UserRepository userRepository;
@Autowired
    private OfficerRepository officerRepository;
@Autowired
    private EmailService emailService;
@Autowired
    private CloudinaryService cloudinaryService;
@Autowired
private ComplaintPhotoRepository photoRepository;
    @Caching(
            evict = {
                    @CacheEvict(value = "myComplaints", key = "#userEmail"),
                    @CacheEvict(value = "complaintsByArea", allEntries = true),
                    @CacheEvict(value = "allComplaints", allEntries = true),
                    @CacheEvict(value = "publicComplaints", allEntries = true),
                    @CacheEvict(value = "officerDashboard", allEntries = true),
                    @CacheEvict(value = "officerPendingComplaint", allEntries = true),
                    @CacheEvict(value = "leaderboard", allEntries = true),
                    @CacheEvict(value = "cityStats", allEntries = true),
                    @CacheEvict(value = "categoryBreadown", allEntries = true),
                    @CacheEvict(value = "statusBreakdown", allEntries = true)
            }
    )
public Complaint fileComplaint(ComplaintRequestDto dto,
                               List<MultipartFile> photos,String userEmail)

    throws IOException{
    System.out.println("=== EMAIL FROM TOKEN: " + userEmail);
    User user = userRepository.findByEmail(userEmail).orElseThrow(()->
            new RuntimeException("User not found with this email"));
    System.out.println("=== USER FOUND: " + user.getId());
    Complaint complaint = new Complaint();
    complaint.setUser(user);
    complaint.setTitle(dto.getTitle());
    complaint.setDescription(dto.getDescription());
    complaint.setCategory(dto.getCategory());
    complaint.setPriority(dto.getPriority());
    complaint.setLocationLink(dto.getLocationLink());
    complaint.setCity(dto.getCity());
    complaint.setUcCode(dto.getUcCode());
    complaint.setAreaAddress(dto.getAreaAddress());

    Complaint saved = complaintRepository.save(complaint);

    if (photos != null && !photos.isEmpty()) {
        for (MultipartFile photo : photos) {
            try {
                String url = cloudinaryService.uploadPhoto(photo);
                System.out.println("=== PHOTO UPLOADED: " + url);
                ComplaintPhoto cp = new ComplaintPhoto();
                cp.setComplaint(saved);
                cp.setPhotoUrl(url);
                photoRepository.save(cp);
            } catch (Exception e) {
                System.out.println("=== PHOTO UPLOAD FAILED: " + e.getMessage());
            }
        }
    }

    saveHistory(saved,null,"PENDING","Complain filed by citizen");
    notifyOfficers(saved);
    return saved;
}
@Cacheable(value = "myComplaints", key = "#userEmail")
public List<Complaint> getMyComplaints(String userEmail){
    User user = userRepository.findByEmail(userEmail).orElseThrow(()->
            new RuntimeException("User not found with this email : "+userEmail));
    return complaintRepository.findByUserId(user.getId());
}
@Cacheable(value = "complaintsByArea", key = "#ucCode")
    public Page<Complaint> getComplaintsByArea(String ucCode, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return complaintRepository.findByUcCodeOrderByCreatedAtDesc(ucCode, pageable);
    }
@Cacheable(value = "allComplaints", key = "'all'")
    public Page<Complaint> getAllComplaints(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return complaintRepository.findAllByOrderByCreatedAtDesc(pageable);
    }
@Cacheable(value = "publicComplaints", key = "#city")
    public Page<Complaint> getPublicComplaints(String city, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return complaintRepository.findByCityOrderByCreatedAtDesc(city, pageable);
    }
@Caching(
        evict = {
                @CacheEvict(value = "myComplaints",allEntries = true),
                @CacheEvict(value = "complaintsByArea", allEntries = true),
                @CacheEvict(value = "allComplaints", allEntries = true),
                @CacheEvict(value = "publicComplaints", allEntries = true),
                @CacheEvict(value = "officerDashboard", key = "#officerEmail"),
                @CacheEvict(value = "officerPendingComplaint", key = "#officerEmail"),
                @CacheEvict(value = "leaderboard", allEntries = true),
                @CacheEvict(value = "cityStats", allEntries = true),
                @CacheEvict(value = "categoryBreadown", allEntries = true),
                @CacheEvict(value = "statusBreakdown", allEntries = true)
        }
)
public Complaint updateStatus(Long complaintId,
                              String newStatus,
                              String officerEmail,
                              String note){
    Complaint complaint = complaintRepository.findById(complaintId).orElseThrow(()->
            new RuntimeException("Complaint not found with id : "+ complaintId));
    String oldStatus = complaint.getStatus().name();
    complaint.setStatus(ComplaintStatus.valueOf(newStatus));
    if (newStatus.equals("RESOLVED")){
        complaint.setResolvedAt(LocalDateTime.now());
    }
    complaintRepository.save(complaint);
    saveHistory(complaint,oldStatus,newStatus,note);
    emailService.sendStatusUpdateEmail(complaint.getUser().getEmail(),
            complaint.getUser().getFullName(),
            complaint.getTitle(),
            newStatus);
    return complaint;
}
    @Caching(
            evict = {
                    @CacheEvict(value = "myComplaints",allEntries = true),
                    @CacheEvict(value = "complaintsByArea", allEntries = true),
                    @CacheEvict(value = "allComplaints", allEntries = true),
                    @CacheEvict(value = "publicComplaints", allEntries = true),
                    @CacheEvict(value = "officerDashboard", allEntries = true),
                    @CacheEvict(value = "officerPendingComplaint", allEntries = true),
                    @CacheEvict(value = "leaderboard", allEntries = true),
                    @CacheEvict(value = "cityStats", allEntries = true),
                    @CacheEvict(value = "categoryBreadown", allEntries = true),
                    @CacheEvict(value = "statusBreakdown", allEntries = true)
            }
    )
public String complaintResolved(Long complaintId, String email){
    Complaint complaint = complaintRepository.findById(complaintId).orElseThrow(()->
            new RuntimeException("Complaint not found with this Id : "+ complaintId));
    if (!complaint.getUser().getEmail().equals(email)){
        throw new RuntimeException("Unauthorize");
    }
    complaint.setIsConfirmedResolved(true);
    complaint.setStatus(ComplaintStatus.CLOSED);
    complaintRepository.save(complaint);

    saveHistory(complaint, "RESOLVED","CLOSE","Confirmed by citizen");
    return "Thank you for confirmation. Your complaint has been resolved and marked as closed";
}
    @Caching(
            evict = {
                    @CacheEvict(value = "myComplaints",allEntries = true),
                    @CacheEvict(value = "complaintsByArea", allEntries = true),
                    @CacheEvict(value = "allComplaints", allEntries = true),
                    @CacheEvict(value = "publicComplaints", allEntries = true)
            }
    )
public String upVoteComplaint(Long complaintId){
    Complaint complaint = complaintRepository.findById(complaintId).orElseThrow(()->
            new RuntimeException("Complaint not found with id : "+complaintId));
    complaint.setUpVoteCount(complaint.getUpVoteCount() + 1);
    complaintRepository.save(complaint);
    return "Thank you, Upvoted successfully!";

}
private void saveHistory(Complaint complaint,
                         String oldStatus,
                         String newStatus,
                         String note){
    ComplaintHistory history = new ComplaintHistory();
    history.setComplaint(complaint);
    history.setOldStatus(oldStatus);
    history.setNewStatus(newStatus);
    history.setNote(note);
    complaintHistoryRepository.save(history);
}

public void notifyOfficers(Complaint complaint){
    List<Officer> officers = officerRepository.findByUcCode(complaint.getUcCode());
    for(Officer officer : officers){
        if (officer.getIsEmailVerified() && officer.getIsVerifiedByAdmin()){
            emailService.sendComplaintNotification(officer.getEmail(),
                    officer.getFullName(),
                    complaint.getTitle(),
                    complaint.getId().toString());
        }
    }
}
}
