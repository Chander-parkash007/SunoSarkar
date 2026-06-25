package SunoSarkar.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponseDto {
    private String token;
    private String role;
    private String email;
    private String fullName;
    private String message;
}
