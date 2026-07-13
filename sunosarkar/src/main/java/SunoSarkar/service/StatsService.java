package SunoSarkar.service;

import SunoSarkar.entity.Complaint;
import SunoSarkar.enums.ComplaintStatus;
import SunoSarkar.respository.ComplaintRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StatsService {

    @Autowired
    private ComplaintRepository complaintRepository;
@Cacheable(value = "cityStats", key = "#city")
    public Map<String, Object> getCityStats(String city) {
        List<Complaint> complaints = complaintRepository.findByCity(city);

        long total = complaints.size();
        long pending = complaints.stream()
                .filter(c -> c.getStatus() == ComplaintStatus.PENDING).count();
        long inProgress = complaints.stream()
                .filter(c -> c.getStatus() == ComplaintStatus.IN_PROGRESS).count();
        long resolved = complaints.stream()
                .filter(c -> c.getStatus() == ComplaintStatus.RESOLVED
                        || c.getStatus() == ComplaintStatus.CLOSED).count();
        long emergency = complaints.stream()
                .filter(c -> c.getPriority() != null &&
                        c.getPriority().name().equals("EMERGENCY")).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("city", city);
        stats.put("totalComplaints", total);
        stats.put("pendingComplaints", pending);
        stats.put("inProgressComplaints", inProgress);
        stats.put("resolvedComplaints", resolved);
        stats.put("emergencyComplaints", emergency);
        stats.put("resolutionRate",
                total > 0 ? Math.round((resolved * 100.0 / total)) + "%" : "0%");

        return stats;
    }
    @Cacheable(value = "categoryBreadown", key = "#city")

    public Map<String, Long> getCategoryBreakdown(String city) {
        List<Complaint> complaints = complaintRepository.findByCity(city);

        return complaints.stream()
                .filter(c -> c.getCategory() != null)
                .collect(Collectors.groupingBy(
                        c -> c.getCategory().name(),
                        Collectors.counting()
                ));
    }
    @Cacheable(value = "statusBreakdown", key = "#city")

    public Map<String, Long> getStatusBreakdown(String city) {
        List<Complaint> complaints = complaintRepository.findByCity(city);

        return complaints.stream()
                .collect(Collectors.groupingBy(
                        c -> c.getStatus().name(),
                        Collectors.counting()
                ));
    }
}
