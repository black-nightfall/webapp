package com.night.admin.domain.service;

import com.night.admin.domain.product.repository.ProductRepository;
import com.night.admin.domain.product.entity.Product;
import com.night.admin.exception.BusinessException;
import com.night.common.dto.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    
    public Product createProduct(Product product) {
        log.info("Creating product: {}", product.getName());
        try {
            Product savedProduct = productRepository.save(product);
            log.info("Product created successfully with id: {}", savedProduct.getId());
            return savedProduct;
        } catch (Exception e) {
            log.error("Failed to create product: {}", e.getMessage(), e);
            throw new BusinessException(ErrorCode.BAD_REQUEST, "产品创建失败");
        }
    }
    
    public Product getProductById(Long id) {
        log.info("Fetching product with id: {}", id);
        return productRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.PRODUCT_NOT_FOUND, "产品不存在"));
    }
    
    public List<Product> getAllProducts() {
        log.info("Fetching all products");
        List<Product> products = productRepository.findAll();
        log.debug("Found {} products", products.size());
        return products;
    }
}
