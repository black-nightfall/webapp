package com.night.website.application

import com.night.website.domain.LoginRequest
import com.night.website.domain.LoginResponse
import com.night.website.domain.RegisterRequest
import com.night.website.domain.User
import com.night.website.infrastructure.persistence.UserRepository
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.stereotype.Service
import java.util.UUID

@Service
class AuthService(private val userRepository: UserRepository) {

    suspend fun login(request: LoginRequest): LoginResponse {
        val user = userRepository.findByEmail(request.email)
            ?: throw IllegalArgumentException("User not found")
        // In real app, check password match here
        return LoginResponse(token = "jwt-token-for-${user.id}", user = user)
    }

    suspend fun register(request: RegisterRequest): LoginResponse {
        val existing = userRepository.findByEmail(request.email)
        if (existing != null) {
            throw IllegalArgumentException("User already exists")
        }
        val newUser = User(
            name = request.name,
            email = request.email,
            avatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=" + request.name
        )
        val savedUser = userRepository.save(newUser).awaitSingle()
        return LoginResponse(token = "jwt-token-for-${savedUser.id}", user = savedUser)
    }
}
