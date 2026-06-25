package SunoSarkar.controller;

import SunoSarkar.dto.*;
import SunoSarkar.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/user/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody UserRegisterDto dto){
        String message = authService.registerUser(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }
    @PostMapping("/officer/register")
    public ResponseEntity<String> officerRegister(@Valid @RequestBody OfficerRegisterDto dto){
        String message = authService.registerOfficer(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);

    }
    @PostMapping("/verify-email")
    public ResponseEntity<String> verifyEmail(@Valid @RequestBody OtpDto dto){
        String message = authService.verifyEmail(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);

    }
    @PostMapping("/user-login")
    public ResponseEntity<AuthResponseDto> userLogin(@Valid @RequestBody LoginDto dto){
       AuthResponseDto response = authService.UserLogin(dto);
       return ResponseEntity.status(HttpStatus.CREATED).body(response);

    }

    @PostMapping("/officer-login")
    public ResponseEntity<AuthResponseDto> officerLogin (@Valid @RequestBody LoginDto dto){
        AuthResponseDto response = authService.officerLogin(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<String> resendOtp(@RequestParam String email){
        String message = authService.resendOtp(email);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }


}
