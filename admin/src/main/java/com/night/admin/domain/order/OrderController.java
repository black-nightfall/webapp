package com.night.admin.domain.order;


import com.night.admin.domain.order.dto.CreateOrderRequest;
import com.night.admin.domain.order.dto.OrderDTO;
import com.night.common.dto.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    
    private final OrderService orderService;
    
    @PostMapping
    public ApiResponse<OrderDTO> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        OrderDTO order = orderService.createOrder(request.getUserId(), request.getProductId());
        return ApiResponse.success(order, "订单创建成功");
    }
}
