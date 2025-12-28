package com.night.website.domain.auth.service

import com.night.website.domain.user.entity.User
import com.night.website.domain.user.repository.UserRepository
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.stereotype.Service

data class LoginRequest(val email: String)
data class LoginResponse(val token: String, val user: User)
data class RegisterRequest(val name: String, val email: String)

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
