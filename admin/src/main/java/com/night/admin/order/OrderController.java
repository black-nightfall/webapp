package com.night.admin.order;

import com.night.admin.common.dto.Result;
import com.night.admin.order.dto.CreateOrderRequest;
import com.night.admin.order.dto.OrderDTO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    
    private final OrderService orderService;
    
    @PostMapping
    public Result<OrderDTO> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        OrderDTO order = orderService.createOrder(request.getUserId(), request.getProductId());
        return Result.success("订单创建成功", order);
    }
}
