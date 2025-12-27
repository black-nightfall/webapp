package com.night.admin.application.dto.request;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 角色查询请求 DTO
 * 
 * 继承 PageableRequestDTO 以支持分页和排序。
 * 所有业务查询条件均为可选。
 * 
 * 使用示例：
 * GET
 * /api/roles/search?name=管理&page=0&size=10&sortBy=createdAt&sortDirection=desc
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SearchRoleRequestDTO extends PageableRequestDTO {

    /**
     * 角色名（模糊匹配，忽略大小写）
     */
    private String name;
}
