import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const saveCompletedLessons = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { completedLessons } = req.body;

    if (!Array.isArray(completedLessons)) {
      res.status(400).json({ message: 'completedLessons must be an array' });
      return;
    }

    const completedLessonsJson = JSON.stringify(completedLessons);

    let userProgress = await prisma.userProgress.findUnique({
      where: { userId }
    });

    if (!userProgress) {
      userProgress = await prisma.userProgress.create({
        data: {
          userId,
          completedLessons: completedLessonsJson
        }
      });
    } else {
      userProgress = await prisma.userProgress.update({
        where: { userId },
        data: {
          completedLessons: completedLessonsJson
        }
      });
    }

    res.json({
      message: 'Completed lessons saved successfully',
      completedLessons: completedLessons
    });
  } catch (error) {
    console.error('Save completed lessons error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCompletedLessons = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const userProgress = await prisma.userProgress.findUnique({
      where: { userId }
    });

    if (!userProgress) {
      res.json({ completedLessons: [] });
      return;
    }

    const completedLessons = JSON.parse(userProgress.completedLessons);

    res.json({
      completedLessons: completedLessons
    });
  } catch (error) {
    console.error('Get completed lessons error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const addCompletedLesson = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { lessonId } = req.body;

    if (!lessonId || typeof lessonId !== 'string') {
      res.status(400).json({ message: 'lessonId is required and must be a string' });
      return;
    }

    let userProgress = await prisma.userProgress.findUnique({
      where: { userId }
    });

    if (!userProgress) {
      userProgress = await prisma.userProgress.create({
        data: {
          userId,
          completedLessons: JSON.stringify([lessonId])
        }
      });
    } else {
      const currentCompletedLessons = JSON.parse(userProgress.completedLessons);

      if (!currentCompletedLessons.includes(lessonId)) {
        currentCompletedLessons.push(lessonId);

        userProgress = await prisma.userProgress.update({
          where: { userId },
          data: {
            completedLessons: JSON.stringify(currentCompletedLessons)
          }
        });
      }
    }

    const updatedProgress = await prisma.userProgress.findUnique({
      where: { userId }
    });

    const completedLessons = updatedProgress ? JSON.parse(updatedProgress.completedLessons) : [];

    res.json({
      message: 'Lesson marked as completed',
      completedLessons: completedLessons
    });
  } catch (error) {
    console.error('Add completed lesson error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 
