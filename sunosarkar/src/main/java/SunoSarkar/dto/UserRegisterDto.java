package SunoSarkar.dto;

import SunoSarkar.enums.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRegisterDto {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "CNIC is required")
    private String cnic;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private Integer age;

    private Gender gender;

    @NotBlank(message = "City is required")
    private String city;

    private String ucCode;

    @NotBlank(message = "Residential address is required")
    private String residentialAddress;

    private String permenantAddress;
}
