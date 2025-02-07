package com.busanit501.weatherback.repository;

import com.busanit501.weatherback.domain.Weather;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WeatherRepository extends JpaRepository<Weather, Long> {
    List<Weather> findByCity(String city);

    List<Weather> findByMid(String mid);

    List<Weather> findByLatitudeAndLongitude(double latitude, double longitude); // 메서드명 수정

    void deleteById(Long id);
}
