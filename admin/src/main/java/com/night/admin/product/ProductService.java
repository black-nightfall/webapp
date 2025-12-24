package com.night.admin.product;

import com.night.admin.common.dto.ErrorCode;
import com.night.admin.common.exception.BusinessException;
import com.night.admin.product.dto.ProductDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    
    public ProductDTO getProduct(Long id) {
        log.info("Fetching product with id: {}", id);
        
        Product product = productRepository.findById(id);
        if (product == null) {
            log.warn("Product not found with id: {}", id);
            throw new BusinessException(ErrorCode.PRODUCT_NOT_FOUND);
        }
        
        return convertToDTO(product);
    }
    
    public List<ProductDTO> getAllProducts() {
        log.info("Fetching all products");
        List<Product> products = productRepository.findAll();
        log.debug("Found {} products", products.size());
        
        return products.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    private ProductDTO convertToDTO(Product product) {
        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .build();
    }
}
