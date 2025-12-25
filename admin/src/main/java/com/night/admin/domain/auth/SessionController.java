package com.night.admin.domain.auth;

import com.night.admin.domain.auth.dto.SessionInfoDTO;
import com.night.admin.domain.auth.service.TokenSessionService;

import com.night.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

/**
 * 会话管理 Controller
 * 用于管理员管理用户会话
 */
@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
@Slf4j
public class SessionController {
    
    private final TokenSessionService tokenSessionService;
    
    /**
     * 获取用户会话信息
     */
    @GetMapping("/{username}")
    public ApiResponse<SessionInfoDTO> getSessionInfo(@PathVariable String username) {
        Long activeTokenCount = tokenSessionService.getUserActiveTokenCount(username);
        SessionInfoDTO info = SessionInfoDTO.builder()
                .username(username)
                .activeTokenCount(activeTokenCount)
                .build();
        return ApiResponse.success(info);
    }
    
    /**
     * 踢用户下线（T用户）
     */
    @DeleteMapping("/{username}")
    public ApiResponse<Void> kickOutUser(@PathVariable String username) {
        log.info("Admin kicking out user: {}", username);
        tokenSessionService.kickOutUser(username);
        return ApiResponse.success("用户已被踢下线");
    }
}
