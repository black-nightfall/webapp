package com.night.website.domain.forum.entity

import com.night.website.domain.user.entity.User
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.Id
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.annotation.Transient
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDate
import java.time.LocalDateTime

@Table("forum_posts")
data class ForumPost(
    @Id
    val id: Long? = null,
    val title: String,
    val content: String,
    val authorId: Long, // Changed to Long
    
    @Transient
    val author: User? = null,
    
    val category: String,
    val likes: Int = 0,
    val comments: Int = 0,
    val date: LocalDate,
    val isHot: Boolean = false,

    @CreatedDate
    val createdAt: LocalDateTime? = null,
    
    @LastModifiedDate
    val updatedAt: LocalDateTime? = null
)
