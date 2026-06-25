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


}
