package com.busanit501.weatherback.dto;

import com.busanit501.weatherback.domain.Weather;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WeatherDTO {
    private String country;
    private String city;
    private String mid;
    private Double latitude;
    private Double longitude;

    public Weather toEntity() {
        return new Weather(mid, country, city, latitude, longitude);
    }
}
