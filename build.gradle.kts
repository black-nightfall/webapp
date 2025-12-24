plugins {
	alias(libs.plugins.kotlin) apply false
	alias(libs.plugins.kotlinSpring) apply false
	alias(libs.plugins.springBoot) apply false
	alias(libs.plugins.springDependencyManagement) apply false
}

group = providers.gradleProperty("projectGroup").get()
version = providers.gradleProperty("projectVersion").get()
description = "Demo project for Spring Boot"

allprojects {
	group = providers.gradleProperty("projectGroup").get()
	version = providers.gradleProperty("projectVersion").get()

	repositories {
		mavenCentral()
	}
}