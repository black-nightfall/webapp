import React, { useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import {
    UserOutlined,
    ShoppingOutlined,
    DashboardOutlined,
    OrderedListOutlined,
    SafetyCertificateOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import UserDropdown from '../components/UserDropdown';

const { Header, Content, Footer, Sider } = Layout;

const AppLayout: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const navigate = useNavigate();
    const location = useLocation();

    const items = [
        {
            key: '/',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/users',
            icon: <UserOutlined />,
            label: 'Users',
        },
        {
            key: '/roles',
            icon: <SafetyCertificateOutlined />,
            label: 'Roles',
        },
        {
            key: '/products',
            icon: <ShoppingOutlined />,
            label: 'Products',
        },
        {
            key: '/orders',
            icon: <OrderedListOutlined />,
            label: 'Orders',
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
                <Menu
                    theme="dark"
                    defaultSelectedKeys={['/']}
                    selectedKeys={[location.pathname]}
                    mode="inline"
                    items={items}
                    onClick={(e) => navigate(e.key)}
                />
            </Sider>
            <Layout style={{ flex: 1 }}>
                <Header style={{
                    padding: '0 24px',
                    background: colorBgContainer,
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    boxShadow: '0 1px 4px rgba(0,21,41,.08)'
                }}>
                    <UserDropdown />
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                            marginTop: 16
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Admin Panel ©{new Date().getFullYear()} Created with Ant Design
                </Footer>
            </Layout>
        </Layout>
    );
};

export default AppLayout;
