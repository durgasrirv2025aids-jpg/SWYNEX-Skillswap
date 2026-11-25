package com.skillswap.entity;

import com.skillswap.enums.AccountStatus;
import com.skillswap.enums.UserRole;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
    name = "students",
    indexes = {
        @Index(name = "idx_students_email", columnList = "email", unique = true),
        @Index(name = "idx_students_department", columnList = "department"),
        @Index(name = "idx_students_college", columnList = "college_name")
    }
)
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id")
    private Long id;

    @Column(name = "full_name", nullable = false, length = 120)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "college_name", length = 160)
    private String collegeName;

    @Column(name = "department", length = 120)
    private String department;

    @Column(name = "year_of_study")
    private Integer yearOfStudy;

    @Column(name = "bio", length = 1000)
    private String bio;

    @Enumerated(EnumType.STRING)
    @Column(name = "account_status", nullable = false, length = 20)
    private AccountStatus accountStatus = AccountStatus.ACTIVE;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 20)
    private UserRole role = UserRole.STUDENT;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<StudentSkill> studentSkills = new ArrayList<>();

    @OneToMany(mappedBy = "sender")
    private List<ExchangeRequest> sentRequests = new ArrayList<>();

    @OneToMany(mappedBy = "receiver")
    private List<ExchangeRequest> receivedRequests = new ArrayList<>();

    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> notifications = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
        if (this.accountStatus == null) {
            this.accountStatus = AccountStatus.ACTIVE;
        }
        if (this.role == null) {
            this.role = UserRole.STUDENT;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getYearOfStudy() { return yearOfStudy; }
    public void setYearOfStudy(Integer yearOfStudy) { this.yearOfStudy = yearOfStudy; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public AccountStatus getAccountStatus() { return accountStatus; }
    public void setAccountStatus(AccountStatus accountStatus) { this.accountStatus = accountStatus; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<StudentSkill> getStudentSkills() { return studentSkills; }
    public void setStudentSkills(List<StudentSkill> studentSkills) { this.studentSkills = studentSkills; }

    public List<ExchangeRequest> getSentRequests() { return sentRequests; }
    public void setSentRequests(List<ExchangeRequest> sentRequests) { this.sentRequests = sentRequests; }

    public List<ExchangeRequest> getReceivedRequests() { return receivedRequests; }
    public void setReceivedRequests(List<ExchangeRequest> receivedRequests) { this.receivedRequests = receivedRequests; }

    public List<Notification> getNotifications() { return notifications; }
    public void setNotifications(List<Notification> notifications) { this.notifications = notifications; }
}
