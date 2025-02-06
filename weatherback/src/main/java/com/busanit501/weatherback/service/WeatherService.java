package com.busanit501.weatherback.service;

import com.busanit501.weatherback.domain.Weather;
import com.busanit501.weatherback.dto.WeatherDTO;
import com.busanit501.weatherback.repository.WeatherRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WeatherService {

    private final WeatherRepository repository;

    public WeatherService(WeatherRepository repository) {
        this.repository = repository;
    }

    public Weather addFavorite(WeatherDTO dto) {
        Weather Weather = dto.toEntity();
        return repository.save(Weather);
    }

    public List<Weather> getFavorites() {
        return repository.findAll();
    }

    public void deleteFavorite(Long id) {
        repository.deleteById(id);
    }
}
