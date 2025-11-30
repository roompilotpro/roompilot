package com.roompilot.model;

import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entity representing a resident's profile information. Created during the profile completion flow
 * after a user selects the RESIDENT role. Contains bio, employment status, and optional contact
 * information needed for rental applications.
 */
@Entity
@Table(name = "resident_profiles")
@Getter
@Setter
@NoArgsConstructor
@SuppressFBWarnings(
    value = {"EI_EXPOSE_REP", "EI_EXPOSE_REP2"},
    justification = "JPA entity with Lombok-generated accessors requires mutable user reference")
public class ResidentProfile {

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private UUID id;

  @OneToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false, unique = true)
  private User user;

  @Column(name = "bio", nullable = false, columnDefinition = "TEXT")
  private String bio;

  @Enumerated(EnumType.STRING)
  @Column(name = "employment_status", nullable = false, length = 30)
  private EmploymentStatus employmentStatus;

  @Column(name = "phone", length = 50)
  private String phone;

  @Column(name = "profile_completed", nullable = false)
  private Boolean profileCompleted = true;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  public ResidentProfile(User user, String bio, EmploymentStatus employmentStatus, String phone) {
    this.user = user;
    this.bio = bio;
    this.employmentStatus = employmentStatus;
    this.phone = phone;
    this.profileCompleted = true;
  }

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = LocalDateTime.now();
  }
}
