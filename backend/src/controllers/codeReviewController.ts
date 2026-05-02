import { Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';
import { analyzeCode } from '../services/aiService';

const codeReviewSchema = z.object({
  title: z.string().min(1),
  codeSnippet: z.string().min(1),
  language: z.string(),
  repositoryId: z.string(),
});

export const createCodeReview = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = codeReviewSchema.parse(req.body);

    const repository = await prisma.repository.findFirst({
      where: { id: validatedData.repositoryId, userId: req.userId },
    });

    if (!repository) {
      return res.status(404).json({ error: { message: 'Repository not found' } });
    }

    // Perform AI analysis
    const aiAnalysis = await analyzeCode(validatedData.codeSnippet, validatedData.language);

    const codeReview = await prisma.codeReview.create({
      data: {
        ...validatedData,
        userId: req.userId!,
        aiAnalysis: aiAnalysis as any,
        suggestions: {
          create: aiAnalysis.suggestions.map((s: any) => ({
            type: s.type,
            content: s.content,
            lineNumbers: s.lineNumbers,
            severity: s.severity,
          })),
        },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        repository: { select: { id: true, name: true } },
        suggestions: true,
      },
    });

    res.status(201).json(codeReview);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: { message: 'Validation error', details: error.issues } });
    }
    console.error('Create code review error:', error);
    res.status(500).json({ error: { message: 'Internal server error' } });
  }
};

export const getCodeReviews = async (req: AuthRequest, res: Response) => {
  try {
    const { repositoryId } = req.query;

    const where: any = { userId: req.userId };
    if (repositoryId) {
      where.repositoryId = repositoryId as string;
    }

    const codeReviews = await prisma.codeReview.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
        repository: { select: { id: true, name: true } },
        comments: { include: { user: { select: { id: true, name: true } } } },
        suggestions: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(codeReviews);
  } catch (error) {
    console.error('Get code reviews error:', error);
    res.status(500).json({ error: { message: 'Internal server error' } });
  }
};

export const getCodeReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const codeReview = await prisma.codeReview.findFirst({
      where: { id: id as string, userId: req.userId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        repository: { select: { id: true, name: true, url: true } },
        comments: { include: { user: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' } },
        suggestions: { orderBy: { severity: 'desc' } },
      },
    });

    if (!codeReview) {
      return res.status(404).json({ error: { message: 'Code review not found' } });
    }

    res.json(codeReview);
  } catch (error) {
    console.error('Get code review error:', error);
    res.status(500).json({ error: { message: 'Internal server error' } });
  }
};

export const updateCodeReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = codeReviewSchema.partial().parse(req.body);

    const codeReview = await prisma.codeReview.findFirst({
      where: { id: id as string, userId: req.userId },
    });

    if (!codeReview) {
      return res.status(404).json({ error: { message: 'Code review not found' } });
    }

    const updated = await prisma.codeReview.update({
      where: { id: id as string },
      data: validatedData,
      include: {
        user: { select: { id: true, name: true, email: true } },
        repository: { select: { id: true, name: true } },
      },
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: { message: 'Validation error', details: error.issues } });
    }
    console.error('Update code review error:', error);
    res.status(500).json({ error: { message: 'Internal server error' } });
  }
};

export const updateCodeReviewStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ error: { message: 'Invalid status' } });
    }

    const codeReview = await prisma.codeReview.findFirst({
      where: { id: id as string, userId: req.userId },
    });

    if (!codeReview) {
      return res.status(404).json({ error: { message: 'Code review not found' } });
    }

    const updated = await prisma.codeReview.update({
      where: { id: id as string },
      data: { status },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update code review status error:', error);
    res.status(500).json({ error: { message: 'Internal server error' } });
  }
};

export const deleteCodeReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const codeReview = await prisma.codeReview.findFirst({
      where: { id: id as string, userId: req.userId },
    });

    if (!codeReview) {
      return res.status(404).json({ error: { message: 'Code review not found' } });
    }

    await prisma.codeReview.delete({ where: { id: id as string } });

    res.json({ message: 'Code review deleted successfully' });
  } catch (error) {
    console.error('Delete code review error:', error);
    res.status(500).json({ error: { message: 'Internal server error' } });
  }
};
