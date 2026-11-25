package com.skillswap.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "connections",
    indexes = {
        @Index(name = "idx_connections_student_one", columnList = "student_one_id"),
        @Index(name = "idx_connections_student_two", columnList = "student_two_id")
    }
)
public class Connection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "connection_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_one_id", nullable = false)
    private Student studentOne;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_two_id", nullable = false)
    private Student studentTwo;

    @Column(name = "exchanged_skills_summary", length = 400)
    private String exchangedSkillsSummary;

    @Column(name = "connected_at", nullable = false, updatable = false)
    private LocalDateTime connectedAt;

    @PrePersist
    protected void onCreate() {
        this.connectedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudentOne() { return studentOne; }
    public void setStudentOne(Student studentOne) { this.studentOne = studentOne; }

    public Student getStudentTwo() { return studentTwo; }
    public void setStudentTwo(Student studentTwo) { this.studentTwo = studentTwo; }

    public String getExchangedSkillsSummary() { return exchangedSkillsSummary; }
    public void setExchangedSkillsSummary(String exchangedSkillsSummary) { this.exchangedSkillsSummary = exchangedSkillsSummary; }

    public LocalDateTime getConnectedAt() { return connectedAt; }
    public void setConnectedAt(LocalDateTime connectedAt) { this.connectedAt = connectedAt; }
}
