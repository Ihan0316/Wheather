package com.busanit501.weatherback.security;

import com.busanit501.weatherback.domain.APIUser;
import com.busanit501.weatherback.dto.APIUserDTO;
import com.busanit501.weatherback.repository.APlUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Log4j2
@RequiredArgsConstructor
public class APIUserDetailsService implements UserDetailsService {

    // Repository 주입
    private final APlUserRepository apiUserRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // DB에서 사용자 정보를 조회 (APIUser 엔티티에 미리 모든 필드가 저장되어 있어야 함)
        Optional<APIUser> result = apiUserRepository.findByMid(username);

        // 사용자 정보가 없으면 예외 발생
        APIUser apiUser = result.orElseThrow(() ->
                new UsernameNotFoundException("Cannot find user with username: " + username));

        // 조회된 사용자 정보 로깅
        log.info("APIUserDetailsService - Found APIUser: {}", apiUser);

        // APIUserDTO 생성 – 추가 정보(name, birthdate, mbti, gender)를 모두 포함
        APIUserDTO dto = new APIUserDTO(
                apiUser.getMid(),                   // 사용자 ID
                apiUser.getMpw(),                   // 사용자 비밀번호
                List.of(new SimpleGrantedAuthority("ROLE_USER")), // 권한 설정
                apiUser.getName(),                  // 사용자 이름
                apiUser.getBirthdate(),             // 생년월일
                apiUser.getMbti(),                  // MBTI
                apiUser.getGender()                 // 성별 ("M", "F", "Other")
        );

        // 생성한 DTO 로깅
        log.info("APIUserDetailsService - Created APIUserDTO: {}", dto);

        return dto;
    }
}
