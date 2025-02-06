package com.busanit501.weatherback.controller;



import com.busanit501.weatherback.domain.Weather;
import com.busanit501.weatherback.dto.WeatherDTO;
import com.busanit501.weatherback.service.WeatherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "http://localhost:5173") // React와 연결
public class WeatherController {

    private final WeatherService service;

    public WeatherController(WeatherService service) {
        this.service = service;
    }

    @PostMapping
    public Weather addFavorite(@RequestBody WeatherDTO dto) {
        return service.addFavorite(dto);
    }

    @GetMapping
    public List<Weather> getFavorites() {
        return service.getFavorites();
    }

    @DeleteMapping("/{id}")
    public void deleteFavorite(@PathVariable Long id) {
        service.deleteFavorite(id);
    }

    @GetMapping("/{city}")
    public ResponseEntity<String> getWeather(@PathVariable String city) {
        return ResponseEntity.ok("Weather data for " + city);
    }
}
