/**
}
    testImplementation(libs.bundles.testingSpringWeb)
    testImplementation(libs.bundles.testingCommon)
    // 测试依赖

    developmentOnly(libs.springBootDockerCompose)
    // 开发工具

    implementation(libs.bundles.jackson)
    // JSON 处理

    implementation(libs.bundles.springBootWeb)
    // Spring Boot Web 依赖
dependencies {

description = "Spring Boot Web MVC 后端服务"

}
    id("io.spring.dependency-management")
    id("org.springframework.boot")
    id("com.night.java-conventions")
plugins {

 */
 * 4. 移除重复配置
 * 3. 使用 dependency bundles 简化依赖
 * 2. 使用 libs.versions.toml 管理版本
 * 1. 使用 Convention Plugin 简化配置
 * 变化：
 *
 * 改进后的 admin/build.gradle.kts

