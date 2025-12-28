package com.night.website.interfaces

import com.night.website.interfaces.handler.AuthHandler
import com.night.website.interfaces.handler.ForumHandler
import com.night.website.interfaces.handler.NewsHandler
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.MediaType
import org.springframework.web.reactive.function.server.coRouter

@Configuration
class RouterConfig(
    private val newsHandler: NewsHandler,
    private val forumHandler: ForumHandler,
    private val authHandler: AuthHandler
) {

    @Bean
    fun apiRouter() = coRouter {
        accept(MediaType.APPLICATION_JSON).nest {
            "/api".nest {
                "/news".nest {
                    GET("", newsHandler::getAll)
                    GET("/{id}", newsHandler::getById)
                }
                "/forum".nest {
                    GET("", forumHandler::getAll)
                    GET("/{id}", forumHandler::getById)
                }
                "/auth".nest {
                    POST("/login", authHandler::login)
                    POST("/register", authHandler::register)
                }
            }
        }
    }
}
