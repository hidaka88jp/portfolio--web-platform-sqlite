import express from "express";
import prisma from "../../prisma/prismaClient.js";
import xss from "xss";

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

/* ---------------------------------------------------
   POST /messages (authenticated)
-----------------------------------------------------*/
router.post("/", async (req, res) => {
  const token = req.headers.authorization;
  const userId = await getUserIdFromToken(token);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { message } = req.body;

  /* ★ ① 型チェック */
  if (typeof message !== "string") {
    return res.status(400).json({ error: "Invalid message format" });
  }

  /* ★ ② 空白禁止（trim して 0 なら空） */
  if (message.trim().length === 0) {
    return res.status(400).json({ error: "Message cannot be empty" });
  }

  /* ★ ③ 長さチェック */
  if (message.length > 500) {
    return res.status(400).json({ error: "Message too long (max 500)" });
  }

  // ★ XSS 対策
  const safeMessage = xss(message);

  const newMessage = await prisma.message.create({
    data: {
      message: safeMessage,
      userId,
    },
  });

  return res.json(newMessage);
});

/* ---------------------------------------------------
   GET /messages（for top page）
-----------------------------------------------------*/
router.get("/", async (req, res) => {
  const messages = await prisma.message.findMany({
    take: 20,
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

/* ---------------------------------------------------
   GET /messages/user
-----------------------------------------------------*/
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

/* ---------------------------------------------------
   DELETE /messages/:id
-----------------------------------------------------*/
router.delete("/:id", async (req, res) => {
  const token = req.headers.authorization;
  const userId = await getUserIdFromToken(token);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  /* ★ 型チェック（数字かどうか） */
  const messageId = Number(req.params.id);
  if (isNaN(messageId)) {
    return res.status(400).json({ error: "Invalid message id" });
  }

  const message = await prisma.message.findUnique({
    where: { id: messageId },
  });

  if (!message) {
    return res.status(404).json({ error: "Message not found" });
  }

  if (message.userId !== userId) {
    return res.status(403).json({ error: "Forbidden" });
  }

  await prisma.message.delete({
    where: { id: messageId },
  });

  return res.json({ success: true });
});

/* ---------------------------------------------------
   PATCH /messages/:id（authenticated）
-----------------------------------------------------*/
router.patch("/:id", async (req, res) => {
  const token = req.headers.authorization;
  const userId = await getUserIdFromToken(token);

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  /* ★ 型チェック（数字かどうか） */
  const messageId = Number(req.params.id);
  if (isNaN(messageId)) {
    return res.status(400).json({ error: "Invalid message id" });
  }

  const { message } = req.body;

  /* ★ 型チェック */
  if (typeof message !== "string") {
    return res.status(400).json({ error: "Invalid message format" });
  }

  /* ★ 空チェック */
  if (message.trim().length === 0) {
    return res.status(400).json({ error: "Message cannot be empty" });
  }

  /* ★ 長さチェック */
  if (message.length > 500) {
    return res.status(400).json({ error: "Message too long (max 500)" });
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

  // ★ XSS 対策
  const safeMessage = xss(message);

  const updated = await prisma.message.update({
    where: { id: messageId },
    data: {
      message: safeMessage,
    },
  });

  return res.json(updated);
});

export default router;
