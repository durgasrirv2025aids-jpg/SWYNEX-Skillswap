package com.skillswap.dto.skill;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SkillRequest {

    @NotBlank(message = "Skill name is required")
    @Size(min = 1, max = 100)
    private String skillName;

    @Size(max = 80)
    private String category;

    @Size(max = 500)
    private String description;

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
