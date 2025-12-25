package com.night.admin.domain.order;


import com.night.admin.exception.BusinessException;
import com.night.admin.domain.order.dto.OrderDTO;
import com.night.admin.domain.product.ProductService;
import com.night.admin.domain.user.UserService;
import com.night.common.dto.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService {
    
    private final UserService userService;
    private final ProductService productService;
    
    public OrderDTO createOrder(Long userId, Long productId) {
        log.info("Creating order for userId: {}, productId: {}", userId, productId);
        
        try {
            // 验证用户存在
            userService.getUser(userId);
            
            // 验证产品存在
            productService.getProduct(productId);
            
            // 创建订单（实际应该保存到数据库）
            Order order = Order.builder()
                    .id(System.currentTimeMillis())  // Mock ID
                    .userId(userId)
                    .productId(productId)
                    .status("CREATED")
                    .build();
            
            log.info("Order created successfully with id: {}", order.getId());
            return convertToDTO(order);
            
        } catch (BusinessException e) {
            log.error("Failed to create order: {}", e.getMessage());
            throw new BusinessException(ErrorCode.ORDER_CREATION_FAILED, e.getMessage());
        }
    }
    
    private OrderDTO convertToDTO(Order order) {
        return OrderDTO.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .productId(order.getProductId())
                .status(order.getStatus())
                .build();
    }
}
