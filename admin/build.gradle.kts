plugins {
    id("java")
    alias(libs.plugins.springBoot)
    alias(libs.plugins.springDependencyManagement)
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(providers.gradleProperty("javaVersion").get().toInt())
    }
}

dependencies {
    // Common module
    implementation(project(":common"))
    
    // Spring Boot Starters
    implementation(libs.bundles.springBootWeb)
    
    // JPA & Database
    implementation(libs.spring.data.jpa)
    runtimeOnly(libs.postgresql.driver)
    
    // Redis
    implementation(libs.spring.data.redis)
    
    // Security & JWT
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation(libs.bundles.jwt)
    
    // Lombok
    compileOnly(libs.lombok)
    annotationProcessor(libs.lombok)
    
    // Validation
    implementation(libs.springBootStarterValidation)
    
    // Development
    developmentOnly(libs.springBootDockerCompose)
    
    // Testing
    testImplementation(libs.bundles.testingSpringWebComplete)
    testImplementation(libs.spring.security.test)
}

tasks.withType<Test> {
    useJUnitPlatform()
}
