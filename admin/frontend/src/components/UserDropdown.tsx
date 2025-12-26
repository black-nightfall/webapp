import React from 'react';
import { Dropdown, Avatar, Space, type MenuProps } from 'antd';
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserDropdown: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const items: MenuProps['items'] = [
        {
            key: 'user-info',
            label: (
                <div style={{ padding: '8px 0' }}>
                    <div style={{ fontWeight: 500, fontSize: '14px' }}>{user?.username || 'User'}</div>
                    <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '4px' }}>
                        Administrator
                    </div>
                </div>
            ),
            disabled: true,
        },
        {
            type: 'divider',
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'Settings',
            onClick: () => {
                // TODO: Navigate to settings page
                console.log('Navigate to settings');
            },
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            danger: true,
            onClick: handleLogout,
        },
    ];

    return (
        <Dropdown menu={{ items }} placement="bottomRight" arrow>
            <Space style={{ cursor: 'pointer', padding: '8px 12px' }}>
                <Avatar
                    style={{ backgroundColor: '#1890ff' }}
                    icon={<UserOutlined />}
                    size="small"
                />
                <span style={{ fontSize: '14px' }}>{user?.username || 'User'}</span>
            </Space>
        </Dropdown>
    );
};

export default UserDropdown;
