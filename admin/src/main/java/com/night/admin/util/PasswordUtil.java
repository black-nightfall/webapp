package com.night.admin.util;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * 密码工具类
 * 用于密码加密和验证
 */
@Component
@RequiredArgsConstructor
public class PasswordUtil {

    private final PasswordEncoder passwordEncoder;

    /**
     * 将明文密码加密为密文（哈希）
     * 
     * @param rawPassword 明文密码
     * @return 加密后的密码（BCrypt哈希）
     */
    public String encodePassword(String rawPassword) {
        if (rawPassword == null || rawPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("密码不能为空");
        }
        return passwordEncoder.encode(rawPassword);
    }

    /**
     * 验证明文密码是否与加密密码匹配
     * 
     * @param rawPassword     明文密码
     * @param encodedPassword 已加密的密码
     * @return true 如果匹配，否则 false
     */
    public boolean matches(String rawPassword, String encodedPassword) {
        if (rawPassword == null || encodedPassword == null) {
            return false;
        }
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}
