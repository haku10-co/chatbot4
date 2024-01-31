const express = require('express');
const { Server: WebSocketServer } = require('ws');
const http = require('http');

const app = express();
const server = http.createServer(app);

// WebSocketサーバーの設定
const wss = new WebSocketServer({ server });

wss.on('connection', function connection(ws) {
  console.log('クライアントが接続しました');

  ws.on('message', function incoming(message) {
    console.log('受信したメッセージ:', message);
    ws.send('メッセージを受け取りました');
  });

  ws.send('サーバーに接続しました');
});

// Expressを使用してHTTPリクエストを処理
app.get('/', (req, res) => {
  res.send('Hello, ExpressとWebSocketの組み合わせ!');
});

// サーバーをポート5005で起動
server.listen(5005, () => {
  console.log('サーバーがポート5005で起動しました');
});