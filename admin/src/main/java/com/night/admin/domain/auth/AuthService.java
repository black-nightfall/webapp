package com.night.admin.domain.auth;

import com.night.admin.infrastructure.persistence.repository.UserRepository;
import com.night.admin.domain.user.entity.User;
import com.night.admin.domain.auth.TokenSessionService;
import com.night.admin.exception.BusinessException;
import com.night.admin.util.JwtUtil;
import com.night.common.dto.ErrorCode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {
    
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final TokenSessionService tokenSessionService;
    private final UserRepository userRepository;

    public LoginResult login(String username, String password) {
        log.info("Login attempt for username: {}", username);
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            
            com.night.admin.infrastructure.persistence.entity.UserEntity userEntity = 
                userRepository.findByUsername(username)
                    .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
            
            if (!userEntity.getIsActive()) {
                throw new BusinessException(ErrorCode.USER_DISABLED);
            }
            
            String token = jwtUtil.generateToken(username);
            
            tokenSessionService.storeToken(token, username, jwtUtil.getExpiration());
            
            log.info("User logged in successfully: {}", username);
            
            return new LoginResult(token, username, userEntity.getId());
                    
        } catch (AuthenticationException e) {
            log.warn("Invalid login attempt for username: {}", username);
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }
    }
    

    public void logout(String token) {
        String username = jwtUtil.getUsernameFromToken(token);
        if (username != null) {
            tokenSessionService.deleteToken(token);
            log.info("User logged out: {}", username);
        }
    }
    
    @Data
    @AllArgsConstructor
    public static class LoginResult {
        private String token;
        private String username;
        private Long userId;
    }
}
