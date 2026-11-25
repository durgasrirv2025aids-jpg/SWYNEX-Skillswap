package com.skillswap.dto.skill;

import com.skillswap.enums.SkillType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class StudentSkillRequest {

    @NotBlank(message = "Skill name is required")
    @Size(min = 1, max = 100)
    private String skillName;

    @Size(max = 80)
    private String category;

    @NotNull(message = "Skill type (TEACH or LEARN) is required")
    private SkillType skillType;

    @Size(max = 50)
    private String proficiencyLevel;

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public SkillType getSkillType() { return skillType; }
    public void setSkillType(SkillType skillType) { this.skillType = skillType; }

    public String getProficiencyLevel() { return proficiencyLevel; }
    public void setProficiencyLevel(String proficiencyLevel) { this.proficiencyLevel = proficiencyLevel; }
}
