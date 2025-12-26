package com.night.admin.domain.user.specification;

import com.night.admin.domain.user.entity.User;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

/**
 * User 查询规格构建器
 * 用于构建动态查询条件
 */
public class UserSpecification {

    /**
     * 构建用户查询条件
     *
     * @param username 用户名（模糊查询）
     * @param email    邮箱地址（模糊查询）
     * @param isActive 是否激活
     * @return Specification<User>
     */
    public static Specification<User> buildSearchCriteria(String username, String email, Boolean isActive) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 用户名模糊查询
            if (username != null && !username.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("username")),
                    "%" + username.toLowerCase() + "%"
                ));
            }

            // 邮箱地址模糊查询
            if (email != null && !email.trim().isEmpty()) {
                predicates.add(criteriaBuilder.like(
                    criteriaBuilder.lower(root.get("email")),
                    "%" + email.toLowerCase() + "%"
                ));
            }

            // 是否激活精确查询
            if (isActive != null) {
                predicates.add(criteriaBuilder.equal(root.get("isActive"), isActive));
            }

            // 组合所有条件（AND关系）
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
