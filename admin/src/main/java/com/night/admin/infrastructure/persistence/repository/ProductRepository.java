package com.night.admin.infrastructure.persistence.repository;

import com.night.admin.infrastructure.persistence.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Long> {
    
    Optional<ProductEntity> findByName(String name);
    
    Optional<ProductEntity> findByCategory(String category);
    
    boolean existsByName(String name);
}
