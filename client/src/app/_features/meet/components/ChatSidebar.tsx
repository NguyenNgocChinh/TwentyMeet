"use client";

import { useState } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ChatSidebar() {
  const [messages, setMessages] = useState([
    { id: 1, sender: "John Doe", message: "Hello everyone!", time: "10:00 AM" },
    { id: 2, sender: "Jane Smith", message: "Hi John!", time: "10:01 AM" },
    {
      id: 3,
      sender: "Mike Johnson",
      message: "Can everyone hear me okay?",
      time: "10:02 AM",
    },
  ]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Meeting chat</h2>
      </div>
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{message.sender}</span>
                <span className="text-xs text-muted-foreground">
                  {message.time}
                </span>
              </div>
              <p className="text-sm">{message.message}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <form className="flex gap-2">
          <Input placeholder="Type a message..." className="flex-1" />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
