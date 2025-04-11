
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Keyboard } from 'lucide-react';

interface SpeechToTextButtonProps {
  className?: string;
}

const SpeechToTextButton: React.FC<SpeechToTextButtonProps> = ({
  className = '',
}) => {
  const showWindowsSpeechInstructions = () => {
    // Show instructions in a modal or tooltip
    alert("To use Windows Speech Recognition:\n\n1. Press Windows + H keys\n2. Speak into your microphone\n3. Windows will convert your speech to text in the current input field\n\nNote: This feature is only available on Windows devices.");
  };
  
  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={showWindowsSpeechInstructions}
        className={className}
      >
        <Mic className="h-4 w-4 mr-2" />
        Use Speech-to-Text (Win+H)
      </Button>
    </div>
  );
};

export default SpeechToTextButton;
