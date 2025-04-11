
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';

interface SpeechToTextButtonProps {
  onTranscriptChange: (text: string) => void;
  initialContent?: string;
  className?: string;
}

const SpeechToTextButton: React.FC<SpeechToTextButtonProps> = ({
  onTranscriptChange,
  initialContent = '',
  className = '',
}) => {
  const [content, setContent] = useState(initialContent);
  
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    hasRecognitionSupport,
    error,
    microphonePermission,
    isOnline,
    retryingCount
  } = useSpeechRecognition();
  
  // Update content when transcript changes
  React.useEffect(() => {
    if (transcript) {
      const newContent = initialContent + (initialContent ? ' ' : '') + transcript;
      setContent(newContent);
      onTranscriptChange(newContent);
    }
  }, [transcript, initialContent, onTranscriptChange]);
  
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      // Reset the transcript to avoid duplicating content
      resetTranscript();
      startListening();
    }
  };
  
  // If browser doesn't support speech recognition
  if (!hasRecognitionSupport) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled
        className={className}
        title="Your browser does not support speech recognition"
      >
        <Mic className="h-4 w-4 mr-2" />
        Not Supported
      </Button>
    );
  }
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {/* Network status indicator */}
        {!isOnline && (
          <div className="flex items-center text-destructive text-xs mr-2">
            <WifiOff className="h-3 w-3 mr-1" />
            <span>Offline</span>
          </div>
        )}
        
        {/* Error indicator */}
        {error && error !== 'network' && (
          <div className="flex items-center text-destructive text-xs">
            <AlertCircle className="h-3 w-3 mr-1" />
            <span>Error: {error}</span>
          </div>
        )}
        
        {/* Speech recognition button */}
        <Button
          type="button"
          variant={isListening ? "destructive" : "outline"}
          size="sm"
          onClick={toggleListening}
          disabled={microphonePermission === false || !isOnline}
          title={
            microphonePermission === false 
              ? "Microphone permission is required" 
              : !isOnline 
                ? "Internet connection required" 
                : ""
          }
          className={className}
        >
          {isListening ? (
            <>
              <MicOff className="h-4 w-4 mr-2" />
              Stop Dictation
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 mr-2" />
              Start Dictation
            </>
          )}
        </Button>
        
        {/* Retrying indicator */}
        {retryingCount > 0 && error === 'network' && (
          <div className="flex items-center justify-center h-8 px-2 bg-orange-500 rounded-full text-white text-xs">
            <span>Retrying {retryingCount}/3</span>
          </div>
        )}
      </div>
      
      {/* Network error message */}
      {error === 'network' && (
        <div className="text-sm p-2 border border-red-200 bg-red-50 rounded text-red-800 flex items-start gap-2 mt-2">
          <WifiOff className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Network Error Detected</p>
            <p className="text-xs mt-1">Speech recognition requires a stable internet connection. Please check the following:</p>
            <ul className="text-xs list-disc pl-4 mt-1 space-y-1">
              <li>Your Wi-Fi or cellular connection is active</li>
              <li>You have stable internet access</li>
              <li>Your firewall isn't blocking speech recognition services</li>
              <li>Try refreshing the page or using a different browser</li>
            </ul>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 h-7 text-xs"
              onClick={() => {
                resetTranscript();
                startListening();
              }}
              disabled={!isOnline}
            >
              <Wifi className="h-3 w-3 mr-1" /> 
              Try Again
            </Button>
          </div>
        </div>
      )}
      
      {/* Microphone permission message */}
      {microphonePermission === false && (
        <div className="text-sm p-2 border border-orange-200 bg-orange-50 rounded text-orange-800 flex items-start gap-2 mt-2">
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">Microphone access is required for speech-to-text</p>
            <p className="text-xs mt-1">Please allow microphone access in your browser settings and refresh the page.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 h-7 text-xs"
              onClick={startListening}
            >
              Request Permission Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeechToTextButton;
