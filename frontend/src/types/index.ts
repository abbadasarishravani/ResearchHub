// User types
export type UserRole = 'researcher' | 'reviewer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio?: string;
  avatar?: string;
  createdAt: Date;
}

// Paper types
export type PaperStatus = 'draft' | 'submitted' | 'under-review' | 'accepted' | 'rejected';
export type PaperCategory = 'ai' | 'ml' | 'nlp' | 'cv' | 'data-science' | 'other';

export interface Paper {
  id: string;
  title: string;
  abstract: string;
  content: string;
  author: User;
  authorId: string;
  status: PaperStatus;
  category: PaperCategory;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  views: number;
  downloads: number;
}

// Review types
export type ReviewRecommendation = 'accept' | 'reject' | 'revision-needed';

export interface Review {
  id: string;
  paperId: string;
  paper: Paper;
  reviewer: User;
  reviewerId: string;
  rating: number; // 1-5
  comments: string;
  recommendation: ReviewRecommendation;
  createdAt: Date;
}

// Activity types
export type ActivityType = 'paper-created' | 'paper-submitted' | 'review-submitted' | 'paper-accepted' | 'paper-rejected';

export interface Activity {
  id: string;
  type: ActivityType;
  userId: string;
  paperId?: string;
  description: string;
  createdAt: Date;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: UserRole;
}
