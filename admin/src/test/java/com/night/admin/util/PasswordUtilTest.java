package com.night.admin.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

/**
 * PasswordUtil 单元测试
 */
@SpringBootTest
@DisplayName("密码工具类测试")
class PasswordUtilTest {

    @Autowired
    private PasswordUtil passwordUtil;

    @Test
    @DisplayName("测试密码加密 - 成功加密")
    void testEncodePassword_Success() {
        // Given
        String rawPassword = "123456";

        // When
        String encodedPassword = passwordUtil.encodePassword(rawPassword);


        System.out.println("原始密码: " + rawPassword);
        System.out.println("加密后密码: " + encodedPassword);
        // Then
        assertNotNull(encodedPassword, "加密后的密码不应为空");
        assertNotEquals(rawPassword, encodedPassword, "加密后的密码应与原密码不同");
        assertTrue(encodedPassword.startsWith("$2a$") || encodedPassword.startsWith("$2b$"),
                "BCrypt 加密应以 $2a$ 或 $2b$ 开头");
        assertTrue(encodedPassword.length() == 60,
                "BCrypt 加密后长度应为 60 字符");
    }

    @Test
    @DisplayName("测试密码加密 - 空密码抛出异常")
    void testEncodePassword_EmptyPassword_ThrowsException() {
        // Given
        String emptyPassword = "";

        // When & Then
        assertThrows(IllegalArgumentException.class,
                () -> passwordUtil.encodePassword(emptyPassword),
                "空密码应抛出 IllegalArgumentException");
    }

    @Test
    @DisplayName("测试密码加密 - null 密码抛出异常")
    void testEncodePassword_NullPassword_ThrowsException() {
        // Given
        String nullPassword = null;

        // When & Then
        assertThrows(IllegalArgumentException.class,
                () -> passwordUtil.encodePassword(nullPassword),
                "null 密码应抛出 IllegalArgumentException");
    }

    @Test
    @DisplayName("测试密码加密 - 只有空格的密码抛出异常")
    void testEncodePassword_WhitespaceOnly_ThrowsException() {
        // Given
        String whitespacePassword = "   ";

        // When & Then
        assertThrows(IllegalArgumentException.class,
                () -> passwordUtil.encodePassword(whitespacePassword),
                "只有空格的密码应抛出 IllegalArgumentException");
    }

    @Test
    @DisplayName("测试密码验证 - 正确密码匹配")
    void testMatches_CorrectPassword_ReturnsTrue() {
        // Given
        String rawPassword = "correctPassword123";
        String encodedPassword = passwordUtil.encodePassword(rawPassword);

        // When
        boolean matches = passwordUtil.matches(rawPassword, encodedPassword);

        // Then
        assertTrue(matches, "正确的密码应该匹配成功");
    }

    @Test
    @DisplayName("测试密码验证 - 错误密码不匹配")
    void testMatches_WrongPassword_ReturnsFalse() {
        // Given
        String rawPassword = "correctPassword123";
        String wrongPassword = "wrongPassword456";
        String encodedPassword = passwordUtil.encodePassword(rawPassword);

        // When
        boolean matches = passwordUtil.matches(wrongPassword, encodedPassword);

        // Then
        assertFalse(matches, "错误的密码不应该匹配");
    }

    @Test
    @DisplayName("测试密码验证 - null 原密码返回 false")
    void testMatches_NullRawPassword_ReturnsFalse() {
        // Given
        String encodedPassword = passwordUtil.encodePassword("somePassword");

        // When
        boolean matches = passwordUtil.matches(null, encodedPassword);

        // Then
        assertFalse(matches, "null 原密码应返回 false");
    }

    @Test
    @DisplayName("测试密码验证 - null 加密密码返回 false")
    void testMatches_NullEncodedPassword_ReturnsFalse() {
        // Given
        String rawPassword = "somePassword";

        // When
        boolean matches = passwordUtil.matches(rawPassword, null);

        // Then
        assertFalse(matches, "null 加密密码应返回 false");
    }

