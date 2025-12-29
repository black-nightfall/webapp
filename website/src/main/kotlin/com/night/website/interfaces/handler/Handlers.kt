package com.night.website.interfaces.handler

import com.night.website.domain.auth.service.AuthService
import com.night.website.domain.auth.service.LoginRequest
import com.night.website.domain.auth.service.RegisterRequest
import com.night.website.domain.forum.service.ForumService
import com.night.website.domain.news.service.NewsService
import org.springframework.stereotype.Component
import org.springframework.web.reactive.function.server.*

@Component
class NewsHandler(private val newsService: NewsService) {
    suspend fun getAll(request: ServerRequest): ServerResponse {
        return ServerResponse.ok().bodyValueAndAwait(newsService.getAll())
    }

    suspend fun getById(request: ServerRequest): ServerResponse {
        val id = request.pathVariable("id").toLongOrNull()
        return if (id != null) {
            val item = newsService.getById(id)
            if (item != null) {
                ServerResponse.ok().bodyValueAndAwait(item)
            } else {
                ServerResponse.notFound().buildAndAwait()
            }
        } else {
             ServerResponse.badRequest().buildAndAwait()
        }
    }

    suspend fun create(request: ServerRequest): ServerResponse {
        val newsItem = request.awaitBody<com.night.website.domain.news.entity.NewsItem>()
        val created = newsService.create(newsItem)
        return ServerResponse.ok().bodyValueAndAwait(created)
    }

    suspend fun update(request: ServerRequest): ServerResponse {
        val id = request.pathVariable("id").toLongOrNull()
        if (id == null) return ServerResponse.badRequest().buildAndAwait()
        
        val newsItem = request.awaitBody<com.night.website.domain.news.entity.NewsItem>()
        val updated = newsService.update(id, newsItem)
        return if (updated != null) {
             ServerResponse.ok().bodyValueAndAwait(updated)
        } else {
             ServerResponse.notFound().buildAndAwait()
        }
    }

    suspend fun delete(request: ServerRequest): ServerResponse {
        val id = request.pathVariable("id").toLongOrNull()
        if (id == null) return ServerResponse.badRequest().buildAndAwait()
        
        newsService.delete(id)
        return ServerResponse.ok().buildAndAwait()
    }
}

@Component
class ForumHandler(private val forumService: ForumService) {
    suspend fun getAll(request: ServerRequest): ServerResponse {
        return ServerResponse.ok().bodyValueAndAwait(forumService.getAll())
    }

    suspend fun getById(request: ServerRequest): ServerResponse {
        val id = request.pathVariable("id").toLongOrNull()
        return if (id != null) {
            val post = forumService.getById(id)
            if (post != null) {
                ServerResponse.ok().bodyValueAndAwait(post)
            } else {
                ServerResponse.notFound().buildAndAwait()
            }
        } else {
             ServerResponse.badRequest().buildAndAwait()
        }
    }

    suspend fun create(request: ServerRequest): ServerResponse {
        val post = request.awaitBody<com.night.website.domain.forum.entity.ForumPost>()
        val created = forumService.create(post)
        return ServerResponse.ok().bodyValueAndAwait(created)
    }

    suspend fun update(request: ServerRequest): ServerResponse {
        val id = request.pathVariable("id").toLongOrNull()
        if (id == null) return ServerResponse.badRequest().buildAndAwait()
        
        val post = request.awaitBody<com.night.website.domain.forum.entity.ForumPost>()
        val updated = forumService.update(id, post)
        return if (updated != null) {
             ServerResponse.ok().bodyValueAndAwait(updated)
        } else {
             ServerResponse.notFound().buildAndAwait()
        }
    }

    suspend fun delete(request: ServerRequest): ServerResponse {
        val id = request.pathVariable("id").toLongOrNull()
        if (id == null) return ServerResponse.badRequest().buildAndAwait()
        
        forumService.delete(id)
        return ServerResponse.ok().buildAndAwait()
    }
}

@Component
class AuthHandler(private val authService: AuthService) {
    suspend fun login(request: ServerRequest): ServerResponse {
        val loginRequest = request.awaitBody<LoginRequest>()
        val response = authService.login(loginRequest)
        return ServerResponse.ok().bodyValueAndAwait(response)
    }

    suspend fun register(request: ServerRequest): ServerResponse {
        val registerRequest = request.awaitBody<RegisterRequest>()
        val response = authService.register(registerRequest)
        return ServerResponse.ok().bodyValueAndAwait(response)
    }
}
