package com.busanit501.weatherback.security.handler;

import com.busanit501.weatherback.dto.APIUserDTO;
import com.busanit501.weatherback.util.JWTUtil;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;
import java.util.Map;

@Log4j2
@RequiredArgsConstructor
public class APILoginSuccessHandler implements AuthenticationSuccessHandler {
    private final JWTUtil jwtUtil;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {
        log.info("Login Success Handler triggered");

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        // APIUserDTO에는 mid, birthdate, mbti, gender 등의 필드가 있어야 합니다.
        APIUserDTO userDTO = (APIUserDTO) authentication.getPrincipal();

        // 클레임에 필요한 정보를 모두 포함합니다.
        Map<String, Object> claims = Map.of(
                "mid", userDTO.getMid(),
                "birthdate", userDTO.getBirthdate().toString(),
                "mbti", userDTO.getMbti(),
                "gender", userDTO.getGender()
        );

        String accessToken = jwtUtil.generateToken(claims, 1);
        String refreshToken = jwtUtil.generateToken(claims, 30);

        Gson gson = new Gson();
        Map<String, String> tokenMap = Map.of(
                "accessToken", accessToken,
                "refreshToken", refreshToken
        );
        response.getWriter().println(gson.toJson(tokenMap));
    }
}
