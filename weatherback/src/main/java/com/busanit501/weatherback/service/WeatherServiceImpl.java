package com.busanit501.weatherback.service;

import com.busanit501.weatherback.domain.Weather;
import com.busanit501.weatherback.repository.WeatherRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WeatherServiceImpl implements WeatherService {

    private static final Logger logger = LoggerFactory.getLogger(WeatherServiceImpl.class);
    private final WeatherRepository repository;

    public WeatherServiceImpl(WeatherRepository repository) {
        this.repository = repository;
    }

    @Override
    public String saveFavoriteWeather(Weather weather) {
        List<Weather> existingWeather = repository.findByMidAndCity(weather.getMid(), weather.getCity());
        if (!existingWeather.isEmpty()) {
            return "이미 등록된 즐겨찾기 도시입니다.";
        }
        repository.save(weather);
        return "즐겨찾기에 추가되었습니다.";
    }

    @Override
    public List<Weather> getFavoritesByMid(String mid) {
        return repository.findByMid(mid);
    }

    @Override
    public List<Weather> getAllFavorites() {
        return repository.findAll();
    }

    @Override
    public void deleteFavorite(Long id) {
        logger.info("삭제 요청 ID: {}", id);
        if (repository.existsById(id)) {
            repository.deleteById(id);
            logger.info("삭제 완료 ID: {}", id);
        } else {
            logger.warn("삭제할 ID가 존재하지 않음: {}", id);
        }
    }
}
