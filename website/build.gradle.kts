plugins {
    alias(libs.plugins.kotlin)
    alias(libs.plugins.kotlinSpring)
    alias(libs.plugins.springBoot)
    alias(libs.plugins.springDependencyManagement)
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(providers.gradleProperty("javaVersion").get().toInt())
    }
}

repositories {
    mavenCentral()
}

dependencies {
    implementation(project(":common"))
    implementation(libs.bundles.springBootWebflux)
    implementation(libs.bundles.jackson)
    
    // Reactive Database (R2DBC)
    implementation(libs.spring.data.r2dbc)
    implementation(libs.r2dbc.postgresql)
    
    // Reactive Cache (Redis)
    implementation(libs.spring.data.redis.reactive)

    testImplementation(libs.bundles.testingKotlinComplete)
    testImplementation(libs.reactor.test)
}

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict", "-Xannotation-default-target=param-property")
    }
}

tasks.withType<Test> {
    useJUnitPlatform()
}

