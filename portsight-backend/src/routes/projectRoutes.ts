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
// Get all decisions for the Governance Log
router.get('/global/decisions', async (req: Request, res: Response) => {
  try {
    const decisions = await prisma.decisionLog.findMany({
      include: {
        project: { select: { name: true } },
        decidedBy: { select: { name: true, role: true } }
      },
      orderBy: { timestamp: 'desc' }
    });
    res.json(decisions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch decisions' });
  }
});

// Save a new decision from the Simulator
router.post('/:id/decisions', async (req: Request, res: Response) => {
  try {
    const newDecision = await prisma.decisionLog.create({
      data: {
        projectId: req.params.id,
        decidedById: req.body.userId, // We will use the Project Manager's ID
        decisionType: req.body.decisionType, // e.g., 'REPLAN'
        rationale: req.body.rationale
      }
    });
    res.json(newDecision);
  } catch (error) {
    res.status(500).json({ error: 'Failed to log decision', details: error });
  }
});
// Get a single project by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.id },
      include: {
        manager: { select: { name: true, email: true } },
        updates: { orderBy: { updateDate: 'desc' } },
        risks: { orderBy: { createdAt: 'desc' } },
        decisions: { orderBy: { timestamp: 'desc' } }
      }
    });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project details' });
  }
});

export default router;