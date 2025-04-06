
import { useState, useEffect } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { 
  Save, 
  Image as ImageIcon, 
  FileText, 
  Sparkles,
  Eye,
  PenSquare,
  CheckCircle
} from "lucide-react";

// Mock data for categories
const CATEGORIES = [
  { value: "technology", label: "Technology" },
  { value: "writing", label: "Writing" },
  { value: "productivity", label: "Productivity" },
  { value: "creativity", label: "Creativity" },
  { value: "personal-growth", label: "Personal Growth" },
  { value: "publishing", label: "Publishing" },
];

const MOCK_POST = {
  id: "1",
  title: "The Art of Mindful Writing: Finding Your Creative Flow",
  content: `In a world filled with distractions, finding your creative flow as a writer can seem like an elusive goal. Yet, the practice of mindful writing offers a path forward, allowing you to tap into deeper levels of creativity and produce work that truly resonates with readers.

What is Mindful Writing?

Mindful writing is the practice of bringing full attention to the writing process. It involves being present with your words, embracing the current moment without judgment, and letting go of distractions and self-criticism that often plague writers.

Unlike rushed or forced writing, mindful writing creates space for ideas to emerge organically. It's about quality over quantity, depth over speed, and connection over perfection.

Benefits of Mindful Writing

The benefits of adopting a mindful approach to writing extend far beyond productivity:

Reduced writer's block - By releasing the pressure to produce perfect prose immediately, mindfulness creates an environment where ideas can flow more freely.

Deeper insights - When we slow down and truly engage with our writing, we often discover connections and perspectives that wouldn't emerge during rushed sessions.

More authentic voice - Mindfulness helps quiet the inner critic and external influences that can dilute your unique voice.

Greater resilience - A mindful approach builds the ability to stay with difficult emotions that writing can trigger, rather than avoiding challenging topics.`,
  category: "writing",
  tags: ["writing", "mindfulness", "creativity", "productivity"],
  coverImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
};

const CreatePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!id;
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  // Load post data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      // Mock API call to get post data
      setTimeout(() => {
        setTitle(MOCK_POST.title);
        setContent(MOCK_POST.content);
        setCategory(MOCK_POST.category);
        setTags(MOCK_POST.tags.join(", "));
        setCoverImage(MOCK_POST.coverImage);
      }, 500);
    }
  }, [isEditMode]);
  
  const handleSubmit = (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate saving
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: isDraft ? "Draft saved" : "Post published",
        description: isDraft 
          ? "Your draft has been saved successfully" 
          : "Your post has been published successfully",
      });
      
      // Navigate to the post or dashboard
      navigate(isDraft ? "/dashboard" : `/post/${id || "new"}`);
    }, 1500);
  };
  
  const handleAISuggestion = (suggestion: string) => {
    // In a real implementation, this would intelligently apply the suggestion
    // For now, we'll just append it to the content as a demonstration
    setContent((prev) => `${prev}\n\n[AI Suggestion Applied]: ${suggestion}`);
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
                    
                    {coverImage && (
                      <div className="w-full aspect-video rounded-lg overflow-hidden mb-6">
                        <img 
                          src={coverImage}
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
                        <Label htmlFor="cover-image">Cover Image URL</Label>
                        <div className="flex gap-2">
                          <Input
                            id="cover-image"
                            placeholder="Enter image URL or upload"
                            value={coverImage}
                            onChange={(e) => setCoverImage(e.target.value)}
                            className="flex-grow"
                          />
                          <Button variant="outline" type="button" className="flex-shrink-0">
                            <ImageIcon className="h-5 w-5" />
                          </Button>
                        </div>
                        {coverImage && (
                          <div className="mt-2 aspect-video w-full rounded-md border overflow-hidden">
                            <img 
                              src={coverImage} 
                              alt="Cover preview" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          placeholder="Write your post here..."
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          className="min-h-[300px]"
                        />
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
                onSuggestionApply={handleAISuggestion} 
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
                    <p className="text-sm text-muted-foreground">Preview your post to see how it will appear to readers</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blogSphere-600" />
                    AI Tools
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Sparkles className="h-4 w-4" />
                    Generate Title Ideas
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <FileText className="h-4 w-4" />
                    Create Summary
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Suggest Cover Images
                  </Button>
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
