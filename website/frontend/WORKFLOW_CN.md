# 前端新页面开发工作流 (New Page Workflow)

本文档将指导你如何从零开始，在本项目中创建一个新的页面，并使其支持国际化和数据交互。

## 1. 创建页面路由 (Route & Page)

Next.js App Router 约定 `app/[locale]/` 下的文件夹结构对应 URL 路径。

**步骤:**

1.  在 `src/app/[locale]/` 下创建新文件夹，例如 `about`。
2.  在该文件夹内创建 `page.tsx`。

```tsx
// src/app/[locale]/about/page.tsx
import { useTranslations } from 'next-intl';
import { CatContainer } from '@/components/ui/cat-container'; // 核心容器组件

export default function AboutPage() {
  const t = useTranslations('AboutPage'); // 对应 messages/*.json 中的 Key

  return (
    <main className="min-h-screen p-8 bg-yellow-main">
       {/* entryDirection 控制进入动画方向: bottom | left | right */}
      <CatContainer variant="orange" entryDirection="bottom">
        <h1 className="text-4xl font-bold mb-4">{t('title')}</h1>
        <p>{t('description')}</p>
      </CatContainer>
    </main>
  );
}
```

---

## 2. 配置国际化 (Internationalization)

所有对用户显示的文本都必须放入翻译文件。

**步骤:**

1.  打开 `messages/en.json`，添加新的命名空间：
    ```json
    "AboutPage": {
        "title": "About Us",
        "description": "We love pets!"
    }
    ```
2.  打开 `messages/zh.json`，添加对应中文：
    ```json
    "AboutPage": {
        "title": "关于我们",
        "description": "我们超级爱宠物！"
    }
    ```

---

## 3. 数据交互层 (Service Strategy)

我们推荐使用 "Service Layer" 模式，方便在 Mock 数据和真实 API 之间切换，而不影响 UI 组件。

**步骤:**

1.  在 `src/features` 下创建你的功能模块，例如 `src/features/about/service.ts`。
2.  定义数据 Schema (推荐使用 [Zod](https://zod.dev/))。
3.  实现 Mock 逻辑。

**代码示例 (`service.ts`):**

```typescript
import { z } from "zod";

// 1. 定义数据结构
export const TeamMemberSchema = z.object({
    id: z.string(),
    name: z.string(),
    role: z.string(),
    avatar: z.string().url(),
});

export type TeamMember = z.infer<typeof TeamMemberSchema>;

// Mock 数据
const MOCK_MEMBERS: TeamMember[] = [
    { id: '1', name: 'Peigen', role: 'Dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Peigen' }
];

// 2. Service 实现
export const AboutService = {
    getTeamMembers: async (): Promise<TeamMember[]> => {
        // 模拟网络延迟
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        // 模式切换：一旦后端准备好，替换为真实的 fetch 调用
        // const res = await fetch('/api/about/members');
        // return await res.json();
        
        return MOCK_MEMBERS;
    }
};
```

**在组件中使用:**

可以使用 `React Use` 或 `TanStack Query` (当前项目已在 next-intl 中隐式使用，但也推荐直接在 Server Component 获取数据)。

*Server Component 示例:*

```tsx
// src/app/[locale]/about/page.tsx
import { AboutService } from '@/features/about/service';

export default async function AboutPage() {
  const members = await AboutService.getTeamMembers(); // 直接调用 async 函数

  return (
    // ... 渲染 members
  );
}
```

---

## 4. UI 组件与样式 (UI & Styling)

本项目使用 **Tailwind CSS** + **Neubrutalism** 风格。

**核心规范:**
- **容器**: 使用 `CatContainer` 包裹主要内容。
- **按钮**: 使用 `src/components/ui/button.tsx` 中的 `<Button>`.
- **边框**: 强调黑色粗边框 (`border-2` 或 `border-4` + `border-black`).
- **阴影**: 使用自定义硬阴影 `shadow-hard`。

**示例:**
```tsx
import { Button } from '@/components/ui/button';

<Button variant="primary" size="lg" className="shadow-hard">
  Contact Us
</Button>
```

---

## 5. 运行与验证 (Run & Verify)

1.  运行开发服务器:
    ```bash
    npm run dev
    ```
2.  访问页面:
    - 英文: `http://localhost:3000/en/about`
    - 中文: `http://localhost:3000/zh/about`

3.  验证:
    - 确认文本是否正确显示（未显示 key）。
    - 确认 Mock 数据是否加载。
    - 确认猫咪动画 (耳朵抖动) 是否正常。

---

## 6. ❌ 开发规范与禁止事项 (Rules & Prohibitions)

为了保持代码质量和风格统一，请严格遵守以下规则：

### 🚫 禁止 (Don'ts)

1.  **禁止硬编码文本 (No Hardcoded Text)**
    *   ❌ `<p>Hello World</p>`
    *   ✅ `<p>{t('hello')}</p>`
    *   **原因**: 必须支持中英双语切换。

2.  **禁止内联样式 (No Inline Styles)**
    *   ❌ `style={{ marginTop: '20px' }}`
    *   ✅ `className="mt-5"`
    *   **原因**: 保持 Tailwind 风格统一。

3.  **禁止在组件中直接调用 fetch (No Direct Fetch)**
    *   ❌ `useEffect(() => { fetch('/api/...') }, [])`
    *   ✅ `await NewsService.getLatestNews()`
    *   **原因**: 必须经过 Service 层，以便 Mock/Real 切换和统一错误处理。

4.  **禁止使用 TypeScript `any` (No Any)**
    *   ❌ `const data: any = ...`
    *   ✅ 使用 Zod Schema 定义类型。
    *   **原因**: 保证类型安全，运行时校验。

5.  **禁止随意修改全局 CSS (No Global CSS hacks)**
    *   ❌ 在组件中写 `.my-class { ... }`
    *   ✅ 使用 Tailwind Utility Classes。

### ✅ 必须 (Dos)

*   **必须** 使用 `CatContainer` 包裹主要内容区域。
*   **必须** 为所有边框添加 `border-black` 和 `border-2/4`。
*   **必须** 保持 "Neubrutalism" 风格（高对比度、硬阴影、粗边框）。
