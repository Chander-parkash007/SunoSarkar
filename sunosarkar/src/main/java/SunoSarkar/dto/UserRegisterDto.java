package SunoSarkar.dto;

import SunoSarkar.enums.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRegisterDto {
    @NotBlank(message = "Name is required")
    private String fullName;
    @NotBlank(message = "Cnic is required")
    @Size(min = 13, max = 15, message = "Cnic must be between 13 and 15")
    private String cnic;
@NotBlank(message = "Email is required")
@Email(message = "Invalid email format")
    private String email;
@NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be of 6 characters")
    private String password;

@Min(value = 16, message = "Age must be 18")
    private Integer age;

private Gender gender;
@NotBlank(message = "City is required")
private String city;

private String ucCode;
@NotBlank(message = "Residential Address is required")
private String residentialAddress;

private String permenantAddress;
}
