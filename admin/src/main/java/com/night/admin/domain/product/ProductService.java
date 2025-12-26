package com.night.admin.domain.service;

import com.night.admin.infrastructure.persistence.repository.ProductRepository;
import com.night.admin.domain.product.entity.Product;
import com.night.admin.exception.BusinessException;
import com.night.common.dto.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    
    public Product createProduct(Product product) {
        log.info("Creating product: {}", product.getName());
        
        try {
            // 保存产品到数据库
            com.night.admin.infrastructure.persistence.entity.ProductEntity entity = new com.night.admin.infrastructure.persistence.entity.ProductEntity();
            entity.setName(product.getName());
            entity.setDescription(product.getDescription());
            entity.setPrice(product.getPrice());
            entity.setStock(product.getStock());
            entity.setCategory(product.getCategory());
            entity.setImageUrl(product.getImageUrl());
            entity.setIsActive(product.getIsActive());
            
            com.night.admin.infrastructure.persistence.entity.ProductEntity savedEntity = productRepository.save(entity);
            
            // 转换回领域实体
            Product result = new Product();
            result.setId(savedEntity.getId());
            result.setName(savedEntity.getName());
            result.setDescription(savedEntity.getDescription());
            result.setPrice(savedEntity.getPrice());
            result.setStock(savedEntity.getStock());
            result.setCategory(savedEntity.getCategory());
            result.setImageUrl(savedEntity.getImageUrl());
            result.setIsActive(savedEntity.getIsActive());
            result.setCreatedAt(savedEntity.getCreatedAt());
            result.setUpdatedAt(savedEntity.getUpdatedAt());
            
            log.info("Product created successfully with id: {}", result.getId());
            return result;
        } catch (Exception e) {
            log.error("Failed to create product: {}", e.getMessage(), e);
            throw new BusinessException(ErrorCode.BAD_REQUEST, "产品创建失败");
        }
    }
    
    public Product getProductById(Long id) {
        log.info("Fetching product with id: {}", id);
        
        Optional<com.night.admin.infrastructure.persistence.entity.ProductEntity> optional = productRepository.findById(id);
        
        if (optional.isPresent()) {
            com.night.admin.infrastructure.persistence.entity.ProductEntity entity = optional.get();
            Product product = new Product();
            product.setId(entity.getId());
            product.setName(entity.getName());
            product.setDescription(entity.getDescription());
            product.setPrice(entity.getPrice());
            product.setStock(entity.getStock());
            product.setCategory(entity.getCategory());
            product.setImageUrl(entity.getImageUrl());
            product.setIsActive(entity.getIsActive());
            product.setCreatedAt(entity.getCreatedAt());
            product.setUpdatedAt(entity.getUpdatedAt());
            
            return product;
        } else {
            throw new BusinessException(ErrorCode.PRODUCT_NOT_FOUND, "产品不存在");
        }
    }
    
    public List<Product> getAllProducts() {
        log.info("Fetching all products");
        List<com.night.admin.infrastructure.persistence.entity.ProductEntity> entities = productRepository.findAll();
        log.debug("Found {} products", entities.size());
        
        return entities.stream()
                .map(this::convertToEntity)
                .collect(Collectors.toList());
    }
    
    private Product convertToEntity(com.night.admin.infrastructure.persistence.entity.ProductEntity entity) {
        Product product = new Product();
        product.setId(entity.getId());
        product.setName(entity.getName());
        product.setDescription(entity.getDescription());
        product.setPrice(entity.getPrice());
        product.setStock(entity.getStock());
        product.setCategory(entity.getCategory());
        product.setImageUrl(entity.getImageUrl());
        product.setIsActive(entity.getIsActive());
        product.setCreatedAt(entity.getCreatedAt());
        product.setUpdatedAt(entity.getUpdatedAt());
        return product;
    }
}
