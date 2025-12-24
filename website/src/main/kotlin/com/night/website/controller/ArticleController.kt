package com.night.website.controller

import com.night.common.dto.ApiResponse
import com.night.common.dto.PageRequest
import com.night.common.dto.PageResponse
import com.night.common.exception.ResourceNotFoundException
import com.night.common.exception.InvalidArgumentException
import com.night.common.extension.toSuccessResponse
import org.springframework.web.bind.annotation.*
import kotlinx.coroutines.*
import org.springframework.http.ResponseEntity
import reactor.core.publisher.Mono
import reactor.core.publisher.Flux

@RestController
@RequestMapping("/api/articles")
class ArticleController {

    @GetMapping("/{id}")
    fun getArticle(@PathVariable id: Long): Mono<ApiResponse<ArticleDTO>> {
        return Mono.fromCallable {
            if (id <= 0) {
                throw InvalidArgumentException("Article ID must be greater than 0")
            }

            val article = ArticleDTO(
                id = id,
                title = "Spring Boot Best Practices",
                content = "This is an article about Spring Boot...",
                author = "Zhang San",
                views = 1000
            )
            ApiResponse.success(article, "Article retrieved successfully")
        }
    }

    @PostMapping
    fun createArticle(@RequestBody request: CreateArticleRequest): Mono<ApiResponse<Long>> {
        return Mono.fromCallable {
            if (request.title.isBlank()) {
                throw InvalidArgumentException("Article title cannot be empty")
            }
            if (request.content.isBlank()) {
                throw InvalidArgumentException("Article content cannot be empty")
            }

            val newArticleId = System.currentTimeMillis()
            println("Article '${request.title}' has been created, ID: $newArticleId")

            ApiResponse.success(newArticleId, "Article created successfully")
        }
    }

    @GetMapping
    fun listArticles(
        @RequestParam(defaultValue = "1") pageNo: Int,
        @RequestParam(defaultValue = "10") pageSize: Int
    ): Mono<ApiResponse<PageResponse<ArticleDTO>>> {
        return Mono.fromCallable {
            val page = try {
                PageRequest(pageNo, pageSize)
            } catch (e: IllegalArgumentException) {
                throw InvalidArgumentException(e.message ?: "Invalid pagination parameters")
            }

            val articles = listOf(
                ArticleDTO(1, "Spring Boot Best Practices", "Content...", "Zhang San", 1000),
                ArticleDTO(2, "Kotlin Coroutines Guide", "Content...", "Li Si", 800),
                ArticleDTO(3, "WebFlux Reactive Programming", "Content...", "Wang Wu", 600)
            )

            val pageResponse = PageResponse.of(articles, page.pageNo, page.pageSize, 100)
            ApiResponse.success(pageResponse, "Article list retrieved successfully")
        }
    }

    @DeleteMapping("/{id}")
    fun deleteArticle(@PathVariable id: Long): Mono<ApiResponse<Void>> {
        return Mono.fromCallable {
            if (id == 999L) {
                throw ResourceNotFoundException("Article ID: $id does not exist")
            }

            println("Article $id has been deleted")
            ApiResponse.success<Void>("Article deleted successfully")
        }
    }

    @PutMapping("/{id}/views")
    fun incrementViews(@PathVariable id: Long): Mono<ApiResponse<ArticleDTO>> {
        return Mono.fromCallable {
            val article = ArticleDTO(
                id = id,
                title = "Spring Boot Best Practices",
                content = "This is an article about Spring Boot...",
                author = "Zhang San",
                views = 1001
            )
            article.toSuccessResponse("Views updated successfully")
        }
    }

    @GetMapping("/search")
    fun searchArticles(@RequestParam keyword: String): Flux<ArticleDTO> {
        return Flux.fromIterable(
            listOf(
                ArticleDTO(1, "Spring Boot Best Practices", "Content...", "Zhang San", 1000),
                ArticleDTO(2, "Spring Cloud Microservices", "Content...", "Li Si", 800),
                ArticleDTO(3, "Spring Security", "Content...", "Wang Wu", 600)
            )
        ).filter { it.title.contains(keyword, ignoreCase = true) }
    }

    @GetMapping("/hot")
    fun getHotArticles(): Mono<ApiResponse<List<ArticleDTO>>> {
        return Mono.defer {
            val articles = listOf(
                ArticleDTO(1, "Spring Boot Best Practices", "Content...", "Zhang San", 1000),
                ArticleDTO(2, "Kotlin Coroutines Guide", "Content...", "Li Si", 800)
            )
            Mono.just(ApiResponse.success(articles, "Hot articles retrieved successfully"))
        }
    }

    data class ArticleDTO(
        val id: Long,
        val title: String,
        val content: String,
        val author: String,
        val views: Int
    )

    data class CreateArticleRequest(
        val title: String,
        val content: String,
        val author: String
    )
}

