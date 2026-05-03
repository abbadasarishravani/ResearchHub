'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://researchhub-nyui.onrender.com';

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch(`${API_URL}/api/auth/profile`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const userData = await response.json();
                        setUser(userData);
                    } else {
                        logout();
                    }
                } catch (error) {
                    console.error('Failed to fetch profile:', error);
                }
            }
            setIsLoading(false);
        };
        checkAuth();
    }, [API_URL]);

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
        if (token) {
            localStorage.setItem('token', token);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('token');
        router.push('/');
    };

    const updateProfile = async (userData) => {
        if (user) {
            const updatedUser = { ...user, ...userData };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
        }
    };

    return (<AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            logout,
            updateProfile,
            isLoading,
            API_URL
        }}>
      {children}
    </AuthContext.Provider>);
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
