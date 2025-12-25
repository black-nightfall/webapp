package com.night.common.extension

import com.night.common.dto.ApiResponse
import com.night.common.dto.ErrorCode
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

fun String?.orEmpty(default: String = ""): String = this ?: default

fun String?.orNull(): String? = if (this.isNullOrEmpty()) null else this

fun String.toIntOrNull(default: Int): Int = this.toIntOrNull() ?: default

fun String.toLongOrNull(default: Long): Long = this.toLongOrNull() ?: default

fun <T> Collection<T>?.isNotEmpty(): Boolean = this != null && this.isNotEmpty()

fun <T> Collection<T>?.isEmpty(): Boolean = this == null || this.isEmpty()

fun <T> List<T>?.getOrEmpty(): List<T> = this ?: emptyList()

fun LocalDateTime.format(pattern: String = "yyyy-MM-dd HH:mm:ss"): String {
    return this.format(DateTimeFormatter.ofPattern(pattern))
}

fun LocalDateTime.toStartOfDay(): LocalDateTime = this.withHour(0).withMinute(0).withSecond(0)

fun LocalDateTime.toEndOfDay(): LocalDateTime = this.withHour(23).withMinute(59).withSecond(59)

fun <T : Any> T.toSuccessResponse(message: String = "success"): ApiResponse<T> {
    return ApiResponse.success(this, message)
}

fun <T> String.toErrorResponse(): ApiResponse<T> {
    return ApiResponse.error(ErrorCode.BAD_REQUEST,this)
}

