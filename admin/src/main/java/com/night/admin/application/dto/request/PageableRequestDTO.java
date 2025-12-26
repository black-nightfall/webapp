package com.night.admin.application.dto.request;

import lombok.Data;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

/**
 * 分页查询请求基类
 * 
 * 适用于所有需要分页的列表查询API。
 * 提供统一的分页参数（page, size, sortBy, sortDirection）。
 * 
 * <p>使用方式：
 * <pre>
 * public class SearchUserRequestDTO extends PageableRequestDTO {
 *     private String username;
 *     private String email;
 * }
 * </pre>
 * 
 * <p>Controller示例：
 * <pre>
 * {@code @GetMapping("/search")}
 * public ApiResponse{@code <Page<UserResponseDTO>>} searchUsers(
 *         {@code @ModelAttribute} SearchUserRequestDTO request) {
 *     Pageable pageable = request.toPageable();
 *     // ...
 * }
 * </pre>
 * 
 * <p>注意：如果查询不需要分页，请使用独立的DTO而非继承此类。
 */
@Data
public class PageableRequestDTO {
    
    /**
     * 页码（从0开始）
     * 默认值：0（第一页）
     */
    private Integer page = 0;
    
    /**
     * 每页大小
     * 默认值：10
     */
    private Integer size = 10;
    
    /**
     * 排序字段
     * 默认值：createdAt（按创建时间排序）
     */
    private String sortBy = "createdAt";
    
    /**
     * 排序方向
     * 可选值：asc（升序）、desc（降序）
     * 默认值：desc（降序）
     */
    private String sortDirection = "desc";
    
    /**
     * 转换为Spring Data的Pageable对象
     * 
     * @return Pageable对象，包含分页和排序信息
     */
    public Pageable toPageable() {
        Sort sort = "asc".equalsIgnoreCase(sortDirection) 
            ? Sort.by(sortBy).ascending() 
            : Sort.by(sortBy).descending();
        return PageRequest.of(page, size, sort);
    }
    
    /**
     * 转换为Spring Data的Pageable对象（自定义默认排序字段）
     * 
     * @param defaultSortBy 默认排序字段
     * @return Pageable对象
     */
    public Pageable toPageable(String defaultSortBy) {
        String actualSortBy = (sortBy == null || sortBy.trim().isEmpty()) ? defaultSortBy : sortBy;
        Sort sort = "asc".equalsIgnoreCase(sortDirection) 
            ? Sort.by(actualSortBy).ascending() 
            : Sort.by(actualSortBy).descending();
        return PageRequest.of(page, size, sort);
    }
    
    /**
     * 转换为Spring Data的Pageable对象（多字段排序）
     * 
     * @param orders 排序规则数组
     * @return Pageable对象
     */
    public Pageable toPageable(Sort.Order... orders) {
        if (orders == null || orders.length == 0) {
            return toPageable();
        }
        return PageRequest.of(page, size, Sort.by(orders));
    }
}
