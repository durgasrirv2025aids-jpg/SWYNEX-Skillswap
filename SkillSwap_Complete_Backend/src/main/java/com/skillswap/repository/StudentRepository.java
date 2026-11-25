package com.skillswap.repository;

import com.skillswap.entity.Student;
import com.skillswap.enums.AccountStatus;
import com.skillswap.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByEmail(String email);

    Optional<Student> findByEmailIgnoreCase(String email);

    boolean existsByEmail(String email);

    boolean existsByEmailIgnoreCase(String email);

    long countByRole(UserRole role);

    long countByAccountStatus(AccountStatus status);

    List<Student> findByAccountStatus(AccountStatus status);

    Page<Student> findByRole(UserRole role, Pageable pageable);

    @Query("SELECT s FROM Student s WHERE s.role = com.skillswap.enums.UserRole.STUDENT " +
           "AND (:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(s.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.department) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(s.collegeName) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:department IS NULL OR :department = '' OR LOWER(s.department) = LOWER(:department)) " +
           "AND (:college IS NULL OR :college = '' OR LOWER(s.collegeName) = LOWER(:college))")
    Page<Student> searchStudents(
            @Param("keyword") String keyword,
            @Param("department") String department,
            @Param("college") String college,
            Pageable pageable
    );
}
