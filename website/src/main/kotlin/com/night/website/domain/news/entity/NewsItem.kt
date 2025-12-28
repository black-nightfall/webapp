package com.night.website.domain.news.entity

import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDate
import java.time.LocalDateTime

@Table("news")
data class NewsItem(
    @Id
    val id: Long? = null,
    val title: String,
    val summary: String,
    val content: String,
    val author: String,
    val date: LocalDate,
    val tags: List<String>,
    val imageUrl: String? = null,
    
    @CreatedDate
    val createdAt: LocalDateTime? = null,
    
    @LastModifiedDate
    val updatedAt: LocalDateTime? = null
)
