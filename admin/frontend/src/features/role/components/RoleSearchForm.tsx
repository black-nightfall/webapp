import React from 'react';
import { Input, Button, Space } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

interface RoleSearchFormProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
    onReset: () => void;
}

export const RoleSearchForm: React.FC<RoleSearchFormProps> = ({
    value,
    onChange,
    onSearch,
    onReset,
}) => {
    return (
        <Space style={{ marginBottom: 16 }}>
            <Input
                placeholder="按角色名搜索"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onPressEnter={onSearch}
                style={{ width: 200 }}
                allowClear
            />
            <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={onSearch}
            >
                搜索
            </Button>
            <Button
                icon={<ReloadOutlined />}
                onClick={onReset}
            >
                重置
            </Button>
        </Space>
    );
};
