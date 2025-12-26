package com.night.admin.domain.service;

import com.night.admin.domain.order.repository.OrderRepository;
import com.night.admin.domain.order.entity.Order;
import com.night.admin.exception.BusinessException;
import com.night.common.dto.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    
    public Order createOrder(Order order) {
        log.info("Creating order for userId: {}", order.getUserId());
        
        try {
            Order savedOrder = orderRepository.save(order);
            log.info("Order created successfully with id: {}", savedOrder.getId());
            return savedOrder;
        } catch (Exception e) {
            log.error("Failed to create order: {}", e.getMessage(), e);
            throw new BusinessException(ErrorCode.ORDER_CREATION_FAILED, "订单创建失败");
        }
    }
    
    public Order getOrderById(Long id) {
        log.info("Fetching order with id: {}", id);
        return orderRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.ORDER_NOT_FOUND, "订单不存在"));
    }
}
