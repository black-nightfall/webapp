import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Spin } from 'antd';
import type { RouteConfig, MenuItemConfig } from './types';
import { routes, protectedRoutes } from './config';
import ProtectedRoute from '../components/ProtectedRoute';

/**
 * 加载中的回退组件
 */
const LoadingFallback = () => (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" />
    </div>
);

/**
 * 包装懒加载组件
 */
const wrapLazy = (Component: any) => {
    // 如果是懒加载组件，使用 Suspense 包装
    if (Component && typeof Component === 'object' && '_payload' in Component) {
        return (
            <Suspense fallback={<LoadingFallback />}>
                <Component />
            </Suspense>
        );
    }
    // 否则直接返回
    return Component;
};

/**
 * 递归渲染路由
 */
const renderRoute = (route: RouteConfig) => {
    const { path, element, index, meta, children } = route;

    // 构建元素
    let routeElement = element ? wrapLazy(element) : null;

    // 如果需要认证，包装 ProtectedRoute
    if (meta?.requireAuth && routeElement) {
        routeElement = <ProtectedRoute>{routeElement}</ProtectedRoute>;
    }

    // 索引路由（不能有children）
    if (index) {
        return <Route key="index" index element={routeElement} />;
    }

    // 普通路由
    return (
        <Route key={path} path={path} element={routeElement}>
            {children && children.map((childRoute) => renderRoute(childRoute))}
        </Route>
    );
};

/**
 * 渲染所有路由
 */
export const renderRoutes = () => {
    return <Routes>{routes.map((route) => renderRoute(route))}</Routes>;
};

/**
 * 从路由配置生成菜单项
 */
const routeToMenuItem = (route: RouteConfig, parentPath = ''): MenuItemConfig | null => {
    const { path, index, meta, children } = route;

    // 隐藏的菜单项不显示
    if (meta?.hideInMenu) {
        return null;
    }

    // 如果是索引路由，使用父路径
    const menuKey = index ? parentPath : path;

    // 如果没有标题，不显示在菜单中
    if (!meta?.title) {
        return null;
    }

    const menuItem: MenuItemConfig = {
        key: menuKey || '/',
        label: meta.title,
        icon: meta.icon,
    };

    // 处理子菜单
    if (children && children.length > 0) {
        const childMenuItems = children
            .map((child) => routeToMenuItem(child, menuKey))
            .filter((item): item is MenuItemConfig => item !== null);

        if (childMenuItems.length > 0) {
            menuItem.children = childMenuItems;
        }
    }

    return menuItem;
};

/**
 * 获取菜单项配置
 */
export const getMenuItems = (): MenuItemConfig[] => {
    // 从受保护的路由中提取菜单项
    const layoutRoute = protectedRoutes.find((route) => route.path === '/');
    if (!layoutRoute || !layoutRoute.children) {
        return [];
    }

    // 转换并排序菜单项
    const menuItems = layoutRoute.children
        .map((route) => {
            // 为索引路由特殊处理
            if (route.index) {
                return routeToMenuItem({ ...route, path: '/' }, '');
            }
            return routeToMenuItem({ ...route, path: `/${route.path}` }, '');
        })
        .filter((item): item is MenuItemConfig => item !== null)
        .sort((a, b) => {
            // 根据 order 排序
            const orderA = layoutRoute.children?.find((r) =>
                r.index ? a.key === '/' : `/${r.path}` === a.key
            )?.meta?.order || 999;
            const orderB = layoutRoute.children?.find((r) =>
                r.index ? b.key === '/' : `/${r.path}` === b.key
            )?.meta?.order || 999;
            return orderA - orderB;
        });

    return menuItems;
};

export { routes, protectedRoutes };
export { publicRoutes } from './config';
export type { RouteConfig, MenuItemConfig };
