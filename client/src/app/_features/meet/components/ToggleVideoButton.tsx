"use client";

import { Video, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMedia } from "../providers/MediaProvider";

export function ToggleVideoButton() {
  const { isVideoOff, toggleVideo } = useMedia();

  return (
    <Button
      variant={isVideoOff ? "destructive" : "ghost"}
      size="icon"
      className={cn(
        "rounded-full h-10 w-10 md:h-12 md:w-12 bg-[#3c4043] hover:text-black text-white",
        isVideoOff && "bg-destructive"
      )}
      onClick={toggleVideo}
    >
      {isVideoOff ? (
        <VideoOff className="h-4 w-4 md:h-5 md:w-5" />
      ) : (
        <Video className="h-4 w-4 md:h-5 md:w-5" />
      )}
      <span className="sr-only">Toggle camera</span>
    </Button>
  );
}
