// Mock current user
export const mockCurrentUser = {
    id: 'user-1',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@research.edu',
    role: 'researcher',
    bio: 'AI researcher focusing on natural language processing and machine learning applications.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    createdAt: new Date('2023-01-15'),
};
// Mock users
export const mockUsers = [
    mockCurrentUser,
    {
        id: 'user-2',
        name: 'Prof. James Wilson',
        email: 'j.wilson@research.edu',
        role: 'reviewer',
        bio: 'Senior researcher in machine learning and deep learning.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
        createdAt: new Date('2022-06-20'),
    },
    {
        id: 'user-3',
        name: 'Dr. Priya Patel',
        email: 'priya.patel@research.edu',
        role: 'admin',
        bio: 'Platform administrator and research director.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
        createdAt: new Date('2022-01-01'),
    },
    {
        id: 'user-4',
        name: 'Dr. Alex Kumar',
        email: 'alex.kumar@research.edu',
        role: 'researcher',
        bio: 'Specialist in computer vision and neural networks.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        createdAt: new Date('2023-03-10'),
    },
];
// Mock papers
export const mockPapers = [
    {
        id: 'paper-1',
        title: 'Transformer-Based Architectures for Long Document Understanding',
        abstract: 'This paper explores advanced transformer architectures specifically designed for processing and understanding lengthy documents. We introduce a novel attention mechanism that efficiently handles context windows exceeding 32K tokens while maintaining computational efficiency.',
        content: `## Introduction
Long document processing has been a challenging problem in NLP. Traditional transformer models struggle with the quadratic complexity of self-attention mechanisms when dealing with extended sequences.

## Methodology
We propose a hierarchical attention mechanism that:
1. Segments documents into coherent chunks
2. Applies local attention within chunks
3. Uses global attention for inter-chunk relationships

## Results
Our model achieves state-of-the-art performance on long document benchmarks, with 23% improvement in accuracy over existing methods while reducing computational requirements by 40%.

## Conclusion
This work opens new possibilities for processing large-scale documents in real-world applications.`,
        author: mockUsers[0],
        authorId: 'user-1',
        status: 'accepted',
        category: 'nlp',
        tags: ['transformers', 'nlp', 'attention-mechanism', 'deep-learning'],
        createdAt: new Date('2024-08-15'),
        updatedAt: new Date('2024-10-01'),
        views: 1240,
        downloads: 385,
    },
    {
        id: 'paper-2',
        title: 'Efficient Vision-Language Models Through Knowledge Distillation',
        abstract: 'We present a novel knowledge distillation approach for creating efficient vision-language models that maintain high performance while reducing computational overhead by 60%. Our method combines feature-level and response-level distillation.',
        content: `## Introduction
Vision-language models have shown remarkable capabilities but are often too large for deployment on edge devices. This work addresses this limitation through efficient distillation.

## Proposed Approach
Our two-stage distillation process:
- Stage 1: Feature alignment between student and teacher models
- Stage 2: Task-specific knowledge transfer

## Experiments
Tested on COCO, Flickr30K, and custom datasets. Achieved 95% of teacher model performance with 60% fewer parameters.`,
        author: mockUsers[1],
        authorId: 'user-2',
        status: 'under-review',
        category: 'cv',
        tags: ['vision-language', 'distillation', 'efficiency', 'multimodal'],
        createdAt: new Date('2024-10-05'),
        updatedAt: new Date('2024-11-10'),
        views: 856,
        downloads: 234,
    },
    {
        id: 'paper-3',
        title: 'Federated Learning for Privacy-Preserving ML Models',
        abstract: 'A comprehensive framework for implementing federated learning in production environments. We address communication efficiency, model convergence, and privacy guarantees across distributed datasets.',
        content: `## Overview
Federated learning enables training on decentralized data without centralizing sensitive information.

## Key Contributions
1. Adaptive compression for communication-efficient updates
2. Novel aggregation algorithms for non-IID data
3. Privacy certification framework

## Results
Successfully deployed across 50 edge devices with 92% communication reduction compared to standard federated learning approaches.`,
        author: mockUsers[3],
        authorId: 'user-4',
        status: 'submitted',
        category: 'ml',
        tags: ['federated-learning', 'privacy', 'distributed', 'optimization'],
        createdAt: new Date('2024-11-01'),
        updatedAt: new Date('2024-11-15'),
        views: 612,
        downloads: 156,
    },
    {
        id: 'paper-4',
        title: 'Graph Neural Networks for Recommendation Systems',
        abstract: 'Novel GNN architecture for personalized recommendations. Our approach leverages user-item interaction graphs to generate highly relevant suggestions with improved cold-start performance.',
        content: `## Introduction
Recommendation systems are critical for modern e-commerce and content platforms. Traditional collaborative filtering approaches struggle with sparse interaction matrices.

## Our Contribution
A novel GNN architecture that:
- Models complex user-item relationships
- Handles temporal dynamics
- Improves cold-start recommendations by 35%

## Evaluation
Tested on MovieLens-1M and Netflix datasets, outperforming existing methods by 18% in NDCG@10.`,
        author: mockUsers[0],
        authorId: 'user-1',
        status: 'draft',
        category: 'ai',
        tags: ['graph-neural-networks', 'recommendations', 'collaborative-filtering'],
        createdAt: new Date('2024-11-18'),
        updatedAt: new Date('2024-11-20'),
        views: 234,
        downloads: 45,
    },
    {
        id: 'paper-5',
        title: 'Explainable AI for Medical Diagnosis Systems',
        abstract: 'An interpretability framework for deep learning models in healthcare. We develop methods to explain model predictions in clinical contexts, improving trust and adoption among medical professionals.',
        content: `## Motivation
Medical AI systems must be interpretable for clinical acceptance and regulatory compliance.

## Methodology
Multi-level explanation approach:
- Layer-wise relevance propagation
- Counterfactual explanations
- Human-readable decision trees

## Clinical Validation
Validated with radiologists and cardiologists. Improved model trust scores from 62% to 89%.`,
        author: mockUsers[1],
        authorId: 'user-2',
        status: 'accepted',
        category: 'ai',
        tags: ['explainable-ai', 'healthcare', 'interpretability', 'deep-learning'],
        createdAt: new Date('2024-09-20'),
        updatedAt: new Date('2024-10-25'),
        views: 1856,
        downloads: 512,
    },
    {
        id: 'paper-6',
        title: 'Real-Time Object Detection on Mobile Devices',
        abstract: 'Optimized YOLO-based architecture for mobile inference. Achieves 30fps on modern smartphones with 92% accuracy retention compared to desktop versions.',
        content: `## Challenge
Real-time object detection on mobile devices requires extreme efficiency without sacrificing accuracy.

## Solution
- Quantization-aware training
- Architecture pruning
- Optimized inference pipeline

## Performance
Achieves 30fps on Snapdragon 888 with only 89MB model size.`,
        author: mockUsers[3],
        authorId: 'user-4',
        status: 'under-review',
        category: 'cv',
        tags: ['object-detection', 'mobile', 'optimization', 'edge-computing'],
        createdAt: new Date('2024-10-30'),
        updatedAt: new Date('2024-11-12'),
        views: 945,
        downloads: 289,
    },
];
// Mock reviews
export const mockReviews = [
    {
        id: 'review-1',
        paperId: 'paper-1',
        paper: mockPapers[0],
        reviewer: mockUsers[1],
        reviewerId: 'user-2',
        rating: 5,
        comments: 'Excellent work on addressing the long document problem. The hierarchical attention mechanism is novel and well-executed. Clear improvement over existing methods. Minor suggestions: Consider discussing computational complexity in more detail.',
        recommendation: 'accept',
        createdAt: new Date('2024-09-28'),
    },
    {
        id: 'review-2',
        paperId: 'paper-2',
        paper: mockPapers[1],
        reviewer: mockUsers[0],
        reviewerId: 'user-1',
        rating: 4,
        comments: 'Strong work on knowledge distillation for vision-language models. The two-stage approach is intuitive. Would like to see more analysis on what knowledge is preserved vs. lost during distillation.',
        recommendation: 'revision-needed',
        createdAt: new Date('2024-11-08'),
    },
    {
        id: 'review-3',
        paperId: 'paper-5',
        paper: mockPapers[4],
        reviewer: mockUsers[2],
        reviewerId: 'user-3',
        rating: 5,
        comments: 'Outstanding contribution to explainable AI in healthcare. The clinical validation is particularly impressive. This work will have significant real-world impact.',
        recommendation: 'accept',
        createdAt: new Date('2024-10-22'),
    },
];
// Mock activities
export const mockActivities = [
    {
        id: 'activity-1',
        type: 'paper-created',
        userId: 'user-1',
        paperId: 'paper-1',
        description: 'Created new paper: Transformer-Based Architectures for Long Document Understanding',
        createdAt: new Date('2024-08-15'),
    },
    {
        id: 'activity-2',
        type: 'paper-submitted',
        userId: 'user-1',
        paperId: 'paper-1',
        description: 'Submitted paper for review',
        createdAt: new Date('2024-08-20'),
    },
    {
        id: 'activity-3',
        type: 'review-submitted',
        userId: 'user-2',
        paperId: 'paper-1',
        description: 'Submitted review for: Transformer-Based Architectures for Long Document Understanding',
        createdAt: new Date('2024-09-28'),
    },
    {
        id: 'activity-4',
        type: 'paper-accepted',
        userId: 'user-1',
        paperId: 'paper-1',
        description: 'Your paper was accepted: Transformer-Based Architectures for Long Document Understanding',
        createdAt: new Date('2024-10-01'),
    },
    {
        id: 'activity-5',
        type: 'paper-created',
        userId: 'user-1',
        paperId: 'paper-4',
        description: 'Created new paper: Graph Neural Networks for Recommendation Systems',
        createdAt: new Date('2024-11-18'),
    },
];
// Stats for dashboard
export const mockStats = {
    totalPapers: 42,
    papersUnderReview: 8,
    reviewsGiven: 12,
    acceptanceRate: 65,
};
