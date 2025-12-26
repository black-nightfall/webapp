package com.night.admin.interfaces;

import com.night.admin.application.service.UserApplicationService;
import com.night.admin.application.dto.request.CreateUserRequestDTO;
import com.night.admin.application.dto.request.SearchUserRequestDTO;
import com.night.admin.application.dto.response.UserResponseDTO;
import com.night.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    
    /**
     * 搜索用户（支持可选条件和分页）
     * GET /api/users/search?username=xxx&email=xxx&isActive=true&page=0&size=10&sortBy=createdAt&sortDirection=desc
     * 
     * @param request 搜索条件（包含业务查询条件和分页参数）
     * @return 分页用户列表
     */
    @GetMapping("/search")
    public ApiResponse<Page<UserResponseDTO>> searchUsers(
            @ModelAttribute SearchUserRequestDTO request) {
        try {
            // 通过继承的 toPageable() 方法转换为 Pageable
            Pageable pageable = request.toPageable();
            
            // 执行查询
            Page<UserResponseDTO> users = userApplicationService.searchUsers(request, pageable);
            
            log.info("搜索用户成功: 查询条件={}, 结果数={}, 总数={}", 
                request, users.getNumberOfElements(), users.getTotalElements());
            
            return ApiResponse.success(users, "查询成功");
        } catch (Exception e) {
            log.error("搜索用户失败: request={}, error={}", 
                request, e.getMessage(), e);
            return ApiResponse.error(com.night.common.dto.ErrorCode.BAD_REQUEST, "搜索失败");
        }
    }
}