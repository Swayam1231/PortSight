// src/routes/projectRoutes.ts
import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all projects for the dashboard
router.get('/', async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        manager: { select: { name: true, email: true } },
        updates: { orderBy: { updateDate: 'desc' }, take: 1 },
        risks: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Create a new project
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const newProject = await prisma.project.create({ data });
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create project', details: error });
  }
});

export default router;