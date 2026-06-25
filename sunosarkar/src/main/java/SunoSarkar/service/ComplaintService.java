package SunoSarkar.service;

import SunoSarkar.dto.ComplaintRequestDto;
import SunoSarkar.entity.Complaint;
import SunoSarkar.entity.ComplaintPhoto;
import SunoSarkar.entity.User;
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
   private ComplaintService complaintService;

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
    User user = userRepository.findByEmail(userEmail).orElseThrow(()->
            new RuntimeException("User not found with this email"));

    Complaint complaint = new Complaint();
    complaint.setUser(user);
    complaint.setTitle(dto.getTitle());
    complaint.setDescription(dto.getDescription());
    complaint.setCity(dto.getCity());
    complaint.setAreaAddress(dto.getComplaintAreaAddress());
    complaint.setUcCode(dto.getUcCode());
    complaint.setLocationLink(dto.getLocationLink());
    complaint.setCategory(dto.getComaplaintCategory());
    complaint.setPriorty(dto.getPriorty());
    complaint.setStatus(ComplaintStatus.PENDING);

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

public List<Complaint> getComplaintsByArea(String ucCode){
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
}
