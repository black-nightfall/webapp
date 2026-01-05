package com.night.website.domain.user.repository

import com.night.website.domain.user.entity.User
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface UserRepository : ReactiveCrudRepository<User, Long> {
    suspend fun findByEmail(email: String): User?
}
