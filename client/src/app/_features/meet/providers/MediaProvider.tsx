"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

interface MediaContextType {
  isMuted: boolean;
  isVideoOff: boolean;
  toggleMic: () => void;
  toggleVideo: () => void;
  audioStream: MediaStream | null;
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  useEffect(() => {
    if (streamRef.current) return;

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        streamRef.current = stream;
        setAudioStream(stream);

        const context = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: unknown })
            .webkitAudioContext)();
        const analyserNode = context.createAnalyser();
        analyserNode.fftSize = 32;

        const source = context.createMediaStreamSource(stream);
        source.connect(analyserNode);

        setAudioContext(context);
        setAnalyser(analyserNode);
      })
      .catch(console.error);

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, []);

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      audioTrack.enabled = isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => setIsVideoOff(!isVideoOff);

  return (
    <MediaContext.Provider
      value={{
        isMuted,
        isVideoOff,
        toggleMic,
        toggleVideo,
        audioStream,
        audioContext,
        analyser,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
}

export const useMedia = () => {
  const context = useContext(MediaContext);
  if (context === undefined) {
    throw new Error("useMedia must be used within a MediaProvider");
  }
  return context;
};
