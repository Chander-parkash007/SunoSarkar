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

    public void generateAndSendOtp(String email){
        otpTokenRepository.deleteByEmail(email);
        String otp = String.valueOf(100000 + new Random().nextInt(900000));
        OtpToken otpToken = new OtpToken();
        otpToken.setEmail(email);
        otpToken.setUsed(false);
        otpToken.setOtpToken(otp);
        otpToken.setExpiresAt(LocalDateTime.now().plusMinutes(10));
        otpTokenRepository.save(otpToken);

        emailService.sendOtpEmail(email,otp);
    }

    public boolean verifyOtp(String email, String otpCode){
        Optional<OtpToken> otpToken =
                otpTokenRepository.findByEmailAndOtpTokenAndIsUsedFalse(email, otpCode);
        if (otpToken.isEmpty()){
            return false;
        }
        OtpToken token = otpToken.get();
        if (token.getExpiresAt().isBefore(LocalDateTime.now())){
            return false;
        }
        token.setUsed(true);
        otpTokenRepository.save(token);
        return true;
    }
}
