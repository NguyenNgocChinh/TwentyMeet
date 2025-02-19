import { createServer } from "http";
import { initializeExpress } from "./config/express";
import { initializeSocket } from "./config/socket";
import { SocketController } from "./controllers/socket.controller";

export const createApp = () => {
  const app = initializeExpress();
  const httpServer = createServer(app);
  const io = initializeSocket(httpServer);

  // Khởi tạo socket controller
  new SocketController(io);

  return httpServer;
};
