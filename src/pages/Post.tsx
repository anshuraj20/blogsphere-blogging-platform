
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { MessageCircle, Heart, Share2, BookmarkPlus, Pencil, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth, Post as PostType } from "@/contexts/AuthContext";

const Post = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, getUserPosts, updateUserPost, deleteUserPost } = useAuth();
  const [post, setPost] = useState<PostType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Initialize post data
  useEffect(() => {
    if (id && user) {
      setIsLoading(true);
      try {
        const userPosts = getUserPosts();
        const foundPost = userPosts.find(post => post.id === id);
        
        if (foundPost) {
          setPost(foundPost);
          // Update view count
          updateUserPost(id, { views: foundPost.views + 1 });
        } else {
          setError("Post not found");
        }
      } catch (err) {
        setError("Error loading post");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  }, [id, user, getUserPosts, updateUserPost]);

  const handleLike = () => {
    if (!post || !user) return;
    
    const newLikeCount = isLiked ? post.likesCount - 1 : post.likesCount + 1;
    updateUserPost(post.id, { likesCount: newLikeCount });
    setPost({...post, likesCount: newLikeCount});
    setIsLiked(!isLiked);
    
    if (!isLiked) {
      toast({
        title: "Post liked",
        description: "You've liked this post.",
      });
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Bookmark removed" : "Post bookmarked",
      description: isBookmarked ? "This post has been removed from your bookmarks." : "This post has been added to your bookmarks.",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Post link has been copied to clipboard.",
    });
  };

  const handleDelete = () => {
    if (!post || !user) return;
    
    if (deleteUserPost(post.id)) {
      toast({
        title: "Post deleted",
        description: "Your post has been successfully deleted.",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p>Loading post...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post not found</h1>
            <p className="text-muted-foreground mb-6">{error || "The post you're looking for doesn't exist or has been removed."}</p>
            <Link to="/">
              <Button>Back to Home</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Format date if available
  const formattedDate = post.publishDate 
    ? format(new Date(post.publishDate), 'MMMM dd, yyyy') 
    : 'Recently published';

  const isAuthor = user && user.id === post.author.id;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Cover image */}
        {post.coverImage && (
          <div className="w-full h-[400px] relative">
            <img 
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <article className="container px-4 md:px-6 max-w-4xl mx-auto py-12">
          {/* Post header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm mb-2 text-muted-foreground">
              <span>{post.category}</span>
              <span>•</span>
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{Math.ceil(post.content.length / 1000)} min read</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
            
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{post.author.name}</p>
                <p className="text-sm text-muted-foreground">Author</p>
              </div>
            </div>
          </div>
          
          <Separator className="my-8" />
          
          {/* Post content */}
          <div className="prose max-w-none">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
          
          <Separator className="my-8" />
          
          {/* Post actions */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" onClick={handleLike}>
                <Heart className={`h-5 w-5 mr-1 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{post.likesCount}</span>
              </Button>
              <Button variant="ghost" size="sm">
                <MessageCircle className="h-5 w-5 mr-1" />
                <span>{post.commentsCount}</span>
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleBookmark}>
                <BookmarkPlus className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
              
              {isAuthor && (
                <>
                  <Button variant="ghost" size="icon" onClick={() => navigate(`/edit-post/${post.id}`)}>
                    <Pencil className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleDelete}>
                    <Trash className="h-5 w-5 text-red-500" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default Post;
