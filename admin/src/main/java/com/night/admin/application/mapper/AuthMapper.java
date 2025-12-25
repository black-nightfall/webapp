package com.night.admin.application.mapper;

import com.night.admin.application.dto.response.LoginResponse;
import org.springframework.stereotype.Component;

@Component
public class AuthMapper {
    
    public com.night.admin.application.dto.response.LoginResponse toLoginResponse(
            com.night.admin.domain.entity.LoginResponse domainResponse) {
        if (domainResponse == null) {
            return null;
        }
        
        return com.night.admin.application.dto.response.LoginResponse.builder()
                .token(domainResponse.getToken())
                .username(domainResponse.getUsername())
                .userId(domainResponse.getUserId())
                .build();
    }
}