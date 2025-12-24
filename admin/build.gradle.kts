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
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    runtimeOnly(libs.postgresql.driver)
    
    // Redis
    implementation("org.springframework.boot:spring-boot-starter-data-redis")
    
    // Security & JWT
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("io.jsonwebtoken:jjwt-api:0.12.6")
    runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.6")
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.6")
    
    // Lombok
    compileOnly("org.projectlombok:lombok:1.18.36")
    annotationProcessor("org.projectlombok:lombok:1.18.36")
    
    // Validation
    implementation("org.springframework.boot:spring-boot-starter-validation")
    
    // Development
    developmentOnly(libs.springBootDockerCompose)
    
    // Testing
    testImplementation(libs.bundles.testingSpringWebComplete)
    testImplementation("org.springframework.security:spring-security-test")
}

tasks.withType<Test> {
    useJUnitPlatform()
}
