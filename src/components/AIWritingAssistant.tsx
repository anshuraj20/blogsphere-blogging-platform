
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent,
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
  RotateCw,
  ChevronDown
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from "@/components/ui/use-toast";
import { checkGrammar, rewriteText } from "@/utils/textProcessor";

interface AIWritingAssistantProps {
  content: string;
  onContentUpdate: (newContent: string) => void;
}

const AIWritingAssistant = ({ content, onContentUpdate }: AIWritingAssistantProps) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [grammarIssues, setGrammarIssues] = useState<string[]>([]);
  const { toast } = useToast();

  // Run grammar check
  const handleGrammarCheck = () => {
    setIsChecking(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const { corrected, issues } = checkGrammar(content);
      
      if (issues.length > 0) {
        setGrammarIssues(issues);
        onContentUpdate(corrected);
        
        toast({
          title: "Grammar check complete",
          description: `Found and fixed ${issues.length} issue${issues.length === 1 ? '' : 's'}.`,
        });
      } else {
        setGrammarIssues([]);
        
        toast({
          title: "Grammar check complete",
          description: "No issues found in your content."
        });
      }
      
      setIsChecking(false);
    }, 1500);
  };

  // Handle rewrite with specific style
  const handleRewrite = (style: "simplify" | "formal" | "shorten") => {
    setIsChecking(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const rewrittenText = rewriteText(content, style);
      onContentUpdate(rewrittenText);
      
      toast({
        title: "Content rewritten",
        description: `Your content has been rewritten in ${style} style.`,
      });
      
      setIsChecking(false);
    }, 2000);
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
            <Tabs defaultValue="grammar">
              <TabsList className="mb-4">
                <TabsTrigger value="grammar">Grammar Check</TabsTrigger>
                <TabsTrigger value="rewrite">Rewrite</TabsTrigger>
              </TabsList>
              
              <TabsContent value="grammar">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Check your content for grammar and spelling issues
                    </p>
                    <Button 
                      onClick={handleGrammarCheck} 
                      disabled={isChecking || !content}
                      size="sm"
                      className="gap-2"
                    >
                      {isChecking ? (
                        <>
                          <RotateCw className="h-4 w-4 animate-spin" />
                          Checking...
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4" />
                          Check Grammar
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {grammarIssues.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Issues Found</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          {grammarIssues.map((issue, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{issue}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                  
                  {grammarIssues.length === 0 && !isChecking && content && (
                    <p className="text-sm text-center py-4 text-muted-foreground">
                      Click "Check Grammar" to analyze your content
                    </p>
                  )}
                  
                  {!content && (
                    <p className="text-sm text-center py-4 text-muted-foreground">
                      Start writing to use the grammar checker
                    </p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="rewrite">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Choose a style to rewrite your content
                  </p>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      disabled={isChecking || !content}
                      onClick={() => handleRewrite("simplify")}
                    >
                      {isChecking ? (
                        <RotateCw className="h-3 w-3 animate-spin" />
                      ) : (
                        <Zap className="h-3 w-3" />
                      )}
                      Simplify
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      disabled={isChecking || !content}
                      onClick={() => handleRewrite("formal")}
                    >
                      {isChecking ? (
                        <RotateCw className="h-3 w-3 animate-spin" />
                      ) : (
                        <Edit className="h-3 w-3" />
                      )}
                      Formal
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      disabled={isChecking || !content}
                      onClick={() => handleRewrite("shorten")}
                    >
                      {isChecking ? (
                        <RotateCw className="h-3 w-3 animate-spin" />
                      ) : (
                        <Scissors className="h-3 w-3" />
                      )}
                      Shorten
                    </Button>
                  </div>
                  
                  {!content && (
                    <p className="text-sm text-center py-4 text-muted-foreground">
                      Start writing to use the rewrite features
                    </p>
                  )}
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
