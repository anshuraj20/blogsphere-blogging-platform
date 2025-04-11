
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Keyboard } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface SpeechToTextButtonProps {
  className?: string;
}

const SpeechToTextButton: React.FC<SpeechToTextButtonProps> = ({
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={className}
        >
          <Mic className="h-4 w-4 mr-2" />
          Use Speech-to-Text
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Use Windows Speech-to-Text</DialogTitle>
          <DialogDescription>
            Windows has a built-in speech recognition feature you can use to dictate text.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-4">
            <div className="bg-muted p-2 rounded-md">
              <Keyboard className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Press Windows + H on your keyboard</p>
              <p className="text-sm text-muted-foreground">
                This opens Windows' built-in speech recognition bar
              </p>
            </div>
          </div>
          <div className="rounded-md bg-muted p-4">
            <p className="text-sm">
              <strong>Note:</strong> This feature only works on Windows devices with a microphone.
              After pressing Win+H, speak clearly into your microphone and Windows will convert
              your speech to text in the current input field.
            </p>
          </div>
        </div>
        <DialogClose asChild>
          <Button type="button">Got it</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default SpeechToTextButton;
