import express from 'express';
const router = express.Router();
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

router.get('/', (req, res) => {
  res.json({ message: 'users endpoint' });
});

// POST /users/login
router.post('/login', async (req, res) => {
  const { name, password } = req.body;

  // find user by name
  const user = await prisma.user.findUnique({
    where: { name }
  });

  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  // No hash so far
  if (user.password !== password) {
    return res.status(401).json({ error: "Invalid password" });
  }

  // success
  return res.json({
    id: user.id,
    name: user.name,
    message: "Login successful"
  });
});

// GET /users/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });

  if (!user) return res.status(404).json({ error: "User not found" });

  return res.json(user);
});


export default router;