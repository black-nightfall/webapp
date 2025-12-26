package com.night.admin.application.service;

import com.night.admin.domain.service.ProductService;
import com.night.admin.application.dto.response.ProductResponseDTO;
import com.night.admin.application.dto.request.CreateProductRequest;
import com.night.admin.application.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductApplicationService {
    
    private final ProductService productDomainService;
    private final ProductMapper productMapper;
    
    public ProductResponseDTO createProduct(CreateProductRequest request) {
        com.night.admin.domain.product.entity.Product product = productMapper.toDomain(request);
        com.night.admin.domain.product.entity.Product savedProduct = productDomainService.createProduct(product);
        return productMapper.toResponseDTO(savedProduct);
    }
    
    public ProductResponseDTO getProductById(Long id) {
        com.night.admin.domain.product.entity.Product product = productDomainService.getProductById(id);
        if (product != null) {
            return productMapper.toResponseDTO(product);
        }
        throw new RuntimeException("Product not found");
    }
}