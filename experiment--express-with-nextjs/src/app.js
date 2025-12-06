import express from 'express'
import cors from "cors";

import messagesRouter from './routes/messages.js'
import usersRouter from './routes/users.js'
import sessionsRouter from './routes/sessions.js';

const app = express()

const allowedOrigins = [
  "http://localhost:3000",
  "https://spike-messageboard.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ミドルウェア
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// For health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// ルート
app.use('/messages', messagesRouter)
app.use('/users', usersRouter)
app.use('/sessions', sessionsRouter);

// 404（APIなのでJSONで返す）
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

export default app
