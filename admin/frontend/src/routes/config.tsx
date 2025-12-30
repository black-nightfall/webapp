import { lazy } from 'react';
import {
    DashboardOutlined,
    UserOutlined,
    SafetyCertificateOutlined,
} from '@ant-design/icons';
import type { RouteConfig } from './types';
import Login from '../pages/Login';
import AppLayout from '../layouts/AppLayout';

/**
 * 公共路由配置（无需认证）
 */
export const publicRoutes: RouteConfig[] = [
    {
        path: '/login',
        element: <Login />,
        meta: {
            title: '登录',
            hideInMenu: true,
        },
    },
];

/**
 * 受保护的路由配置（需要认证）
 */
export const protectedRoutes: RouteConfig[] = [
    {
        path: '/',
        element: <AppLayout />,
        meta: {
            requireAuth: true,
        },
        children: [
            {
                path: '',
                index: true,
                element: lazy(() => import('../pages/Dashboard')),
                meta: {
                    title: 'Dashboard',
                    icon: <DashboardOutlined />,
                    order: 1,
                },
            },
            {
                path: 'users',
                element: lazy(() => import('../pages/UsersPage')),
                meta: {
                    title: '用户管理',
                    icon: <UserOutlined />,
                    order: 2,
                },
            },
            {
                path: 'roles',
                element: lazy(() => import('../pages/RolesPage')),
                meta: {
                    title: '角色管理',
                    icon: <SafetyCertificateOutlined />,
                    order: 3,
                },
            },
        ],
    },
];

/**
 * 所有路由配置
 */
export const routes: RouteConfig[] = [...publicRoutes, ...protectedRoutes];
