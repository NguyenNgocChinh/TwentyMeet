"use client";

import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMedia } from "../providers/MediaProvider";

export function ToggleMicButton() {
  const { isMuted, toggleMic } = useMedia();

  return (
    <Button
      variant={isMuted ? "destructive" : "ghost"}
      size="icon"
      className={cn(
        "rounded-full h-10 w-10 md:h-12 md:w-12 bg-[#3c4043] hover:text-black text-white",
        isMuted && "bg-destructive"
      )}
      onClick={toggleMic}
    >
      {isMuted ? (
        <MicOff className="h-4 w-4 md:h-5 md:w-5" />
      ) : (
        <Mic className="h-4 w-4 md:h-5 md:w-5" />
      )}
      <span className="sr-only">Toggle microphone</span>
    </Button>
  );
}
