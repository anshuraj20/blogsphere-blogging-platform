
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import PostCard from "@/components/PostCard";

// Mock data
const USER_DATA = {
  name: "Alex Johnson",
  username: "alexjohnson",
  email: "alex@example.com",
  bio: "Writer, blogger, and tech enthusiast. I love sharing my thoughts on the latest trends in technology and digital culture.",
  avatar: "https://randomuser.me/api/portraits/men/44.jpg",
  following: 128,
  followers: 256,
  joinedDate: "January 2023",
};

const USER_POSTS = [
  {
    id: "1",
    title: "The Art of Mindful Writing: Finding Your Creative Flow",
    excerpt: "Discover techniques to develop your unique writing voice and connect with your audience.",
    coverImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    author: {
      name: USER_DATA.name,
      avatar: USER_DATA.avatar,
    },
    category: "Writing Tips",
    readTime: "5 min read",
    commentsCount: 24,
    likesCount: 152,
  },
  {
    id: "2",
    title: "10 Tools Every Writer Should Know About in 2025",
    excerpt: "Explore the essential tools that can transform your writing workflow and boost productivity.",
    coverImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    author: {
      name: USER_DATA.name,
      avatar: USER_DATA.avatar,
    },
    category: "Productivity",
    readTime: "7 min read",
    commentsCount: 18,
    likesCount: 87,
  },
];

const UserProfile = () => {
  const [userData, setUserData] = useState(USER_DATA);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="bg-blogSphere-50 py-10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-md">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-3 flex-1">
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold">{userData.name}</h1>
                  <p className="text-muted-foreground">@{userData.username}</p>
                </div>
                <p className="max-w-xl">{userData.bio}</p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div>
                    <span className="font-bold">{userData.followers}</span>{" "}
                    <span className="text-muted-foreground">Followers</span>
                  </div>
                  <div>
                    <span className="font-bold">{userData.following}</span>{" "}
                    <span className="text-muted-foreground">Following</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Joined {userData.joinedDate}</span>
                  </div>
                </div>
                <div className="flex gap-3 justify-center md:justify-start">
                  <Button onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                  <Button variant="outline">Share Profile</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container px-4 md:px-6 py-8">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {USER_POSTS.map((post) => (
                  <PostCard key={post.id} {...post} />
                ))}
              </div>
              {USER_POSTS.length === 0 && (
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
            </TabsContent>
            <TabsContent value="drafts" className="space-y-8">
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No drafts yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start writing and save your ideas as drafts
                </p>
                <Link to="/create-post">
                  <Button>Create New Draft</Button>
                </Link>
              </div>
            </TabsContent>
            <TabsContent value="settings" className="space-y-8">
              <div className="bg-white rounded-lg shadow p-6 space-y-6">
                <h2 className="text-2xl font-bold">Profile Settings</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={userData.name}
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        value={userData.username}
                        onChange={(e) => setUserData({...userData, username: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({...userData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      rows={4}
                      value={userData.bio}
                      onChange={(e) => setUserData({...userData, bio: e.target.value})}
                    />
                  </div>
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 space-y-6">
                <h2 className="text-2xl font-bold">Account Security</h2>
                <div className="space-y-4">
                  <Button variant="outline">Change Password</Button>
                  <Button variant="outline">Two-Factor Authentication</Button>
                  <Button variant="outline" className="text-red-500">Delete Account</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default UserProfile;
