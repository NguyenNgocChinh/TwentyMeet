import { Server } from "socket.io";
import { Server as HttpServer } from "http";

export const initializeSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("joinMeeting", (meetingCode: string) => {
      console.log("🚀 ~ socket.on ~ meetingCode:", meetingCode);
      socket.join(meetingCode);
      socket.emit("meetingJoined", meetingCode);
    });
  });

  return io;
};
