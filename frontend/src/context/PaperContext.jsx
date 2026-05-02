'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
const PaperContext = createContext(undefined);
export function PaperProvider({ children }) {
    const { user, isAuthenticated } = useAuth();
    const [papers, setPapers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        if (isAuthenticated && user) {
            const storageKey = `papers_${user.email}`;
            const storedPapers = localStorage.getItem(storageKey);
            if (storedPapers) {
                try {
                    setPapers(JSON.parse(storedPapers));
                }
                catch (e) {
                    console.error('Failed to parse papers from localStorage');
                    setPapers([]);
                }
            }
            else {
                setPapers([]);
            }
        }
        else {
            setPapers([]);
        }
        setIsLoading(false);
    }, [isAuthenticated, user]);
    const savePapers = (newPapers) => {
        if (user) {
            const storageKey = `papers_${user.email}`;
            localStorage.setItem(storageKey, JSON.stringify(newPapers));
            setPapers(newPapers);
        }
    };
    const createPaper = (paperData) => {
        if (!user)
            throw new Error('User must be logged in to create a paper');
        const newPaper = {
            ...paperData,
            id: `paper_${Math.random().toString(36).substr(2, 9)}`,
            author: {
                id: user.email,
                name: user.name,
                email: user.email,
                role: user.role.toLowerCase(),
                createdAt: new Date(),
            },
            authorId: user.email,
            tags: [],
            views: 0,
            downloads: 0,
            status: 'draft',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const updatedPapers = [newPaper, ...papers];
        savePapers(updatedPapers);
        return newPaper;
    };
    const getPaperById = (id) => {
        return papers.find((p) => p.id === id);
    };
    const deletePaper = (id) => {
        const updatedPapers = papers.filter((p) => p.id !== id);
        savePapers(updatedPapers);
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
