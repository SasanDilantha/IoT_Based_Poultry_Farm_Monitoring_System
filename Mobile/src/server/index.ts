import WebSocket, { Server } from "ws";

const PORT = process.env.PORT || 8080;
const server = new Server({ port: Number(PORT) });

server.on("connection", (socket: WebSocket) => {
  console.log("A new client connection");

  // Initialize data to send to the client
  const initializeData = { temperature: 0, humidity: 0 };
  socket.send(JSON.stringify(initializeData));

  socket.on("message", (message: string) => {
    console.log("Received:", message);

    try {
      const parsedMessage = JSON.parse(message);

      switch (parsedMessage.type) {
        case "sensorData": {
          const { temperature, humidity } = parsedMessage;
          console.log("🚀 ~ Received sensor data:", temperature, humidity);

          const dataToSend = { temperature, humidity };
          server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(dataToSend));
            }
          });
          break;
        }
        case "fanControl": {
          const { status } = parsedMessage;
          console.log("🚀 ~ Fan control status:", status);

          const fanStatus = { type: "fanControl", status };
          server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(fanStatus));
            }
          });
          break;
        }
        case "ledControl": {
          const { status } = parsedMessage;
          console.log("🚀 ~ LED control status:", status);

          const ledStatus = { type: "ledControl", status };
          server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(ledStatus));
            }
          });
          break;
        }
        default:
          console.log("Unknown message type");
      }
    } catch (error) {
      console.error("🚀 ~ Error parsing message:", error);
    }
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });

  socket.on("error", (error: Error) => {
    console.error("🚀 ~ Socket error:", error);
  });
});

console.log(`Server listening on port ${PORT}`);