    @Test
    @DisplayName("测试 BCrypt 特性 - 同一密码多次加密生成不同哈希")
    void testBCryptFeature_SamePasswordDifferentHashes() {
        // Given
        String rawPassword = "samePassword123";

        // When
        String encoded1 = passwordUtil.encodePassword(rawPassword);
        String encoded2 = passwordUtil.encodePassword(rawPassword);
        String encoded3 = passwordUtil.encodePassword(rawPassword);

        // Then
        assertNotEquals(encoded1, encoded2, "同一密码的两次加密应生成不同的哈希值");
        assertNotEquals(encoded2, encoded3, "同一密码的两次加密应生成不同的哈希值");
        assertNotEquals(encoded1, encoded3, "同一密码的两次加密应生成不同的哈希值");

        // 但都应该能验证成功
        assertTrue(passwordUtil.matches(rawPassword, encoded1), "encoded1 应该验证成功");
        assertTrue(passwordUtil.matches(rawPassword, encoded2), "encoded2 应该验证成功");
        assertTrue(passwordUtil.matches(rawPassword, encoded3), "encoded3 应该验证成功");
    }

    @Test
    @DisplayName("测试密码加密 - 特殊字符密码")
    void testEncodePassword_SpecialCharacters() {
        // Given
        String specialPassword = "P@ssw0rd!#$%^&*()_+-=[]{}|;:',.<>?/~`";

        // When
        String encodedPassword = passwordUtil.encodePassword(specialPassword);

        // Then
        assertNotNull(encodedPassword);
        assertTrue(passwordUtil.matches(specialPassword, encodedPassword),
                "特殊字符密码应该正确加密和验证");
    }

    @Test
    @DisplayName("测试密码加密 - 中文密码")
    void testEncodePassword_ChineseCharacters() {
        // Given
        String chinesePassword = "我的密码123";

        // When
        String encodedPassword = passwordUtil.encodePassword(chinesePassword);

        // Then
        assertNotNull(encodedPassword);
        assertTrue(passwordUtil.matches(chinesePassword, encodedPassword),
                "中文密码应该正确加密和验证");
    }

    @Test
    @DisplayName("测试密码加密 - 长密码（接近 BCrypt 72 字节限制）")
    void testEncodePassword_LongPassword() {
        // Given - BCrypt 有 72 字节的限制
        String longPassword = "ThisIsAVeryLongPasswordThatIsUsedToTestTheBCryptAlgorithmLimit12345";

        // When
        String encodedPassword = passwordUtil.encodePassword(longPassword);

        // Then
        assertNotNull(encodedPassword);
        assertTrue(passwordUtil.matches(longPassword, encodedPassword),
                "长密码应该正确加密和验证");
    }

    @Test
    @DisplayName("测试密码验证 - 大小写敏感")
    void testMatches_CaseSensitive() {
        // Given
        String password = "Password123";
        String encodedPassword = passwordUtil.encodePassword(password);

        // When & Then
        assertTrue(passwordUtil.matches("Password123", encodedPassword),
                "完全相同的密码应该匹配");
        assertFalse(passwordUtil.matches("password123", encodedPassword),
                "小写的密码不应该匹配");
        assertFalse(passwordUtil.matches("PASSWORD123", encodedPassword),
                "大写的密码不应该匹配");
    }

    @Test
    @DisplayName("测试密码验证 - 空格敏感")
    void testMatches_SpaceSensitive() {
        // Given
        String password = "pass word";
        String encodedPassword = passwordUtil.encodePassword(password);

        // When & Then
        assertTrue(passwordUtil.matches("pass word", encodedPassword),
                "完全相同的密码（包含空格）应该匹配");
        assertFalse(passwordUtil.matches("password", encodedPassword),
                "没有空格的密码不应该匹配");
        assertFalse(passwordUtil.matches("pass  word", encodedPassword),
                "多个空格的密码不应该匹配");
    }

    @Test
    @DisplayName("性能测试 - 加密操作耗时（BCrypt 应该较慢以防止暴力破解）")
    void testPerformance_EncodingIsSlow() {
        // Given
        String password = "testPassword123";

        // When
        long startTime = System.currentTimeMillis();
        passwordUtil.encodePassword(password);
        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;

        // Then
        // BCrypt 应该花费一定时间（通常 > 50ms），这是设计特性
        System.out.println("BCrypt 加密耗时: " + duration + "ms");
        assertTrue(duration > 0, "加密应该花费一些时间");
    }
}
