import React, { useEffect, useState } from 'react';
import { Modal, Tree, Spin, message } from 'antd';
import type { DataNode } from 'antd/es/tree';
import type { Menu } from '../types';
import { roleApi } from '../../../services/roleApi';
import { menuApi } from '../../../services/menuApi';

interface RolePermissionModalProps {
    visible: boolean;
    roleId: number | null;
    roleName?: string;
    onCancel: () => void;
    onSuccess: () => void;
}

const RolePermissionModal: React.FC<RolePermissionModalProps> = ({
    visible,
    roleId,
    roleName,
    onCancel,
    onSuccess,
}) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [treeData, setTreeData] = useState<DataNode[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

    // 将Menu转换为TreeNode
    const convertMenuToTreeNode = (menus: Menu[]): DataNode[] => {
        return menus.map(menu => ({
            title: menu.title,
            key: menu.id,
            children: menu.children ? convertMenuToTreeNode(menu.children) : undefined,
        }));
    };

    // 提取所有菜单ID（用于展开）
    const extractAllKeys = (menus: Menu[]): number[] => {
        const keys: number[] = [];
        const extract = (items: Menu[]) => {
            items.forEach(item => {
                keys.push(item.id);
                if (item.children) {
                    extract(item.children);
                }
            });
        };
        extract(menus);
        return keys;
    };

    // 加载菜单树和角色权限
    useEffect(() => {
        if (visible && roleId) {
            loadData();
        }
    }, [visible, roleId]);

    const loadData = async () => {
        setLoading(true);
        try {
            // 并行加载菜单树和角色权限
            const [menuTree, rolePermissions] = await Promise.all([
                menuApi.getMenuTree(),
                roleApi.getRolePermissions(roleId!),
            ]);

            const treeNodes = convertMenuToTreeNode(menuTree);
            setTreeData(treeNodes);

            // 设置已选中的菜单keys
            const checkedMenuIds = rolePermissions.map(menu => menu.id);
            setCheckedKeys(checkedMenuIds);

            // 默认展开所有节点
            const allKeys = extractAllKeys(menuTree);
            setExpandedKeys(allKeys);
        } catch (error) {
            message.error('加载菜单数据失败');
            console.error('Error loading menu data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!roleId) return;

        setSaving(true);
        try {
            const menuIds = checkedKeys.map(key => Number(key));
            await roleApi.assignPermissions(roleId, { menuIds });
            message.success('权限分配成功');
            onSuccess();
        } catch (error) {
            message.error('权限分配失败');
            console.error('Error assigning permissions:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setCheckedKeys([]);
        setExpandedKeys([]);
        onCancel();
    };

    return (
        <Modal
            title={`分配权限${roleName ? ` - ${roleName}` : ''}`}
            open={visible}
            onOk={handleSave}
            onCancel={handleCancel}
            confirmLoading={saving}
            width={600}
            destroyOnClose
        >
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Spin tip="加载中..." />
                </div>
            ) : (
                <Tree
                    checkable
                    treeData={treeData}
                    checkedKeys={checkedKeys}
                    onCheck={(checked) => {
                        setCheckedKeys(checked as React.Key[]);
                    }}
                    expandedKeys={expandedKeys}
                    onExpand={(expanded) => {
                        setExpandedKeys(expanded);
                    }}
                    style={{ marginTop: 16 }}
                />
            )}
        </Modal>
    );
};

export default RolePermissionModal;
