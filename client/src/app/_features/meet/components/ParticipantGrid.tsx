"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import Image from "next/image";
import { useSocketProvider } from "@/app/_features/socket/providers/SocketProvider";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface Participant {
  id: string;
  name: string;
  image?: string;
}

export function ParticipantGrid() {
  const [showAllParticipants, setShowAllParticipants] = useState(false);
  const { socket, participants } = useSocketProvider();
  console.log("🚀 ~ ParticipantGrid ~ participants:", participants);

  // Số người hiển thị tối đa trong grid
  const MAX_VISIBLE_PARTICIPANTS = 8;

  // Tính toán layout dựa trên số lượng người tham gia
  const getLayoutConfig = (count: number) => {
    const totalItems = count + (remainingCount > 0 ? 1 : 0);

    switch (totalItems) {
      case 1:
        return { columns: 1, width: "60%" };
      case 2:
        return { columns: 2, width: "40%" };
      case 3:
        return { columns: 2, width: "40%" }; // 2-1 layout
      case 4:
        return { columns: 2, width: "40%" }; // 2-2 layout
      case 5:
        return { columns: 3, width: "30%" }; // 3-2 layout
      case 6:
        return { columns: 3, width: "30%" }; // 3-3 layout
      case 7:
        return { columns: 3, width: "30%" }; // 3-3-1 layout
      case 8:
        return { columns: 3, width: "30%" }; // 3-3-2 layout
      case 9:
      default:
        return { columns: 3, width: "30%" }; // 3-3-3 layout
    }
  };

  // Lấy danh sách người tham gia hiển thị trong grid
  const visibleParticipants = participants.slice(0, MAX_VISIBLE_PARTICIPANTS);
  const remainingCount = participants.length - MAX_VISIBLE_PARTICIPANTS;
  const { columns, width } = getLayoutConfig(visibleParticipants.length);

  return (
    <>
      <div className="w-full h-full p-2 md:p-4 flex flex-col">
        {/* <div className="text-center mb-2 bg-muted/50 py-1 px-2 rounded-md">
          <span className="font-medium">ABC đang trình bày</span>
        </div> */}

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "4px",
            height: "calc(100vh - 140px)",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          {visibleParticipants.map((participant) => (
            <div
              key={participant.id}
              className="relative bg-muted rounded-lg overflow-hidden transition-all duration-200 ease-in-out hover:ring-2 hover:ring-primary"
              style={{
                width: width,
                aspectRatio: "16/9",
                height: "auto",
                maxHeight: `calc((100vh - 160px) / ${Math.ceil(
                  (visibleParticipants.length + (remainingCount > 0 ? 1 : 0)) /
                    columns
                )})`,
              }}
            >
              <Image
                src={participant.image || "/placeholder.svg"}
                alt={`${participant.name}'s video`}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 left-2 bg-background/80 px-2 py-1 rounded-md text-sm">
                {participant.name}
                {socket?.id && participant.id === socket.id && " (You)"}
              </div>
            </div>
          ))}

          {remainingCount > 0 && (
            <Button
              variant="secondary"
              className="relative rounded-lg hover:ring-2 hover:ring-primary p-0"
              style={{
                width: width,
                aspectRatio: "16/9",
                height: "auto",
                maxHeight: `calc((100vh - 160px) / ${Math.ceil(
                  (visibleParticipants.length + (remainingCount > 0 ? 1 : 0)) /
                    columns
                )})`,
              }}
              onClick={() => setShowAllParticipants(true)}
            >
              <div className="flex flex-col items-center justify-center w-full h-full">
                <Users className="h-6 w-6" />
                <span className="text-base font-medium">+{remainingCount}</span>
                <span className="text-xs text-muted-foreground">View all</span>
              </div>
            </Button>
          )}
        </div>
      </div>

      <Dialog open={showAllParticipants} onOpenChange={setShowAllParticipants}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>All Participants ({participants.length})</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted"
              >
                <div className="relative w-16 h-16 rounded-md overflow-hidden">
                  <Image
                    src={participant.image || "/placeholder.svg"}
                    alt={participant.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium">{participant.name}</div>
                  {socket?.id && participant.id === socket.id && (
                    <div className="text-sm text-muted-foreground">You</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
