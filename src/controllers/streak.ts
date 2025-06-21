import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateStreak = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    let userProgress = await prisma.userProgress.findUnique({
      where: { userId }
    });

    if (!userProgress) {
      userProgress = await prisma.userProgress.create({
        data: { userId }
      });
    }

    const updatedProgress = await prisma.userProgress.update({
      where: { userId },
      data: {
        currentStreak: {
          increment: 1
        }
      }
    });

    res.json({
      message: 'Streak updated successfully',
      currentStreak: updatedProgress.currentStreak
    });
  } catch (error) {
    console.error('Update streak error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCurrentStreak = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const userProgress = await prisma.userProgress.findUnique({
      where: { userId },
      select: {
        currentStreak: true
      }
    });

    if (!userProgress) {
      res.json({ currentStreak: 0 });
      return;
    }

    res.json({
      currentStreak: userProgress.currentStreak
    });
  } catch (error) {
    console.error('Get current streak error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTopStreaks = async (req: Request, res: Response): Promise<void> => {
  try {
    const topUsers = await prisma.userProgress.findMany({
      select: {
        currentStreak: true,
        user: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        currentStreak: 'desc'
      },
      take: 5
    });

    const formattedTopUsers = topUsers.map(progress => ({
      id: progress.user.id,
      name: progress.user.name,
      currentStreak: progress.currentStreak
    }));

    res.json(formattedTopUsers);
  } catch (error) {
    console.error('Get top streaks error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 
