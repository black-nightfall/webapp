# 国际化使用指南

## 🎉 功能完成

Admin 项目已实现完整的中英文国际化支持！

## 📚 使用方法

### 前端 - 切换语言

**方法 1：使用语言切换器**
- 登录页面右上角有语言选择下拉框
- 选择 "简体中文" 或 "English"
- 语言会保存到 localStorage，刷新后保持

**方法 2：编程方式**
```typescript
import { useTranslation } from 'react-i18next';

const { t, i18n } = useTranslation();

// 切换语言
i18n.changeLanguage('zh-CN'); // 中文
i18n.changeLanguage('en-US'); // 英文

// 使用翻译
<button>{t('common.confirm')}</button>
```

### 后端 - 返回国际化消息

**自动检测**：后端根据请求的 `Accept-Language` header 自动返回对应语言的消息

**示例**：
```bash
# 中文请求
curl -H "Accept-Language: zh-CN" http://localhost:9090/admin/api/auth/login

# 英文请求
curl -H "Accept-Language: en-US" http://localhost:9090/admin/api/auth/login
```

### 添加新的翻译

#### 前端

1. **编辑翻译文件**：
   - `frontend/src/i18n/locales/zh-CN.json` （中文）
   - `frontend/src/i18n/locales/en-US.json` （英文）

2. **添加翻译键**：
```json
{
  "myFeature": {
    "title": "我的功能标题",
    "description": "功能描述"
  }
}
```

3. **在组件中使用**：
```typescript
const { t } = useTranslation();
<h1>{t('myFeature.title')}</h1>
```

#### 后端

1. **编辑资源文件**：
   - `admin/src/main/resources/i18n/messages_zh_CN.properties`
   - `admin/src/main/resources/i18n/messages_en_US.properties`

2. **添加消息**：
```properties
# messages_zh_CN.properties
myFeature.success=操作成功

# messages_en_US.properties
myFeature.success=Operation successful
```

3. **在代码中使用**：
```java
@Autowired
private MessageService messageService;

String message = messageService.getMessage("myFeature.success");
return ApiResponse.success(data, message);
```

## 🗂️ 文件结构

### 后端
```
admin/
└── src/main/
    ├── java/com/night/admin/
    │   ├── config/
    │   │   └── LocalizationConfig.java      # i18n 配置
    │   └── util/
    │       └── MessageService.java          # 消息服务
    └── resources/i18n/
        ├── messages_zh_CN.properties        # 中文资源
        └── messages_en_US.properties        # 英文资源
```

### 前端
```
frontend/
└── src/
    ├── i18n/
    │   ├── index.ts                # i18n 配置
    │   └── locales/
    │       ├── zh-CN.json          # 中文翻译
    │       └── en-US.json          # 英文翻译
    └── components/
        └── LanguageSwitcher.tsx    # 语言切换器
```

## ✅ 已实现功能

### 后端
- ✅ 基于 `Accept-Language` header 的自动语言检测
- ✅ MessageSource 国际化配置
- ✅ MessageService 工具类
- ✅ AuthController 国际化消息
- ✅ 中英文资源文件（通用、认证、用户、产品、订单等）

### 前端
- ✅ react-i18next 配置
- ✅ 语言持久化（localStorage）
- ✅ 语言切换器组件
- ✅ Login 页面国际化
- ✅ API 请求自动添加 Accept-Language header
- ✅ 中英文翻译文件

## 🔍 示例

### 登录页面
- **中文**：标题显示 "登录"，按钮显示 "登录"
- **英文**：标题显示 "Login"，按钮显示 "Login"
- 语言切换器位于卡片右上角

### API 响应
```json
// 中文请求
{
  "code": 200,
  "message": "登录成功",
  "data": { ... }
}

// 英文请求
{
  "code": 200,
  "message": "Login successful",
  "data": { ... }
}
```

## 📝 最佳实践

1. **键名统一**：使用 `.` 分隔的层级结构，如 `user.create.success`
2. **避免硬编码**：所有用户可见文本都应使用翻译
3. **同步更新**：添加新功能时同时更新中英文翻译
4. **参数化消息**：支持占位符，如 `{0}`, `{1}`
5. **一致性**：保持前后端消息键的命名风格一致

## 🛠️ 技术细节

- **后端框架**：Spring Boot MessageSource
- **前端库**：react-i18next + i18next
- **默认语言**：简体中文 (zh-CN)
- **支持语言**：简体中文、英文
- **语言检测**：localStorage > navigator
- **持久化**：localStorage

---

现在你可以在整个应用中享受中英文切换功能了！🌐
