plugins {
    alias(libs.plugins.kotlin)
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
    // Core dependencies
    implementation(libs.bundles.kotlin)
    implementation(libs.springBootStarterLogging)

    // Testing
    testImplementation(libs.bundles.testingKotlinComplete)
}

tasks.withType<Test> {
    useJUnitPlatform()
}

