"use client";

import { ChatSidebar } from "@/app/_features/meet/components/ChatSidebar";
import { MeetingInfo } from "@/app/_features/meet/components/MeetingInfo";
import { ParticipantGrid } from "@/app/_features/meet/components/ParticipantGrid";
import { PreJoinScreen } from "@/app/_features/meet/components/PreJoinScreen";
import { ToggleMicButton } from "@/app/_features/meet/components/ToggleMicButton";
import { ToggleVideoButton } from "@/app/_features/meet/components/ToggleVideoButton";
import { MediaProvider } from "@/app/_features/meet/providers/MediaProvider";
import {
  SocketProvider,
  useSocketProvider,
} from "@/app/_features/socket/providers/SocketProvider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  Hand,
  MessageSquare,
  MonitorUp,
  MoreVertical,
  Phone,
  Users,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function MeetingPage() {
  const params = useParams<{ slug: string; item: string }>();
  const router = useRouter();
  const [showInfo, setShowInfo] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isInMeeting, setIsInMeeting] = useState(false);
  const { joinMeeting, socket } = useSocketProvider();

  const handleJoinMeeting = () => {
    console.log("🚀 ~ MeetingPage ~ socket:", socket);
    joinMeeting(params.slug);
    setIsInMeeting(true);
  };

  if (!isInMeeting) {
    if (!params.slug) {
      router.push("/");
      return null;
    }

    return (
      <SocketProvider>
        <MediaProvider>
          <PreJoinScreen onJoin={handleJoinMeeting} />
        </MediaProvider>
      </SocketProvider>
    );
  }

  return (
    <SocketProvider>
      <MediaProvider>
        <div className="flex h-screen bg-black">
          <main className="flex-1 flex flex-col">
            <div className="flex-1 relative">
              <ParticipantGrid />
            </div>
            <div className="h-16 md:h-20 bg-[#202124] flex items-center justify-center px-2 md:px-4 text-white">
              <div className="flex items-center gap-2 md:gap-3 w-full justify-between">
                {/* Time info - Left section */}
                <div className="hidden md:flex text-sm min-w-[100px] gap-2 items-center">
                  <span className="font-bold">10:45 PM</span>
                  <span>|</span>
                  <span className="font-bold">MTG ABCXYZ</span>
                </div>

                {/* Main controls - Center section */}
                <div className="flex items-center gap-2 md:gap-3">
                  <ToggleMicButton />
                  <ToggleVideoButton />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden md:flex rounded-full h-12 w-12 bg-[#3c4043] hover:text-black text-white"
                  >
                    <MonitorUp className="h-5 w-5" />
                    <span className="sr-only">Present screen</span>
                  </Button>
                  <Button
                    variant={isHandRaised ? "secondary" : "ghost"}
                    size="icon"
                    className={cn(
                      "rounded-full h-10 w-10 md:h-12 md:w-12 bg-[#3c4043] hover:text-black text-white",
                      isHandRaised && "bg-yellow-500"
                    )}
                    onClick={() => setIsHandRaised(!isHandRaised)}
                  >
                    <Hand className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="sr-only">Raise hand</span>
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="rounded-full h-10 w-10 md:h-12 md:w-12"
                  >
                    <Phone className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="sr-only">Leave call</span>
                  </Button>
                </div>

                {/* Additional controls - Right section */}
                <div className="flex items-center gap-1 md:gap-2 justify-end">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full h-8 w-8 md:h-10 md:w-10"
                      >
                        <MessageSquare className="h-4 w-4 md:h-5 md:w-5" />
                        <span className="sr-only">Chat</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-full sm:w-[400px] md:w-[540px] p-0">
                      <ChatSidebar />
                    </SheetContent>
                  </Sheet>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8 md:h-10 md:w-10"
                    onClick={() => setShowInfo(true)}
                  >
                    <Users className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="sr-only">Meeting info</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8 md:h-10 md:w-10"
                  >
                    <MoreVertical className="h-4 w-4 md:h-5 md:w-5" />
                    <span className="sr-only">More options</span>
                  </Button>
                </div>
              </div>
            </div>
          </main>
          <MeetingInfo open={showInfo} onClose={() => setShowInfo(false)} />
        </div>
      </MediaProvider>
    </SocketProvider>
  );
}
