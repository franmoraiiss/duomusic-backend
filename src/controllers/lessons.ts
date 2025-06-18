import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Save completed lessons for a user
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

    // Convert array to JSON string for storage
    const completedLessonsJson = JSON.stringify(completedLessons);

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        completedLessons: completedLessonsJson
      }
    });

    res.json({
      message: 'Completed lessons saved successfully',
      completedLessons: completedLessons
    });
  } catch (error) {
    console.error('Save completed lessons error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get completed lessons for a user
export const getCompletedLessons = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        completedLessons: true
      }
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Parse JSON string back to array
    const completedLessons = JSON.parse(user.completedLessons);

    res.json({
      completedLessons: completedLessons
    });
  } catch (error) {
    console.error('Get completed lessons error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Add a single completed lesson to user's progress
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

    // Get current completed lessons
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        completedLessons: true
      }
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Parse current completed lessons
    const currentCompletedLessons = JSON.parse(user.completedLessons);

    // Add new lesson if not already completed
    if (!currentCompletedLessons.includes(lessonId)) {
      currentCompletedLessons.push(lessonId);

      // Update user with new completed lessons
      await prisma.user.update({
        where: { id: userId },
        data: {
          completedLessons: JSON.stringify(currentCompletedLessons)
        }
      });
    }

    res.json({
      message: 'Lesson marked as completed',
      completedLessons: currentCompletedLessons
    });
  } catch (error) {
    console.error('Add completed lesson error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}; 
