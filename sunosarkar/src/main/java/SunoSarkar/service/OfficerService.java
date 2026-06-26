package SunoSarkar.service;

import SunoSarkar.entity.Complaint;
import SunoSarkar.entity.Officer;
import SunoSarkar.enums.ComplaintStatus;
import SunoSarkar.respository.ComplaintRepository;
import SunoSarkar.respository.OfficerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OfficerService {

    @Autowired
    private OfficerRepository officerRepository;
    @Autowired
    private ComplaintRepository complaintRepository;

    public Map<String,Object> getDashboard(String officerEmail){
        Officer officer = officerRepository.findByEmail(officerEmail).orElseThrow(()->
                new RuntimeException("Officer not found with this email : "+officerEmail));
        List<Complaint> areaComplaint = complaintRepository.findByUcCode(officer.getUcCode());
        long total = areaComplaint.size();
        long pending = areaComplaint.stream().filter(
                c -> c.getStatus() == ComplaintStatus.PENDING).count();
        long inProgress = areaComplaint.stream().filter(
                c -> c.getStatus() == ComplaintStatus.IN_PROGRESS).count();
        long resolved = areaComplaint.stream().filter(
                c -> c.getStatus() == ComplaintStatus.RESOLVED ||
                        c.getStatus() == ComplaintStatus.CLOSED).count();

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("OfficerName",officer.getFullName());
        dashboard.put("officerEmail", officer.getEmail());
        dashboard.put("officerPhone", officer.getPhoneNumber());
        dashboard.put("officerCity",officer.getCity());
        dashboard.put("officerUcCode", officer.getUcCode());
        dashboard.put("totalComplaints", total);
        dashboard.put("pendingComplaints", pending);
        dashboard.put("inProgressComplaints", inProgress);
        dashboard.put("resolvedComplaints", resolved);
        return dashboard;
    }
    public List<Complaint> getPendingComplaints(String officerEmail){
        Officer officer = officerRepository.findByEmail(officerEmail).orElseThrow(
                () -> new RuntimeException("Offcier not found with this email : "+officerEmail));

                return complaintRepository.findByUcCodeAndStatus(officer.getUcCode(), ComplaintStatus.PENDING);

    }
    public Map<String, Object> getLeaderBoard(){
        List<Officer> officers = officerRepository.findAll();
        List<Map<String, Object>> leaderBoard = new ArrayList<>();

        for(Officer officer : officers){
            List<Complaint> complaints = complaintRepository.findByUcCode(officer.getUcCode());
            long resolved = complaints.stream().filter(c -> c.getStatus() == ComplaintStatus.RESOLVED
            || c.getStatus() == ComplaintStatus.CLOSED).count();

            Map<String,Object> entry = new HashMap<>();
            entry.put("officerName", officer.getFullName());
            entry.put("officerEmail",officer.getEmail());
            entry.put("role",officer.getRole());
            entry.put("city", officer.getCity());
            entry.put("resolvedComplaints", resolved);
            leaderBoard.add(entry);
        }
        leaderBoard.sort((a, b) ->
                Long.compare((Long) b.get("resolvedComplaints"), (Long) a.get("resolvedComplaints")));
return (Map<String, Object>) leaderBoard;
    }
}
