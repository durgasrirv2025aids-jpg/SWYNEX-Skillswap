package com.skillswap.dto.student;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

public class StudentUpdateRequest {

    @Size(min = 2, max = 120)
    private String fullName;

    @Size(max = 160)
    private String collegeName;

    @Size(max = 120)
    private String department;

    @Min(1)
    @Max(10)
    private Integer yearOfStudy;

    @Size(max = 1000)
    private String bio;

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getYearOfStudy() { return yearOfStudy; }
    public void setYearOfStudy(Integer yearOfStudy) { this.yearOfStudy = yearOfStudy; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
}
