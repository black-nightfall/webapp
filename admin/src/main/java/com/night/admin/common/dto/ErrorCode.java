package com.night.admin.common.dto;

import lombok.Getter;

/**
 * 错误码枚举
 */
@Getter
public enum ErrorCode {
    
    // 通用错误码 1xxx
    SUCCESS(200, "Success"),
    BAD_REQUEST(400, "Bad Request"),
    UNAUTHORIZED(401, "Unauthorized"),
    FORBIDDEN(403, "Forbidden"),
    NOT_FOUND(404, "Not Found"),
    INTERNAL_SERVER_ERROR(500, "Internal Server Error"),
    
    // 认证相关 10xx
    INVALID_CREDENTIALS(1001, "用户名或密码错误"),
    TOKEN_EXPIRED(1002, "Token已过期"),
    TOKEN_INVALID(1003, "Token无效"),
    
    // 用户相关 20xx
    USER_NOT_FOUND(2001, "用户不存在"),
    USER_ALREADY_EXISTS(2002, "用户已存在"),
    USER_DISABLED(2003, "用户已被禁用"),
    
    // 产品相关 30xx
    PRODUCT_NOT_FOUND(3001, "产品不存在"),
    PRODUCT_OUT_OF_STOCK(3002, "产品库存不足"),
    
    // 订单相关 40xx
    ORDER_NOT_FOUND(4001, "订单不存在"),
    ORDER_CREATION_FAILED(4002, "订单创建失败"),
    INVALID_ORDER_STATUS(4003, "订单状态无效");
    
    private final int code;
    private final String message;
    
    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
