package com.skillswap.dto.match;

public class MatchFilterRequest {

    private String skill;
    private String college;
    private String department;

    public String getSkill() { return skill; }
    public void setSkill(String skill) { this.skill = skill; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
}
