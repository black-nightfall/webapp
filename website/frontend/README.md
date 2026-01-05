# Website Frontend - 开发文档

> 萌宠新闻网站前端 - Next.js + Neubrutalism Design

> **📚 深入阅读**：本README为快速指南。  
> - 完整开发指南 → [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)  
> - AI专用提示 → [prompt.md](./prompt.md)

## 📋 目录

- [项目概述](#项目概述)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [架构设计](#架构设计) → [详见DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)
- [目录结构](#目录结构)
- [开发规范](#开发规范) → [详见DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)
- [常见问题](#常见问题)
- [相关文档](#相关文档)

---

## 项目概述

基于 **Neubrutalism (新粗野主义)** 设计风格的萌宠新闻网站前端。

**核心特色**：
- ✅ 高对比度视觉效果
- ✅ 动态猫咪主题元素  
- ✅ SSR + RSC
- ✅ 国际化（中英文）
- ✅ 完全响应式

---

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| **Next.js** | 15.x | App Router + RSC |
| **React** | 19.x | UI框架 |
| **TypeScript** | 5.x | 类型安全 |
| **Tailwind CSS** | 3.x | 样式框架 |
| **next-intl** | 3.x | 国际化 |
| **Framer Motion** | 11.x | 动画 |
| **Lucide React** | - | 图标 |
| **Zod** | 3.x | 验证 |

---

## 快速开始

### 环境要求
```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### 安装依赖
```bash
cd website/frontend
npm install
```

### 开发模式
```bash
npm run dev
```

访问: http://localhost:3000

### 生产构建
```bash
npm run build
npm run start
```

---

## 架构设计

### Neubrutalism风格概览

本项目采用 **Neubrutalism (新粗野主义)** 设计风格，这是一种现代化的设计理念，强调大胆、直接的视觉表达。

**核心设计理念**：
```
视觉层 (Neubrutalism Components)
  ↓ 使用
样式层 (Tailwind CSS + Custom Tokens)
  ↓ 支撑 
业务层 (Next.js App Router + Server Components)
  ↓ 调用
数据层 (Service Layer + API)
```

**详细说明** → [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)

---

## 目录结构

```
website/frontend/
├── src/
│   ├── app/[locale]/        # 路由页面（RSC）
│   │   ├── page.tsx
│   │   ├── news/
│   │   └── forum/
│   │
│   ├── components/
│   │   ├── ui/              # UI组件
│   │   │   └── cat-container.tsx  # ⭐ 核心组件
│   │   └── layout/          # 布局组件
│   │       ├── sticky-header.tsx
│   │       └── page-transition.tsx
│   │
│   ├── services/            # API Service层
│   │   ├── newsService.ts
│   │   └── baseService.ts
│   │
│   ├── lib/                 # 工具函数
│   │   └── utils.ts
│   │
│   └── messages/            # i18n翻译
│       ├── en.json
│       └── zh.json
│
├── public/                  # 静态资源
├── tailwind.config.ts       # Tailwind配置
└── next.config.js           # Next.js配置
```

**重要说明**：
- ✅ **核心组件**: `cat-container.tsx` 是猫咪主题容器
- ✅ **样式系统**: Tailwind + Neubrutalism tokens
- ✅ **国际化**: next-intl自动路由

---

## 核心特性

### 1. Neobrutalism设计

**视觉特征**：
- 粗黑边框（4px）
- 硬投影（无模糊）
- 高对比度颜色
- 大胆字体

**示例**：
```tsx
<div className="
  border-4 border-black
  shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
  bg-yellow-main
">
  Content
</div>
```

### 2. 核心组件

**CatContainer** - 猫咪主题容器：
```tsx
import { CatContainer } from '@/components/ui/cat-container';

<CatContainer variant="orange" entryDirection="bottom">
  <h1>Your Content</h1>
</CatContainer>
```

**StickyHeader** - 滚动导航栏：
- 滚动300px后自动显示
- 响应式设计

### 3. 国际化(i18n)

使用 `next-intl`：

```tsx
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('PageName');
  
  return <h1>{t('title')}</h1>;
}
```

翻译文件：
- `messages/en.json` - 英文
- `messages/zh.json` - 中文

---

## 开发规范

### ✅ 必须遵守

1. **禁止硬编码文本**
   ```tsx
   // ❌ 错误
   <h1>关于我们</h1>
   
   // ✅ 正确  
   <h1>{t('about.title')}</h1>
   ```

2. **使用Service层API调用**
   ```tsx
   // ✅ 正确
   import { newsService } from '@/services/newsService';
   const news = await newsService.getList();
   ```

3. **遵循Neubrutalism风格**
   - ✅ 粗边框（border-4）
   - ✅ 硬阴影（shadow-[8px_8px_0px...]）
   - ❌ 禁止柔和阴影

4. **类型安全**
   - ✅ 使用TypeScript strict模式
   - ✅ 使用Zod验证API响应
   - ❌ 禁止any类型

### 📁 目录结构

```
website/frontend/
├── src/
│   ├── app/[locale]/        # 路由页面
│   ├── components/
│   │   ├── ui/              # UI组件
│   │   └── layout/          # 布局组件
│   ├── services/            # API Service
│   ├── lib/                 # 工具函数
│   └── messages/            # i18n翻译
├── public/                  # 静态资源
└── tailwind.config.ts       # Tailwind配置
```

---

## 常见问题

### Q1: 如何创建新页面？

1. 在 `src/app/[locale]/` 创建文件夹
2. 创建 `page.tsx`
3. 添加翻译到 `messages/*.json`
4. 使用 `CatContainer` 包裹内容

详见：[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md#新页面开发工作流)

### Q2: 如何调用后端API？

1. 创建Service文件（`src/services/xxxService.ts`）
2. 使用环境变量配置API地址
3. 在页面中引入Service

详见：[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md#数据交互)

### Q3: 如何切换语言？

访问：
- 中文：`http://localhost:3000/zh`
- 英文：`http://localhost:3000/en`

### Q4: 如何添加新组件？

参考 `src/components/ui/cat-container.tsx` 的实现风格。

---

## 相关文档

### 本模块深入阅读
- **[DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md)** - 完整开发工作流和组件使用
- **[prompt.md](./prompt.md)** - AI专用快速提示

### 后端文档
- **[website/README.md](../README.md)** - Website后端文档

### 项目级文档
- **[docs/AI_CONTEXT_INDEX.md](../../docs/AI_CONTEXT_INDEX.md)** - AI导航中心
- **[docs/AI_PROMPTING_GUIDE.md](../../docs/AI_PROMPTING_GUIDE.md)** - AI提示语指南
- **[QUICKSTART.md](../../QUICKSTART.md)** - 快速开始

---

**Neubrutalism风格，大胆创新！** 🎨
