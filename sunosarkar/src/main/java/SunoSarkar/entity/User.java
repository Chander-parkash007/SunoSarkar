package SunoSarkar.entity;

import java.time.LocalDateTime;

import SunoSarkar.enums.Gender;
import SunoSarkar.enums.Roles;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "fullname", nullable = false)
    private String fullName;
    @Column(name = "cnic", nullable = false)
    private String cnic;
    @Email
    @Column(name = "email", unique = true, nullable = false)
    private String email;
    @Column(name = "password", nullable = false)
    private String password;
    @Column(name = "age")
    private Integer age;
    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;
    @Column(name = "profile_photo")
    private String profilePhoto;
    @Column(name = "residential_address", columnDefinition = "TEXT")
    private String residentialAddress;
    @Column(name = "permenant_address", columnDefinition = "TEXT")
    private String permenantAddress;
    @Column(name = "city")
    private String city;
    @Column(name = "uc_code")
    private String ucCode;
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Roles role = Roles.CITIZEN;
    @Column(name = "is_email_verified")
    private boolean isEmailVerified = false;
    @Column(name = "is_active")
    private boolean isActive = true;
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

}
