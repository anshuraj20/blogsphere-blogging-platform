
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AIWritingAssistant from "@/components/AIWritingAssistant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Save, 
  Image as ImageIcon, 
  FileText, 
  Eye,
  PenSquare,
  CheckCircle,
  Upload,
  X,
  Mic,
  MicOff,
  AlertCircle,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useAuth, Post } from "@/contexts/AuthContext";

// Mock data for categories
const CATEGORIES = [
  { value: "technology", label: "Technology" },
  { value: "writing", label: "Writing" },
  { value: "productivity", label: "Productivity" },
  { value: "creativity", label: "Creativity" },
  { value: "personal-growth", label: "Personal Growth" },
  { value: "publishing", label: "Publishing" },
];

const CreatePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, getUserPosts, addUserPost, updateUserPost } = useAuth();
  const isEditMode = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Speech recognition states
  const [isListening, setIsListening] = useState(false);
  const [recognitionInstance, setRecognitionInstance] = useState<SpeechRecognition | null>(null);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const [microphonePermission, setMicrophonePermission] = useState<boolean | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [networkRetryCount, setNetworkRetryCount] = useState(0);
  const maxRetryAttempts = 3;
  const retryTimeoutRef = useRef<number | null>(null);
  
  // Online/offline status tracking
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Back online",
        description: "Your internet connection has been restored"
      });
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Network disconnected",
        description: "You are offline. Speech recognition requires an internet connection",
        variant: "destructive"
      });
      
      // Automatically stop recognition if it's running
      if (isListening) {
        stopListening();
      }
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isListening, toast]);
  
  // Load post data if in edit mode
  useEffect(() => {
    if (isEditMode && user) {
      const userPosts = getUserPosts();
      const post = userPosts.find(p => p.id === id);
      
      if (post) {
        setTitle(post.title);
        setContent(post.content);
        setCategory(post.category);
        setTags(post.tags.join(", "));
        setCoverImage(post.coverImage);
        setImagePreview(post.coverImage);
      }
    }
  }, [isEditMode, id, user, getUserPosts]);
  
  // Check for microphone permission
  useEffect(() => {
    const checkMicrophonePermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicrophonePermission(true);
        
        // Close the stream since we're just checking permission
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.error("Microphone permission error:", err);
        setMicrophonePermission(false);
      }
    };
    
    checkMicrophonePermission();
    
    // Clean up any retry timeouts when component unmounts
    return () => {
      if (retryTimeoutRef.current) {
        window.clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);
  
  const formatDate = () => {
    const now = new Date();
    return now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const handleImageSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      setImageFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setCoverImage("");
      };
      reader.readAsDataURL(file);
      
      toast({
        title: "Image selected",
        description: "Your cover image has been selected"
      });
    }
  };
  
  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
    setCoverImage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  // Request microphone permission again
  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicrophonePermission(true);
      
      // Close the stream
      stream.getTracks().forEach(track => track.stop());
      
      // Start listening now that we have permission
      startListening();
    } catch (err) {
      console.error("Failed to get microphone permission:", err);
      setMicrophonePermission(false);
      toast({
        title: "Permission Denied",
        description: "Please allow microphone access in your browser settings to use speech-to-text",
        variant: "destructive"
      });
    }
  };
  
  // Check for network connectivity
  const checkNetworkConnectivity = (): boolean => {
    const isConnected = navigator.onLine;
    
    if (!isConnected) {
      toast({
        title: "No Internet Connection",
        description: "Speech recognition requires an internet connection. Please check your network and try again.",
        variant: "destructive"
      });
      setRecognitionError("network");
    }
    
    return isConnected;
  };
  
  // Retry speech recognition after network error
  const retryAfterNetworkError = () => {
    if (networkRetryCount < maxRetryAttempts) {
      toast({
        title: "Retrying connection",
        description: `Attempting to reconnect (${networkRetryCount + 1}/${maxRetryAttempts})...`
      });
      
      setNetworkRetryCount(prev => prev + 1);
      
      // Retry after a delay (increasing delay with each retry)
      const delayMs = 1000 * (networkRetryCount + 1);
      
      if (retryTimeoutRef.current) {
        window.clearTimeout(retryTimeoutRef.current);
      }
      
      retryTimeoutRef.current = window.setTimeout(() => {
        if (navigator.onLine) {
          startListening();
        } else {
          toast({
            title: "Still offline",
            description: "Please check your internet connection",
            variant: "destructive"
          });
        }
      }, delayMs);
    } else {
      toast({
        title: "Connection failed",
        description: "Maximum retry attempts reached. Please check your internet connection and try again later.",
        variant: "destructive"
      });
      setNetworkRetryCount(0);
    }
  };
  
  // Speech recognition setup and functions
  const startListening = () => {
    // Reset any previous errors
    setRecognitionError(null);
    
    // Check if microphone permission is granted
    if (microphonePermission === false) {
      requestMicrophonePermission();
      return;
    }
    
    // Check network connectivity first
    if (!checkNetworkConnectivity()) {
      return;
    }
    
    // Check if the browser supports the Web Speech API
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognitionAPI) {
      try {
        // Initialize SpeechRecognition API
        const recognition = new SpeechRecognitionAPI();
        
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
          console.log("Speech recognition started");
          setIsListening(true);
          setNetworkRetryCount(0); // Reset retry count on successful start
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
            setContent(prev => {
              // Add a space if the previous content doesn't end with one
              const spacer = prev.length > 0 && !prev.endsWith(' ') ? ' ' : '';
              return prev + spacer + finalTranscript;
            });
          }
        };
        
        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error', event.error, event.message);
          setRecognitionError(event.error);
          
          let errorMessage = "There was an error with speech recognition.";
          
          // Handle specific error types
          switch (event.error) {
            case 'network':
              errorMessage = "Network error. Please check your internet connection and try again.";
              // Only attempt auto-retry for network errors
              if (navigator.onLine) {
                // Sometimes the browser reports online but there's still a network issue
                errorMessage = "Network error detected. Trying to reconnect...";
                retryAfterNetworkError();
              } else {
                setIsOnline(false);
              }
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
              // No-speech is common, automatically restart
              if (isListening) {
                try {
                  recognition.stop();
                  setTimeout(() => {
                    if (isListening) recognition.start();
                  }, 300);
                } catch (e) {
                  console.error("Error restarting after no-speech:", e);
                }
              }
              break;
            case 'service-not-allowed':
              errorMessage = "Speech recognition service is not allowed on this device or browser.";
              break;
          }
          
          toast({
            title: "Speech Recognition Error",
            description: errorMessage,
            variant: "destructive"
          });
          
          // Only fully stop listening for errors that can't be auto-recovered
          if (event.error !== 'network' && event.error !== 'no-speech') {
            setIsListening(false);
            setRecognitionInstance(null);
          }
        };
        
        recognition.onend = () => {
          console.log("Speech recognition ended");
          // Only restart if we're still supposed to be listening and there was no error
          if (isListening && !recognitionError) {
            console.log("Restarting speech recognition");
            try {
              recognition.start();
            } catch (e) {
              console.error("Error restarting recognition:", e);
              setIsListening(false);
              setRecognitionInstance(null);
            }
          } else if (recognitionError === 'network' && navigator.onLine) {
            // If it's a network error but we're online, try to restart once
            console.log("Network error but we're online, attempting to restart");
            retryAfterNetworkError();
          } else {
            setIsListening(false);
            setRecognitionInstance(null);
          }
        };
        
        // Additional handlers for better debugging
        recognition.onaudiostart = () => console.log("Audio capturing started");
        recognition.onaudioend = () => console.log("Audio capturing ended");
        recognition.onspeechstart = () => console.log("Speech detected");
        recognition.onspeechend = () => console.log("Speech ended");
        recognition.onnomatch = () => console.log("No match found");
        
        // Try to start recognition
        try {
          recognition.start();
          setRecognitionInstance(recognition);
        } catch (e) {
          console.error("Error starting recognition:", e);
          toast({
            title: "Error",
            description: "Could not start speech recognition. Please try again.",
            variant: "destructive"
          });
        }
      } catch (e) {
        console.error("Error initializing speech recognition:", e);
        toast({
          title: "Error",
          description: "Could not initialize speech recognition. Please try again.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in your browser. Try using Chrome, Edge, or Safari.",
        variant: "destructive"
      });
    }
  };
  
  const stopListening = () => {
    if (recognitionInstance) {
      try {
        recognitionInstance.stop();
        // Also abort to make sure any pending network requests are canceled
        if ('abort' in recognitionInstance) {
          recognitionInstance.abort();
        }
        toast({
          title: "Listening stopped",
          description: "Speech recognition has been stopped"
        });
      } catch (e) {
        console.error("Error stopping recognition:", e);
      } finally {
        setIsListening(false);
        setRecognitionInstance(null);
        setNetworkRetryCount(0);
        
        // Clear any pending retry timeouts
        if (retryTimeoutRef.current) {
          window.clearTimeout(retryTimeoutRef.current);
          retryTimeoutRef.current = null;
        }
      }
    }
  };
  
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  // Clean up speech recognition on component unmount
  useEffect(() => {
    return () => {
      if (recognitionInstance) {
        try {
          recognitionInstance.stop();
          if ('abort' in recognitionInstance) {
            recognitionInstance.abort();
          }
        } catch (e) {
          console.error("Error stopping recognition on unmount:", e);
        }
      }
      
      // Clear any timeouts
      if (retryTimeoutRef.current) {
        window.clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [recognitionInstance]);
  
  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your post",
        variant: "destructive"
      });
      navigate("/sign-in");
      return;
    }
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please add a title to your post",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    const tagsArray = tags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    // Use either the file preview or external URL
    const finalImageUrl = imagePreview || coverImage || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d";
    
    try {
      const currentDate = formatDate();
      
      if (isEditMode) {
        // Update existing post
        const success = updateUserPost(id, {
          title,
          content,
          excerpt: content.substring(0, 150) + (content.length > 150 ? "..." : ""),
          coverImage: finalImageUrl,
          category,
          tags: tagsArray,
          status: isDraft ? "draft" : "published",
          publishDate: isDraft ? undefined : currentDate,
          lastEdit: currentDate,
        });
        
        if (success) {
          toast({
            title: isDraft ? "Draft updated" : "Post updated",
            description: isDraft 
              ? "Your draft has been updated successfully" 
              : "Your post has been updated successfully",
          });
        } else {
          throw new Error("Failed to update post");
        }
      } else {
        // Create new post
        const newPost = addUserPost({
          title,
          content,
          excerpt: content.substring(0, 150) + (content.length > 150 ? "..." : ""),
          coverImage: finalImageUrl,
          category,
          tags: tagsArray,
          status: isDraft ? "draft" : "published",
          publishDate: isDraft ? undefined : currentDate,
          lastEdit: currentDate,
          views: 0,
          commentsCount: 0,
          likesCount: 0,
        });
        
        toast({
          title: isDraft ? "Draft saved" : "Post published",
          description: isDraft 
            ? "Your draft has been saved successfully" 
            : "Your post has been published successfully",
        });
      }
      
      // Navigate to the post or dashboard
      navigate(isDraft ? "/dashboard" : `/post/${id || "new"}`);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error saving your post. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8 bg-secondary/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-6">
            <div className="md:w-2/3">
              {previewMode ? (
                <Card className="shadow-lg">
                  <CardHeader className="pb-0">
                    <div className="flex justify-between items-center mb-4">
                      <Button
                        variant="outline"
                        onClick={() => setPreviewMode(false)}
                        className="gap-2"
                      >
                        <PenSquare className="h-4 w-4" />
                        Back to Editor
                      </Button>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={(e) => handleSubmit(e, true)}
                          disabled={isSubmitting}
                          className="gap-2"
                        >
                          <Save className="h-4 w-4" />
                          Save Draft
                        </Button>
                        <Button 
                          onClick={(e) => handleSubmit(e)}
                          disabled={isSubmitting}
                          className="gap-2"
                        >
                          {isSubmitting ? (
                            <>
                              <CheckCircle className="h-4 w-4 animate-pulse" />
                              Publishing...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              Publish
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    {(imagePreview || coverImage) && (
                      <div className="w-full aspect-video rounded-lg overflow-hidden mb-6">
                        <img 
                          src={imagePreview || coverImage}
                          alt={title} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <CardTitle className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
                      {title || "Untitled Post"}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="blog-content prose prose-lg max-w-none">
                      {content.split("\n\n").map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-lg">
                  <CardHeader>
                    <div className="flex justify-between items-center mb-4">
                      <CardTitle>{isEditMode ? "Edit Post" : "Create New Post"}</CardTitle>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setPreviewMode(true)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Preview
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          placeholder="Enter post title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cover-image">Cover Image</Label>
                        
                        <div className="flex flex-col gap-4">
                          {/* Image upload area */}
                          <div 
                            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors ${imagePreview ? 'border-green-300 bg-green-50' : 'border-gray-300'}`}
                            onClick={handleImageSelect}
                          >
                            <input 
                              type="file" 
                              ref={fileInputRef} 
                              className="hidden" 
                              accept="image/*"
                              onChange={handleImageChange}
                            />
                            
                            {imagePreview ? (
                              <div className="relative">
                                <img 
                                  src={imagePreview} 
                                  alt="Cover preview" 
                                  className="mx-auto max-h-[200px] rounded-md"
                                />
                                <Button 
                                  type="button" 
                                  variant="destructive" 
                                  size="icon"
                                  className="absolute top-2 right-2 h-6 w-6"
                                  onClick={(e) => { 
                                    e.stopPropagation();
                                    clearImage();
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center">
                                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                                <p className="text-sm font-medium">Click to upload image</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  JPG, PNG or GIF (max 5MB)
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label htmlFor="content">Content</Label>
                          <div className="flex items-center gap-2">
                            {/* Network status indicator */}
                            {!isOnline && (
                              <div className="flex items-center text-destructive text-xs mr-2">
                                <WifiOff className="h-3 w-3 mr-1" />
                                <span>Offline</span>
                              </div>
                            )}
                            
                            {/* Error indicator */}
                            {recognitionError && (
                              <div className="flex items-center text-destructive text-xs">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                <span>Error: {recognitionError}</span>
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
                              className="ml-2"
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
                          </div>
                        </div>
                        
                        <div className="relative">
                          <Textarea
                            id="content"
                            placeholder="Write your post here or use speech-to-text by clicking the microphone button..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className={`min-h-[300px] ${isListening ? 'border-green-500 focus-visible:ring-green-500' : ''}`}
                          />
                          
                          {/* Listening indicator */}
                          {isListening && (
                            <div className="absolute bottom-3 right-3">
                              <div className="flex items-center justify-center h-8 w-8 bg-green-500 rounded-full animate-pulse">
                                <Mic className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          )}
                          
                          {/* Retrying indicator */}
                          {networkRetryCount > 0 && recognitionError === 'network' && (
                            <div className="absolute bottom-3 right-14">
                              <div className="flex items-center justify-center h-8 px-2 bg-orange-500 rounded-full text-white text-xs">
                                <span>Retrying {networkRetryCount}/{maxRetryAttempts}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Network error message */}
                        {recognitionError === 'network' && (
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
                                  setRecognitionError(null);
                                  setNetworkRetryCount(0);
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
                                onClick={requestMicrophonePermission}
                              >
                                Request Permission Again
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select 
                            value={category} 
                            onValueChange={setCategory}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {CATEGORIES.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                  {cat.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="tags">Tags (comma separated)</Label>
                          <Input
                            id="tags"
                            placeholder="writing, tips, productivity"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                          />
                        </div>
                      </div>
                    </form>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={(e) => handleSubmit(e, true)}
                      disabled={isSubmitting}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Save Draft
                    </Button>
                    <Button 
                      onClick={(e) => handleSubmit(e)}
                      disabled={isSubmitting}
                      className="gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <CheckCircle className="h-4 w-4 animate-pulse" />
                          Publishing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Publish
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
            
            <div className="md:w-1/3 space-y-4">
              <AIWritingAssistant 
                content={content} 
                onContentUpdate={setContent} 
              />
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Publishing Tips</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <div className="rounded-full bg-green-100 p-1.5">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">Use a compelling title that draws readers in</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="rounded-full bg-green-100 p-1.5">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">Add a high-quality cover image for better engagement</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="rounded-full bg-green-100 p-1.5">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">Choose relevant categories and tags for discoverability</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="rounded-full bg-green-100 p-1.5">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm text-muted-foreground">Try using speech-to-text to capture your thoughts naturally</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatePost;
