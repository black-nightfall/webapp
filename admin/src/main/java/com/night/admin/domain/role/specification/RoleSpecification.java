package com.night.admin.domain.role.specification;

import com.night.admin.domain.role.entity.Role;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

/**
 * Role 查询规格构建器
 * 用于构建动态查询条件
 */
public class RoleSpecification {

    /**
     * 构建角色查询条件
     *
     * @param name 角色名（模糊查询）
     * @return Specification<Role>
     */
    public static Specification<Role> buildSearchCriteria(String name) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 角色名模糊查询（忽略大小写）
            if (name != null && !name.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("name")),
                        "%" + name.toLowerCase() + "%"));
            }

            // 组合所有条件（AND关系）
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
