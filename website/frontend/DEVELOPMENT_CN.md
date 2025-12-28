# 前端开发指南 (Frontend Development Guide)

这份文档旨在帮助你理解和开发 "Cute Pet News" (萌宠新闻) 网站的前端部分。

## 1. 项目概览

本项目是一个基于 Neubrutalism (新粗野主义) 设计风格的 Next.js 网站。核心特色是高对比度的视觉效果和丰富的交互动画（特别是猫咪主题元素）。

### 技术栈
- **框架**: [Next.js 15](https://nextjs.org/) (App Router)
- **样式**: [Tailwind CSS](https://tailwindcss.com/)
- **国际化**: [next-intl](https://next-intl-docs.vercel.app/)
- **动画**: [Framer Motion](https://www.framer.com/motion/)
- **图标**: [Lucide React](https://lucide.dev/)
- **表单**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)

---

## 2. 核心组件 (Core Components)

### `CatContainer`
**路径**: `src/components/ui/cat-container.tsx`

这是项目中最核心的视觉组件，用于包裹内容框，并附带动态的猫咪耳朵和胡须。

- **功能**:
  - 提供多种猫咪变体 (`british`, `orange`, `tuxedo`, `calico`, `white`)。
  - 支持页面进入动画 (`entryDirection`).
  - **交互**:
    - **Idle**: 耳朵会每隔 2 秒间歇性抖动 (Wiggle)，提示用户可交互。
    - **Hover**: 鼠标悬停时，抖动停止，耳朵会根据位置向外侧弹跳和旋转。
- **使用示例**:
  ```tsx
  <CatContainer variant="orange" entryDirection="bottom">
    <h1>Your Content Here</h1>
  </CatContainer>
  ```

### `StickyHeader`
**路径**: `src/components/layout/sticky-header.tsx`

滚动时出现的顶部导航栏。

- **功能**:
  - 默认隐藏，页面向下滚动 300px 后滑入。
  - **响应式**: 移动端 "Back Home" 按钮仅显示图标，桌面端显示完整文字。
  - 包含页面标题和主要操作按钮（如 "发布新闻"）。

### `PageTransition`
**路径**: `src/components/layout/page-transition.tsx`

负责页面切换时的平滑过渡动画。根据页面层级不同，可以配置从左、右或底部滑入。

---

## 3. 样式指南 (Styling Guide)

本项目严格遵循 **Neubrutalism** 风格：

1.  **边框**: 所有主要容器必须有 `border-4 border-black`。
2.  **阴影**: 使用硬阴影 `shadow-hard` (即 `4px 4px 0px 0px black`)，没有模糊。
3.  **圆角**: 
    - 按钮通常使用 `rounded-xl` 或 `rounded-lg`。
    - 大容器使用 `rounded-[3rem]`。
4.  **动效**: 按钮和卡片在 Hover 时通常有位移效果 (`translate-x-[2px] translate-y-[2px]`) 模拟按压感。

**CSS 变量**:
定义在 `src/app/globals.css` 中，包含自定义的阴影和配色类。

---

## 4. 国际化 (Internationalization - i18n)

使用 `next-intl` 进行多语言支持 (中/英)。

- **路由**: 默认路径为 `/[locale]/...` (如 `/en/news`, `/zh/news`)。
- **翻译文件**:
  - `messages/en.json`: 英文源文件。
  - `messages/zh.json`: 中文源文件。
- **添加新词条**: 务必同时在两个文件中添加相同的 Key。

---

## 5. 开发常用命令 (Commands)

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行 Lint 检查
npm run lint
```

## 6. icon使用规范

使用 `lucide-react` 图标库。
请确保图标大小适中 (通常 `w-5 h-5` 或 `w-6 h-6`)，并根据上下文调整颜色。

---

## 7. 更新日志 (Recent Updates)

- **移动端优化**: 修复了 Sticky Header 在手机上按钮文字过长的问题，改为图标显示。
- **动画增强**: `CatContainer` 耳朵增加了待机抖动动画，并修复了 Hover 时动画冲突的问题（使用了 Framer Motion variants 隔离状态）。
