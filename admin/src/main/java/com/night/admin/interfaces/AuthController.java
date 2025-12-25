package com.night.admin.interfaces;

import com.night.admin.application.service.AuthApplicationService;
import com.night.admin.application.dto.request.LoginRequest;
import com.night.admin.application.dto.response.LoginResponse;
import com.night.common.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    
    private final AuthApplicationService authApplicationService;
    
    /**
     * 用户登录
     */
    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = authApplicationService.login(request);
            return ApiResponse.success(response, "登录成功");
        } catch (Exception e) {
            log.error("登录失败: {}", e.getMessage(), e);
            return ApiResponse.error(com.night.common.dto.ErrorCode.INVALID_CREDENTIALS, "登录失败");
        }
    }
    
    /**
     * 用户登出
     */
    @PostMapping("/logout")
    public ApiResponse<Void> logout(HttpServletRequest request) {
        try {
            String token = getTokenFromRequest(request);
            if (token != null) {
                authApplicationService.logout(token);
            }
            return ApiResponse.success(null, "登出成功");
        } catch (Exception e) {
            log.error("登出失败: {}", e.getMessage(), e);
            return ApiResponse.error(com.night.common.dto.ErrorCode.ACCESS_DENIED, "登出失败");
        }
    }
    
    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}