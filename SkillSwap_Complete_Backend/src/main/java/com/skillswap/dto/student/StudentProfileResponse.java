package com.skillswap.dto.student;

import com.skillswap.dto.skill.StudentSkillResponse;
import com.skillswap.enums.AccountStatus;
import java.time.LocalDateTime;
import java.util.List;

public class StudentProfileResponse {

    private Long id;
    private String fullName;
    private String email;
    private String collegeName;
    private String department;
    private Integer yearOfStudy;
    private String bio;
    private AccountStatus accountStatus;
    private List<StudentSkillResponse> teachingSkills;
    private List<StudentSkillResponse> learningSkills;
    private int connectionCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

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

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public AccountStatus getAccountStatus() { return accountStatus; }
    public void setAccountStatus(AccountStatus accountStatus) { this.accountStatus = accountStatus; }

    public List<StudentSkillResponse> getTeachingSkills() { return teachingSkills; }
    public void setTeachingSkills(List<StudentSkillResponse> teachingSkills) { this.teachingSkills = teachingSkills; }

    public List<StudentSkillResponse> getLearningSkills() { return learningSkills; }
    public void setLearningSkills(List<StudentSkillResponse> learningSkills) { this.learningSkills = learningSkills; }

    public int getConnectionCount() { return connectionCount; }
    public void setConnectionCount(int connectionCount) { this.connectionCount = connectionCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
