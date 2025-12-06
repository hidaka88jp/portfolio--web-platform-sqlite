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

  // --- validation ---
  if (!name || typeof name !== "string" || name.length === 0) {
    return res.status(400).json({ error: "Invalid name" });
  }
  if (!password || typeof password !== "string" || password.length === 0) {
    return res.status(400).json({ error: "Invalid password" });
  }

  const user = await prisma.user.findUnique({
    where: { name },
  });

  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const token = crypto.randomUUID();

  await prisma.session.create({
    data: {
      id: token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });

  return res.json({
    session_token: token,
    message: "Login successful",
  });
});


// GET /users/:id
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  // --- validation ---
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid user id" });
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      // password は返さない
    },
  });

  if (!user) return res.status(404).json({ error: "User not found" });

  return res.json(user);
});

// POST /users/register
router.post("/register", async (req, res) => {
  const { name, password } = req.body;

  // --- validation ---
  if (!name || typeof name !== "string" || name.length < 3) {
    return res.status(400).json({ error: "Name must be at least 3 chars" });
  }
  if (!password || typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ error: "Password too short" });
  }

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
