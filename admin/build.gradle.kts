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

repositories {
    mavenCentral()
}

dependencies {
    implementation(libs.bundles.springBootWeb)
    developmentOnly(libs.springBootDockerCompose)
    testImplementation(libs.bundles.testingSpringWebComplete)
}

tasks.withType<Test> {
    useJUnitPlatform()
}

