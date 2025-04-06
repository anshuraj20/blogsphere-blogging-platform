
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { PenSquare, Image, Trash2 } from "lucide-react";

// Mock categories for the select dropdown
const CATEGORIES = [
  { id: "1", name: "Technology" },
  { id: "2", name: "Creativity" },
  { id: "3", name: "Publishing" },
  { id: "4", name: "Writing Tips" },
  { id: "5", name: "Personal Growth" },
  { id: "6", name: "Book Reviews" },
  { id: "7", name: "Industry News" },
  { id: "8", name: "Author Interviews" },
];

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      toast.error("Please enter a title for your post");
      return;
    }
    
    if (!content.trim()) {
      toast.error("Please add some content to your post");
      return;
    }
    
    if (!category) {
      toast.error("Please select a category");
      return;
    }
    
    // In a real app, we would submit the form data to an API
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Your post has been published successfully!");
      // In a real app, we would redirect to the new post
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container max-w-4xl py-10 px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl font-bold">Create New Post</h1>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-blogSphere-600 hover:bg-blogSphere-700">
            {isSubmitting ? "Publishing..." : "Publish Post"}
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Cover image uploader */}
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            {coverImage ? (
              <div className="relative">
                <img 
                  src={coverImage} 
                  alt="Cover"
                  className="w-full h-64 object-cover rounded-md"
                />
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="absolute top-2 right-2"
                  onClick={() => setCoverImage("")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="py-12">
                <div className="mb-4 flex justify-center">
                  <Image className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Add a cover image</h3>
                <p className="text-muted-foreground mb-4">
                  Drag and drop an image, or click to select a file
                </p>
                {/* In a real app, this would be a file input with proper upload handling */}
                <Button 
                  variant="outline" 
                  onClick={() => setCoverImage("https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d")}
                >
                  Select Image
                </Button>
              </div>
            )}
          </div>
          
          {/* Post title */}
          <div>
            <Input 
              type="text" 
              placeholder="Post Title" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-serif font-bold border-0 border-b focus-visible:ring-0 rounded-none px-0 py-4 placeholder:text-muted-foreground/50"
            />
          </div>
          
          {/* Post content */}
          <div>
            <Textarea 
              placeholder="Write your post content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[300px] border-0 focus-visible:ring-0 text-lg resize-none"
            />
          </div>
          
          <Separator />
          
          {/* Post metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>
              <Input 
                placeholder="writing, tips, creativity (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Add relevant tags to help readers discover your content
              </p>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-4">
            <Button variant="outline" type="button">
              Save Draft
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blogSphere-600 hover:bg-blogSphere-700"
            >
              {isSubmitting ? "Publishing..." : "Publish Post"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreatePost;
