package com.skillswap.repository;

import com.skillswap.entity.Connection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    @Query("SELECT c FROM Connection c WHERE c.studentOne.id = :studentId OR c.studentTwo.id = :studentId ORDER BY c.connectedAt DESC")
    List<Connection> findAllByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT c FROM Connection c WHERE c.studentOne.id = :studentId OR c.studentTwo.id = :studentId")
    Page<Connection> findPageByStudentId(@Param("studentId") Long studentId, Pageable pageable);

    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Connection c " +
           "WHERE (c.studentOne.id = :idA AND c.studentTwo.id = :idB) " +
           "OR (c.studentOne.id = :idB AND c.studentTwo.id = :idA)")
    boolean existsConnectionBetweenStudents(@Param("idA") Long idA, @Param("idB") Long idB);

    @Query("SELECT c FROM Connection c " +
           "WHERE (c.studentOne.id = :idA AND c.studentTwo.id = :idB) " +
           "OR (c.studentOne.id = :idB AND c.studentTwo.id = :idA)")
    Optional<Connection> findConnectionBetweenStudents(@Param("idA") Long idA, @Param("idB") Long idB);
}
