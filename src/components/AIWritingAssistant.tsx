
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Sparkles, 
  Edit, 
  Zap, 
  Scissors, 
  Check, 
  ArrowRight,
  MessageSquare,
  RotateCw,
  ChevronDown
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/components/ui/use-toast";

interface AIWritingAssistantProps {
  content: string;
  onSuggestionApply: (suggestion: string) => void;
}

const AIWritingAssistant = ({ content, onSuggestionApply }: AIWritingAssistantProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const { toast } = useToast();

  // Mock function to simulate AI generating suggestions
  const generateSuggestions = () => {
    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockSuggestions = [
        "Consider adding more specific examples to illustrate your point. This will help readers better understand and apply your insights.",
        "The middle section could benefit from more concise phrasing. Try condensing the third paragraph to improve readability.",
        "Your conclusion feels abrupt. Consider adding a call-to-action or suggesting next steps for readers interested in learning more.",
      ];
      
      setSuggestions(mockSuggestions);
      setIsGenerating(false);
      
      toast({
        title: "Suggestions generated",
        description: "AI has analyzed your content and provided recommendations.",
      });
    }, 2000);
  };

  const handleApplySuggestion = (suggestion: string) => {
    onSuggestionApply(suggestion);
    
    toast({
      title: "Suggestion applied",
      description: "The AI suggestion has been incorporated into your content.",
    });
  };

  return (
    <div className="w-full">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="border rounded-lg overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 bg-blogSphere-50">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blogSphere-600" />
            <h3 className="font-medium">AI Writing Assistant</h3>
            <Badge variant="outline" className="bg-blogSphere-100">Beta</Badge>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent>
          <div className="p-4 bg-white">
            <Tabs defaultValue="suggestions">
              <TabsList className="mb-4">
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                <TabsTrigger value="grammar">Grammar Check</TabsTrigger>
                <TabsTrigger value="rewrite">Rewrite</TabsTrigger>
                <TabsTrigger value="chat">Ask AI</TabsTrigger>
              </TabsList>
              
              <TabsContent value="suggestions">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Get intelligent suggestions to improve your writing
                    </p>
                    <Button 
                      onClick={generateSuggestions} 
                      disabled={isGenerating}
                      size="sm"
                      className="gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <RotateCw className="h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4" />
                          Analyze Content
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {suggestions.length > 0 ? (
                    <div className="space-y-3">
                      {suggestions.map((suggestion, index) => (
                        <Card key={index} className="overflow-hidden">
                          <CardContent className="p-4">
                            <p className="text-sm mb-3">{suggestion}</p>
                            <div className="flex justify-end">
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="gap-1"
                                onClick={() => handleApplySuggestion(suggestion)}
                              >
                                <Check className="h-3 w-3" />
                                Apply
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground text-sm">
                      {isGenerating ? (
                        <p>Analyzing your content for suggestions...</p>
                      ) : (
                        <p>Click "Analyze Content" to get AI-powered suggestions</p>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="grammar">
                <div className="text-center py-10 space-y-3">
                  <Edit className="h-10 w-10 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">
                    Grammar and spelling check will appear here
                  </p>
                  <Button variant="outline" disabled>Run Grammar Check</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="rewrite">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <Zap className="h-3 w-3" />
                      Simplify
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Edit className="h-3 w-3" />
                      Formal
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
                      <Scissors className="h-3 w-3" />
                      Shorten
                    </Button>
                  </div>
                  
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    <p>Select text from your content and choose a rewrite style</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="chat">
                <div className="space-y-4">
                  <div className="bg-secondary/30 rounded-lg p-4 h-[150px] overflow-y-auto">
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Sparkles className="h-5 w-5 text-blogSphere-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm bg-blogSphere-50 p-2 rounded-lg">
                          How can I help with your writing today?
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Textarea 
                      placeholder="Ask something about your content..."
                      className="resize-none"
                      rows={1}
                    />
                    <Button size="icon">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    <p className="text-xs text-muted-foreground mb-1 w-full">Suggested questions:</p>
                    <Button variant="outline" size="sm" className="text-xs h-7">How can I make my intro more engaging?</Button>
                    <Button variant="outline" size="sm" className="text-xs h-7">Suggest a better title</Button>
                    <Button variant="outline" size="sm" className="text-xs h-7">Help me with transitions</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default AIWritingAssistant;
