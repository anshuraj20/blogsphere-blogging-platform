
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
  };
  createdAt: Date;
  replies?: Comment[];
}

interface CommentSectionProps {
  postId: string;
  initialComments?: Comment[];
}

export default function CommentSection({ postId, initialComments = [] }: CommentSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const { toast } = useToast();

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: {
        id: user?.id || "anonymous",
        name: user?.name || "Anonymous User"
      },
      createdAt: new Date(),
      replies: []
    };
    
    setComments([...comments, comment]);
    setNewComment("");
    
    toast({
      title: "Comment Added",
      description: "Your comment has been successfully posted."
    });
  };

  const handleAddReply = (commentId: string) => {
    if (!replyContent.trim()) return;
    
    const reply: Comment = {
      id: Date.now().toString(),
      content: replyContent,
      author: {
        id: user?.id || "anonymous",
        name: user?.name || "Anonymous User"
      },
      createdAt: new Date()
    };
    
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply]
        };
      }
      return comment;
    });
    
    setComments(updatedComments);
    setReplyContent("");
    setReplyTo(null);
    
    toast({
      title: "Reply Added",
      description: "Your reply has been successfully added."
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6 mt-8 pt-8 border-t">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5" />
        <h3 className="text-xl font-bold">Comments ({comments.length})</h3>
      </div>

      {isAuthenticated ? (
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              {user?.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px]"
            />
            <Button onClick={handleAddComment} disabled={!newComment.trim()}>
              Post Comment
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-secondary/50 p-4 rounded-md text-center">
          <p className="mb-2">Sign in to join the conversation</p>
          <Button asChild variant="outline">
            <a href="/sign-in">Sign In</a>
          </Button>
        </div>
      )}

      <div className="space-y-6">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {comment.author.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{comment.author.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2">{comment.content}</p>
                  
                  {isAuthenticated && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2 text-muted-foreground"
                      onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                    >
                      Reply
                    </Button>
                  )}
                </div>
              </div>
              
              {replyTo === comment.id && (
                <div className="ml-12 space-y-2">
                  <Textarea
                    placeholder="Write a reply..."
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleAddReply(comment.id)}>
                      Reply
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setReplyTo(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-12 space-y-4 border-l-2 pl-4">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {reply.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex flex-col">
                          <h4 className="font-medium">{reply.author.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(reply.createdAt)}
                          </p>
                        </div>
                        <p className="mt-1">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
}
