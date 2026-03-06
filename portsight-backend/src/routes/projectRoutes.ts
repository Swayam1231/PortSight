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
        decidedById: req.body.userId,
        decisionType: req.body.decisionType, 
        rationale: req.body.rationale
      }
    });
    res.json(newDecision);
  } catch (error) {
    res.status(500).json({ error: 'Failed to log decision', details: error });
  }
});

// --- ENTERPRISE MASTER SEED ROUTE (MOVED UP!) ---
router.get('/master-seed', async (req: Request, res: Response) => {
  try {
    console.log("Starting Master Seed process...");

    // 1. Create a few realistic Managers
    const managers = await Promise.all([
      prisma.user.create({ data: { name: "Sarah Jenkins", email: `s.jenkins_${Date.now()}@portsight.com`, passwordHash: "123", role: "PROJECT_MANAGER" } }),
      prisma.user.create({ data: { name: "David Chen", email: `d.chen_${Date.now()}@portsight.com`, passwordHash: "123", role: "PROJECT_MANAGER" } }),
      prisma.user.create({ data: { name: "Marcus Thorne", email: `m.thorne_${Date.now()}@portsight.com`, passwordHash: "123", role: "EXECUTIVE" } })
    ]);

    // 2. The Master Project Data Array
    const seedProjects = [
      { name: "ERP System Upgrade", budget: 1200000, days: 365, team: 15, value: 9, status: "ACTIVE", mId: managers[0].id },
      { name: "Mobile App Redesign", budget: 450000, days: 120, team: 8, value: 7, status: "ACTIVE", mId: managers[1].id },
      { name: "Legacy DB Migration", budget: 850000, days: 200, team: 4, value: 8, status: "ON_HOLD", mId: managers[0].id }, 
      { name: "AI Chatbot Integration", budget: 150000, days: 60, team: 3, value: 5, status: "PROPOSED", mId: managers[2].id },
      { name: "Cloud Infrastructure Setup", budget: 2000000, days: 400, team: 20, value: 10, status: "ACTIVE", mId: managers[1].id },
      { name: "Employee Portal V2", budget: 80000, days: 90, team: 2, value: 3, status: "CANCELLED", mId: managers[0].id }, 
      { name: "Q3 Marketing Campaign", budget: 300000, days: 45, team: 12, value: 6, status: "COMPLETED", mId: managers[1].id },
      { name: "Cybersecurity Audit Fixing", budget: 600000, days: 150, team: 10, value: 9, status: "ACTIVE", mId: managers[2].id },
      { name: "Blockchain Supply Tracking", budget: 1100000, days: 250, team: 5, value: 4, status: "PROPOSED", mId: managers[0].id }, 
      { name: "Customer CRM Replacement", budget: 950000, days: 300, team: 14, value: 8, status: "ACTIVE", mId: managers[1].id }
    ];

    // 3. Inject Projects into Database
    const createdProjects = [];
    for (const p of seedProjects) {
      const proj = await prisma.project.create({
        data: {
          name: p.name,
          description: `Enterprise initiative for ${p.name}.`,
          allocatedBudget: p.budget,
          expectedDurationDays: p.days,
          teamSize: p.team,
          strategicValueScore: p.value,
          status: p.status as any,
          managerId: p.mId
        }
      });
      createdProjects.push(proj);
    }

    // 4. Inject Realistic Risks to light up the Heatmap
    await prisma.risk.createMany({
      data: [
        { title: "Critical Data Loss", probability: 4, impact: 5, projectId: createdProjects[2].id }, 
        { title: "Vendor API Rate Limits", probability: 3, impact: 3, projectId: createdProjects[1].id },
        { title: "Cloud Cost Overrun", probability: 5, impact: 4, projectId: createdProjects[4].id },
        { title: "Regulatory Compliance Failure", probability: 2, impact: 5, projectId: createdProjects[7].id },
        { title: "Key Developer Resignation", probability: 4, impact: 4, projectId: createdProjects[8].id },
        { title: "Scope Creep", probability: 5, impact: 2, projectId: createdProjects[9].id }
      ]
    });

    // 5. Inject Governance Decisions to populate the Audit Log
    await prisma.decisionLog.createMany({
      data: [
        { projectId: createdProjects[2].id, decidedById: managers[2].id, decisionType: "PAUSE", rationale: "Paused DB migration due to critical data loss risks. Re-evaluating vendor." },
        { projectId: createdProjects[5].id, decidedById: managers[2].id, decisionType: "STOP", rationale: "Cancelled Employee Portal V2. Low strategic value, resources needed elsewhere." },
        { projectId: createdProjects[4].id, decidedById: managers[2].id, decisionType: "ACCELERATE", rationale: "Injected $250k into Cloud Infrastructure to hit Q4 deadlines." }
      ]
    });

    res.json({ message: "✅ Master Seed Complete! Your dashboard is now packed with enterprise data." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Seed failed", details: error });
  }
});

// Get a single project by ID (MOVED DOWN - WILDCARDS GO LAST)
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