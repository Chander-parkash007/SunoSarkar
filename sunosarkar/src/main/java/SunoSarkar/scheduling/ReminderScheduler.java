package SunoSarkar.scheduling;

import SunoSarkar.entity.Complaint;
import SunoSarkar.entity.Officer;
import SunoSarkar.enums.ComplaintStatus;
import SunoSarkar.respository.ComplaintRepository;
import SunoSarkar.respository.OfficerRepository;
import SunoSarkar.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class ReminderScheduler {
    @Autowired
    private ComplaintRepository complaintRepository;
    @Autowired
    private OfficerRepository officerRepository;
    @Autowired
    private EmailService emailService;

    @Scheduled(fixedRate = 3600000)
    public void reminderScheduler(){
        System.out.println("=== Reminder Schedular Running : "+ LocalDateTime.now());
        LocalDateTime cutoff = LocalDateTime.now().minusHours(48);
        List<Complaint> complaints = complaintRepository.findAllByOrderByCreatedAtDesc();
        for(Complaint complaint : complaints){
            if (complaint.getStatus() == ComplaintStatus.PENDING &&
            complaint.getCreatedAt().isBefore(cutoff)){
                List<Officer> officers = officerRepository.findByUcCode(complaint.getUcCode());

                for(Officer officer : officers){
                    if (officer.getIsEmailVerified() && officer.getIsVerifiedByAdmin()){
                        emailService.complaintReminderEmail(
                                officer.getEmail(),
                                officer.getFullName(),
                                complaint.getTitle(),
                                complaint.getId().toString()
                        );
                        System.out.println("=== Reminder sent to : "+officer.getEmail());
                    }
                }
            }
        }
    }
}
