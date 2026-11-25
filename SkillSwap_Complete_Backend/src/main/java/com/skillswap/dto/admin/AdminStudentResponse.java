package com.skillswap.dto.admin;

import com.skillswap.enums.AccountStatus;
import com.skillswap.enums.UserRole;
import java.time.LocalDateTime;

public class AdminStudentResponse {

    private Long id;
    private String fullName;
    private String email;
    private String collegeName;
    private String department;
    private Integer yearOfStudy;
    private AccountStatus accountStatus;
    private UserRole role;
    private int skillCount;
    private int connectionCount;
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getYearOfStudy() { return yearOfStudy; }
    public void setYearOfStudy(Integer yearOfStudy) { this.yearOfStudy = yearOfStudy; }

    public AccountStatus getAccountStatus() { return accountStatus; }
    public void setAccountStatus(AccountStatus accountStatus) { this.accountStatus = accountStatus; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public int getSkillCount() { return skillCount; }
    public void setSkillCount(int skillCount) { this.skillCount = skillCount; }

    public int getConnectionCount() { return connectionCount; }
    public void setConnectionCount(int connectionCount) { this.connectionCount = connectionCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
