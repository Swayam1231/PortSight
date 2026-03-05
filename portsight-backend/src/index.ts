// src/index.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import projectRoutes from './routes/projectRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/projects', projectRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'PortSight Backend is Running beautifully!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});