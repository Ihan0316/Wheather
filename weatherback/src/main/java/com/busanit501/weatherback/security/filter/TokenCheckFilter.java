package com.busanit501.weatherback.security.filter;

import com.busanit501.weatherback.security.APIUserDetailsService;
import com.busanit501.weatherback.security.exception.AccessTokenException;
import com.busanit501.weatherback.util.JWTUtil;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Map;

@Log4j2
@RequiredArgsConstructor
public class TokenCheckFilter extends OncePerRequestFilter {

    private final APIUserDetailsService apiUserDetailsService;
    private final JWTUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();

        if (shouldSkipTokenValidation(path)) {
            filterChain.doFilter(request, response);
            return;
        }

        log.info("Token Check Filter triggered for path: {}", path);
        log.info("JWTUtil instance: {}", jwtUtil);

        try {
            Map<String, Object> payload = validateAccessToken(request);
            String mid = (String) payload.get("mid");
            log.info("Extracted mid from token: {}", mid);

            UserDetails userDetails = apiUserDetailsService.loadUserByUsername(mid);
            UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            filterChain.doFilter(request, response);
        } catch (AccessTokenException e) {
            log.error("AccessTokenException occurred: {}", e.getMessage());
            e.sendResponseError(response);
        }
    }

    public Map<String, Object> validateAccessToken(HttpServletRequest request) throws AccessTokenException {
        String headerStr = request.getHeader("Authorization");

        if (headerStr == null || headerStr.length() < 8) {
            throw new AccessTokenException(AccessTokenException.TOKEN_ERROR.UNACCEPT);
        }

        String tokenType = headerStr.substring(0, 6);
        String tokenStr = headerStr.substring(7);

        if (!tokenType.equalsIgnoreCase("Bearer")) {
            throw new AccessTokenException(AccessTokenException.TOKEN_ERROR.BADTYPE);
        }

        try {
            return jwtUtil.validateToken(tokenStr);
        } catch (MalformedJwtException e) {
            log.error("MalformedJwtException: {}", e.getMessage());
            throw new AccessTokenException(AccessTokenException.TOKEN_ERROR.MALFORM);
        } catch (SignatureException e) {
            log.error("SignatureException: {}", e.getMessage());
            throw new AccessTokenException(AccessTokenException.TOKEN_ERROR.BADSIGN);
        } catch (ExpiredJwtException e) {
            log.error("ExpiredJwtException: {}", e.getMessage());
            throw new AccessTokenException(AccessTokenException.TOKEN_ERROR.EXPIRED);
        }
    }

    private boolean shouldSkipTokenValidation(String path) {
        return path.equals("/member/check-mid") ||
                path.equals("/member/register") ||
                path.equals("/api/member/login") ||
                path.equals("/api/member/register");
    }
}
