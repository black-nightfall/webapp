# Common 模块

## 概述

`common` 模块是项目中的共享模块，包含所有子模块都可能使用的通用代码、工具类和配置。

## 模块结构

```
common/
├── exception/           # 异常定义
│   └── ApplicationException.kt
├── dto/                # 数据传输对象
│   └── ApiResponse.kt
├── constant/           # 常量定义
│   └── Constants.kt
├── util/               # 工具类
│   ├── CommonUtils.kt
│   └── LoggerUtil.kt
└── extension/          # Kotlin 扩展函数
    └── Extensions.kt
```

## 包含的功能

### 1. 异常处理 (`exception` 包)

统一的异常体系，便于错误处理和返回一致的错误响应。

**主要异常类**:
- `ApplicationException` - 应用异常基类
- `BusinessException` - 业务异常
- `ResourceNotFoundException` - 资源不存在异常
- `InvalidArgumentException` - 参数验证异常
- `InternalErrorException` - 内部错误异常

**使用示例**:
```kotlin
throw BusinessException("USER_NOT_FOUND", "用户不存在")
```

### 2. 数据传输对象 (`dto` 包)

**主要类**:
- `ApiResponse<T>` - API 统一响应包装类，包含成功/失败统一处理
- `ErrorResponse` - 错误响应
- `PageRequest` - 分页请求
- `PageResponse<T>` - 分页响应

**使用示例**:
```kotlin
// 成功响应
return ApiResponse.success(user, "User found successfully")

// 失败响应
return ApiResponse.error("USER_NOT_FOUND", "用户不存在")

// 分页响应
val page = PageResponse.of(users, pageNo, pageSize, total)
```

### 3. 常量定义 (`constant` 包)

**包含的常量**:
- `HttpConstant` - HTTP 相关常量
- `ErrorCodeConstant` - 错误码常量
- `BusinessConstant` - 业务相关常量
- `SystemConstant` - 系统相关常量

**使用示例**:
```kotlin
import com.night.common.constant.*

val contentType = HttpConstant.CONTENT_TYPE_JSON
val pageSize = BusinessConstant.DEFAULT_PAGE_SIZE
```

### 4. 工具类 (`util` 包)

**主要工具**:
- `DateTimeUtil` - 日期时间工具
  - `now()` - 获取当前时间
  - `formatToString()` - 格式化时间
  - `parseFromString()` - 解析时间字符串

- `StringUtil` - 字符串工具
  - `isEmpty()` / `isNotEmpty()` - 判断空值
  - `isBlank()` / `isNotBlank()` - 判断空白
  - `camelToSnake()` / `snakeToCamel()` - 命名转换

- `ValidationUtil` - 验证工具
  - `isValidEmail()` - 邮箱验证
  - `isValidPhoneNumber()` - 电话号码验证
  - `isValidUrl()` - URL 验证

- `LoggerUtil` - 日志工具
  - 便捷的日志记录方式

**使用示例**:
```kotlin
import com.night.common.util.*

val now = DateTimeUtil.now()
val email = "user@example.com"
if (ValidationUtil.isValidEmail(email)) {
    logger.info("Valid email: $email")
}
```

### 5. 扩展函数 (`extension` 包)

**String 扩展**:
- `orEmpty()` / `orNull()` - 空值处理
- `toIntOrNull()` / `toLongOrNull()` - 类型转换

**Collection 扩展**:
- `isNotEmpty()` / `isEmpty()` - 集合判断
- `getOrEmpty()` - 获取空列表

**LocalDateTime 扩展**:
- `format()` - 格式化输出
- `toStartOfDay()` / `toEndOfDay()` - 时间段转换

**ApiResponse 扩展**:
- `toSuccessResponse()` - 快速生成成功响应
- `toErrorResponse()` - 快速生成错误响应

**使用示例**:
```kotlin
import com.night.common.extension.*

val name: String? = getUserName()
val displayName = name.orEmpty("Unknown")

val users: List<User>? = getUsers()
if (users.isNotEmpty()) {
    logger.info("Found ${users.size} users")
}

val response = user.toSuccessResponse("User found")
```

## 依赖关系

```
common (核心共享模块)
  ├── admin (依赖 common)
  └── website (依赖 common)
```

## 使用指南

### 在 admin 或 website 中使用 common

由于已经在 `build.gradle.kts` 中配置了依赖，可以直接导入使用：

```kotlin
import com.night.common.dto.ApiResponse
import com.night.common.exception.BusinessException
import com.night.common.util.DateTimeUtil
import com.night.common.extension.*

// 使用 DTO
val response = ApiResponse.success(data, "Success")

// 使用异常
throw BusinessException("ERROR_CODE", "Error message")

// 使用工具类
val now = DateTimeUtil.now()

// 使用扩展函数
val value = nullableString.orEmpty("default")
```

## 最佳实践

1. **异常处理** - 优先使用 `common` 中定义的异常类，保持异常体系一致
2. **DTO 复用** - 使用 `ApiResponse` 统一响应格式
3. **常量管理** - 使用 `constant` 包中的常量而不是硬编码
4. **工具函数** - 优先使用提供的工具函数和扩展函数

## 扩展建议

未来可以添加以下内容到 `common` 模块：

- **配置类** - 应用配置管理
- **拦截器** - 日志、认证、授权拦截
- **AOP 切面** - 统一的业务逻辑处理
- **数据库访问层基类** - Repository 基类
- **缓存工具** - Redis 缓存操作
- **消息队列工具** - 消息发送/接收

