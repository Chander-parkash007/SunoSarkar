package SunoSarkar.entity;

import java.time.LocalDateTime;

import SunoSarkar.enums.Roles;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "officers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"createdAt", "password", "hibernateLazyInitializer", "handler"})
public class Officer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "full_name", nullable = false)
    private String fullName;
    @Column(name = "cnic", unique = true, nullable = false, length = 15)
    private String cnic;
    @Column(name = "email", unique = true, nullable = false)
    private String email;
    @Column(name = "password", nullable = false)
    private String password;
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Roles role;
    @Column(name = "jurisdiction_area")
    private String jurisdictionArea;
    @Column(name = "city")
    private String city;
    @Column(name = "uc_code")
    private String ucCode;
    @Column(name = "profile_photo")
    private String profilePhoto;
    @Column(name = "phone_number")
    private String phoneNumber;
    @Column(name = "is_email_verified")
    private Boolean isEmailVerified = false;
    @Column(name = "is_verified_by_admin")
    private Boolean isVerifiedByAdmin = false;
    @Column(name = "is_active")
    private Boolean isActive = true;
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
