
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth, Post } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark, BookmarkX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BookmarkedPost {
  id: string;
  title: string;
  dateAdded: string;
}

const Bookmarks = () => {
  const { user, isAuthenticated, getPosts } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkedPost[]>([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Fetch bookmarks for the current user
      const userBookmarks = JSON.parse(localStorage.getItem(`bookmarks_${user.id}`) || "[]");
      setBookmarks(userBookmarks);

      // Get full post details for each bookmark
      const allPosts = getPosts();
      const postsWithDetails = userBookmarks
        .map((bookmark: BookmarkedPost) => {
          return allPosts.find(post => post.id === bookmark.id);
        })
        .filter(Boolean) as Post[];

      setBookmarkedPosts(postsWithDetails);
    }
  }, [user, isAuthenticated, getPosts]);

  const removeBookmark = (postId: string, postTitle: string) => {
    const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== postId);
    localStorage.setItem(`bookmarks_${user?.id}`, JSON.stringify(updatedBookmarks));
    setBookmarks(updatedBookmarks);
    setBookmarkedPosts(bookmarkedPosts.filter(post => post.id !== postId));

    toast({
      title: "Bookmark removed",
      description: `"${postTitle}" has been removed from your bookmarks.`
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please sign in to view your bookmarks</h1>
            <Link to="/sign-in">
              <Button>Sign In</Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container py-8 flex-grow">
        <div className="flex items-center gap-2 mb-8">
          <Bookmark className="h-6 w-6" />
          <h1 className="text-3xl font-bold">Your Bookmarks</h1>
        </div>

        {bookmarkedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookmarkedPosts.map(post => (
              <Card key={post.id} className="overflow-hidden">
                {post.coverImage && (
                  <Link to={`/post/${post.id}`}>
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </Link>
                )}
                <CardHeader className="p-4">
                  <CardTitle className="line-clamp-2">
                    <Link to={`/post/${post.id}`} className="hover:underline hover:text-blogSphere-700 transition-colors">
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    {post.author.name} • {new Date(post.createdDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBookmark(post.id, post.title)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <BookmarkX className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No bookmarks yet</h3>
            <p className="text-muted-foreground mb-4">
              Start bookmarking posts to find them here later
            </p>
            <Link to="/">
              <Button>Explore Posts</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
};

export default Bookmarks;
