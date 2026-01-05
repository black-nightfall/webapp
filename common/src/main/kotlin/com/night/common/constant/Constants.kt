package com.night.common.constant

object HttpConstant {
    const val HEADER_CONTENT_TYPE = "Content-Type"
    const val CONTENT_TYPE_JSON = "application/json"
    const val CHARSET_UTF8 = "utf-8"

    const val HEADER_AUTHORIZATION = "Authorization"
    const val BEARER_PREFIX = "Bearer "
}

object ErrorCodeConstant {
    const val SUCCESS = "0"
    const val COMMON_ERROR = "COMMON_ERROR"
    const val INVALID_ARGUMENT = "INVALID_ARGUMENT"
    const val NOT_FOUND = "NOT_FOUND"
    const val INTERNAL_ERROR = "INTERNAL_ERROR"
    const val UNAUTHORIZED = "UNAUTHORIZED"
    const val FORBIDDEN = "FORBIDDEN"
}

object BusinessConstant {
    const val PROJECT_NAME = "webapp"
    const val PROJECT_VERSION = "0.0.1-SNAPSHOT"

    const val DEFAULT_PAGE_SIZE = 20
    const val MAX_PAGE_SIZE = 100
    const val MIN_PAGE_SIZE = 1

    const val CACHE_PREFIX = "webapp:"
    const val CACHE_USER_PREFIX = "webapp:user:"
    const val CACHE_PERMISSION_PREFIX = "webapp:permission:"
}

object SystemConstant {
    const val SYSTEM_NAME = "webapp"
    const val SYSTEM_VERSION = "0.0.1-SNAPSHOT"
    const val JAVA_VERSION = "21"
}

