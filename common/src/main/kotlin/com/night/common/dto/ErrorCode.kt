package com.night.common.dto

enum class ErrorCode(val code: Int, val message: String) {

    SUCCESS(200, "Success"),
    BAD_REQUEST(400, "Bad Request"),
    UNAUTHORIZED(401, "Unauthorized"),
    FORBIDDEN(403, "Forbidden"),
    NOT_FOUND(404, "Not Found"),
    INTERNAL_SERVER_ERROR(500, "Internal Server Error"),

    INVALID_CREDENTIALS(1001, "Invalid username or password"),
    TOKEN_EXPIRED(1002, "Token has expired"),
    TOKEN_INVALID(1003, "Invalid token"),
    ACCESS_DENIED(1004, "Access denied"), // 典型的安全相关错误码

    USER_NOT_FOUND(2001, "User not found"),
    USER_ALREADY_EXISTS(2002, "User already exists"),
    USER_DISABLED(2003, "User account is disabled"),

    PRODUCT_NOT_FOUND(3001, "Product not found"),
    PRODUCT_OUT_OF_STOCK(3002, "Out of stock"),

    ORDER_NOT_FOUND(4001, "Order not found"),
    ORDER_CREATION_FAILED(4002, "Failed to create order"),
    INVALID_ORDER_STATUS(4003, "Invalid order status");

}