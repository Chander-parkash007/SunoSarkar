package SunoSarkar.service;

import SunoSarkar.entity.Complaint;
import SunoSarkar.entity.Officer;
import SunoSarkar.entity.User;
import SunoSarkar.enums.ComplaintStatus;
import SunoSarkar.respository.ComplaintRepository;
import SunoSarkar.respository.OfficerRepository;
import SunoSarkar.respository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AdminService {
    @Autowired
    private ComplaintRepository complaintRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OfficerRepository officerRepository;

    public List<User> getAllUsers(){
        return userRepository.findAll();
    }
    public List<Officer> getAllOfficers(){
        return officerRepository.findAll();
    }
    public List<Officer> getPendingOfficer(){
        return officerRepository.findAll().stream().filter(o -> !o.getIsVerifiedByAdmin()
        ).collect(Collectors.toList());
    }
    public String verifyOfficer (Long offcierId){
        Officer officer = officerRepository.findById(offcierId).
                orElseThrow(()->
                        new RuntimeException("Offcier not found with this id : "+ offcierId));
        officer.setIsVerifiedByAdmin(true);
        officerRepository.save(officer);
        return "Officer verified successfully. They can now login.";
    }

    public String deactivateUser(Long userId){
        User user = userRepository.findById(userId).orElseThrow(
                ()-> new RuntimeException("User not found with id : "+userId)
        );
        user.setActive(false);
        userRepository.save(user);
        return "User deactivated successfully.";
    }
    public Map<String,Object> getPlatformStats(){
        List<Complaint> complaints= complaintRepository.findAll();
        long total = complaints.size();
        long pending = complaints.stream().filter(c -> c.getStatus() ==
                ComplaintStatus.PENDING).count();
        long inProgress = complaints.stream().filter(c-> c.getStatus()
        == ComplaintStatus.IN_PROGRESS).count();
        long resolved = complaints.stream().filter(c -> c.getStatus()
        == ComplaintStatus.RESOLVED || c.getStatus() == ComplaintStatus.CLOSED).count();
        long rejected = complaints.stream().filter(c -> c.getStatus()
        == ComplaintStatus.REJECTED).count();

        Map<String , Object > stats = new HashMap<>();
        stats.put("totalUser", userRepository.count());
        stats.put("totalOfficers", officerRepository.count());
        stats.put("totalComplaints", total);
        stats.put("pendingComplaints", pending);
        stats.put("inProgress", inProgress);
        stats.put("resolvedComplaints", resolved);
        stats.put("rejectedComplaints", rejected);
        stats.put("resolutionRate",
                total > 0 ? (resolved * 100 / total) + "%" : "0%");
        return stats;
    }
}
