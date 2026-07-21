package SunoSarkar.entity;

import java.time.LocalDateTime;
import java.util.List;

import SunoSarkar.enums.ComplainCategory;
import SunoSarkar.enums.ComplaintPriorty;
import SunoSarkar.enums.ComplaintStatus;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "complaints")
@NoArgsConstructor
@AllArgsConstructor
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"password", "createdAt", "complaints", "hibernateLazyInitializer", "handler"})
    private User user;

    @Column(name = "complaint_title", nullable = false)
    private String title;

    @Column(name = "complaint_description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "catgory", nullable = false)
    private ComplainCategory category;

    @Enumerated(EnumType.STRING)
    @Column(name = "priority")
    private ComplaintPriorty priority = ComplaintPriorty.NORMAL;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private ComplaintStatus status = ComplaintStatus.PENDING;

    @Column(name = "location_link", nullable = false)
    private String locationLink;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "uc_code")
    private String ucCode;

    @Column(name = "area_address", nullable = false, columnDefinition = "TEXT")
    private String areaAddress;

    @Column(name = "upvote_count")
    private Integer upVoteCount = 0;

    @Column(name = "is_confirmed_resolved")
    private Boolean isConfirmedResolved = false;

    @Column(name = "user_feedback", columnDefinition = "TEXT")
    private String userFeedback;

    @Column(name = "feedback_rating")
    private Integer feedbackRating;

    @ManyToOne
    @JoinColumn(name = "assigned_officer_id")
    @JsonIgnoreProperties({"password", "createdAt", "complaints", "hibernateLazyInitializer", "handler"})
    private User assignedOfficer;

    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JsonIgnoreProperties({"complaint", "uploadedAt"})
    private List<ComplaintPhoto> photos;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
}
