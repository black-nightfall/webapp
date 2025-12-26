package com.night.admin.application.service;

import com.night.admin.domain.service.OrderService;
import com.night.admin.application.dto.response.OrderResponseDTO;
import com.night.admin.application.dto.request.CreateOrderRequest;
import com.night.admin.application.mapper.OrderMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderApplicationService {
    
    private final OrderService orderDomainService;
    private final OrderMapper orderMapper;
    
    public OrderResponseDTO createOrder(CreateOrderRequest request) {
        // 将应用层DTO转换为领域对象
        com.night.admin.domain.order.entity.Order order = orderMapper.toDomain(request);
        com.night.admin.domain.order.entity.Order savedOrder = orderDomainService.createOrder(order);
        return orderMapper.toResponseDTO(savedOrder);
    }
    
    public OrderResponseDTO getOrderById(Long id) {
        com.night.admin.domain.order.entity.Order order = orderDomainService.getOrderById(id);
        if (order != null) {
            return orderMapper.toResponseDTO(order);
        }
        throw new RuntimeException("Order not found");
    }
}