package com.night.admin.domain.menu.repository;

import com.night.admin.domain.menu.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuRepository extends JpaRepository<Menu, Long> {

    /**
     * 根据父菜单ID查询子菜单，按排序字段升序
     */
    List<Menu> findByParentIdOrderBySortOrder(Long parentId);

    /**
     * 查询所有菜单，按排序字段升序
     */
    List<Menu> findAllByOrderBySortOrder();
}
