package com.night.admin.auth;

import com.night.admin.auth.dto.SessionInfoDTO;
import com.night.admin.auth.service.TokenSessionService;
import com.night.admin.common.dto.Result;
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
    public Result<SessionInfoDTO> getSessionInfo(@PathVariable String username) {
        Long activeTokenCount = tokenSessionService.getUserActiveTokenCount(username);
        SessionInfoDTO info = SessionInfoDTO.builder()
                .username(username)
                .activeTokenCount(activeTokenCount)
                .build();
        return Result.success(info);
    }
    
    /**
     * 踢用户下线（T用户）
     */
    @DeleteMapping("/{username}")
    public Result<Void> kickOutUser(@PathVariable String username) {
        log.info("Admin kicking out user: {}", username);
        tokenSessionService.kickOutUser(username);
        return Result.success("用户已被踢下线", null);
    }
}
