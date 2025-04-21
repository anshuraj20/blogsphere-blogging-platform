
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth, Post as PostType } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import BookmarkButton from "@/components/BookmarkButton";
import ReportPost from "@/components/ReportPost";
import CommentSection from "@/components/CommentSection";
import { Badge } from "@/components/ui/badge";

const Post = () => {
  const { id } = useParams<{ id: string }>();
  const { getPosts, user } = useAuth();
  const [post, setPost] = useState<PostType | null>(null);
  
  useEffect(() => {
    if (id) {
      const posts = getPosts();
      const foundPost = posts.find(p => p.id === id);
      if (foundPost) {
        setPost(foundPost);
      }
    }
  }, [id, getPosts]);
  
  if (!post) {
    return (
      <div>
        <Navbar />
        <main className="container py-8 min-h-screen">
          <div className="text-center pt-24">
            <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-6">The post you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </main>
      </div>
    );
  }
  
  const formattedDate = new Date(post.createdDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  
  return (
    <div>
      <Navbar />
      <main className="container max-w-4xl py-8">
        <Badge className="mb-4">{post.category}</Badge>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif mb-4">{post.title}</h1>
        
        <div className="flex items-center justify-between border-y py-4 my-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <BookmarkButton postId={post.id} postTitle={post.title} />
            <ReportPost postId={post.id} userId={user?.id} />
          </div>
        </div>
        
        {post.coverImage && (
          <div className="aspect-video w-full mb-8 overflow-hidden rounded-lg">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="blog-content prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        
        <CommentSection postId={post.id} initialComments={[]} />
      </main>
    </div>
  );
};

export default Post;
