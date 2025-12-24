package com.night.common.util

import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

object DateTimeUtil {
    private val ISO_8601_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE_TIME
    private val COMMON_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")

    fun now(): LocalDateTime = LocalDateTime.now()

    fun formatToString(dateTime: LocalDateTime, pattern: String = "yyyy-MM-dd HH:mm:ss"): String {
        val formatter = if (pattern == "iso8601") ISO_8601_FORMATTER else DateTimeFormatter.ofPattern(pattern)
        return dateTime.format(formatter)
    }

    fun parseFromString(dateTimeStr: String, pattern: String = "yyyy-MM-dd HH:mm:ss"): LocalDateTime {
        val formatter = if (pattern == "iso8601") ISO_8601_FORMATTER else DateTimeFormatter.ofPattern(pattern)
        return LocalDateTime.parse(dateTimeStr, formatter)
    }
}

object StringUtil {
    fun isEmpty(str: String?): Boolean = str == null || str.isEmpty()

    fun isNotEmpty(str: String?): Boolean = !isEmpty(str)

    fun isBlank(str: String?): Boolean = str == null || str.isBlank()

    fun isNotBlank(str: String?): Boolean = !isBlank(str)

    fun capitalize(str: String): String = str.replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() }

    fun camelToSnake(str: String): String {
        return str.replace(Regex("([a-z])([A-Z])"), "$1_$2").lowercase()
    }

    fun snakeToCamel(str: String): String {
        return str.split("_").mapIndexed { index, s ->
            if (index == 0) s else s.replaceFirstChar { it.uppercase() }
        }.joinToString("")
    }
}

object ValidationUtil {
    fun isValidEmail(email: String): Boolean {
        return email.matches(Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$"))
    }

    fun isValidPhoneNumber(phone: String): Boolean {
        return phone.matches(Regex("^1[3-9]\\d{9}$"))
    }

    fun isValidUrl(url: String): Boolean {
        return url.matches(Regex("^https?://.*"))
    }
}

