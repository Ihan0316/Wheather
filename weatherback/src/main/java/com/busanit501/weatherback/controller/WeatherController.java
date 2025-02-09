package com.busanit501.weatherback.controller;

import com.busanit501.weatherback.domain.Weather;
import com.busanit501.weatherback.dto.WeatherDTO;
import com.busanit501.weatherback.service.WeatherService;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Log4j2
@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "http://localhost:5173")
public class WeatherController {

    private final WeatherService service;

    @Autowired
    public WeatherController(WeatherService service) {
        this.service = service;
    }

    /**
     * 즐겨찾기 추가 (POST)
     * 인증된 사용자만 호출할 수 있으며, Authentication에서 mid를 받아 DTO에 설정함
     */
    @PostMapping
    public ResponseEntity<String> addFavorite(
            @RequestBody WeatherDTO dto,
            Authentication authentication
    ) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("로그인이 필요한 서비스입니다.");
        }
        String mid = authentication.getName();
        log.info("addFavorite | mid: {}", mid);

        dto.setMid(mid);
        Weather weather = dto.toEntity();
        String result = service.saveFavoriteWeather(weather);

        return ResponseEntity.ok(result);
    }

    /**
     * 즐겨찾기 조회 (GET)
     */
    @GetMapping
    public ResponseEntity<?> getFavorites(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("로그인이 필요한 서비스입니다.");
        }
        String mid = authentication.getName();
        log.info("getFavorites | mid: {}", mid);

        List<Weather> favorites = service.getFavoritesByMid(mid);
        return ResponseEntity.ok(favorites);
    }

    /**
     * 즐겨찾기 삭제 (DELETE)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFavorite(@PathVariable Long id) {
        service.deleteFavorite(id);
        return ResponseEntity.ok("삭제 완료");
    }
}
