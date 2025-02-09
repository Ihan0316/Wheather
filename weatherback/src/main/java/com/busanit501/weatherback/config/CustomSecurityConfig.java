package com.busanit501.weatherback.config;

import com.busanit501.weatherback.security.APIUserDetailsService;
import com.busanit501.weatherback.security.filter.APILoginFilter;
import com.busanit501.weatherback.security.filter.RefreshTokenFilter;
import com.busanit501.weatherback.security.filter.TokenCheckFilter;
import com.busanit501.weatherback.security.handler.APILoginSuccessHandler;
import com.busanit501.weatherback.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Log4j2
@Configuration
@EnableMethodSecurity
@EnableWebSecurity
@RequiredArgsConstructor
public class CustomSecurityConfig {

    private final APIUserDetailsService apiUserDetailsService;
    private final JWTUtil jwtUtil;

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * 정적 리소스 경로에 대한 시큐리티 무시 설정
     */
    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        log.info("시큐리티 동작 확인 ====webSecurityCustomizer======================");
        return (web) -> web.ignoring()
                .requestMatchers(PathRequest.toStaticResources().atCommonLocations());
    }

    /**
     * Spring Security 핵심 설정
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        log.info("===========config=================");

        // 1) AuthenticationManager 생성 및 설정
        AuthenticationManagerBuilder authManagerBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authManagerBuilder
                .userDetailsService(apiUserDetailsService)
                .passwordEncoder(passwordEncoder());
        AuthenticationManager authenticationManager = authManagerBuilder.build();
        http.authenticationManager(authenticationManager);

        // 2) 로그인 필터 설정
        APILoginFilter apiLoginFilter = new APILoginFilter("/generateToken");
        apiLoginFilter.setAuthenticationManager(authenticationManager);
        APILoginSuccessHandler successHandler = new APILoginSuccessHandler(jwtUtil);
        apiLoginFilter.setAuthenticationSuccessHandler(successHandler);

        // 3) 필터 순서 지정
        http.addFilterBefore(apiLoginFilter, UsernamePasswordAuthenticationFilter.class);
        http.addFilterBefore(
                tokenCheckFilter(jwtUtil, apiUserDetailsService),
                UsernamePasswordAuthenticationFilter.class
        );
        http.addFilterBefore(
                new RefreshTokenFilter("/refreshToken", jwtUtil),
                TokenCheckFilter.class
        );

        // 4) CSRF, 세션 정책
        http.csrf(csrf -> csrf.disable());
        http.sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // 5) CORS 설정
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));

        // 6) 요청 인증/인가 규칙
        http.authorizeHttpRequests(auth -> auth
                // 로그인, 리프레시 토큰 엔드포인트는 인증 없이 접근 가능
                .requestMatchers("/generateToken", "/refreshToken").permitAll()
                // /api/ 하위 경로는 인증 필요
                .requestMatchers("/api/**").authenticated()
                // 그 외 나머지는 모두 허용
                .anyRequest().permitAll()
        );

        return http.build();
    }

    private TokenCheckFilter tokenCheckFilter(JWTUtil jwtUtil, APIUserDetailsService apiUserDetailsService) {
        return new TokenCheckFilter(apiUserDetailsService, jwtUtil);
    }

    /**
     * CORS 설정
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // 원하는 Origin(React 앱 등)을 설정해주세요
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(Arrays.asList("HEAD", "GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // 모든 경로에 위 설정 적용
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}