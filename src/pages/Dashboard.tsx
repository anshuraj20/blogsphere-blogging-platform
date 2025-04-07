
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenSquare, Eye, MessageSquare, Heart, Trash2 } from "lucide-react";
import { useAuth, Post } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const { user, getUserPosts, deleteUserPost } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      setPosts(getUserPosts());
    }
  }, [user, getUserPosts]);

  const handleDeletePost = (postId: string) => {
    if (deleteUserPost(postId)) {
      setPosts(prev => prev.filter(post => post.id !== postId));
      toast({
        title: "Post deleted",
        description: "The post has been successfully deleted."
      });
    }
  };

  const calculateTotalViews = () => {
    return posts.reduce((total, post) => total + post.views, 0);
  };

  const calculateTotalLikes = () => {
    return posts.reduce((total, post) => total + post.likesCount, 0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-secondary/30 py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Manage your content and track your performance</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/create-post">
                <Button className="gap-2">
                  <PenSquare className="h-4 w-4" />
                  Create New Post
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                    <p className="text-3xl font-bold">{posts.length}</p>
                  </div>
                  <PenSquare className="h-8 w-8 text-blogSphere-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                    <p className="text-3xl font-bold">{calculateTotalViews()}</p>
                  </div>
                  <Eye className="h-8 w-8 text-blogSphere-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Likes</p>
                    <p className="text-3xl font-bold">{calculateTotalLikes()}</p>
                  </div>
                  <Heart className="h-8 w-8 text-blogSphere-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList>
              <TabsTrigger value="posts">Your Posts</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="space-y-4">
              <Card>
                <CardHeader className="pb-0">
                  <CardTitle>Content Library</CardTitle>
                  <CardDescription>Manage your published posts and drafts</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  {posts.length > 0 ? (
                    <div className="rounded-md border overflow-hidden">
                      <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Views</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-border">
                          {posts.map((post) => (
                            <tr key={post.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium">{post.title}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  post.status === "published" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-yellow-100 text-yellow-800"
                                }`}>
                                  {post.status === "published" ? "Published" : "Draft"}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                {post.status === "published" ? post.publishDate : post.lastEdit}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                {post.views}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                <div className="flex space-x-2">
                                  <Link to={`/post/${post.id}`}>
                                    <Button variant="ghost" size="sm">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                  <Link to={`/edit-post/${post.id}`}>
                                    <Button variant="ghost" size="sm">
                                      <PenSquare className="h-4 w-4" />
                                    </Button>
                                  </Link>
                                  <Button variant="ghost" size="sm" onClick={() => handleDeletePost(post.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <h3 className="text-xl font-medium mb-2">No posts yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start writing and publish your first post
                      </p>
                      <Link to="/create-post">
                        <Button>Create New Post</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                  <CardDescription>Track your content performance over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-muted-foreground">Analytics dashboard coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
