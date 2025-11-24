import express from 'express';
const router = express.Router();
import prisma from "../../prisma/prismaClient.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

router.get('/', (req, res) => {
  res.json({ message: 'users endpoint' });
});

// POST /users/login
router.post("/login", async (req, res) => {
  const { name, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { name },
  });

  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  if (user.password !== password) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const token = crypto.randomUUID(); // or uuid

  await prisma.session.create({
    data: {
      id: token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7日
    },
  });

  return res.json({
    session_token: token,
    message: "Login successful",
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

// POST /users/register
router.post("/register", async (req, res) => {
  const { name, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      password: hashed
    },
  });

  return res.json({
    id: user.id,
    name: user.name,
    message: "User registered",
  });
});

export default router;