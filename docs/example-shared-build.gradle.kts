/**
 * 改进后的 shared/build.gradle.kts (新增模块)
 *
 * 用途：
 * - 存放公共 domain models
 * - 存放 utilities 和 helpers
 * - 存放公共异常类
 * - 被 admin 和 website 模块依赖
 *
 * 特点：
 * - 不依赖 Spring Boot，轻量级
 * - 仅包含 Jackson 用于 JSON 序列化
 * - 易于单独维护和版本化
 */

plugins {
    id("com.night.kotlin-conventions")
}

description = "共享模块 - Domain Models & Utilities"

dependencies {
    // JSON 处理
    implementation(libs.bundles.jackson)

    // Kotlin 基础库
    implementation(libs.bundles.kotlin)

    // 测试依赖
    testImplementation(libs.bundles.testingCommon)
    testImplementation(libs.bundles.testingKotlin)
}

