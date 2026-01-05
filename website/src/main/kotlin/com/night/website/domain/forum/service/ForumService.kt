package com.night.website.domain.forum.service

import com.night.website.domain.forum.entity.ForumPost
import com.night.website.domain.forum.repository.ForumPostRepository
import com.night.website.domain.user.repository.UserRepository
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.stereotype.Service

@Service
class ForumService(
    private val forumPostRepository: ForumPostRepository,
    private val userRepository: UserRepository
) {

    suspend fun getAll(): List<ForumPost> = forumPostRepository.findAll().asFlow()
        .map { post ->
            val user = userRepository.findById(post.authorId).awaitSingleOrNull()
            post.copy(author = user)
        }
        .toList()

    suspend fun getById(id: Long): ForumPost? {
        val post = forumPostRepository.findById(id).awaitSingleOrNull() ?: return null
        val user = userRepository.findById(post.authorId).awaitSingleOrNull()
        return post.copy(author = user)
    }

    suspend fun create(forumPost: ForumPost): ForumPost = forumPostRepository.save(forumPost).awaitSingle()

    suspend fun update(id: Long, forumPost: ForumPost): ForumPost? {
        val existing = forumPostRepository.findById(id).awaitSingleOrNull() ?: return null
        val toSave = forumPost.copy(id = id, createdAt = existing.createdAt)
        return forumPostRepository.save(toSave).awaitSingle()
    }

    suspend fun delete(id: Long) {
        forumPostRepository.deleteById(id).awaitSingleOrNull()
    }
}
