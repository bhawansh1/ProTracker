import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../utils/prisma';

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } }
        ]
      },
      include: {
        owner: { select: { name: true, email: true } },
        members: { include: { user: { select: { name: true, email: true } } } },
        _count: { select: { tasks: true } }
      }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  const { name, description } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: userId,
        members: {
          create: { userId, role: 'ADMIN' }
        }
      }
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project' });
  }
};

export const getProjectDetails = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const project = await prisma.project.findUnique({
      where: { id: id as string },
      include: {
        tasks: { include: { assignee: { select: { name: true, email: true } } } },
        members: { include: { user: { select: { id: true, name: true, email: true } } } }
      }
    });
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project details' });
  }
};

export const addMember = async (req: AuthRequest, res: Response) => {
  const { id } = req.params; // project id
  const { email, role } = req.body;

  try {
    const userToAdd = await prisma.user.findUnique({ where: { email } });
    if (!userToAdd) return res.status(404).json({ message: 'User not found' });

    const member = await prisma.teamMember.create({
      data: {
        projectId: id as string,
        userId: userToAdd.id,
        role: role || 'MEMBER'
      }
    });
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: 'Error adding member' });
  }
};
