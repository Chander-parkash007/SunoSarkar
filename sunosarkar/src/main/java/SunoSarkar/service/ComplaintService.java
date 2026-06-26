package SunoSarkar.service;

import SunoSarkar.dto.ComplaintRequestDto;
import SunoSarkar.entity.*;
import SunoSarkar.enums.ComplaintStatus;
import SunoSarkar.respository.*;
import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Autowired;
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

public Complaint fileComplaint(ComplaintRequestDto dto, List<MultipartFile> photos,String userEmail)
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

    if (photos !=null && photos.isEmpty()){
        for(MultipartFile photo : photos){
            String url = cloudinaryService.uploadPhoto(photo);
            ComplaintPhoto cp = new ComplaintPhoto();
            cp.setComplaint(complaint);
            cp.setPhotoUrl(url);
            complaintPhotoRepository.save(cp);
        }
    }
    saveHistory(saved,null,"PENDING","Complain filed by citizen");
    notifyOfficers(saved);
    return saved;
}

public List<Complaint> getMyComplaints(String userEmail){
    User user = userRepository.findByEmail(userEmail).orElseThrow(()->
            new RuntimeException("User not found with this email : "+userEmail));
    return complaintRepository.findByUserId(user.getId());
}

public List<Complaint> getComplaintsByArea(String ucCode)
{
    return complaintRepository.findByUcCode(ucCode);
}

public List<Complaint> getAllComlaints(){
    List<Complaint> allByOrderByCreatedAtDesc = complaintRepository.findAllByOrderByCreatedAtDesc();
    return allByOrderByCreatedAtDesc;
}

public List<Complaint> getAllPublicComplaints(String city){
    return complaintRepository.findByCityOrderByCreatedAtDesc(city);
}

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
    return "Thank you confirmation your complaint has been resolved and marked as closed";
}
public String upVoteComplaint(Long complaintId){
    Complaint complaint = complaintRepository.findById(complaintId).orElseThrow(()->
            new RuntimeException("Complaint not found with id : "+complaintId));
    complaint.setUpVoteCount(complaint.getUpVoteCount() + 1);
    complaintRepository.save(complaint);
    return "Thank, Upvoted successfully!";

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
