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
      fullAmount = data.fullAmount;
      // отправляем всем обновлённое значение
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
