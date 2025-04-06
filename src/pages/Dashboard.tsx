
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenSquare, Eye, MessageSquare, Heart, BarChart2, Users, Trash2 } from "lucide-react";

// Mock data
const DASHBOARD_STATS = {
  totalPosts: 12,
  totalViews: 3547,
  totalComments: 243,
  totalLikes: 752,
  newFollowers: 18,
};

const RECENT_POSTS = [
  {
    id: "1",
    title: "The Art of Mindful Writing: Finding Your Creative Flow",
    status: "published",
    publishDate: "Mar 22, 2025",
    views: 1243,
    comments: 24,
    likes: 152,
  },
  {
    id: "2",
    title: "10 Tools Every Writer Should Know About in 2025",
    status: "published",
    publishDate: "Mar 15, 2025",
    views: 876,
    comments: 18,
    likes: 87,
  },
  {
    id: "3",
    title: "The Future of AI in Content Creation",
    status: "draft",
    lastEdit: "Mar 27, 2025",
    views: 0,
    comments: 0,
    likes: 0,
  },
];

const RECENT_COMMENTS = [
  {
    id: "c1",
    author: "Jamie Wilson",
    content: "This resonated with me so deeply. I've been struggling with my writing lately, and I think mindfulness might be the missing piece.",
    postTitle: "The Art of Mindful Writing",
    date: "Mar 23, 2025",
  },
  {
    id: "c2",
    author: "Taylor Reed",
    content: "I've been practicing mindful writing for about a year now, and it's completely transformed my work.",
    postTitle: "The Art of Mindful Writing",
    date: "Mar 24, 2025",
  },
];

const Dashboard = () => {
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

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
                    <p className="text-3xl font-bold">{DASHBOARD_STATS.totalPosts}</p>
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
                    <p className="text-3xl font-bold">{DASHBOARD_STATS.totalViews}</p>
                  </div>
                  <Eye className="h-8 w-8 text-blogSphere-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Comments</p>
                    <p className="text-3xl font-bold">{DASHBOARD_STATS.totalComments}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-blogSphere-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Likes</p>
                    <p className="text-3xl font-bold">{DASHBOARD_STATS.totalLikes}</p>
                  </div>
                  <Heart className="h-8 w-8 text-blogSphere-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">New Followers</p>
                    <p className="text-3xl font-bold">{DASHBOARD_STATS.newFollowers}</p>
                  </div>
                  <Users className="h-8 w-8 text-blogSphere-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="posts" className="space-y-6">
            <TabsList>
              <TabsTrigger value="posts">Your Posts</TabsTrigger>
              <TabsTrigger value="comments">Recent Comments</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="space-y-4">
              <Card>
                <CardHeader className="pb-0">
                  <CardTitle>Content Library</CardTitle>
                  <CardDescription>Manage your published posts and drafts</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
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
                        {RECENT_POSTS.map((post) => (
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
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="comments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Comments</CardTitle>
                  <CardDescription>Engage with your readers by responding to their comments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {RECENT_COMMENTS.map((comment) => (
                      <div key={comment.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{comment.author}</div>
                          <div className="text-sm text-muted-foreground">{comment.date}</div>
                        </div>
                        <p className="text-muted-foreground mb-2">{comment.content}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">On: {comment.postTitle}</div>
                          <Button variant="ghost" size="sm">Reply</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                  <CardDescription>Track your content performance and audience growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <BarChart2 className="h-10 w-10" />
                      <p>Analytics charts will be displayed here</p>
                    </div>
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
