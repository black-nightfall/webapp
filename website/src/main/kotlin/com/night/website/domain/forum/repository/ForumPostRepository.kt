package com.night.website.domain.forum.repository

import com.night.website.domain.forum.entity.ForumPost
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface ForumPostRepository : ReactiveCrudRepository<ForumPost, Long>
