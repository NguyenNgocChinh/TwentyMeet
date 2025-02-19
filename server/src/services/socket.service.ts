import { Socket } from "socket.io";
import { Participant } from "../types/socket.types";

export class SocketService {
  private participants: Map<string, Map<string, Participant>> = new Map();

  addParticipant(meetingId: string, socket: Socket, name: string) {
    if (!this.participants.has(meetingId)) {
      this.participants.set(meetingId, new Map());
    }

    const meetingParticipants = this.participants.get(meetingId)!;
    const participant: Participant = {
      id: socket.id,
      name: name || `User ${meetingParticipants.size + 1}`,
      image: `/placeholder.svg`,
    };

    meetingParticipants.set(socket.id, participant);
    return participant;
  }

  removeParticipant(meetingId: string, socketId: string) {
    const meetingParticipants = this.participants.get(meetingId);
    if (meetingParticipants) {
      meetingParticipants.delete(socketId);
      if (meetingParticipants.size === 0) {
        this.participants.delete(meetingId);
      }
    }
  }

  getParticipants(meetingId: string): Participant[] {
    const meetingParticipants = this.participants.get(meetingId);
    return meetingParticipants ? Array.from(meetingParticipants.values()) : [];
  }

  // Thêm các phương thức xử lý logic socket ở đây
}
