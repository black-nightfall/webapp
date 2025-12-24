package com.night.admin.auth;

import com.night.admin.auth.dto.LoginResponse;
import com.night.admin.auth.service.TokenSessionService;
import com.night.admin.common.dto.ErrorCode;
import com.night.admin.common.exception.BusinessException;
import com.night.admin.common.util.JwtUtil;
import com.night.admin.user.User;
import com.night.admin.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class AuthService {
    
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final TokenSessionService tokenSessionService;
    private final UserRepository userRepository;
    
    /**
     * 用户登录
     */
    public LoginResponse login(String username, String password) {
        log.info("Login attempt for username: {}", username);
        
        try {
            // 使用 Spring Security 验证凭据
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );
            
            // 验证用户是否启用
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new BusinessException(ErrorCode.USER_NOT_FOUND));
            
            if (!user.getEnabled()) {
                throw new BusinessException(ErrorCode.USER_DISABLED);
            }
            
            // 生成 JWT Token
            String token = jwtUtil.generateToken(username);
            
            // 将 Token 存储到 Redis
            tokenSessionService.storeToken(token, username, jwtUtil.getExpiration());
            
            log.info("User logged in successfully: {}", username);
            
            return LoginResponse.builder()
                    .token(token)
                    .username(username)
                    .build();
                    
        } catch (AuthenticationException e) {
            log.warn("Invalid login attempt for username: {}", username);
            throw new BusinessException(ErrorCode.INVALID_CREDENTIALS);
        }
    }
    
    /**
     * 用户登出
     */
    public void logout(String token) {
        String username = jwtUtil.getUsernameFromToken(token);
        if (username != null) {
            tokenSessionService.deleteToken(token);
            log.info("User logged out: {}", username);
        }
    }
}
