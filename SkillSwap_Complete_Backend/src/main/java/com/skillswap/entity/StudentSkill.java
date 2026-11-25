package com.skillswap.entity;

import com.skillswap.enums.SkillType;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "student_skills",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_student_skill_type", columnNames = {"student_id", "skill_id", "skill_type"})
    },
    indexes = {
        @Index(name = "idx_student_skills_student", columnList = "student_id"),
        @Index(name = "idx_student_skills_skill", columnList = "skill_id"),
        @Index(name = "idx_student_skills_type", columnList = "skill_type")
    }
)
public class StudentSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_skill_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    @Column(name = "skill_type", nullable = false, length = 20)
    private SkillType skillType;

    @Column(name = "proficiency_level", length = 50)
    private String proficiencyLevel;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public Skill getSkill() { return skill; }
    public void setSkill(Skill skill) { this.skill = skill; }

    public SkillType getSkillType() { return skillType; }
    public void setSkillType(SkillType skillType) { this.skillType = skillType; }

    public String getProficiencyLevel() { return proficiencyLevel; }
    public void setProficiencyLevel(String proficiencyLevel) { this.proficiencyLevel = proficiencyLevel; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
