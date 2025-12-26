package com.night.admin.interfaces;

import com.night.admin.application.service.UserApplicationService;
import com.night.admin.application.dto.request.CreateUserRequestDTO;
import com.night.admin.application.dto.request.UpdateUserRequestDTO;
import com.night.admin.application.dto.request.SearchUserRequestDTO;
import com.night.admin.application.dto.response.UserResponseDTO;
import com.night.common.dto.ApiResponse;
import jakarta.validation.Valid;
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
    public ApiResponse<UserResponseDTO> createUser(@Valid @RequestBody CreateUserRequestDTO request) {
        try {
            UserResponseDTO user = userApplicationService.createUser(request);
            return ApiResponse.success(user, "用户创建成功");
        } catch (Exception e) {
            log.error("创建用户失败: {}", e.getMessage(), e);
            return ApiResponse.error(com.night.common.dto.ErrorCode.BAD_REQUEST, "创建用户失败: " + e.getMessage());
        }
    }
    
    /**
     * 更新用户
     * PUT /api/users/{id}
     * 
     * @param id 用户ID
     * @param request 更新请求（所有字段均为可选）
     * @return 更新后的用户信息
     */
    @PutMapping("/{id}")
    public ApiResponse<UserResponseDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequestDTO request) {
        try {
            UserResponseDTO user = userApplicationService.updateUser(id, request);
            return ApiResponse.success(user, "用户更新成功");
        } catch (Exception e) {
            log.error("更新用户失败: userId={}, error={}", id, e.getMessage(), e);
            return ApiResponse.error(com.night.common.dto.ErrorCode.BAD_REQUEST, "更新用户失败: " + e.getMessage());
        }
    }
    
    /**
     * 删除用户
     * DELETE /api/users/{id}
     * 
     * @param id 用户ID
     * @return 删除结果
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteUser(@PathVariable Long id) {
        try {
            userApplicationService.deleteUser(id);
            return ApiResponse.success(null, "用户删除成功");
        } catch (Exception e) {
            log.error("删除用户失败: userId={}, error={}", id, e.getMessage(), e);
            return ApiResponse.error(com.night.common.dto.ErrorCode.BAD_REQUEST, "删除用户失败: " + e.getMessage());
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