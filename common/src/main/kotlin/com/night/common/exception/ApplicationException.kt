package com.night.common.exception

open class ApplicationException(
    val errorCode: String,
    message: String,
    cause: Throwable? = null
) : RuntimeException(message, cause) {
    companion object {
        const val COMMON_ERROR = "COMMON_ERROR"
        const val INVALID_ARGUMENT = "INVALID_ARGUMENT"
        const val NOT_FOUND = "NOT_FOUND"
        const val INTERNAL_ERROR = "INTERNAL_ERROR"
    }
}

class BusinessException : ApplicationException {
    constructor(message: String) : super(ApplicationException.COMMON_ERROR, message)

    constructor(errorCode: String, message: String) : super(errorCode, message)

    constructor(errorCode: String, message: String, cause: Throwable) : super(errorCode, message, cause)
}

class ResourceNotFoundException : ApplicationException {
    constructor(message: String) : super(ApplicationException.NOT_FOUND, message)

    constructor(message: String, cause: Throwable) : super(ApplicationException.NOT_FOUND, message, cause)
}

class InvalidArgumentException : ApplicationException {
    constructor(message: String) : super(ApplicationException.INVALID_ARGUMENT, message)

    constructor(message: String, cause: Throwable) : super(ApplicationException.INVALID_ARGUMENT, message, cause)
}

class InternalErrorException : ApplicationException {
    constructor(message: String) : super(ApplicationException.INTERNAL_ERROR, message)

    constructor(message: String, cause: Throwable) : super(ApplicationException.INTERNAL_ERROR, message, cause)
}

