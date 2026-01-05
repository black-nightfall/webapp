package com.night.admin.domain.auth;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.TimeUnit;

/**
 * Token 会话管理服务
 * 使用 Redis 存储和管理用户 Token
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class TokenSessionService {
    
    private final RedisTemplate<String, String> redisTemplate;
    
    private static final String TOKEN_PREFIX = "token:";
    private static final String USER_TOKENS_PREFIX = "user:tokens:";
    
    /**
     * 存储 Token
     * @param token Token字符串
     * @param username 用户名
     * @param expirationMs 过期时间（毫秒）
     */
    public void storeToken(String token, String username, Long expirationMs) {
        String tokenKey = TOKEN_PREFIX + token;
        String userTokensKey = USER_TOKENS_PREFIX + username;
        
        // 存储 token -> username 映射
        redisTemplate.opsForValue().set(tokenKey, username, expirationMs, TimeUnit.MILLISECONDS);
        
        // 存储 username -> tokens 集合（用于管理用户的所有会话）
        redisTemplate.opsForSet().add(userTokensKey, token);
        redisTemplate.expire(userTokensKey, expirationMs, TimeUnit.MILLISECONDS);
        
        log.debug("Stored token for user: {}", username);
    }
    
    /**
     * 验证 Token 是否有效（是否在 Redis 中）
     */
    public boolean isTokenValid(String token) {
        String tokenKey = TOKEN_PREFIX + token;
        Boolean exists = redisTemplate.hasKey(tokenKey);
        return Boolean.TRUE.equals(exists);
    }
    
    /**
     * 从 Token 获取用户名
     */
    public String getUsernameFromToken(String token) {
        String tokenKey = TOKEN_PREFIX + token;
        return redisTemplate.opsForValue().get(tokenKey);
    }
    
    /**
     * 删除单个 Token（用户登出）
     */
    public void deleteToken(String token) {
        String tokenKey = TOKEN_PREFIX + token;
        String username = redisTemplate.opsForValue().get(tokenKey);
        
        if (username != null) {
            String userTokensKey = USER_TOKENS_PREFIX + username;
            redisTemplate.opsForSet().remove(userTokensKey, token);
            redisTemplate.delete(tokenKey);
            log.info("Deleted token for user: {}", username);
        }
    }
    
    /**
     * 踢用户下线（删除该用户的所有 Token）
     */
    public void kickOutUser(String username) {
        String userTokensKey = USER_TOKENS_PREFIX + username;
        Set<String> tokens = redisTemplate.opsForSet().members(userTokensKey);
        
        if (tokens != null && !tokens.isEmpty()) {
            // 删除所有 token
            for (String token : tokens) {
                String tokenKey = TOKEN_PREFIX + token;
                redisTemplate.delete(tokenKey);
            }
            // 删除用户的 token 集合
            redisTemplate.delete(userTokensKey);
            log.info("Kicked out user: {}, deleted {} tokens", username, tokens.size());
        }
    }
    
    /**
     * 获取用户当前有效的所有 Token 数量
     */
    public Long getUserActiveTokenCount(String username) {
        String userTokensKey = USER_TOKENS_PREFIX + username;
        return redisTemplate.opsForSet().size(userTokensKey);
    }
    
    /**
     * 刷新 Token 过期时间
     */
    public void refreshToken(String token, Long expirationMs) {
        String tokenKey = TOKEN_PREFIX + token;
        String username = redisTemplate.opsForValue().get(tokenKey);
        
        if (username != null) {
            redisTemplate.expire(tokenKey, expirationMs, TimeUnit.MILLISECONDS);
            log.debug("Refreshed token for user: {}", username);
        }
    }
}
