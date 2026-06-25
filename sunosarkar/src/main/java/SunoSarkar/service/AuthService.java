package SunoSarkar.service;

import SunoSarkar.dto.*;
import SunoSarkar.entity.Officer;
import SunoSarkar.entity.User;
import SunoSarkar.enums.Roles;
import SunoSarkar.respository.OfficerRepository;
import SunoSarkar.respository.UserRepository;
import SunoSarkar.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private OfficerRepository officerRepository;
    @Autowired
    private OtpService otpService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public String registerUser(UserRegisterDto dto){
        if (userRepository.existsByEmail(dto.getEmail())){
            throw new RuntimeException("User already exists with this email");
        }
        if (userRepository.existsByCnic(dto.getCnic())){
            throw new RuntimeException("User already exists by this cnic");
        }
        User user = new User();
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setCnic(dto.getCnic());
        user.setCity(dto.getCity());
        user.setAge(dto.getAge());
        user.setGender(dto.getGender());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setUcCode(dto.getUcCode());
        user.setResidentialAddress(dto.getResidentialAddress());
        user.setPermenantAddress(dto.getPermenantAddress());
        user.setRole(Roles.CITIZEN);
        user.setEmailVerified(false);

        userRepository.save(user);

        otpService.generateAndSendOtp(dto.getEmail());
        return "Registration successful. Please verify your email with the OTP sent.";
    }

    public String registerOfficer(OfficerRegisterDto dto){
        if (officerRepository.existsByEmail(dto.getEmail())){
            throw new RuntimeException("Email already exists");
        }
        if (officerRepository.existsByCnic(dto.getCnic())){
            throw new RuntimeException("User with this cnic already exists");
        }
        Officer officer = new Officer();
        officer.setFullName(dto.getFullName());
        officer.setEmail(dto.getEmail());
        officer.setCnic(dto.getCnic());
        officer.setPassword(passwordEncoder.encode(dto.getPassword()));
        officer.setCity(dto.getCity());
        officer.setUcCode(dto.getUcCode());
        officer.setIsEmailVerified(false);
        officer.setIsVerifiedByAdmin(false);
        officer.setRole(dto.getRole());
        officer.setJurisdictionArea(dto.getJurisdisctionArea());
        officer.setPhoneNumber(dto.getPhoneNumber());

        officerRepository.save(officer);
        otpService.generateAndSendOtp(dto.getEmail());
        return "Registration successful. Please verify your email with the OTP sent.";
    }

    public String verifyEmail(OtpDto dto){
        boolean valid = otpService.verifyOtp(dto.getEmail(), dto.getOtpCode());
        if (!valid){
            throw new RuntimeException("Otp is not valid or expired");
        }
        userRepository.findByEmail(dto.getEmail()).ifPresent(user -> {
            user.setEmailVerified(true);
            userRepository.save(user);
        });

        officerRepository.findByEmail(dto.getEmail()).ifPresent(officer -> {
            officer.setIsEmailVerified(true);
            officerRepository.save(officer);
        });

        return "Email verified successfully. You can login now!";
    }

    public AuthResponseDto UserLogin(LoginDto dto){
        User user = userRepository.findByEmail(dto.getEmail()).orElseThrow
                (() -> new RuntimeException("User not found with this email"));

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())){
            throw new RuntimeException("Invalid username password");
        }
        if (!user.isEmailVerified()){
            throw new RuntimeException("Please verify your email first");
        }
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
         return new AuthResponseDto(
                 token,
                 user.getRole().name(),
                 user.getEmail(),
                 user.getFullName(),
                 "Login successful"
         );
    }

    public AuthResponseDto officerLogin(LoginDto dto){
        Officer officer = officerRepository.findByEmail(dto.getEmail()).orElseThrow(()->
                new RuntimeException("Invalid email or password")
        );

        if (!passwordEncoder.matches(dto.getPassword(), officer.getPassword())){
            throw new RuntimeException("Invalid email or password");
        }
        if (!officer.getIsEmailVerified()){
            throw new RuntimeException("Verify your email first");
        }
        if (!officer.getIsVerifiedByAdmin()){
            throw new RuntimeException("Your email is not verified by admin kindly wait for approval" +
                    "or contact our team at sunosarkar2410@gmail.com");
        }
        String token = jwtUtil.generateToken(dto.getEmail(), officer.getRole().name());
        return new AuthResponseDto(
                token,
                officer.getRole().name(),
                officer.getEmail(),
                officer.getFullName(),
                "Login successful"
        );
    }
    public String resendOtp(String email){
        otpService.generateAndSendOtp(email);
        return "Otp resent successfully";
    }
}
