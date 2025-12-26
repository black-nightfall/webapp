package com.night.admin.application.dto.request;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 用户查询请求 DTO
 * 
 * 继承 {@link PageableRequestDTO} 以支持分页和排序。
 * 所有业务查询条件均为可选。
 * 
 * <p>使用示例：
 * <pre>
 * GET /api/users/search?username=john&amp;isActive=true&amp;page=0&amp;size=10&amp;sortBy=createdAt&amp;sortDirection=desc
 * </pre>
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class SearchUserRequestDTO extends PageableRequestDTO {
    
    /**
     * 用户名（模糊匹配，忽略大小写）
     */
    private String username;
    
    /**
     * 邮箱地址（模糊匹配，忽略大小写）
     */
    private String email;
    
    /**
     * 是否激活
     * <ul>
     *   <li>true - 仅查询激活用户</li>
     *   <li>false - 仅查询未激活用户</li>
     *   <li>null - 查询所有用户</li>
     * </ul>
     */
    private Boolean isActive;
}
