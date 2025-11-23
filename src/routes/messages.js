import express from "express";
import prisma from "../../prisma/prismaClient.js";

const router = express.Router();

// authenticated helper
async function getUserIdFromToken(token) {
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { id: token },
  });

  if (!session) return null;
  if (session.expiresAt < new Date()) return null;

  return session.userId;
}

// POST /messages (authenticated)
router.post("/", async (req, res) => {
  const token = req.headers.authorization; // ← Next.js から送ってもらう
  const userId = await getUserIdFromToken(token);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }

  const newMessage = await prisma.message.create({
    data: {
      message,
      userId,
    },
  });

  return res.json(newMessage);
});

// GET /messages（for top page）
router.get("/", async (req, res) => {
  const messages = await prisma.message.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.json(messages);
});

// GET /messages/user
router.get("/user", async (req, res) => {
  const token = req.headers.authorization;
  const userId = await getUserIdFromToken(token);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const messages = await prisma.message.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  return res.json(messages);
});

// DELETE /messages/:id
router.delete("/:id", async (req, res) => {
  const token = req.headers.authorization;
  const userId = await getUserIdFromToken(token);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const messageId = Number(req.params.id);

  // get message and check ownership
  const message = await prisma.message.findUnique({
    where: { id: messageId },
  });

  if (!message) {
    return res.status(404).json({ error: "Message not found" });
  }

  if (message.userId !== userId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // delete message
  await prisma.message.delete({
    where: { id: messageId },
  });

  return res.json({ success: true });
});

// PATCH /messages/:id (authenticated)
router.patch("/:id", async (req, res) => {
  const token = req.headers.authorization;
  const userId = await getUserIdFromToken(token);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const messageId = Number(req.params.id);
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }

  // Get existing message and check ownership
  const existing = await prisma.message.findUnique({
    where: { id: messageId },
  });

  if (!existing) {
    return res.status(404).json({ error: "Message not found" });
  }

  if (existing.userId !== userId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  // Update message
  const updated = await prisma.message.update({
    where: { id: messageId },
    data: {
      message,
    },
  });

  return res.json(updated);
});

export default router;
