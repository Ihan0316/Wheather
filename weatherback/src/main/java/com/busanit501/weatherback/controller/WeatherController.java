package com.busanit501.weatherback.controller;

import com.busanit501.weatherback.domain.Weather;
import com.busanit501.weatherback.dto.WeatherDTO;
import com.busanit501.weatherback.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "http://localhost:5173") // React와 연결
public class WeatherController {

    private final WeatherService service;


    @Autowired
    public WeatherController(WeatherService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<String> addFavorite(@RequestBody WeatherDTO dto) {
        Weather weather = dto.toEntity();
        String result = service.saveFavoriteWeather(weather);

        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<List<Weather>> getFavorites() {
        List<Weather> favorites = service.getAllFavorites();
        return ResponseEntity.ok(favorites);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFavorite(@PathVariable Long id) {
        service.deleteFavorite(id);
        return ResponseEntity.ok("삭제 완료");
    }
}
