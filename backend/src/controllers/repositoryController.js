import { z } from 'zod';
import prisma from '../utils/prisma.js';

const repositorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  url: z.string().url(),
  language: z.string(),
});

export const createRepository = async (req, res) => {
  try {
    const validatedData = repositorySchema.parse(req.body);

    const repository = await prisma.repository.create({
      data: {
        ...validatedData,
        userId: req.userId,
      },
    });

    res.status(201).json(repository);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: { message: 'Validation error', details: error.issues } });
    }
    console.error('Create repository error:', error);
    res.status(500).json({ error: { message: 'Internal server error' } });
  }
};

export const getRepositories = async (req, res) => {
  try {
    const repositories = await prisma.repository.findMany({
      where: { userId: req.userId },
      include: {
        codeReviews: {
          select: { id: true, title: true, status: true, createdAt: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(repositories);
  } catch (error) {
    console.error('Get repositories error:', error);
    res.status(500).json({ error: { message: 'Internal server error' } });
  }
};

export const getRepository = async (req, res) => {
  try {
    const { id } = req.params;

    const repository = await prisma.repository.findFirst({
      where: { id: id, userId: req.userId },
      include: {
        codeReviews: {
          include: {
            comments: true,
            suggestions: true,
          },
        },
      },
    });

    if (!repository) {
      return res.status(404).json({ error: { message: 'Repository not found' } });
    }

    res.json(repository);
  } catch (error) {
    console.error('Get repository error:', error);
    res.status(500).json({ error: { message: 'Internal server error' } });
  }
};

export const updateRepository = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = repositorySchema.partial().parse(req.body);

    const repository = await prisma.repository.findFirst({
      where: { id: id, userId: req.userId },
    });

    if (!repository) {
      return res.status(404).json({ error: { message: 'Repository not found' } });
    }

    const updated = await prisma.repository.update({
      where: { id: id },
      data: validatedData,
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: { message: 'Validation error', details: error.issues } });
    }
    console.error('Update repository error:', error);
    res.status(500).json({ error: { message: 'Internal server error' } });
  }
};

export const deleteRepository = async (req, res) => {
  try {
    const { id } = req.params;

    const repository = await prisma.repository.findFirst({
      where: { id: id, userId: req.userId },
    });

    if (!repository) {
      return res.status(404).json({ error: { message: 'Repository not found' } });
    }

    await prisma.repository.delete({ where: { id: id } });

    res.json({ message: 'Repository deleted successfully' });
  } catch (error) {
    console.error('Delete repository error:', error);
    res.status(500).json({ error: { message: 'Internal server error' } });
  }
};
