package com.busanit501.weatherback.security.filter;

import com.busanit501.weatherback.security.exception.RefreshTokenException;
import com.busanit501.weatherback.util.JWTUtil;
import com.google.gson.Gson;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Log4j2
@RequiredArgsConstructor
public class RefreshTokenFilter extends OncePerRequestFilter {

    private final String refreshPath;
    private final JWTUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();
        log.info("RefreshTokenFilter: path = {}", path);
        if (!path.equals(refreshPath)) {
            filterChain.doFilter(request, response);
            return;
        }

        log.info("RefreshTokenFilter: Running refresh token logic");

        // JSON에서 accessToken과 refreshToken 추출
        Map<String, String> tokens = parseRequestJSON(request);
        String accessToken = tokens.get("accessToken");
        String refreshToken = tokens.get("refreshToken");

        log.info("AccessToken from refresh: {}", accessToken);
        log.info("RefreshToken from refresh: {}", refreshToken);

        try {
            checkAccessToken(accessToken);
        } catch(RefreshTokenException e) {
            e.sendResponseError(response);
            return;
        }

        Map<String, Object> refreshClaims;
        try {
            refreshClaims = checkRefreshToken(refreshToken);
            log.info("Refresh Claims: {}", refreshClaims);
        } catch(RefreshTokenException e) {
            e.sendResponseError(response);
            return;
        }

        // Refresh 토큰의 남은 유효시간 계산
        Integer exp = (Integer) refreshClaims.get("exp");
        Date expTime = new Date(Instant.ofEpochMilli(exp).toEpochMilli() * 1000);
        Date current = new Date(System.currentTimeMillis());
        long gapTime = expTime.getTime() - current.getTime();

        log.info("Current time: {}", current);
        log.info("Expiration time: {}", expTime);
        log.info("Gap: {} ms", gapTime);

        // 클레임에서 "mid" 추출 (일관성을 위해 사용)
        String mid = (String) refreshClaims.get("mid");
        log.info("Extracted mid from refresh token: {}", mid);

        // 새 Access Token 발급 (여기서 "mid" 키로 생성)
        String accessTokenValue = jwtUtil.generateToken(Map.of("mid", mid), 1);
        String refreshTokenValue = refreshToken;

        // Refresh Token의 유효시간이 3일 미만이면 새 Refresh Token 발급
        if(gapTime < (1000 * 60 * 60 * 24 * 3)) {
            log.info("Issuing new refresh token as gap is less than 3 days");
            refreshTokenValue = jwtUtil.generateToken(Map.of("mid", mid), 3);
        }

        log.info("New tokens generated:");
        log.info("AccessToken: {}", accessTokenValue);
        log.info("RefreshToken: {}", refreshTokenValue);

        sendTokens(accessTokenValue, refreshTokenValue, response);
    }

    private Map<String, String> parseRequestJSON(HttpServletRequest request) {
        try (Reader reader = new InputStreamReader(request.getInputStream())) {
            Gson gson = new Gson();
            return gson.fromJson(reader, Map.class);
        } catch (Exception e) {
            log.error("Error parsing JSON in RefreshTokenFilter: {}", e.getMessage());
        }
        return null;
    }

    private void checkAccessToken(String accessToken) throws RefreshTokenException {
        try {
            jwtUtil.validateToken(accessToken);
        } catch (ExpiredJwtException e) {
            log.info("Access token expired: {}", e.getMessage());
        } catch(Exception e) {
            throw new RefreshTokenException(RefreshTokenException.ErrorCase.NO_ACCESS);
        }
    }

    private Map<String, Object> checkRefreshToken(String refreshToken) throws RefreshTokenException {
        try {
            return jwtUtil.validateToken(refreshToken);
        } catch (ExpiredJwtException e) {
            throw new RefreshTokenException(RefreshTokenException.ErrorCase.OLD_REFRESH);
        } catch (MalformedJwtException e) {
            log.error("MalformedJwtException in refresh: {}", e.getMessage());
            throw new RefreshTokenException(RefreshTokenException.ErrorCase.NO_REFRESH);
        } catch(Exception e) {
            e.printStackTrace();
            throw new RefreshTokenException(RefreshTokenException.ErrorCase.NO_REFRESH);
        }
    }

    private void sendTokens(String accessTokenValue, String refreshTokenValue, HttpServletResponse response) {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        Gson gson = new Gson();
        String jsonStr = gson.toJson(Map.of(
                "accessToken", accessTokenValue,
                "refreshToken", refreshTokenValue
        ));
        try {
            response.getWriter().println(jsonStr);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
