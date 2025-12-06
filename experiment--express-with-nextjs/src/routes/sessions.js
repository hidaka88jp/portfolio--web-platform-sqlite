import express from "express";
import prisma from "../../prisma/prismaClient.js";

const router = express.Router();

// POST /sessions/validate with Authorization header
router.post("/validate", async (req, res) => {
  let token = req.headers.authorization;

  // ① token が存在するか
  if (!token) {
    return res.status(400).json({ error: "token is required" });
  }

  // ② token が配列で来ていないか（攻撃対策）
  if (Array.isArray(token)) {
    return res.status(400).json({ error: "Invalid token format" });
  }

  // ③ 前後の空白を削除
  token = token.trim();

  // ④ 長さチェック（UUIDなら36文字程度）
  if (token.length < 10 || token.length > 100) {
    return res.status(400).json({ error: "Invalid token length" });
  }

  const session = await prisma.session.findUnique({
    where: { id: token },
  });

  if (!session) {
    return res.status(401).json({ error: "Invalid session token" });
  }

  // 有効期限チェック
  if (session.expiresAt < new Date()) {
    return res.status(401).json({ error: "Session expired" });
  }

  return res.json({
    userId: session.userId,
  });
});

export default router;
