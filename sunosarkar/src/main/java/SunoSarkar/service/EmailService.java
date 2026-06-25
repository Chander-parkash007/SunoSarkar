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

public void sendOtpEmail(String toEmail, String otpCode ){
    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom(fromEmail);
    message.setTo(toEmail);
    message.setSubject("SunoSarkar - Email Verification OTP");
    message.setText(
            "Assalam o Alaikum,\n\n" +
                    "Thank you for registering on SunoSarkar - Awam Ki Awaz.\n\n" +
                    "Your OTP verification code is: " + otpCode + "\n\n" +
                    "This code will expire in 10 minutes.\n\n" +
                    "Do not share this code with anyone.\n\n" +
                    "SunoSarkar Team"
    );
    mailSender.send(message);
}

public void sendComplaintNotification(String toEmail, String officerName, String complaintTitle , String complaintId){
    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom(fromEmail);
    message.setTo(toEmail);
    message.setSubject("SunoSarkar - New Complaint Filed in Your Area");
    message.setText(
            "Dear " + officerName + ",\n\n" +
                    "A new complaint has been filed in your jurisdiction.\n\n" +
                    "Complaint ID: " + complaintId + "\n" +
                    "Title: " + complaintTitle + "\n\n" +
                    "Please login to SunoSarkar dashboard to view and take action.\n\n" +
                    "SunoSarkar Team - Awam Ki Awaz"
    );
    mailSender.send(message);
}

public void complaintReminderEmail(String toEmail, String officerName, String complaintTitle, String complaintId){
    SimpleMailMessage message = new SimpleMailMessage();
    message.setFrom(fromEmail);
    message.setTo(toEmail);
    message.setSubject("SunoSarkar - REMINDER: Complaint Pending Action");
    message.setText(            "Dear " + officerName + ",\n\n" +
            "This is a reminder that the following complaint has been pending for 48 hours.\n\n" +
            "Complaint ID: " + complaintId + "\n" +
            "Title: " + complaintTitle + "\n\n" +
            "Citizens are waiting. Please take immediate action.\n\n" +
            "SunoSarkar Team - Awam Ki Awaz"
    );
    mailSender.send(message);
}
    public void sendStatusUpdateEmail(String toEmail,
                                      String userName,
                                      String complaintTitle,
                                      String newStatus) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("SunoSarkar - Your Complaint Status Updated");
        message.setText(
                "Dear " + userName + ",\n\n" +
                        "Your complaint has been updated.\n\n" +
                        "Complaint: " + complaintTitle + "\n" +
                        "New Status: " + newStatus + "\n\n" +
                        "Login to SunoSarkar to view details and confirm resolution.\n\n" +
                        "SunoSarkar Team - Awam Ki Awaz"
        );
        mailSender.send(message);
    }




}
