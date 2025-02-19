"use client";

import { FCC } from "@/types/common";
import { useRouter } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { Participant } from "@/app/_features/meet/components/ParticipantGrid";

// Define proper types for the socket context
type TSocketContext = {
  socket: Socket | null;
  isConnected: boolean;
  connectionError: Error | null;
  participants: Participant[];
  connect: () => void;
  disconnect: () => void;
  createNewMeeting: () => void;
  joinMeeting: (meetingCode: string) => void;
};

export const SocketContext = createContext<TSocketContext>({
  socket: null,
  isConnected: false,
  connectionError: null,
  participants: [],
  connect: () => {},
  disconnect: () => {},
  createNewMeeting: () => {},
  joinMeeting: () => {},
});

export const SocketProvider: FCC = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<Error | null>(null);
  const socketRef = useRef<Socket | null>(null); // Use ref to persist socket instance
  const router = useRouter();
  const [participants, setParticipants] = useState<Participant[]>([]);

  // Initialize socket connection
  const initSocket = () => {
    if (socketRef.current) {
      // If socket exists but not connected, try to reconnect
      if (!socketRef.current.connected) {
        socketRef.current.connect();
      }
      return;
    }

    const socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001",
      {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
        transports: ["polling"],
      }
    );

    // Set up event listeners
    socket.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
      setConnectionError(null);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
    });

    socket.on("meetingJoined", (meetingCode) => {
      console.log("Socket meetingJoined:", meetingCode);
      setParticipants([
        {
          id: uuidv4(),
          name: "User",
          image: "https://i.pravatar.cc/150?img=1",
        },
      ]);
    });

    socketRef.current = socket;
  };

  // Manual connect method
  const connect = useCallback(() => {
    initSocket();
  }, []);

  // Manual disconnect method
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setConnectionError(null);
    }
  }, []);

  // Join meeting
  const joinMeeting = useCallback(
    (meetingCode: string) => {
      if (!socketRef.current) {
        throw new Error("Socket not initialized");
      }

      // Có thể lấy tên người dùng từ state hoặc form
      const userName = "User"; // Thay thế bằng tên thật của người dùng
      socketRef.current.emit("joinMeeting", meetingCode, userName);
      router.push(`/meet/${meetingCode}`);
    },
    [router]
  );

  // Create new meeting
  const createNewMeeting = useCallback(() => {
    const meetingCode = uuidv4();
    joinMeeting(meetingCode);
  }, [joinMeeting]);

  useEffect(() => {
    if (!socketRef.current) return;

    // socketRef.current.on(
    //   "participants",
    //   (updatedParticipants: Participant[]) => {
    //     console.log(
    //       "🚀 ~ useEffect ~ updatedParticipants:",
    //       updatedParticipants
    //     );
    //     setParticipants(updatedParticipants);
    //   }
    // );

    return () => {
      socketRef.current?.off("participants");
    };
  }, []);

  // Memoized context value
  const value = useMemo(
    () => ({
      socket: socketRef.current,
      isConnected,
      connectionError,
      participants,
      connect,
      disconnect,
      joinMeeting,
      createNewMeeting,
    }),
    [
      isConnected,
      connectionError,
      participants,
      connect,
      disconnect,
      joinMeeting,
      createNewMeeting,
    ]
  );

  useEffect(() => {
    // Initialize socket on mount
    initSocket();

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.removeAllListeners();
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocketProvider = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocketProvider must be used within SocketProvider");
  }
  return context;
};
