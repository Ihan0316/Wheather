package com.busanit501.weatherback.service;

import com.busanit501.weatherback.domain.APIUser;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface MemberService {
     void joinMember(APIUser apiUser);
     boolean checkMember(String mid);

}
