package SunoSarkar.service;

import SunoSarkar.entity.OtpToken;
import SunoSarkar.respository.OtpTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private OtpTokenRepository otpTokenRepository;

    @Autowired
    private EmailService emailService;

    public void generateAndSendOtp(String email) {
        // Delete any existing OTPs for this email
        otpTokenRepository.deleteByEmail(email);

        // Generate 6-digit OTP
        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        OtpToken otpToken = new OtpToken();
        otpToken.setEmail(email);
        otpToken.setUsed(false);
        otpToken.setOtpToken(otp);
        otpToken.setCreatedAt(LocalDateTime.now());
        otpToken.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        otpTokenRepository.save(otpToken);

        try {
            emailService.sendOtpEmail(email, otp);
        } catch (Exception e) {
            // Log but do NOT throw — registration must succeed even if email fails
            System.err.println("⚠️  Failed to send OTP email to " + email + ": " + e.getMessage());
            System.out.println("🔑 OTP for " + email + " is: " + otp + " (email delivery failed, check logs)");
        }
    }

    public boolean verifyOtp(String email, String otpCode) {
        Optional<OtpToken> optionalToken =
                otpTokenRepository.findByEmailAndOtpTokenAndUsedFalse(email, otpCode);

        if (optionalToken.isEmpty()) {
            return false;
        }

        OtpToken token = optionalToken.get();

        // Check expiry
        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            return false;
        }

        // Mark as used
        token.setUsed(true);
        otpTokenRepository.save(token);
        return true;
    }
}
