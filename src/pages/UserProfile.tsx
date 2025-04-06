
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import PostCard from "@/components/PostCard";
import { useAuth } from "@/contexts/AuthContext";

// Mock posts data for demonstration
const USER_POSTS = [
  {
    id: "1",
    title: "The Art of Mindful Writing: Finding Your Creative Flow",
    excerpt: "Discover techniques to develop your unique writing voice and connect with your audience.",
    coverImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    author: {
      name: "User",
      avatar: "",
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
      name: "User",
      avatar: "",
    },
    category: "Productivity",
    readTime: "7 min read",
    commentsCount: 18,
    likesCount: 87,
  },
];

const UserProfile = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    bio: "",
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  });
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Update userData when user context changes
  useEffect(() => {
    if (user) {
      // Get saved bio from localStorage if it exists
      const savedBio = localStorage.getItem(`bioFor-${user.id}`);
      
      setUserData({
        name: user.name || "",
        email: user.email || "",
        bio: savedBio || "Write something about yourself...",
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      });
    }
  }, [user]);

  const handleSaveProfile = () => {
    setIsEditing(false);
    
    // Update local storage with bio for this user
    if (user) {
      localStorage.setItem(`bioFor-${user.id}`, userData.bio);
    }
    
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Please sign in to view your profile</h1>
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
      <main className="flex-grow">
        <div className="bg-blogSphere-50 py-10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
              <div className="space-y-3 flex-1">
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold">{userData.name}</h1>
                  <p className="text-muted-foreground">{userData.email}</p>
                </div>
                <p className="max-w-xl">{userData.bio}</p>
                <div>
                  <span className="text-muted-foreground">Joined {userData.joinedDate}</span>
                </div>
                <div className="flex gap-3 justify-center md:justify-start">
                  <Button onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? "Cancel" : "Edit Profile"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container px-4 md:px-6 py-8">
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid w-full md:w-auto grid-cols-2 mb-8">
              <TabsTrigger value="posts">Posts</TabsTrigger>
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
            <TabsContent value="settings" className="space-y-8">
              <div className="bg-white rounded-lg shadow p-6 space-y-6">
                <h2 className="text-2xl font-bold">Profile Settings</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={userData.name}
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={userData.email}
                      readOnly
                      className="bg-gray-100"
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
