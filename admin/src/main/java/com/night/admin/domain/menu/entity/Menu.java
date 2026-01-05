package com.night.admin.domain.menu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "menu_info")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "parent_id")
    @Builder.Default
    private Long parentId = 0L;

    @Column(length = 50, nullable = false)
    private String title;

    @Column(length = 50)
    private String name;

    @Column(length = 255)
    private String path;

    @Column(length = 255)
    private String component;

    @Column(length = 100)
    private String perms;

    @Column(length = 50)
    private String icon;

    @Column(name = "sort_order")
    @Builder.Default
    private Integer sortOrder = 0;

    @Column(name = "menu_type", length = 1)
    @Builder.Default
    private String menuType = "M"; // M:目录, C:菜单, F:按钮

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
