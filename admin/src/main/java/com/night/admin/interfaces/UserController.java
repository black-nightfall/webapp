package com.night.admin.interfaces;

import com.night.admin.application.service.UserApplicationService;
import com.night.admin.application.dto.request.CreateUserRequestDTO;
import com.night.admin.application.dto.response.UserResponseDTO;
import com.night.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {
    
    private final UserApplicationService userApplicationService;
    
    @GetMapping("/{id}")
    public ApiResponse<UserResponseDTO> getUser(@PathVariable Long id) {
        try {
            UserResponseDTO user = userApplicationService.getUserById(id);
            return ApiResponse.success(user, "用户查询成功");
        } catch (Exception e) {
            log.error("获取用户失败: {}", e.getMessage(), e);
            return ApiResponse.error(com.night.common.dto.ErrorCode.USER_NOT_FOUND, "用户不存在");
        }
    }
    
    @PostMapping
    public ApiResponse<UserResponseDTO> createUser(@RequestBody CreateUserRequestDTO request) {
        try {
            UserResponseDTO user = userApplicationService.createUser(request);
            return ApiResponse.success(user, "用户创建成功");
        } catch (Exception e) {
            log.error("创建用户失败: {}", e.getMessage(), e);
            return ApiResponse.error(com.night.common.dto.ErrorCode.BAD_REQUEST, "创建用户失败");
        }
    }
}