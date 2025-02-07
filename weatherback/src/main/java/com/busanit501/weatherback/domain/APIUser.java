package com.busanit501.weatherback.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class APIUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 내부 식별용 PK

    @Column(unique = true, nullable = false)
    private String mid; // 사용자 ID (변경 가능)

    private String mpw; // 사용자 비밀번호
    private String name; // 사용자 이름
    private LocalDate birthdate; // 생년월일
    private String mbti; // MBTI
    private String gender; // 성별 ("M", "F", "Other")

    // 비밀번호 변경 메서드
    public void changePw(String mpw) {
        this.mpw = mpw;
    }
}