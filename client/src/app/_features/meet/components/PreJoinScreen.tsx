"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Camera, Mic, MoreVertical, Speaker } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMedia } from "../providers/MediaProvider";
import { AudioWaveform } from "./AudioWaveform";
import { ToggleMicButton } from "./ToggleMicButton";
import { ToggleVideoButton } from "./ToggleVideoButton";

interface DeviceInfo {
  deviceId: string;
  label: string;
}

interface PreJoinScreenProps {
  onJoin: () => void;
}

export function PreJoinScreen({ onJoin }: PreJoinScreenProps) {
  const { isMuted, isVideoOff } = useMedia();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [audioInputs, setAudioInputs] = useState<DeviceInfo[]>([]);
  const [audioOutputs, setAudioOutputs] = useState<DeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<DeviceInfo[]>([]);
  const [selectedAudioInput, setSelectedAudioInput] = useState<string>("");
  const [selectedAudioOutput, setSelectedAudioOutput] = useState<string>("");
  const [selectedVideo, setSelectedVideo] = useState<string>("");

  useEffect(() => {
    async function getDevices() {
      try {
        // Request permission to access media devices
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true });

        const devices = await navigator.mediaDevices.enumerateDevices();

        const mics = devices.filter((device) => device.kind === "audioinput");
        const speakers = devices.filter(
          (device) => device.kind === "audiooutput"
        );
        const cameras = devices.filter(
          (device) => device.kind === "videoinput"
        );

        setAudioInputs(
          mics.map((device) => ({
            deviceId: device.deviceId,
            label: device.label || "Microphone",
          }))
        );
        setSelectedAudioInput(mics[0]?.deviceId || "");

        setAudioOutputs(
          speakers.map((device) => ({
            deviceId: device.deviceId,
            label: device.label || "Speaker",
          }))
        );
        setSelectedAudioOutput(speakers[0]?.deviceId || "");

        setVideoDevices(
          cameras.map((device) => ({
            deviceId: device.deviceId,
            label: device.label || "Camera",
          }))
        );
        setSelectedVideo(cameras[0]?.deviceId || "");
      } catch (error) {
        console.error("Error getting devices:", error);
      }
    }

    getDevices();
  }, []);

  // Khởi tạo stream
  useEffect(() => {
    if (videoRef.current && !streamRef.current) {
      streamRef.current = new MediaStream();
      videoRef.current.srcObject = streamRef.current;
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Xử lý video track
  useEffect(() => {
    let videoStream: MediaStream | null = null;

    async function setupVideoTrack() {
      try {
        if (!streamRef.current || !videoRef.current) return;

        // Dừng và xóa video track hiện tại nếu có
        const currentVideoTrack = streamRef.current.getVideoTracks()[0];
        if (currentVideoTrack) {
          streamRef.current.removeTrack(currentVideoTrack);
          currentVideoTrack.stop();
        }

        // Đảm bảo video element được cập nhật khi tắt camera
        if (isVideoOff) {
          videoRef.current.srcObject = streamRef.current;
          return;
        }

        // Nếu video đang bật, thêm track mới
        try {
          videoStream = await navigator.mediaDevices.getUserMedia({
            video: selectedVideo ? { deviceId: selectedVideo } : true,
            audio: false,
          });

          const newVideoTrack = videoStream.getVideoTracks()[0];
          if (newVideoTrack) {
            streamRef.current.addTrack(newVideoTrack);

            // Đợi một frame để đảm bảo video element đã được cập nhật
            await new Promise((resolve) => requestAnimationFrame(resolve));

            videoRef.current.srcObject = streamRef.current;

            // Đợi video element load metadata
            await new Promise((resolve) => {
              if (videoRef.current!.readyState >= 1) {
                resolve(undefined);
              } else {
                videoRef.current!.addEventListener(
                  "loadedmetadata",
                  () => resolve(undefined),
                  { once: true }
                );
              }
            });
          }
        } catch (error) {
          console.error("Error getting video stream:", error);
        }
      } catch (error) {
        console.error("Error handling video track:", error);
      }
    }

    setupVideoTrack();

    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isVideoOff, selectedVideo]);

  // Xử lý audio track
  useEffect(() => {
    async function setupAudioTrack() {
      try {
        if (!streamRef.current) return;

        const currentAudioTrack = streamRef.current.getAudioTracks()[0];

        if (!isMuted && selectedAudioInput) {
          if (
            !currentAudioTrack ||
            currentAudioTrack.getSettings().deviceId !== selectedAudioInput
          ) {
            if (currentAudioTrack) {
              streamRef.current.removeTrack(currentAudioTrack);
              currentAudioTrack.stop();
            }
            const audioStream = await navigator.mediaDevices.getUserMedia({
              audio: { deviceId: selectedAudioInput },
              video: false,
            });
            const newAudioTrack = audioStream.getAudioTracks()[0];
            if (newAudioTrack) {
              streamRef.current.addTrack(newAudioTrack);
            }
          }
        } else if (currentAudioTrack) {
          streamRef.current.removeTrack(currentAudioTrack);
          currentAudioTrack.stop();
        }
      } catch (error) {
        console.error("Error handling audio track:", error);
      }
    }

    setupAudioTrack();
  }, [isMuted, selectedAudioInput]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#202124]">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4">
          <div className="text-white text-lg truncate">Chinh Nguyen Ngoc</div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 text-white hover:bg-[#3c4043]"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          {/* Preview container */}
          <div className="relative w-full max-w-[720px] aspect-video bg-black rounded-lg overflow-hidden">
            {!isMuted && (
              <div className="absolute top-12 right-6 z-10">
                <AudioWaveform isActive={!isMuted} />
              </div>
            )}
            {!isVideoOff ? (
              <video
                ref={videoRef}
                className="w-full h-full object-cover [transform:rotateY(180deg)]"
                autoPlay
                playsInline
                muted
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-base md:text-xl bg-[#3c4043]">
                Camera is off
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center gap-4">
            <ToggleMicButton />
            <ToggleVideoButton />
          </div>

          {/* Device Selection */}
          <div className="mt-4 flex flex-col md:flex-row items-start md:items-center gap-4 w-full max-w-[720px]">
            <div className="flex items-center gap-2 text-white text-sm w-full md:w-auto">
              <Mic className="h-4 w-4 shrink-0" />
              <Select
                value={selectedAudioInput}
                onValueChange={setSelectedAudioInput}
                defaultValue={audioInputs[0]?.deviceId}
              >
                <SelectTrigger className="w-full md:w-[200px] bg-transparent border-0 text-white hover:bg-[#3c4043] focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Select microphone" />
                </SelectTrigger>
                <SelectContent>
                  {audioInputs.map((device) => (
                    <SelectItem
                      key={device.deviceId}
                      value={device.deviceId}
                      className="cursor-pointer"
                    >
                      {device.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 text-white text-sm w-full md:w-auto">
              <Speaker className="h-4 w-4 shrink-0" />
              <Select
                value={selectedAudioOutput}
                onValueChange={setSelectedAudioOutput}
                defaultValue={audioOutputs[0]?.deviceId}
              >
                <SelectTrigger className="w-full md:w-[200px] bg-transparent border-0 text-white hover:bg-[#3c4043] focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Select speaker" />
                </SelectTrigger>
                <SelectContent>
                  {audioOutputs.map((device) => (
                    <SelectItem
                      key={device.deviceId}
                      value={device.deviceId}
                      className="cursor-pointer"
                    >
                      {device.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2 text-white text-sm w-full md:w-auto">
              <Camera className="h-4 w-4 shrink-0" />
              <Select
                value={selectedVideo}
                onValueChange={setSelectedVideo}
                defaultValue={videoDevices[0]?.deviceId}
              >
                <SelectTrigger className="w-full md:w-[200px] bg-transparent border-0 text-white hover:bg-[#3c4043] focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Select camera" />
                </SelectTrigger>
                <SelectContent>
                  {videoDevices.map((device) => (
                    <SelectItem
                      key={device.deviceId}
                      value={device.deviceId}
                      className="cursor-pointer"
                    >
                      {device.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Right side info */}
      <div className="w-full md:w-[400px] bg-white p-4 md:p-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-xl md:text-2xl">Awesome daily MTG</h1>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            Scheduled for
          </div>
          <div className="text-base md:text-lg">Mon, Feb 17 9:00 AM</div>
          <div className="flex flex-col gap-2">
            <Button
              size="lg"
              className="bg-[#1a73e8] hover:bg-blue-700 text-white w-full"
              onClick={onJoin}
            >
              Join anyway
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-[#1a73e8] border-[#1a73e8] w-full"
            >
              Other ways to join
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
