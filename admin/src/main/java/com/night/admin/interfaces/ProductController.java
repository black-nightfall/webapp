package com.night.admin.interfaces;

import com.night.admin.application.service.ProductApplicationService;
import com.night.admin.application.dto.response.ProductResponseDTO;
import com.night.admin.application.dto.request.CreateProductRequest;
import com.night.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Slf4j
public class ProductController {
    
    private final ProductApplicationService productApplicationService;
    
    @PostMapping
    public ApiResponse<ProductResponseDTO> createProduct(@RequestBody CreateProductRequest request) {
        try {
            ProductResponseDTO product = productApplicationService.createProduct(request);
            return ApiResponse.success(product, "产品创建成功");
        } catch (Exception e) {
            log.error("创建产品失败: {}", e.getMessage(), e);
            return ApiResponse.error(com.night.common.dto.ErrorCode.BAD_REQUEST, "创建产品失败");
        }
    }
    
    @GetMapping("/{id}")
    public ApiResponse<ProductResponseDTO> getProduct(@PathVariable Long id) {
        try {
            ProductResponseDTO product = productApplicationService.getProductById(id);
            return ApiResponse.success(product, "产品查询成功");
        } catch (Exception e) {
            log.error("获取产品失败: {}", e.getMessage(), e);
            return ApiResponse.error(com.night.common.dto.ErrorCode.PRODUCT_NOT_FOUND, "产品不存在");
        }
    }
}