package com.skillswap.repository;

import com.skillswap.entity.Skill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface SkillRepository extends JpaRepository<Skill, Long> {

    Optional<Skill> findBySkillNameIgnoreCase(String skillName);

    boolean existsBySkillNameIgnoreCase(String skillName);

    List<Skill> findByCategoryIgnoreCase(String category);

    @Query("SELECT sk FROM Skill sk WHERE (:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(sk.skillName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(sk.category) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(sk.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Skill> searchSkills(@Param("keyword") String keyword, Pageable pageable);
}
