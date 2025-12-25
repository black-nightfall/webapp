package com.night.common.dto

import java.time.LocalDateTime
import javax.xml.crypto.Data

data class ApiResponse<T>(
    val success: Boolean,
    val code: ErrorCode,
    val message: String,
    val data: T?,
    val timestamp: LocalDateTime = LocalDateTime.now()
) {
    companion object {
        @JvmStatic
        fun <T> success(data: T, message: String = "success"): ApiResponse<T> {
            return ApiResponse(
                success = true,
                code = ErrorCode.SUCCESS,
                message = message,
                data = data
            )
        }

        @JvmStatic
        fun <T> success(data: T): ApiResponse<T> {
            return success(data, "success")
        }
        @JvmStatic
        fun <T> success(): ApiResponse<T> {
            return success("success")
        }

        @JvmStatic
        fun <T> success(message: String = "success"): ApiResponse<T> {
            return ApiResponse(
                success = true,
                code = ErrorCode.SUCCESS,
                message = message,
                data = null
            )
        }

        @JvmStatic
        fun <T> error(code: String, message: String, data: T? = null): ApiResponse<T> {
            return ApiResponse(
                success = false,
                code = ErrorCode.SUCCESS,
                message = message,
                data = data
            )
        }

        @JvmStatic
        fun <T> error(code: ErrorCode, message: String): ApiResponse<T> {
            return ApiResponse(
                success = false,
                code = code,
                message = message,
                data = null
            )
        }

        @JvmStatic
        fun <T> error(code: ErrorCode): ApiResponse<T> {
            return ApiResponse(
                success = false,
                code = code,
                message = code.message,
                data = null
            )
        }
        @JvmStatic
        fun <T> error(data: T): ApiResponse<T> {
            return ApiResponse(
                success = false,
                code = ErrorCode.BAD_REQUEST,
                message = ErrorCode.BAD_REQUEST.message,
                data = data
            )
        }
    }
}

data class ErrorResponse(
    val code: String,
    val message: String,
    val timestamp: LocalDateTime = LocalDateTime.now(),
    val path: String? = null
)

data class PageRequest(
    val pageNo: Int = 1,
    val pageSize: Int = 20
) {
    init {
        require(pageNo > 0) { "pageNo must be greater than 0" }
        require(pageSize in 1..100) { "pageSize must be between 1 and 100" }
    }
}

data class PageResponse<T>(
    val content: List<T>,
    val pageNo: Int,
    val pageSize: Int,
    val total: Long,
    val totalPages: Int
) {
    companion object {
        fun <T> of(content: List<T>, pageNo: Int, pageSize: Int, total: Long): PageResponse<T> {
            val totalPages = (total + pageSize - 1) / pageSize
            return PageResponse(
                content = content,
                pageNo = pageNo,
                pageSize = pageSize,
                total = total,
                totalPages = totalPages.toInt()
            )
        }
    }
}

