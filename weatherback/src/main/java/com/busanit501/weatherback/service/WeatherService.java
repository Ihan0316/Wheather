package com.busanit501.weatherback.service;

import com.busanit501.weatherback.domain.Weather;
import java.util.List;

public interface WeatherService {
    /**
     * 즐겨찾기 추가
     */
    String saveFavoriteWeather(Weather weather);

    /**
     * 특정 사용자(mid) 기준 즐겨찾기 조회
     */
    List<Weather> getFavoritesByMid(String mid);

    /**
     * 전체 즐겨찾기 조회 (필요 시 사용)
     */
    List<Weather> getAllFavorites();

    /**
     * 즐겨찾기 삭제
     */
    void deleteFavorite(Long id);
}
