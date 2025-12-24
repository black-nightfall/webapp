/**
 * 改进后的 website/build.gradle.kts
 *
 * 变化：
 * 1. 使用 Convention Plugin 简化配置
 * 2. 使用 libs.versions.toml 管理版本
 * 3. 使用 dependency bundles 简化依赖
 * 4. 移除重复配置（如 java { toolchain }）
 */

plugins {
    id("com.night.kotlin-conventions")
    id("org.jetbrains.kotlin.plugin.spring")
    id("org.springframework.boot")
    id("io.spring.dependency-management")
}

description = "Spring Boot Webflux 响应式服务"

dependencies {
    // Spring Boot Webflux 依赖
    implementation(libs.bundles.springBootWebflux)

    // JSON 处理
    implementation(libs.bundles.jackson)

    // Kotlin 基础库
    implementation(libs.bundles.kotlin)

    // Coroutines
    implementation(libs.kotlinxCoroutines-core)

    // 开发工具
    developmentOnly(libs.springBootDockerCompose)

    // 测试依赖
    testImplementation(libs.bundles.testingCommon)
    testImplementation(libs.bundles.testingKotlin)
    testImplementation(libs.bundles.testingSpringWeb)
}

