package com.busanit501.weatherback.controller;


import com.busanit501.weatherback.domain.APIUser;
import com.busanit501.weatherback.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/member")
@RequiredArgsConstructor
@Log4j2
public class MemberController {

    private final MemberService memberService;
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody APIUser apiUser) {
        log.info("apiUser확인" + apiUser);
        try {
            memberService.joinMember(apiUser);
            return ResponseEntity.ok("회원가입 성공");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // ✅ 중복 아이디 에러 응답
        }
    }

    @GetMapping("/check-mid")
    public ResponseEntity<Boolean> checkMid(@RequestParam String mid) {
        boolean exists = memberService.checkMember(mid);
        if (exists) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(true); // 409 Conflict (중복)
        }
        return ResponseEntity.ok(false); // 200 OK (사용 가능)
    }

}