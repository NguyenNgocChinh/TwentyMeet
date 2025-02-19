import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface MeetingInfoProps {
  open: boolean;
  onClose: () => void;
}

export function MeetingInfo({ open, onClose }: MeetingInfoProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Meeting info</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Meeting link</label>
            <div className="flex gap-2">
              <Input
                readOnly
                value="https://meet.google.com/abc-defg-hij"
                className="flex-1"
              />
              <Button variant="secondary" size="icon">
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy link</span>
              </Button>
            </div>
          </div>
          <div>
            <h3 className="font-medium mb-2">Participants (4)</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">You (Host)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">John Doe</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Jane Smith</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Mike Johnson</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
