package SunoSarkar.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OtpDto {
    @NotNull(message = "Email is required")
    @Email(message = "Invalid email format")
private String email;
    @NotNull(message = "Otp code is required")
private String otpCode;
}
