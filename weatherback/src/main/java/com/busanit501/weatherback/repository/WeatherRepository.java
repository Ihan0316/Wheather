package com.busanit501.weatherback.repository;

import com.busanit501.weatherback.domain.Weather;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface WeatherRepository extends JpaRepository<Weather, Long> {
    // 도시 이름으로 조회 (필요 시 사용)
    List<Weather> findByCity(String city);

    // 사용자(mid)로 조회 (필요 시 사용)
    List<Weather> findByMid(String mid);

    // 사용자(mid)와 도시(city) 조합으로 조회하여 중복 검사에 사용
    List<Weather> findByMidAndCity(String mid, String city);

    // 위도와 경도 기준으로 조회 (필요 시 사용)
    List<Weather> findByLatitudeAndLongitude(double latitude, double longitude);
}
