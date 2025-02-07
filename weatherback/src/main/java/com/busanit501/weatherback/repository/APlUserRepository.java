package com.busanit501.weatherback.repository;

import com.busanit501.weatherback.domain.APIUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface APlUserRepository extends JpaRepository<APIUser, Long> {
    boolean existsByMid(String mid);

    Optional<APIUser> findByMid(String mid); // 사용자 ID(mid)로 조회하는 메서드 추가
}
