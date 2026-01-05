# Common 模块 - 开发文档

> 共享工具模块 - 异常处理 + DTO + 工具类 + 扩展函数

## 📋 目录

- [🤖 AI/Vibecode Context](#-aivibecode-context) ⭐ **AI必读优先**
- [📦 模块概述](#-模块概述)
- [🛠️ 技术栈](#️-技术栈)
- [📁 模块结构](#-模块结构)
- [💡 使用指南](#-使用指南)
- [📚 相关文档](#-相关文档)

---

## 🤖 AI/Vibecode Context

> **For AI Agents**: Common模块提供项目共享工具，所有模块都依赖此模块

### 核心上下文
1. **定位**: 跨模块共享的基础设施代码
2. **语言**: Kotlin (与Java完全兼容)
3. **依赖关系**: 
   ```
   common (被依赖)
     ├─ admin (依赖common)
     └─ website (依赖common)
   ```

### 代码生成规则
- **✅ 必须**: 所有新增工具类都使用Kotlin编写
- **✅ 必须**: 保持Java兼容性（避免Kotlin专有特性）
- **✅ 必须**: 工具类使用`object`单例模式
- **❌ 禁止**: 在common中依赖具体业务逻辑
- **❌ 禁止**: 在common中引入Spring依赖（保持轻量）

### 使用决策树

```
需要添加新代码到项目？
├─ 是否被多个模块使用？
│  ├─ 是 → 放入common模块
│  │   ├─ 异常类？→ exception/
│  │   ├─ DTO？→ dto/
│  │   ├─ 工具方法？→ util/
│  │   └─ Kotlin扩展？→ extension/
│  │
│  └─ 否 → 放入具体模块(admin/website)
```

### 代码模板

**工具类示例**:
```kotlin
// common/src/main/kotlin/com/night/common/util/StringUtil.kt
package com.night.common.util

object StringUtil {
    @JvmStatic
    fun isValidEmail(email: String): Boolean {
        return email.matches(Regex("^[A-Za-z0-9+_.-]+@(.+)$"))
    }
}

// Java中使用
StringUtil.isValidEmail("test@example.com");
```

---

## 📦 模块概述

`common` 模块是项目中的共享模块，包含所有子模块都可能使用的通用代码、工具类和配置。

**核心功能**:
- ✅ 统一异常体系
- ✅ API响应格式封装
- ✅ 通用工具类
- ✅ Kotlin扩展函数
- ✅ 常量定义

---

## 🛠️ 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **Kotlin** | 2.2.21 | 主要开发语言 |
| **Java Compatibility** | 21 | 完全兼容Java |

---

## 📁 模块结构

```
common/
├── exception/           # 异常定义
│   ├── ApplicationException.kt
│   ├── BusinessException.kt
│   └── ResourceNotFoundException.kt
├── dto/                # 数据传输对象
│   ├── ApiResponse.kt       # ⭐ 核心：统一API响应
│   ├── ErrorCode.kt
│   └── PageResponse.kt
├── constant/           # 常量定义
│   ├── HttpConstant.kt
│   └── ErrorCodeConstant.kt
├── util/               # 工具类
│   ├── DateTimeUtil.kt
│   ├── StringUtil.kt
│   └── ValidationUtil.kt
└── extension/          # Kotlin 扩展函数
    └── Extensions.kt
```

---

## 💡 使用指南

### 1. 异常处理

**主要异常类**:
- `ApplicationException` - 应用异常基类
- `BusinessException` - 业务异常
- `ResourceNotFoundException` - 资源不存在异常

**使用示例**:
```kotlin
// Kotlin
throw BusinessException("USER_NOT_FOUND", "用户不存在")

// Java
throw new BusinessException("USER_NOT_FOUND", "用户不存在");
```

### 2. API响应格式 ⭐ 核心

**ApiResponse<T>** - 统一响应包装类：

```kotlin
// 成功响应
return ApiResponse.success(user, "User found successfully")

// 失败响应
return ApiResponse.error("USER_NOT_FOUND", "用户不存在")

// 分页响应
val page = PageResponse.of(users, pageNo, pageSize, total)
return ApiResponse.success(page)
```

**响应格式**:
```json
{
  "success": true,
  "data": {...},
  "message": "操作成功",
  "code": 200
}
```

### 3. 工具类

**DateTimeUtil** - 日期时间工具:
```kotlin
val now = DateTimeUtil.now()
val formatted = DateTimeUtil.formatToString(date, "yyyy-MM-dd")
```

**StringUtil** - 字符串工具:
```kotlin
StringUtil.isEmpty(str)
StringUtil.isValidEmail("user@example.com")
StringUtil.camelToSnake("userName") // → "user_name"
```

**ValidationUtil** - 验证工具:
```kotlin
ValidationUtil.isValidEmail("test@example.com")
ValidationUtil.isValidPhoneNumber("+86-138-0000-0000")
ValidationUtil.isValidUrl("https://example.com")
```

### 4. Kotlin扩展函数

**String扩展**:
```kotlin
val name: String? = getUserName()
val displayName = name.orEmpty("Unknown")
```

**Collection扩展**:
```kotlin
val users: List<User>? = getUsers()
if (users.isNotEmpty()) {
    logger.info("Found ${users.size} users")
}
```

**LocalDateTime扩展**:
```kotlin
val now = LocalDateTime.now()
val formatted = now.format("yyyy-MM-dd HH:mm:ss")
```

---

## 📚 相关文档

### 依赖此模块的文档
- **Admin模块**: [admin/README.md](../admin/README.md)
- **Website模块**: [website/README.md](../website/README.md)

### 项目文档
- **快速开始**: [QUICKSTART.md](../QUICKSTART.md)
- **项目总览**: [README.md](../README.md)

---

**构建共享基础，服务所有模块！** 🛠️
