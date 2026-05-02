import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';

export const createTask = async (req: AuthRequest, res: Response) => {
  const { title, description, dueDate, projectId, assigneeId } = req.body;

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId,
        assigneeId,
      }
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task' });
  }
};

export const updateTaskStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const task = await prisma.task.update({
      where: { id: id as string },
      data: { status }
    });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task status' });
  }
};

export const getMyTasks = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  try {
    const tasks = await prisma.task.findMany({
      where: { assigneeId: userId },
      include: { project: { select: { name: true } } }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};
