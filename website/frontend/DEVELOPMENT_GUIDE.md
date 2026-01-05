# Website Frontend - 开发指南

> Neubrutalism风格 + Next.js完整开发工作流和组件使用

## 📋 目录

- [新页面开发工作流](#新页面开发工作流)
- [核心组件](#核心组件)
- [样式规范](#样式规范)
- [国际化](#国际化)
- [数据交互](#数据交互)
- [开发规则](#开发规则)

---

# 新页面开发工作流

## 1. 创建页面路由

Next.js App Router约定 `app/[locale]/` 下的文件夹结构对应URL路径。

**步骤**:
1. 在 `src/app/[locale]/` 下创建新文件夹，例如 `about`
2. 在该文件夹内创建 `page.tsx`

```tsx
// src/app/[locale]/about/page.tsx
import { useTranslations } from 'next-intl';
import { CatContainer } from '@/components/ui/cat-container';

export default function AboutPage() {
  const t = useTranslations('AboutPage');

  return (
    <main className="min-h-screen p-8 bg-yellow-main">
      <CatContainer variant="orange" entryDirection="bottom">
        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
        <p>{t('description')}</p>
      </CatContainer>
    </main>
  );
}
```

## 2. 配置国际化

所有用户显示的文本必须放入翻译文件。

**步骤**:
1. 打开 `messages/en.json`，添加命名空间：
   ```json
   "AboutPage": {
       "title": "About Us",
       "description": "We love pets!"
   }
   ```

2. 打开 `messages/zh.json`，添加中文：
   ```json
   "AboutPage": {
       "title": "关于我们",
       "description": "我们热爱宠物！"
   }
   ```

## 3. 数据交互策略

### Service Layer模式（推荐）

```typescript
// src/services/newsService.ts
import { API_BASE_URL } from '@/config/api';

export const newsService = {
  async getNewsList() {
    const response = await fetch(`${API_BASE_URL}/news`);
    return response.json();
  },
  
  async getNewsDetail(id: string) {
    const response = await fetch(`${API_BASE_URL}/news/${id}`);
    return response.json();
  }
};

// page.tsx中使用
import { newsService } from '@/services/newsService';

export default async function NewsPage() {
  const news = await newsService.getNewsList();
  
  return (
    <CatContainer>
      {news.map(item => <NewsCard key={item.id} news={item} />)}
    </CatContainer>
  );
}
```

### Mock API模式

```typescript
// src/services/mockData.ts
export const mockNews = [
  { id: 1, title: '猫咪新闻1', content: '...' },
  { id: 2, title: '猫咪新闻2', content: '...' }
];

// src/services/newsService.ts
const useMock = process.env.NEXT_PUBLIC_USE_MOCK === 'true';

export const newsService = {
  async getNewsList() {
    if (useMock) return mockNews;
    const response = await fetch(`${API_BASE_URL}/news`);
    return response.json();
  }
};
```

---

# 核心组件

## CatContainer

**路径**: `src/components/ui/cat-container.tsx`

项目中最核心的视觉组件，用于包裹内容框，附带动态的猫咪耳朵和胡须。

**功能**:
- 提供多种猫咪变体 (`british`, `orange`, `tuxedo`, `calico`, `white`)
- 支持页面进入动画 (`entryDirection`)
- **交互**:
  - **Idle**: 耳朵每隔2秒间歇性抖动
  - **Hover**: 鼠标悬停时，耳朵向外侧弹跳和旋转

**使用示例**:
```tsx
<CatContainer variant="orange" entryDirection="bottom">
  <h1>Your Content Here</h1>
</CatContainer>
```

**Props**:
- `variant`: 猫咪颜色（british/orange/tuxedo/calico/white）
- `entryDirection`: 进入动画方向（bottom/left/right）
- `children`: 内容

## StickyHeader

**路径**: `src/components/layout/sticky-header.tsx`

滚动时出现的顶部导航栏。

**功能**:
- 默认隐藏，页面向下滚动300px后滑入
- 响应式：移动端显示图标，桌面端显示完整文字
- 包含页面标题和主要操作按钮

## PageTransition

**路径**: `src/components/layout/page-transition.tsx`

页面切换过渡动画。

**功能**:
- 页面进入/退出的淡入淡出效果
- 自动应用到所有路由

---

# 样式规范

## Neubrutalism核心规则

### 1. 边框和阴影

**✅ 必须**:
- 粗边框：`border-4 border-black`
- 硬投影：`shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`

**❌ 禁止**:
- 使用柔和阴影（blur）
- 使用细边框（<4px）

**示例**:
```tsx
<div className="
  border-4 border-black
  shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]
  bg-white
  p-6
">
  Content
</div>
```

### 2. 颜色系统

**主色调**（来自 `tailwind.config.ts`）:
- `bg-yellow-main` - 主背景色
- `bg-pink-accent` - 强调色
- `bg-blue-accent` - 次要强调色

**对比度**:
- 文字必须与背景有强烈对比
- 避免灰色，使用纯黑纯白

### 3. 动画规范

**推荐动画**:
- 弹跳效果：`transition-transform hover:translate-y-[-4px]`
- 摇晃效果：使用 `animate-wiggle`
- 页面进入：使用 Framer Motion

**❌ 禁止**:
- 过度动画（>500ms）
- 淡入淡出（不符合Neubrutalism风格）

---

# 国际化

## 使用next-intl

### 1. 在组件中使用

```tsx
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('MyPage');
  
  return <h1>{t('title')}</h1>;
}
```

### 2. 在服务端组件中

```tsx
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('MyPage');
  
  return <h1>{t('title')}</h1>;
}
```

### 3. 带参数的翻译

```json
// messages/en.json
{
  "welcome": "Welcome, {name}!"
}
```

```tsx
t('welcome', { name: 'John' })
// 输出: "Welcome, John!"
```

---

# 数据交互

## API配置

**环境变量** (`.env.local`):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_USE_MOCK=false
```

## Service Layer模式

**创建Service**:
```typescript
// src/services/baseService.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) throw new Error('API Error');
  return response.json();
}

export async function apiPost<T>(endpoint: string, data: any): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
}
```

**使用Service**:
```typescript
// src/services/newsService.ts
import { apiGet, apiPost } from './baseService';

export const newsService = {
  getList: () => apiGet('/news'),
  getDetail: (id: string) => apiGet(`/news/${id}`),
  create: (data: any) => apiPost('/news', data)
};
```

---

# 开发规则

## ✅ 必须遵守

1. **禁止硬编码文本**
   ```tsx
   // ❌ 错误
   <h1>关于我们</h1>
   
   // ✅ 正确
   <h1>{t('title')}</h1>
   ```

2. **禁止内联样式**
   ```tsx
   // ❌ 错误
   <div style={{ color: 'red' }}>Text</div>
   
   // ✅ 正确
   <div className="text-red-500">Text</div>
   ```

3. **使用Service层做API调用**
   ```tsx
   // ❌ 错误 - 组件内直接fetch
   useEffect(() => {
     fetch('/api/news').then(...)
   }, []);
   
   // ✅ 正确 - 使用Service
   const news = await newsService.getList();
   ```

4. **类型安全**
   ```typescript
   // ✅ 使用Zod验证
   import { z } from 'zod';
   
   const NewsSchema = z.object({
     id: z.number(),
     title: z.string(),
     content: z.string()
   });
   
   type News = z.infer<typeof NewsSchema>;
   ```

## ⭐ 推荐实践

1. **使用CatContainer包裹内容**
2. **为每个页面添加StickyHeader**
3. **使用Mock数据进行开发**
4. **遵循Neubrutalism设计规范**

## ❌ 严格禁止

1. ❌ 硬编码文本（必须i18n）
2. ❌ 直接在组件中fetch（必须用Service）
3. ❌ 使用any类型
4. ❌ 违反Neubrutalism风格（柔和阴影、细边框）

---

# 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 类型检查
npm run type-check

# Lint检查
npm run lint
```

---

# 图标使用

使用 **Lucide React**:

```tsx
import { Home, User, Settings } from 'lucide-react';

<Home size={24} />
<User className="text-pink-accent" />
<Settings strokeWidth={3} />
```

---

**Neubrutalism风格，大胆设计！** 🎨
