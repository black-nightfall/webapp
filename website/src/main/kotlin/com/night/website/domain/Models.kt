package com.night.website.domain

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDate

@Table("users")
data class User(
    @Id
    val id: String? = null,
    val name: String,
    val email: String,
    val avatar: String? = null
)

@Table("news")
data class NewsItem(
    @Id
    val id: String? = null,
    val title: String,
    val summary: String,
    val content: String,
    val author: String,
    val date: LocalDate,
    val tags: List<String>, // Note: Might need converter for array/json in Postgres
    val imageUrl: String? = null
)

@Table("forum_posts")
data class ForumPost(
    @Id
    val id: String? = null,
    val title: String,
    val content: String,
    // Relationships in R2DBC are manual usually, or we store ID.
    // Simplifying to proper relational model: store userId.
    val authorId: String, 
    @org.springframework.data.annotation.Transient // We will populate this manually at service level
    val author: User? = null,
    
    val category: String,
    val likes: Int = 0,
    val comments: Int = 0,
    val date: LocalDate,
    val isHot: Boolean = false
)

data class LoginRequest(val email: String)
data class LoginResponse(val token: String, val user: User)

data class RegisterRequest(val name: String, val email: String)
