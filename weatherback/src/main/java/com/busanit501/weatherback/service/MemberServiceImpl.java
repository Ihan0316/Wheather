package com.busanit501.weatherback.service;

import com.busanit501.weatherback.domain.APIUser;
import com.busanit501.weatherback.repository.APlUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Log4j2
@RequiredArgsConstructor
@Service
public class MemberServiceImpl implements MemberService {

    private final PasswordEncoder passwordEncoder;
    private final APlUserRepository apiUserRepository;

    @Override
    public void joinMember(APIUser apiUser) {
        // 아이디 중복 확인
        if (apiUserRepository.existsByMid(apiUser.getMid())) {
            throw new RuntimeException("이미 사용 중인 아이디입니다.");
        }

        // 모든 필드를 APIUser 빌더에서 설정하도록 수정
        APIUser apiUser2 = APIUser.builder()
                .mid(apiUser.getMid())
                .mpw(passwordEncoder.encode(apiUser.getMpw())) // 비밀번호 암호화
                .name(apiUser.getName())
                .birthdate(apiUser.getBirthdate())
                .mbti(apiUser.getMbti())
                .gender(apiUser.getGender())
                .build();

        apiUserRepository.save(apiUser2);
    }

    @Override
    public boolean checkMember(String mid) {
        return apiUserRepository.existsByMid(mid);
    }
}
