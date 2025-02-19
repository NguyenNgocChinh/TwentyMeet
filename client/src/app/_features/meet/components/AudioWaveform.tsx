"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useMedia } from "../providers/MediaProvider";

interface AudioWaveformProps {
  isActive: boolean;
}

export function AudioWaveform({ isActive }: AudioWaveformProps) {
  const [bars] = useState(Array.from({ length: 3 }));
  const [amplitudes, setAmplitudes] = useState<number[]>([0, 0, 0]);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number>(0);
  const { analyser, isMuted } = useMedia();
  const barKeys = ["left", "middle", "right"];

  useEffect(() => {
    if (!isActive || !analyser || isMuted) {
      return;
    }

    dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

    function updateAmplitudes() {
      if (!analyser || !dataArrayRef.current) return;

      animationFrameRef.current = requestAnimationFrame(updateAmplitudes);
      analyser.getByteFrequencyData(dataArrayRef.current);

      const newAmplitudes = Array.from({ length: 3 }, (_, i) => {
        const startIdx = i * 2;
        const avg =
          (dataArrayRef.current![startIdx] +
            dataArrayRef.current![startIdx + 1]) /
          2;
        const value = avg / 255;

        const smoothed = value * value * (3 - 2 * value);
        return Math.min(smoothed * 1.2, 1);
      });

      setAmplitudes(newAmplitudes);
    }

    updateAmplitudes();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, analyser, isMuted]);

  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center">
      <div className="flex items-center justify-center gap-[1px] h-8 w-8 bg-[#3C4043] rounded-full border border-white/20">
        {bars.map((_, index) => (
          <div
            key={barKeys[index]}
            className={cn(
              "w-1 bg-blue-400 rounded-full transition-all duration-150",
              "h-1.5"
            )}
            style={{
              transform: `scaleY(${
                isActive ? 1 + amplitudes[index] * 1.5 : 1
              })`,
              transition: "transform 50ms linear",
            }}
          />
        ))}
      </div>
    </div>
  );
}
