package com.night.admin.application.service;

import com.night.admin.domain.service.AuthService;
import com.night.admin.application.dto.request.LoginRequest;
import com.night.admin.application.dto.response.LoginResponse;
import com.night.admin.application.mapper.AuthMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthApplicationService {
    
    private final AuthService authDomainService;
    private final AuthMapper authMapper;
    
    public LoginResponse login(LoginRequest request) {
        // 调用领域服务进行认证
        com.night.admin.domain.entity.LoginResponse domainResponse = 
            authDomainService.login(request.getUsername(), request.getPassword());
        return authMapper.toLoginResponse(domainResponse);
    }
    
    public void logout(String token) {
        authDomainService.logout(token);
    }
}