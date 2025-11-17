#!/usr/bin/env node

import app from './app.js'
import http from 'http'
import 'dotenv/config';

// 環境変数 PORT があれば使い、なければ 3000 を使う
const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

// HTTPサーバーを作成
const server = http.createServer(app)

// サーバーを起動
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

// ---- 以下ユーティリティ関数 ----

// ポートを数値 or 名前付きパイプに変換
function normalizePort(val) {
  const port = parseInt(val, 10)
  if (isNaN(port)) return val // 名前付きパイプ
  if (port >= 0) return port  // ポート番号
  return false
}

// エラー発生時の処理
function onError(error) {
  if (error.syscall !== 'listen') throw error

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`)
      process.exit(1)
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`)
      process.exit(1)
    default:
      throw error
  }
}

// サーバーが起動したときの処理
function onListening() {
  const addr = server.address()
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
  console.log(`Listening on ${bind}`)
}
