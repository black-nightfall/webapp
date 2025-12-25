package com.night.admin.interfaces;

import com.night.admin.application.service.OrderApplicationService;
import com.night.admin.application.dto.response.OrderResponseDTO;
import com.night.admin.application.dto.request.CreateOrderRequest;
import com.night.common.dto.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Slf4j
public class OrderController {
    
    private final OrderApplicationService orderApplicationService;
    
    @PostMapping
    public ApiResponse<OrderResponseDTO> createOrder(@RequestBody CreateOrderRequest request) {
        try {
            OrderResponseDTO order = orderApplicationService.createOrder(request);
            return ApiResponse.success(order, "订单创建成功");
        } catch (Exception e) {
            log.error("创建订单失败: {}", e.getMessage(), e);
            return ApiResponse.error(com.night.common.dto.ErrorCode.ORDER_CREATION_FAILED, "创建订单失败");
        }
    }
    
    @GetMapping("/{id}")
    public ApiResponse<OrderResponseDTO> getOrder(@PathVariable Long id) {
        try {
            OrderResponseDTO order = orderApplicationService.getOrderById(id);
            return ApiResponse.success(order, "订单查询成功");
        } catch (Exception e) {
            log.error("获取订单失败: {}", e.getMessage(), e);
            return ApiResponse.error(com.night.common.dto.ErrorCode.ORDER_NOT_FOUND, "订单不存在");
        }
    }
}