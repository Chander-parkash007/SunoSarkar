package SunoSarkar.dto;

import SunoSarkar.enums.Roles;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class OfficerRegisterDto {
    @NotBlank(message = "Full Name is required")
    private String fullName;
    @NotBlank(message = "Cnic is required")
    @Size(min = 13, max = 15, message = "Cnic must be between 13 and 15")
    private String cnic;
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    @NotBlank(message = "Password")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    @NotNull(message = "Must specify the role")
    private Roles role;
    @NotBlank(message = "City is required")
    private String city;
    private String ucCode;
    private String jurisdisctionArea;
    private String phoneNumber;
}
