import { z } from 'zod';
import prisma from '../utils/prisma.js';

const commentSchema = z.object({
  content: z.string().min(1),
  codeReviewId: z.string(),
});

export const createComment = async (req, res) => {
  try {
    const validatedData = commentSchema.parse(req.body);

    const codeReview = await prisma.codeReview.findFirst({
      where: { id: validatedData.codeReviewId, userId: req.userId },
    });

    if (!codeReview) {
      return res.status(404).json({ error: { message: 'Code review not found' } });
    }

    const comment = await prisma.comment.create({
      data: {
        ...validatedData,
        userId: req.userId,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: { message: 'Validation error', details: error.issues } });
    }
    console.error('Create comment error:', error);
    res.status(500).json({ error: { message: 'Internal server error' } });
  }
};

export const getComments = async (req, res) => {
  try {
    const { codeReviewId } = req.params;

    const comments = await prisma.comment.findMany({
      where: { codeReviewId: codeReviewId },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(comments);
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ error: { message: 'Internal server error' } });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    const comment = await prisma.comment.findFirst({
      where: { id: id, userId: req.userId },
    });

    if (!comment) {
      return res.status(404).json({ error: { message: 'Comment not found' } });
    }

    const updated = await prisma.comment.update({
      where: { id: id },
      data: { content },
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update comment error:', error);
    res.status(500).json({ error: { message: 'Internal server error' } });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await prisma.comment.findFirst({
      where: { id: id, userId: req.userId },
    });

    if (!comment) {
      return res.status(404).json({ error: { message: 'Comment not found' } });
    }

    await prisma.comment.delete({ where: { id: id } });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: { message: 'Internal server error' } });
  }
};
