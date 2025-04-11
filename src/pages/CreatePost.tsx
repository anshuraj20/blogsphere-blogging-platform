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
                        <Label htmlFor="content">Content</Label>
                        <div className="relative">
                          <Textarea
                            id="content"
                            placeholder="Write your post here or use Windows speech-to-text (Win+H)..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[300px]"
                          />
                        </div>
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
                    <p className="text-sm text-muted-foreground">Try using Windows speech-to-text (Win+H) to capture your thoughts naturally</p>
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
