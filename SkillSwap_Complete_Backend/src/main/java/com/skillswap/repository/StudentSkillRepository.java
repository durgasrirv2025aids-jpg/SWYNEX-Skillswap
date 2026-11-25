package com.skillswap.repository;

import com.skillswap.entity.StudentSkill;
import com.skillswap.enums.SkillType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface StudentSkillRepository extends JpaRepository<StudentSkill, Long> {

    List<StudentSkill> findByStudentId(Long studentId);

    Page<StudentSkill> findByStudentId(Long studentId, Pageable pageable);

    List<StudentSkill> findByStudentIdAndSkillType(Long studentId, SkillType skillType);

    List<StudentSkill> findBySkillType(SkillType skillType);

    long countBySkillType(SkillType skillType);

    boolean existsByStudentIdAndSkillIdAndSkillType(Long studentId, Long skillId, SkillType skillType);

    Optional<StudentSkill> findByStudentIdAndSkillIdAndSkillType(Long studentId, Long skillId, SkillType skillType);

    List<StudentSkill> findBySkillId(Long skillId);
}
