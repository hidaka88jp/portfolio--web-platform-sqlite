import express from 'express'

// import messagesRouter from './routes/messages.js'
import usersRouter from './routes/users.js'

const app = express()

// ミドルウェア
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// ルート
// app.use('/messages', messagesRouter)
app.use('/users', usersRouter)

// 404（APIなのでJSONで返す）
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' })
})

export default app
