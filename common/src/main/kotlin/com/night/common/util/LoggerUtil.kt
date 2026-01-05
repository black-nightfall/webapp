package com.night.common.util

import org.slf4j.LoggerFactory

class LoggerDelegate {
    private val logger = LoggerFactory.getLogger(this::class.java.enclosingClass)

    fun debug(msg: String) = logger.debug(msg)
    fun debug(msg: String, throwable: Throwable) = logger.debug(msg, throwable)

    fun info(msg: String) = logger.info(msg)
    fun info(msg: String, throwable: Throwable) = logger.info(msg, throwable)

    fun warn(msg: String) = logger.warn(msg)
    fun warn(msg: String, throwable: Throwable) = logger.warn(msg, throwable)

    fun error(msg: String) = logger.error(msg)
    fun error(msg: String, throwable: Throwable) = logger.error(msg, throwable)
}

fun <T> T.getLogger(): LoggerDelegate = LoggerDelegate()

