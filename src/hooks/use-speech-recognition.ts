
import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from './use-toast';

interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  maxNetworkRetries?: number;
  retryInterval?: number;
}

interface UseSpeechRecognitionResult {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  hasRecognitionSupport: boolean;
  error: string | null;
  microphonePermission: boolean | null;
  isOnline: boolean;
  retryingCount: number;
}

export const useSpeechRecognition = ({
  continuous = true,
  interimResults = true,
  lang = 'en-US',
  maxNetworkRetries = 3,
  retryInterval = 1000,
}: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionResult => {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [temporaryTranscript, setTemporaryTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hasRecognitionSupport, setHasRecognitionSupport] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState<boolean | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [retryingCount, setRetryingCount] = useState(0);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const retryTimeoutRef = useRef<number | null>(null);

  // Check for browser support and set up online/offline detection
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    setHasRecognitionSupport(!!SpeechRecognitionAPI);
    
    const handleOnline = () => {
      setIsOnline(true);
      setError(null);
      toast({
        title: "Back online",
        description: "Your internet connection has been restored"
      });
      
      // If we were listening before going offline, try to restart
      if (isListening) {
        startListeningImpl();
      }
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setError('network');
      toast({
        title: "Network disconnected",
        description: "You are offline. Speech recognition requires an internet connection",
        variant: "destructive"
      });
      
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.error("Error stopping recognition after going offline:", e);
        }
      }
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check for microphone permission
    const checkMicrophonePermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicrophonePermission(true);
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.error("Microphone permission error:", err);
        setMicrophonePermission(false);
      }
    };
    
    checkMicrophonePermission();
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      stopListeningImpl();
      
      if (retryTimeoutRef.current) {
        window.clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [toast]);

  // Clear retry timeout when component unmounts or when retrying stops
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        window.clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  // Implementation of start listening with all error handling
  const startListeningImpl = useCallback(() => {
    // Reset any previous errors when attempting to start
    setError(null);
    
    // Check for browser support
    if (!hasRecognitionSupport) {
      setError('not-supported');
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in your browser. Try using Chrome, Edge, or Safari.",
        variant: "destructive"
      });
      return;
    }
    
    // Check for microphone permission
    if (microphonePermission === false) {
      setError('permission-denied');
      toast({
        title: "Microphone Access Required",
        description: "Please allow microphone access in your browser settings to use speech-to-text",
        variant: "destructive"
      });
      return;
    }
    
    // Check for internet connection
    if (!navigator.onLine) {
      setError('network');
      toast({
        title: "No Internet Connection",
        description: "Speech recognition requires an internet connection. Please check your network.",
        variant: "destructive"
      });
      return;
    }
    
    // If already listening, don't restart
    if (recognitionRef.current && isListening) {
      return;
    }
    
    // Initialize SpeechRecognition
    try {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        // Stop any existing recognition instance
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (e) {
            console.error("Error stopping previous recognition instance:", e);
          }
        }
        
        const recognition = new SpeechRecognitionAPI();
        recognitionRef.current = recognition;
        
        recognition.continuous = continuous;
        recognition.interimResults = interimResults;
        recognition.lang = lang;
        
        recognition.onstart = () => {
          console.log("Speech recognition started");
          setIsListening(true);
          setRetryingCount(0);
          setError(null);
          toast({
            title: "Listening started",
            description: "Speak now, your words will be transcribed"
          });
        };
        
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          console.log("Speech recognition result received");
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }
          
          if (finalTranscript) {
            setTranscript(prev => {
              const spacer = prev.length > 0 && !prev.endsWith(' ') ? ' ' : '';
              return prev + spacer + finalTranscript;
            });
          }
          
          if (interimTranscript) {
            setTemporaryTranscript(interimTranscript);
          } else {
            setTemporaryTranscript('');
          }
        };
        
        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error', event.error, event.message);
          setError(event.error);
          
          let errorMessage = "There was an error with speech recognition.";
          let shouldAutoRetry = false;
          
          switch (event.error) {
            case 'network':
              errorMessage = "Network error. Please check your internet connection and try again.";
              shouldAutoRetry = navigator.onLine;
              break;
            case 'not-allowed':
            case 'permission-denied':
              errorMessage = "Microphone access was denied. Please check your browser permissions.";
              setMicrophonePermission(false);
              break;
            case 'aborted':
              errorMessage = "Speech recognition was aborted.";
              break;
            case 'audio-capture':
              errorMessage = "No microphone was detected or it's not working properly.";
              break;
            case 'no-speech':
              errorMessage = "No speech was detected. Please try speaking again.";
              shouldAutoRetry = true;
              break;
            case 'service-not-allowed':
              errorMessage = "Speech recognition service is not allowed on this device or browser.";
              break;
          }
          
          // Only show toast for errors that aren't auto-retried
          if (event.error !== 'no-speech') {
            toast({
              title: "Speech Recognition Error",
              description: errorMessage,
              variant: "destructive"
            });
          }
          
          // Handle auto-retry for network errors when online
          if (shouldAutoRetry && (event.error === 'network' || event.error === 'no-speech')) {
            if (retryingCount < maxNetworkRetries) {
              // For network errors, retry with backoff
              const backoffTime = retryInterval * Math.pow(2, retryingCount);
              console.log(`Will retry in ${backoffTime}ms (attempt ${retryingCount + 1}/${maxNetworkRetries})`);
              
              if (retryTimeoutRef.current) {
                window.clearTimeout(retryTimeoutRef.current);
              }
              
              retryTimeoutRef.current = window.setTimeout(() => {
                if (navigator.onLine && isListening) {
                  setRetryingCount(prev => prev + 1);
                  try {
                    recognition.start();
                  } catch (e) {
                    console.error("Error restarting recognition after error:", e);
                  }
                }
              }, backoffTime);
            } else {
              // Max retries reached
              setIsListening(false);
              toast({
                title: "Connection failed",
                description: "Maximum retry attempts reached. Please check your connection and try again.",
                variant: "destructive"
              });
            }
          } else if (event.error !== 'no-speech') {
            // For non-network errors (except no-speech), stop listening
            setIsListening(false);
          }
        };
        
        recognition.onend = () => {
          console.log("Speech recognition ended");
          
          // If we're supposed to be listening and there was no critical error, restart
          if (isListening && !['permission-denied', 'not-allowed', 'audio-capture', 'service-not-allowed'].includes(error || '')) {
            try {
              // Small delay to prevent rapid restarts
              setTimeout(() => {
                if (isListening && navigator.onLine) {
                  try {
                    recognition.start();
                  } catch (e) {
                    console.error("Error restarting recognition after end:", e);
                    setIsListening(false);
                  }
                }
              }, 300);
            } catch (e) {
              console.error("Error scheduling recognition restart:", e);
              setIsListening(false);
            }
          } else {
            setIsListening(false);
          }
        };
        
        try {
          recognition.start();
        } catch (e) {
          console.error("Error starting recognition:", e);
          setError('start-error');
          setIsListening(false);
          toast({
            title: "Error",
            description: "Could not start speech recognition. Please try again.",
            variant: "destructive"
          });
        }
      }
    } catch (e) {
      console.error("Error initializing speech recognition:", e);
      setError('initialization-error');
      setIsListening(false);
      toast({
        title: "Error",
        description: "Could not initialize speech recognition. Please try again.",
        variant: "destructive"
      });
    }
  }, [continuous, interimResults, lang, maxNetworkRetries, retryInterval, hasRecognitionSupport, microphonePermission, isListening, toast, error, retryingCount]);

  // Implementation of stop listening
  const stopListeningImpl = useCallback(() => {
    // Clear any pending retries
    if (retryTimeoutRef.current) {
      window.clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        // Also abort to make sure any pending network requests are canceled
        if ('abort' in recognitionRef.current) {
          recognitionRef.current.abort();
        }
      } catch (e) {
        console.error("Error stopping recognition:", e);
      }
    }
    
    setIsListening(false);
    setRetryingCount(0);
  }, []);

  // Request microphone permission
  const requestMicrophonePermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicrophonePermission(true);
      stream.getTracks().forEach(track => track.stop());
      setError(null);
      return true;
    } catch (err) {
      console.error("Failed to get microphone permission:", err);
      setMicrophonePermission(false);
      setError('permission-denied');
      toast({
        title: "Permission Denied",
        description: "Please allow microphone access in your browser settings to use speech-to-text",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  // Public API for starting listening
  const startListening = useCallback(async () => {
    // If permission hasn't been checked or was denied, request it
    if (microphonePermission === null || microphonePermission === false) {
      const granted = await requestMicrophonePermission();
      if (!granted) return;
    }
    
    startListeningImpl();
  }, [microphonePermission, requestMicrophonePermission, startListeningImpl]);

  // Public API for stopping listening
  const stopListening = useCallback(() => {
    stopListeningImpl();
    toast({
      title: "Listening stopped",
      description: "Speech recognition has been stopped"
    });
  }, [stopListeningImpl, toast]);

  // Reset transcript
  const resetTranscript = useCallback(() => {
    setTranscript('');
    setTemporaryTranscript('');
  }, []);

  return {
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
  };
};
