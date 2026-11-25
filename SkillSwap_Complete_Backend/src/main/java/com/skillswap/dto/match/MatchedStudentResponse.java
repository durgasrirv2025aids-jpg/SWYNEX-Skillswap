package com.skillswap.dto.match;

import java.util.List;

public class MatchedStudentResponse {

    private Long studentId;
    private String fullName;
    private String email;
    private String collegeName;
    private String department;
    private Integer yearOfStudy;
    private String bio;
    private List<String> skillsYouTeachTheyLearn;
    private List<String> skillsTheyTeachYouLearn;
    private boolean mutualMatch;

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

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

    public List<String> getSkillsYouTeachTheyLearn() { return skillsYouTeachTheyLearn; }
    public void setSkillsYouTeachTheyLearn(List<String> skillsYouTeachTheyLearn) { this.skillsYouTeachTheyLearn = skillsYouTeachTheyLearn; }

    public List<String> getSkillsTheyTeachYouLearn() { return skillsTheyTeachYouLearn; }
    public void setSkillsTheyTeachYouLearn(List<String> skillsTheyTeachYouLearn) { this.skillsTheyTeachYouLearn = skillsTheyTeachYouLearn; }

    public boolean isMutualMatch() { return mutualMatch; }
    public void setMutualMatch(boolean mutualMatch) { this.mutualMatch = mutualMatch; }
}
