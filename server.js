const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: process.env.PORT || 3000 });

let progress = 0;
const fullAmount = 10;

wss.on('connection', ws => {
  // Отправляем текущий прогресс новому клиенту
  ws.send(JSON.stringify({ type: 'update', progress }));

  // Получаем сообщение от клиента
  ws.on('message', message => {
    const data = JSON.parse(message);

    if (data.type === 'increment') {
      progress++;
      if (progress > fullAmount) {
        progress = 0;
      }

      // Рассылаем обновлённый прогресс всем клиентам
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'update', progress }));
        }
      });
    }
  });
});

console.log('WebSocket сервер запущен');