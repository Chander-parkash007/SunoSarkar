package SunoSarkar.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    private void send(SimpleMailMessage message) {
        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Warning: Email send failed to " + message.getTo()[0] + ": " + e.getMessage());
            throw e;
        }
    }

    public void sendOtpEmail(String toEmail, String otpCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("SunoSarkar - Verification Code: " + otpCode);
        message.setText(
            "Assalam o Alaikum,\n\n" +
            "Thank you for registering on SunoSarkar.\n\n" +
            "Your 6-digit verification code is:\n\n" +
            "   " + otpCode + "\n\n" +
            "This code expires in 10 minutes.\n" +
            "Do NOT share this code with anyone.\n\n" +
            "If you did not register on SunoSarkar, ignore this email.\n\n" +
            "SunoSarkar Team\n" +
            "sunosarkar2410@gmail.com"
        );
        send(message);
    }

    public void sendComplaintNotification(String toEmail, String officerName,
                                          String complaintTitle, String complaintId) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("SunoSarkar - New Complaint #" + complaintId + " in Your Area");
        message.setText(
            "Dear " + officerName + ",\n\n" +
            "A new complaint has been filed in your jurisdiction.\n\n" +
            "Complaint ID : " + complaintId + "\n" +
            "Title        : " + complaintTitle + "\n\n" +
            "Please login to SunoSarkar to take action.\n\n" +
            "SunoSarkar Team"
        );
        send(message);
    }

    public void complaintReminderEmail(String toEmail, String officerName,
                                       String complaintTitle, String complaintId) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("REMINDER - Complaint #" + complaintId + " Pending - SunoSarkar");
        message.setText(
            "Dear " + officerName + ",\n\n" +
            "This complaint has been pending for 48+ hours:\n\n" +
            "Complaint ID : " + complaintId + "\n" +
            "Title        : " + complaintTitle + "\n\n" +
            "Citizens are waiting. Please take immediate action.\n\n" +
            "SunoSarkar Team"
        );
        send(message);
    }

    public void sendStatusUpdateEmail(String toEmail, String userName,
                                      String complaintTitle, String newStatus) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("SunoSarkar - Complaint Status Updated: " + newStatus);
        message.setText(
            "Dear " + userName + ",\n\n" +
            "Your complaint status has been updated.\n\n" +
            "Complaint : " + complaintTitle + "\n" +
            "New Status: " + newStatus + "\n\n" +
            "Login to SunoSarkar to view details and confirm resolution.\n\n" +
            "SunoSarkar Team"
        );
        send(message);
    }
}
