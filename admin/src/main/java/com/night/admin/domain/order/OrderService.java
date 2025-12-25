package com.night.admin.domain.service;

import com.night.admin.infrastructure.persistence.repository.OrderRepository;
import com.night.admin.domain.entity.Order;
import com.night.admin.exception.BusinessException;
import com.night.common.dto.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService {
    
    private final OrderRepository orderRepository;
    
    public Order createOrder(Order order) {
        log.info("Creating order for userId: {}", order.getUserId());
        
        try {
            // 保存订单到数据库
            com.night.admin.infrastructure.persistence.entity.OrderEntity entity = new com.night.admin.infrastructure.persistence.entity.OrderEntity();
            entity.setOrderNumber(order.getOrderNumber());
            entity.setUserId(order.getUserId());
            entity.setTotalAmount(order.getTotalAmount());
            entity.setStatus(order.getStatus());
            entity.setShippingAddress(order.getShippingAddress());
            
            com.night.admin.infrastructure.persistence.entity.OrderEntity savedEntity = orderRepository.save(entity);
            
            // 转换回领域实体
            Order result = new Order();
            result.setId(savedEntity.getId());
            result.setOrderNumber(savedEntity.getOrderNumber());
            result.setUserId(savedEntity.getUserId());
            result.setTotalAmount(savedEntity.getTotalAmount());
            result.setStatus(savedEntity.getStatus());
            result.setShippingAddress(savedEntity.getShippingAddress());
            result.setCreatedAt(savedEntity.getCreatedAt());
            result.setUpdatedAt(savedEntity.getUpdatedAt());
            
            log.info("Order created successfully with id: {}", result.getId());
            return result;
            
        } catch (Exception e) {
            log.error("Failed to create order: {}", e.getMessage(), e);
            throw new BusinessException(ErrorCode.ORDER_CREATION_FAILED, "订单创建失败");
        }
    }
    
    public Order getOrderById(Long id) {
        log.info("Fetching order with id: {}", id);
        
        Optional<com.night.admin.infrastructure.persistence.entity.OrderEntity> optional = orderRepository.findById(id);
        
        if (optional.isPresent()) {
            com.night.admin.infrastructure.persistence.entity.OrderEntity entity = optional.get();
            Order order = new Order();
            order.setId(entity.getId());
            order.setOrderNumber(entity.getOrderNumber());
            order.setUserId(entity.getUserId());
            order.setTotalAmount(entity.getTotalAmount());
            order.setStatus(entity.getStatus());
            order.setShippingAddress(entity.getShippingAddress());
            order.setCreatedAt(entity.getCreatedAt());
            order.setUpdatedAt(entity.getUpdatedAt());
            
            return order;
        } else {
            throw new BusinessException(ErrorCode.ORDER_NOT_FOUND, "订单不存在");
        }
    }
}
