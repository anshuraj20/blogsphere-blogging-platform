
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  Search, 
  Users, 
  Flag,
  MessageSquare,
  BarChart2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock data
const REPORTED_POSTS = [
  {
    id: "p1",
    title: "How to Manipulate Financial Markets and Get Away With It",
    author: "suspicious_user",
    reportCount: 12,
    reason: "Inappropriate content",
    date: "Mar 25, 2025",
    reviewed: false,
  },
  {
    id: "p2",
    title: "My Political Rant About Why Everyone Else is Wrong",
    author: "angry_writer",
    reportCount: 8,
    reason: "Hate speech",
    date: "Mar 26, 2025",
    reviewed: false,
  },
  {
    id: "p3",
    title: "Click Here to Win a Free iPhone",
    author: "scam_likely",
    reportCount: 16,
    reason: "Spam/Scam",
    date: "Mar 25, 2025",
    reviewed: true,
  },
];

const REPORTED_COMMENTS = [
  {
    id: "c1",
    content: "This is the worst article I've ever read. The author clearly has no idea what they're talking about.",
    author: "angry_reader",
    postTitle: "10 Tools Every Writer Should Know About",
    reportCount: 3,
    reason: "Harassment",
    date: "Mar 26, 2025",
  },
  {
    id: "c2",
    content: "Check out my profile for adult content and special offers...",
    author: "spam_bot",
    postTitle: "The Art of Mindful Writing",
    reportCount: 7,
    reason: "Spam",
    date: "Mar 25, 2025",
  },
];

const ADMIN_STATS = {
  totalReports: 38,
  pendingReviews: 17,
  resolvedReports: 21,
  bannedUsers: 4,
  activeModerators: 3,
};

const AdminPanel = () => {
  const [selectedTab, setSelectedTab] = useState("reports");
  const { toast } = useToast();
  
  const handleApprove = (id: string, type: "post" | "comment") => {
    toast({
      title: "Content approved",
      description: `The ${type} has been marked as appropriate and will remain published.`,
    });
  };
  
  const handleRemove = (id: string, type: "post" | "comment") => {
    toast({
      title: "Content removed",
      description: `The ${type} has been removed from the platform.`,
      variant: "destructive",
    });
  };
  
  const handleWarn = (id: string, author: string) => {
    toast({
      title: "Warning sent",
      description: `A warning has been sent to ${author}.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="bg-blogSphere-800 text-white py-4">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              <h1 className="text-2xl font-bold">Admin Control Panel</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-blogSphere-700 px-3 py-1 rounded-full text-sm">
                Admin Mode
              </div>
              <Button variant="ghost" size="sm" className="text-white">
                Help
              </Button>
              <Button variant="ghost" size="sm" className="text-white">
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-grow bg-secondary/30 py-8">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                    <p className="text-3xl font-bold">{ADMIN_STATS.totalReports}</p>
                  </div>
                  <Flag className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                    <p className="text-3xl font-bold">{ADMIN_STATS.pendingReviews}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                    <p className="text-3xl font-bold">{ADMIN_STATS.resolvedReports}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Banned Users</p>
                    <p className="text-3xl font-bold">{ADMIN_STATS.bannedUsers}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Moderators</p>
                    <p className="text-3xl font-bold">{ADMIN_STATS.activeModerators}</p>
                  </div>
                  <Shield className="h-8 w-8 text-blogSphere-600" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-2xl font-bold">Content Moderation</h2>
            <div className="relative w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search reports..." className="pl-8" />
            </div>
          </div>
          
          <Tabs defaultValue="reported-posts" className="space-y-6">
            <TabsList>
              <TabsTrigger value="reported-posts">Reported Posts</TabsTrigger>
              <TabsTrigger value="reported-comments">Reported Comments</TabsTrigger>
              <TabsTrigger value="user-management">User Management</TabsTrigger>
              <TabsTrigger value="moderation-log">Moderation Log</TabsTrigger>
            </TabsList>
            
            <TabsContent value="reported-posts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Reported Posts</CardTitle>
                  <CardDescription>Review and moderate posts that have been flagged by users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-hidden">
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Post Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Author</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Reports</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Reason</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-border">
                        {REPORTED_POSTS.map((post) => (
                          <tr key={post.id} className={post.reviewed ? "bg-muted/20" : ""}>
                            <td className="px-6 py-4">
                              <div className="font-medium">{post.title}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {post.author}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                {post.reportCount}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {post.reason}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                              {post.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-green-600"
                                  onClick={() => handleApprove(post.id, "post")}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-yellow-600"
                                  onClick={() => handleWarn(post.id, post.author)}
                                >
                                  <AlertCircle className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-red-600"
                                  onClick={() => handleRemove(post.id, "post")}
                                >
                                  <XCircle className="h-4 w-4" />
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
            
            <TabsContent value="reported-comments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Reported Comments</CardTitle>
                  <CardDescription>Review and moderate comments that have been flagged by users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {REPORTED_COMMENTS.map((comment) => (
                      <div key={comment.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium">{comment.author}</div>
                          <div className="text-sm text-muted-foreground">
                            {comment.date} • {comment.reportCount} reports • {comment.reason}
                          </div>
                        </div>
                        <p className="text-muted-foreground mb-2">{comment.content}</p>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">On: {comment.postTitle}</div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-green-600"
                              onClick={() => handleApprove(comment.id, "comment")}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-yellow-600"
                              onClick={() => handleWarn(comment.id, comment.author)}
                            >
                              Warn User
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-600"
                              onClick={() => handleRemove(comment.id, "comment")}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="user-management" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage users, assign roles, and moderate user accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Users className="h-10 w-10" />
                      <p>User management interface will be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="moderation-log" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Moderation Log</CardTitle>
                  <CardDescription>View a history of all moderation actions taken</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <BarChart2 className="h-10 w-10" />
                      <p>Moderation logs will be displayed here</p>
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

export default AdminPanel;
