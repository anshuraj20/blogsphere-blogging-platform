
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface BookmarkButtonProps {
  postId: string;
  postTitle: string;
}

export default function BookmarkButton({ postId, postTitle }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Check if post is already bookmarked on load
  useEffect(() => {
    if (isAuthenticated && user) {
      const bookmarks = JSON.parse(localStorage.getItem(`bookmarks_${user.id}`) || "[]");
      setIsBookmarked(bookmarks.some((bookmark: any) => bookmark.id === postId));
    }
  }, [postId, user, isAuthenticated]);

  const toggleBookmark = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark posts",
        variant: "destructive"
      });
      return;
    }

    const userId = user?.id;
    const bookmarks = JSON.parse(localStorage.getItem(`bookmarks_${userId}`) || "[]");
    
    if (isBookmarked) {
      // Remove bookmark
      const updatedBookmarks = bookmarks.filter((bookmark: any) => bookmark.id !== postId);
      localStorage.setItem(`bookmarks_${userId}`, JSON.stringify(updatedBookmarks));
      setIsBookmarked(false);
      
      toast({
        title: "Bookmark removed",
        description: `"${postTitle}" has been removed from your bookmarks.`
      });
    } else {
      // Add bookmark
      const newBookmark = {
        id: postId,
        title: postTitle,
        dateAdded: new Date().toISOString()
      };
      
      const updatedBookmarks = [...bookmarks, newBookmark];
      localStorage.setItem(`bookmarks_${userId}`, JSON.stringify(updatedBookmarks));
      setIsBookmarked(true);
      
      toast({
        title: "Bookmark added",
        description: `"${postTitle}" has been added to your bookmarks.`
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleBookmark}
      className={`flex items-center gap-1 ${isBookmarked ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
      aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
    >
      <Bookmark className="h-5 w-5" fill={isBookmarked ? "currentColor" : "none"} />
      <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
    </Button>
  );
}
