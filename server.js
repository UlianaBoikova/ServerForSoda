const WebSocket = require('ws');

// Создаём WebSocket сервер на порту 3000
const wss = new WebSocket.Server({ port: process.env.PORT || 3000 });

let progress = 0;
let fullAmount = 10;

wss.on('connection', ws => {
  ws.send(JSON.stringify({ type: 'update', progress, fullAmount }));

  ws.on('message', message => {
    const data = JSON.parse(message);

    if (data.type === 'increment') {
      progress++;
      if (progress > fullAmount) {
        progress = 0;
      }
      broadcastProgress();
    }

    if (data.type === 'reset') {
      progress = 0;
      broadcastProgress();
    }

    if (data.type === 'setFullAmount') {
      fullAmount = data.fullAmount * 10;
      broadcastProgress();
    }

    if (data.type === 'resetFullAmount') {
      fullAmount = 10;
      broadcastProgress();
    }
  });
});

function broadcastProgress() {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'update', progress, fullAmount }));
    }
  });
}

console.log('WebSocket сервер запущен на порту ' + (process.env.PORT || 3000));
