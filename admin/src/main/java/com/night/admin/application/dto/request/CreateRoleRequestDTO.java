package com.night.admin.application.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 创建角色请求 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateRoleRequestDTO {

    @NotBlank(message = "角色名不能为空")
    @Size(max = 100, message = "角色名长度不能超过100个字符")
    private String name;

    @Size(max = 500, message = "描述长度不能超过500个字符")
    private String description;
}
