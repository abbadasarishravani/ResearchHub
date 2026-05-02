import { Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth';

const suggestionSchema = z.object({
  type: z.enum(['BUG', 'PERFORMANCE', 'SECURITY', 'STYLE', 'BEST_PRACTICE', 'DOCUMENTATION']),
  content: z.string().min(1),
  lineNumbers: z.array(z.number()),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  codeReviewId: z.string(),
});

export const createSuggestion = async (req: AuthRequest, res: Response) => {
  try {
    const validatedData = suggestionSchema.parse(req.body);

    const codeReview = await prisma.codeReview.findFirst({
      where: { id: validatedData.codeReviewId, userId: req.userId },
    });

    if (!codeReview) {
      return res.status(404).json({ error: { message: 'Code review not found' } });
    }

    const suggestion = await prisma.suggestion.create({
      data: validatedData,
    });

    res.status(201).json(suggestion);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: { message: 'Validation error', details: error.issues } });
    }
    console.error('Create suggestion error:', error);
    res.status(500).json({ error: { message: 'Internal server error' } });
  }
};

export const getSuggestions = async (req: AuthRequest, res: Response) => {
  try {
    const { codeReviewId } = req.params;

    const suggestions = await prisma.suggestion.findMany({
      where: { codeReviewId: codeReviewId as string },
      orderBy: [{ severity: 'desc' }, { createdAt: 'desc' }],
    });

    res.json(suggestions);
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({ error: { message: 'Internal server error' } });
  }
};

export const updateSuggestion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = suggestionSchema.partial().parse(req.body);

    const suggestion = await prisma.suggestion.findFirst({
      where: { id: id as string },
      include: { codeReview: true },
    });

    if (!suggestion) {
      return res.status(404).json({ error: { message: 'Suggestion not found' } });
    }

    if (suggestion.codeReview.userId !== req.userId) {
      return res.status(403).json({ error: { message: 'Not authorized' } });
    }

    const updated = await prisma.suggestion.update({
      where: { id: id as string },
      data: validatedData,
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: { message: 'Validation error', details: error.issues } });
    }
    console.error('Update suggestion error:', error);
    res.status(500).json({ error: { message: 'Internal server error' } });
  }
};

export const deleteSuggestion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const suggestion = await prisma.suggestion.findFirst({
      where: { id: id as string },
      include: { codeReview: true },
    });

    if (!suggestion) {
      return res.status(404).json({ error: { message: 'Suggestion not found' } });
    }

    if (suggestion.codeReview.userId !== req.userId) {
      return res.status(403).json({ error: { message: 'Not authorized' } });
    }

    await prisma.suggestion.delete({ where: { id: id as string } });

    res.json({ message: 'Suggestion deleted successfully' });
  } catch (error) {
    console.error('Delete suggestion error:', error);
    res.status(500).json({ error: { message: 'Internal server error' } });
  }
};
