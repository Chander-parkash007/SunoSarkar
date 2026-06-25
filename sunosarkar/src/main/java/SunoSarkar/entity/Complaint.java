package SunoSarkar.entity;

import java.time.LocalDateTime;
import java.util.List;

import SunoSarkar.enums.ComplainCategory;
import SunoSarkar.enums.ComplaintPriorty;
import SunoSarkar.enums.ComplaintStatus;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "complaints")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    @Column(name = "complaint_title", nullable = false)
    private String title;
    @Column(name = "complaint_description", nullable = false, columnDefinition = "TEXT")
    private String description;
    @Enumerated(EnumType.STRING)
    @Column(name = "catgory", nullable = false)
    private ComplainCategory category;

    @Enumerated(EnumType.STRING)
    @Column(name = "priorty")
    private ComplaintPriorty priorty = ComplaintPriorty.NORMAL;

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
    private boolean isConfirmedResolved = false;
    @Column(name = "user_feedback", columnDefinition = "TEXT")
    private String userFeedback;
    @Column(name = "feedback_rating")
    private Integer feedbackRating;
    @ManyToOne
    @JoinColumn(name = "assigned_officer_id")
    private User assignedOfficer;
    @OneToMany(mappedBy = "complaint", cascade = CascadeType.ALL)
    private List<ComplaintPhoto> photos;
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

}
