import { WebSocketServer, WebSocket } from "ws";

// A very simple websocket, whose only purpose is to echo messages back to all clients

// Create WebSocket server on port 8080
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws: WebSocket) => {
  console.log("Client connected");

  ws.on("message", (data: Buffer) => {
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data.toString());
      }
    });
  });
});

console.log("WebSocket server running on ws://localhost:8080");
