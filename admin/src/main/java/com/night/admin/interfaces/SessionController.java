package com.night.admin.interfaces;

import com.night.admin.domain.auth.service.TokenSessionService;
import com.night.admin.domain.auth.dto.SessionInfoDTO;
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
        try {
            Long activeTokenCount = tokenSessionService.getUserActiveTokenCount(username);
            SessionInfoDTO info = SessionInfoDTO.builder()
                    .username(username)
                    .activeTokenCount(activeTokenCount)
                    .build();
            return ApiResponse.success(info, "获取会话信息成功");
        } catch (Exception e) {
            log.error("获取会话信息失败: {}", e.getMessage(), e);
            return ApiResponse.error(com.night.common.dto.ErrorCode.ACCESS_DENIED, "获取会话信息失败");
        }
    }
    
    /**
     * 踢用户下线（T用户）
     */
    @DeleteMapping("/{username}")
    public ApiResponse<Void> kickOutUser(@PathVariable String username) {
        try {
            log.info("Admin kicking out user: {}", username);
            tokenSessionService.kickOutUser(username);
            return ApiResponse.success(null, "用户已被踢下线");
        } catch (Exception e) {
            log.error("踢用户下线失败: {}", e.getMessage(), e);
            return ApiResponse.error(com.night.common.dto.ErrorCode.ACCESS_DENIED, "踢用户下线失败");
        }
    }
}