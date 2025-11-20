import express from "express";
import prisma from "../../prisma/prismaClient.js";

const router = express.Router();

// 認証ヘルパー
async function getUserIdFromToken(token) {
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { id: token },
  });

  if (!session) return null;
  if (session.expiresAt < new Date()) return null;

  return session.userId;
}

// POST /messages (認証付き)
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

export default router;
