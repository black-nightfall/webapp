import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Login: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const onFinish = async (values: { username: string; password: string }) => {
        setLoading(true);
        try {
            await login(values.username, values.password);
            message.success(t('message.success'));
            navigate('/');
        } catch (error) {
            message.error(t('login.placeholder.password') || 'Invalid credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#f0f2f5'
        }}>
            <Card
                title={t('login.title')}
                style={{ width: 400 }}
                extra={<LanguageSwitcher />}
            >
                <Form
                    name="login"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: t('login.placeholder.username') }]}
                    >
                        <Input
                            prefix={<UserOutlined />}
                            placeholder={t('login.placeholder.username')}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: t('login.placeholder.password') }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder={t('login.placeholder.password')}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            {t('login.loginButton')}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default Login;
