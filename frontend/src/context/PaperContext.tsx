'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Paper } from '@/types';

interface PaperContextType {
  papers: Paper[];
  isLoading: boolean;
  createPaper: (paperData: Omit<Paper, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Paper;
  getPaperById: (id: string) => Paper | undefined;
  deletePaper: (id: string) => void;
  stats: {
    total: number;
    underReview: number;
    published: number;
  };
}

const PaperContext = createContext<PaperContextType | undefined>(undefined);

export function PaperProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      const storageKey = `papers_${user.email}`;
      const storedPapers = localStorage.getItem(storageKey);
      if (storedPapers) {
        try {
          setPapers(JSON.parse(storedPapers));
        } catch (e) {
          console.error('Failed to parse papers from localStorage');
          setPapers([]);
        }
      } else {
        setPapers([]);
      }
    } else {
      setPapers([]);
    }
    setIsLoading(false);
  }, [isAuthenticated, user]);

  const savePapers = (newPapers: Paper[]) => {
    if (user) {
      const storageKey = `papers_${user.email}`;
      localStorage.setItem(storageKey, JSON.stringify(newPapers));
      setPapers(newPapers);
    }
  };

  const createPaper = (paperData: Omit<Paper, 'id' | 'createdAt' | 'updatedAt' | 'author' | 'authorId' | 'views' | 'downloads' | 'tags'>) => {
    if (!user) throw new Error('User must be logged in to create a paper');

    const newPaper: Paper = {
      ...paperData,
      id: `paper_${Math.random().toString(36).substr(2, 9)}`,
      author: {
        id: user.email,
        name: user.name,
        email: user.email,
        role: (user.role.toLowerCase() as any),
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

  const getPaperById = (id: string) => {
    return papers.find((p) => p.id === id);
  };

  const deletePaper = (id: string) => {
    const updatedPapers = papers.filter((p) => p.id !== id);
    savePapers(updatedPapers);
  };

  const stats = {
    total: papers.length,
    underReview: papers.filter((p) => p.status === 'UNDER_REVIEW' || p.status === 'REVIEWED').length,
    published: papers.filter((p) => p.status === 'PUBLISHED').length,
  };

  return (
    <PaperContext.Provider
      value={{
        papers,
        isLoading,
        createPaper,
        getPaperById,
        deletePaper,
        stats,
      }}
    >
      {children}
    </PaperContext.Provider>
  );
}

export function usePapers() {
  const context = useContext(PaperContext);
  if (context === undefined) {
    throw new Error('usePapers must be used within a PaperProvider');
  }
  return context;
}
