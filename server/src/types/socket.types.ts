export interface Participant {
  id: string;
  name: string;
  image?: string;
}

export interface ServerToClientEvents {
  participants: (participants: Participant[]) => void;
  meetingJoined: (meetingId: string) => void;
}

export interface ClientToServerEvents {
  joinMeeting: (meetingId: string, name?: string) => void;
  leaveMeeting: (meetingId: string) => void;
}
