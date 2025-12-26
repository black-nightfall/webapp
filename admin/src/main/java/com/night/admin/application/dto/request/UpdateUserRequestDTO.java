package com.night.admin.application.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 更新用户请求 DTO
 * 所有字段均为可选，只更新提供的字段
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequestDTO {
    
    @Size(min = 3, max = 100, message = "用户名长度必须在3-100个字符之间")
    private String username;
    
    @Email(message = "邮箱格式不正确")
    @Size(max = 255, message = "邮箱长度不能超过255个字符")
    private String email;
    
    @Size(min = 8, max = 100, message = "密码长度必须在8-100个字符之间")
    private String password;
    
    @Size(max = 100, message = "全名长度不能超过100个字符")
    private String fullName;
    
    private Boolean isActive;
}
