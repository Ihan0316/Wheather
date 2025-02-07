package com.busanit501.weatherback.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.time.LocalDate;
import java.util.Collection;

@Getter
@Setter
@ToString
public class APIUserDTO extends User {

    private String mid; // 사용자 ID
    private String mpw; // 사용자 비밀번호
    private String name; // 사용자 이름
    private LocalDate birthdate; // 생년월일
    private String mbti; // MBTI
    private String gender; // 성별 ("M", "F", "Other")

    // 생성자
    public APIUserDTO(
            String username,
            String password,
            Collection<? extends GrantedAuthority> authorities,
            String name,
            LocalDate birthdate,
            String mbti,
            String gender
    ) {
        super(username, password, authorities); // 부모 클래스(User)의 생성자 호출
        this.mid = username;
        this.mpw = password;
        this.name = name;
        this.birthdate = birthdate;
        this.mbti = mbti;
        this.gender = gender;
    }
}
