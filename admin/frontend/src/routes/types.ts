import type { ReactNode, LazyExoticComponent, ComponentType } from 'react';

/**
 * 路由元数据配置
 */
export interface RouteMetadata {
    /** 页面标题 */
    title?: string;
    /** 菜单图标 */
    icon?: ReactNode;
    /** 是否需要认证 */
    requireAuth?: boolean;
    /** 允许访问的角色 */
    roles?: string[];
    /** 是否在菜单中隐藏 */
    hideInMenu?: boolean;
    /** 是否在面包屑中隐藏 */
    hideInBreadcrumb?: boolean;
    /** 排序权重，数字越小越靠前 */
    order?: number;
}

/**
 * 路由配置
 */
export interface RouteConfig {
    /** 路由路径 */
    path: string;
    /** 路由组件（支持懒加载） */
    element?: ReactNode | LazyExoticComponent<ComponentType<any>>;
    /** 索引路由标识 */
    index?: boolean;
    /** 路由元数据 */
    meta?: RouteMetadata;
    /** 子路由 */
    children?: RouteConfig[];
}

/**
 * 菜单项配置（兼容 Ant Design Menu）
 */
export interface MenuItemConfig {
    key: string;
    icon?: ReactNode;
    label: string;
    children?: MenuItemConfig[];
    type?: 'group' | 'divider';
    disabled?: boolean;
}
