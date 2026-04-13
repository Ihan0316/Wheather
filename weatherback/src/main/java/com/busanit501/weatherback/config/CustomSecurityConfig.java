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
import org.springframework.beans.factory.annotation.Value;
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

import java.util.List;
import java.util.stream.Collectors;

@Log4j2
@Configuration
// 어노테이션을 이용해서, 특정 권한 있는 페이지 접근시, 구분가능.
// @EnableGlobalMethodSecurity(prePostEnabled = true)
// 위 어노테이션 지원중단, 아래 어노테이션 으로 교체, 기본으로 prePostEnabled = true ,
@EnableMethodSecurity
@EnableWebSecurity
@RequiredArgsConstructor
public class CustomSecurityConfig {
        private final APIUserDetailsService apiUserDetailsService;
        // 추가,
        private final JWTUtil jwtUtil;

        @Value("#{'${app.cors.allowed-origins:http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173}'.split(',')}")
        private List<String> allowedOrigins;

        @Value("#{'${app.cors.allowed-methods:HEAD,GET,POST,PUT,PATCH,DELETE,OPTIONS}'.split(',')}")
        private List<String> allowedMethods;

        @Value("#{'${app.cors.allowed-headers:Authorization,Cache-Control,Content-Type}'.split(',')}")
        private List<String> allowedHeaders;

        @Value("${app.cors.allow-credentials:false}")
        private boolean allowCredentials;

        @Bean
        public BCryptPasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public WebSecurityCustomizer webSecurityCustomizer() {
                log.info("시큐리티 동작 확인 ====webSecurityCustomizer======================");
                return (web) -> web.ignoring()
                                .requestMatchers(PathRequest.toStaticResources().atCommonLocations());
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                log.info("===========config=================");

                // AuthenticationManagerBuilder 생성 및 설정
                AuthenticationManagerBuilder authenticationManagerBuilder = http
                                .getSharedObject(AuthenticationManagerBuilder.class);

                // AuthenticationManagerBuilder에 UserDetailsService와 PasswordEncoder 설정
                authenticationManagerBuilder
                                .userDetailsService(apiUserDetailsService) // 사용자 정보를 제공하는 서비스 설정
                                .passwordEncoder(passwordEncoder()); // 비밀번호 암호화 방식 설정

                // AuthenticationManager 생성
                AuthenticationManager authenticationManager = authenticationManagerBuilder.build();

                // AuthenticationManager를 HttpSecurity에 설정
                http.authenticationManager(authenticationManager); // 반드시 필요: Security 필터 체인에서 사용할 AuthenticationManager
                                                                   // 설정

                // APILoginFilter 생성 및 AuthenticationManager 설정
                APILoginFilter apiLoginFilter = new APILoginFilter("/generateToken"); // 로그인 엔드포인트 설정
                apiLoginFilter.setAuthenticationManager(authenticationManager); // APILoginFilter에서 사용할
                                                                                // AuthenticationManager 설정

                // APILoginSuccessHandler 생성: 인증 성공 후 처리 로직을 담당
                // 교체
                APILoginSuccessHandler successHandler = new APILoginSuccessHandler(jwtUtil);

                // SuccessHandler 설정: 로그인 성공 시 APILoginSuccessHandler가 호출되도록 설정
                apiLoginFilter.setAuthenticationSuccessHandler(successHandler);

                // APILoginFilter를 UsernamePasswordAuthenticationFilter 이전에 추가
                http.addFilterBefore(apiLoginFilter, UsernamePasswordAuthenticationFilter.class); // 사용자 인증 전에
                                                                                                  // APILoginFilter 동작
                                                                                                  // 설정

                // /api 경로에 대해 TokenCheckFilter 적용
                http.addFilterBefore(
                                tokenCheckFilter(jwtUtil, apiUserDetailsService),
                                UsernamePasswordAuthenticationFilter.class);

                // RefreshTokenFilter를 TokenCheckFilter 이전에 등록
                http.addFilterBefore(
                                new RefreshTokenFilter("/refreshToken", jwtUtil),
                                TokenCheckFilter.class);

                // CSRF 비활성화
                http.csrf(httpSecurityCsrfConfigurer -> httpSecurityCsrfConfigurer.disable()); // REST API 환경에서 CSRF 보호
                                                                                               // 비활성화

                // 세션 관리 정책 설정
                http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)); // 세션
                                                                                                                   // 사용
                                                                                                                   // 안
                                                                                                                   // 함:
                                                                                                                   // JWT
                                                                                                                   // 기반
                                                                                                                   // 인증
                                                                                                                   // 사용

                http.cors(httpSecurityCorsConfigurer -> httpSecurityCorsConfigurer
                                .configurationSource(corsConfigurationSource()));

                http.authorizeHttpRequests(auth -> auth
                                .requestMatchers(
                                                "/member/check-mid",
                                                "/member/register",
                                                "/api/member/login",
                                                "/api/member/register")
                                .permitAll()
                                .anyRequest().authenticated());

                // SecurityFilterChain 반환
                return http.build(); // Security 필터 체인을 빌드하여 반환
        }

        private TokenCheckFilter tokenCheckFilter(JWTUtil jwtUtil, APIUserDetailsService apiUserDetailsService) {
                return new TokenCheckFilter(apiUserDetailsService, jwtUtil);
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                List<String> normalizedOrigins = normalizeValues(allowedOrigins);

                if (normalizedOrigins.contains("*")) {
                        configuration.setAllowedOriginPatterns(List.of("*"));
                        configuration.setAllowCredentials(false);
                } else {
                        configuration.setAllowedOrigins(normalizedOrigins);
                        configuration.setAllowCredentials(allowCredentials);
                }

                configuration.setAllowedMethods(normalizeValues(allowedMethods));
                configuration.setAllowedHeaders(normalizeValues(allowedHeaders));

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }

        private List<String> normalizeValues(List<String> values) {
                return values.stream()
                                .map(String::trim)
                                .filter(value -> !value.isEmpty())
                                .collect(Collectors.toList());
        }
}
