import React, { createContext, useState, useContext, type ReactNode } from 'react';
import api from '../services/api';

interface User {
    username: string;
    token: string;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to validate JWT token expiration
const isTokenValid = (token: string): boolean => {
    try {
        // Basic JWT structure validation
        const parts = token.split('.');
        if (parts.length !== 3) return false;

        // For now, we'll just check if token exists
        // In production, decode and check expiration
        return !!token;
    } catch {
        return false;
    }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('user');
        if (!saved) return null;

        try {
            const userData = JSON.parse(saved);
            // Validate token before restoring session
            if (userData.token && isTokenValid(userData.token)) {
                return userData;
            }
        } catch (error) {
            console.error('Failed to restore user session:', error);
        }

        // Clear invalid session data
        localStorage.removeItem('user');
        return null;
    });

    const login = async (username: string, password: string) => {
        const data = await api.post<{ token: string; username: string }>(
            '/auth/login',
            { username, password }
        );

        const userData = { username: data.username, token: data.token };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
