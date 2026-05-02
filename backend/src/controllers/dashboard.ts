import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';

export const getDashboardStats = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;

  try {
    const totalProjects = await prisma.project.count({
      where: {
        OR: [{ ownerId: userId }, { members: { some: { userId } } }]
      }
    });

    const tasks = await prisma.task.findMany({
      where: { assigneeId: userId }
    });

    const stats = {
      totalProjects,
      totalTasks: tasks.length,
      todo: tasks.filter(t => t.status === 'TODO').length,
      inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
      completed: tasks.filter(t => t.status === 'COMPLETED').length,
      overdue: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'COMPLETED').length
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats' });
  }
};
