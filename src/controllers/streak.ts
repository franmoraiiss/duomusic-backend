import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Update user's streak
export const updateStreak = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId; // This will come from the auth middleware

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: {
          increment: 1
        }
      }
    });

    res.json({
      message: 'Streak updated successfully',
      currentStreak: user.currentStreak
    });
  } catch (error) {
    console.error('Update streak error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get user's current streak
export const getCurrentStreak = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        currentStreak: true
      }
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      currentStreak: user.currentStreak
    });
  } catch (error) {
    console.error('Get current streak error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get top 5 users by streak
export const getTopStreaks = async (req: Request, res: Response): Promise<void> => {
  try {
    const topUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        currentStreak: true
      },
      orderBy: {
        currentStreak: 'desc'
      },
      take: 5
    });

    res.json(topUsers);
  } catch (error) {
    console.error('Get top streaks error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 
