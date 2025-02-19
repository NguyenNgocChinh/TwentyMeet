"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Video, Users, Calendar, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useSocketProvider } from "../../socket/providers/SocketProvider";

export default function MeetScreen() {
  const [meetingCode, setMeetingCode] = useState("");
  const { createNewMeeting } = useSocketProvider();

  const handleJoinMeeting = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle joining meeting logic here
    console.log("Joining meeting:", meetingCode);
  };

  const handleNewMeeting = () => {
    createNewMeeting();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl">Twent Meet</CardTitle>
          <CardDescription>Create or join a meeting</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          {/* Create Meeting Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">New Meeting</h2>
            <div className="space-y-2">
              <Button
                onClick={handleNewMeeting}
                className="w-full justify-start gap-2"
                variant="default"
              >
                <Video className="h-4 w-4" />
                Start an instant meeting
              </Button>
              <Button className="w-full justify-start gap-2" variant="outline">
                <Calendar className="h-4 w-4" />
                Schedule in calendar
              </Button>
            </div>

            <div className="pt-4">
              <h3 className="text-sm font-medium mb-2">Recent meetings</h3>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Team Standup
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Project Review
                </Button>
              </div>
            </div>
          </div>

          <Separator className="block md:hidden my-4" />

          {/* Join Meeting Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Join a Meeting</h2>
            <form onSubmit={handleJoinMeeting} className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter meeting code"
                  value={meetingCode}
                  onChange={(e) => setMeetingCode(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" variant="secondary">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Enter a code or link
              </p>
            </form>

            <div className="rounded-lg bg-muted p-4 mt-4">
              <h3 className="text-sm font-medium mb-2">Meeting tips</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Make sure you have a stable internet connection</li>
                <li>• Use a headset for better audio quality</li>
                <li>• Find a quiet place for your meeting</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
