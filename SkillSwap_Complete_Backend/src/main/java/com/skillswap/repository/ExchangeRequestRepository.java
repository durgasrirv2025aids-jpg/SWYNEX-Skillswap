package com.skillswap.repository;

import com.skillswap.entity.ExchangeRequest;
import com.skillswap.enums.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ExchangeRequestRepository extends JpaRepository<ExchangeRequest, Long> {

    List<ExchangeRequest> findBySenderIdOrderByCreatedAtDesc(Long senderId);

    Page<ExchangeRequest> findBySenderId(Long senderId, Pageable pageable);

    List<ExchangeRequest> findByReceiverIdOrderByCreatedAtDesc(Long receiverId);

    Page<ExchangeRequest> findByReceiverId(Long receiverId, Pageable pageable);

    boolean existsBySenderIdAndReceiverIdAndStatus(Long senderId, Long receiverId, RequestStatus status);

    long countByStatus(RequestStatus status);
}
