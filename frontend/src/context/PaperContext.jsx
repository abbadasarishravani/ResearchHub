'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const PaperContext = createContext(undefined);

export function PaperProvider({ children }) {
    const { user, isAuthenticated, API_URL } = useAuth();
    const [papers, setPapers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPapers = async () => {
        if (!isAuthenticated) return;
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/api/repositories`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                // Map backend fields to frontend fields
                const mappedPapers = data.map(repo => ({
                    id: repo.id,
                    title: repo.name,
                    abstract: repo.description || '',
                    content: repo.content || '', // Handle content if exists
                    category: repo.language,
                    status: 'accepted',
                    createdAt: repo.createdAt,
                    tags: repo.tags || [],
                    views: Math.floor(Math.random() * 100), // Random for demo
                    downloads: Math.floor(Math.random() * 50), // Random for demo
                    author: {
                        name: user?.name || 'Researcher'
                    }
                }));
                setPapers(mappedPapers);
            }
        } catch (error) {
            console.error('Failed to fetch papers:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated && API_URL) {
            fetchPapers();
        } else if (!isAuthenticated) {
            setPapers([]);
            setIsLoading(false);
        }
    }, [isAuthenticated, API_URL]);

    const createPaper = async (paperData) => {
        if (!user) throw new Error('User must be logged in to create a paper');
        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch(`${API_URL}/api/repositories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: paperData.title,
                    description: paperData.abstract,
                    url: `https://researchhub.com/papers/${Date.now()}`,
                    language: paperData.category || 'ai'
                })
            });

            if (response.ok) {
                const repo = await response.json();
                const newPaper = {
                    id: repo.id,
                    title: repo.name,
                    abstract: repo.description,
                    content: paperData.content,
                    category: repo.language,
                    status: 'accepted',
                    createdAt: repo.createdAt,
                    tags: [],
                    views: 0,
                    downloads: 0,
                    author: {
                        name: user.name
                    }
                };
                setPapers(prev => [newPaper, ...prev]);
                return newPaper;
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to create paper');
            }
        } catch (error) {
            console.error('Create paper error:', error);
            throw error;
        }
    };

    const deletePaper = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/api/repositories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setPapers(prev => prev.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error('Delete paper error:', error);
        }
    };

    const getPaperById = (id) => {
        return papers.find((p) => p.id === id);
    };

    const stats = {
        total: papers.length,
        underReview: papers.filter((p) => p.status === 'under-review' || p.status === 'submitted').length,
        published: papers.filter((p) => p.status === 'accepted').length,
    };

    return (<PaperContext.Provider value={{
            papers,
            isLoading,
            createPaper,
            getPaperById,
            deletePaper,
            stats,
            refreshPapers: fetchPapers
        }}>
      {children}
    </PaperContext.Provider>);
}

export function usePapers() {
    const context = useContext(PaperContext);
    if (context === undefined) {
        throw new Error('usePapers must be used within a PaperProvider');
    }
    return context;
}
