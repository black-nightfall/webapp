package com.night.website.application

import com.night.website.domain.ForumPost
import com.night.website.domain.User
import com.night.website.infrastructure.persistence.ForumPostRepository
import com.night.website.infrastructure.persistence.UserRepository
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.stereotype.Service
import java.time.LocalDate

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

    suspend fun getById(id: String): ForumPost? {
        val post = forumPostRepository.findById(id).awaitSingleOrNull() ?: return null
        val user = userRepository.findById(post.authorId).awaitSingleOrNull()
        return post.copy(author = user)
    }
}
