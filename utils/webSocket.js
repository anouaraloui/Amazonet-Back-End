
import WebSocket, { WebSocketServer } from 'ws';
import Message from '../models/messageMode.js'



export const setupWebSocket = (server, path) => {
    const wss = new WebSocketServer({ server, path });

   
        wss.on('connection', function connection(ws) {
            console.log('A new client Connected!');
            ws.send('Welcome New Client!');
          
            ws.on('message', function incoming(message) {
              console.log('received: %s', message);
          
              wss.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                  client.send(message);
                }
              });
              
            });
          });

    return wss;
};


