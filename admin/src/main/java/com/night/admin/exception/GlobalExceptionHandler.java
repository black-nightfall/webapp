package com.night.admin.exception;


import com.night.common.dto.ApiResponse;
import com.night.common.dto.ErrorCode;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

/**
 * 全局异常处理器
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {
    

    @ExceptionHandler(BusinessException.class)
    public ApiResponse<Void> handleBusinessException(BusinessException e, 
                                                       HttpServletResponse response) {
        log.warn("Business exception: code={}, message={}", e.getErrorCode().getCode(), e.getMessage());
        
        // Map ErrorCode to HTTP status code
        HttpStatus httpStatus = mapErrorCodeToHttpStatus(e.getErrorCode());
        response.setStatus(httpStatus.value());
        
        return ApiResponse.error(e.getErrorCode());
    }
    
    /**
     * Map ErrorCode to appropriate HTTP status code
     */
    private HttpStatus mapErrorCodeToHttpStatus(ErrorCode errorCode) {
        return switch (errorCode) {
            // Authentication errors -> 401
            case INVALID_CREDENTIALS, TOKEN_EXPIRED, TOKEN_INVALID, UNAUTHORIZED -> HttpStatus.UNAUTHORIZED;
            
            // Authorization/Access errors -> 403
            case ACCESS_DENIED, USER_DISABLED, FORBIDDEN -> HttpStatus.FORBIDDEN;
            
            // Not found errors -> 404
            case NOT_FOUND, USER_NOT_FOUND, PRODUCT_NOT_FOUND, ORDER_NOT_FOUND -> HttpStatus.NOT_FOUND;
            
            // Bad request errors -> 400
            case BAD_REQUEST -> HttpStatus.BAD_REQUEST;
            
            // Server errors -> 500
            case INTERNAL_SERVER_ERROR -> HttpStatus.INTERNAL_SERVER_ERROR;
            
            // All other business errors -> 400
            default -> HttpStatus.BAD_REQUEST;
        };
    }
    

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> handleValidationException(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        log.warn("Validation exception: {}", message);
        return ApiResponse.error(ErrorCode.BAD_REQUEST, message);
    }
    

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> handleIllegalArgumentException(IllegalArgumentException e) {
        log.warn("Illegal argument exception: {}", e.getMessage());
        return ApiResponse.error(ErrorCode.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse<Void> handleException(Exception e) {
        log.error("Unexpected exception", e);
        return ApiResponse.error(ErrorCode.INTERNAL_SERVER_ERROR);
    }
}
