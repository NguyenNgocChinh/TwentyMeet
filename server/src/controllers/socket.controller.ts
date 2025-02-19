import { Server, Socket } from "socket.io";
import { SocketService } from "../services/socket.service";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../types/socket.types";

export class SocketController {
  private socketService: SocketService;

  constructor(private io: Server<ClientToServerEvents, ServerToClientEvents>) {
    this.socketService = new SocketService();
    this.initializeEventHandlers();
  }

  private initializeEventHandlers() {
    this.io.on("connection", (socket: Socket) => {
      console.log("Client connected:", socket.id);

      socket.on("joinMeeting", (meetingId: string, name?: string) => {
        // Join the socket room
        socket.join(meetingId);

        // Add participant to the meeting
        const participant = this.socketService.addParticipant(
          meetingId,
          socket,
          name ?? "anonymous"
        );

        // Notify all clients in the meeting about the updated participant list
        this.io
          .to(meetingId)
          .emit("participants", this.socketService.getParticipants(meetingId));

        socket.emit("meetingJoined", meetingId);
      });

      socket.on("disconnect", () => {
        // Find and remove participant from all meetings they were in
        this.io.sockets.adapter.rooms.forEach((_, meetingId) => {
          this.socketService.removeParticipant(meetingId, socket.id);
          this.io
            .to(meetingId)
            .emit(
              "participants",
              this.socketService.getParticipants(meetingId)
            );
        });
      });

      socket.on("error", (error) => {
        console.error("Socket error:", error);
      });
    });
  }
}
