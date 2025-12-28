package com.night.website.infrastructure.persistence

import com.night.website.domain.ForumPost
import com.night.website.domain.NewsItem
import com.night.website.domain.User
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface NewsRepository : ReactiveCrudRepository<NewsItem, String>

@Repository
interface ForumPostRepository : ReactiveCrudRepository<ForumPost, String>

@Repository
interface UserRepository : ReactiveCrudRepository<User, String> {
    suspend fun findByEmail(email: String): User?
}
