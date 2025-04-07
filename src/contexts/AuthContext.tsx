
import React, { createContext, useContext, useState, useEffect } from "react";

// User type definition
export interface User {
  id: string;
  name: string;
  email: string;
}

// Post type definition
export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: {
    name: string;
    id: string;
  };
  category: string;
  tags: string[];
  status: "published" | "draft";
  publishDate?: string;
  lastEdit?: string;
  views: number;
  commentsCount: number;
  likesCount: number;
}

// Auth context type definition
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  signout: () => void;
  getUserPosts: () => Post[];
  addUserPost: (post: Omit<Post, 'id' | 'author'>) => Post;
  updateUserPost: (postId: string, updatedPost: Partial<Post>) => boolean;
  deleteUserPost: (postId: string) => boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// User credentials for demo purposes
const DEMO_USERS = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    password: "password123",
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("blogSphereUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call with timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        const matchedUser = DEMO_USERS.find(
          (u) => u.email === email && u.password === password
        );

        if (matchedUser) {
          const { password: _, ...userWithoutPassword } = matchedUser;
          setUser(userWithoutPassword);
          setIsAuthenticated(true);
          localStorage.setItem("blogSphereUser", JSON.stringify(userWithoutPassword));
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  };

  // Signup function
  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call with timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if user already exists
        const existingUser = DEMO_USERS.find((u) => u.email === email);
        
        if (existingUser) {
          resolve(false);
          return;
        }

        // Create new user
        const newUser = {
          id: `${DEMO_USERS.length + 1}`,
          name,
          email,
          password,
        };
        
        // Add to demo users array (would be a DB insert in real app)
        DEMO_USERS.push(newUser);
        
        // Log in the newly created user
        const { password: _, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        localStorage.setItem("blogSphereUser", JSON.stringify(userWithoutPassword));
        resolve(true);
      }, 1000);
    });
  };

  // Sign out function
  const signout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("blogSphereUser");
  };

  // Get user posts
  const getUserPosts = (): Post[] => {
    if (!user) return [];
    
    const storedPosts = localStorage.getItem(`blogSpherePosts-${user.id}`);
    if (storedPosts) {
      return JSON.parse(storedPosts);
    }
    
    return [];
  };

  // Add a new post
  const addUserPost = (post: Omit<Post, 'id' | 'author'>): Post => {
    if (!user) throw new Error("User not authenticated");
    
    const newPost: Post = {
      ...post,
      id: `post-${Date.now()}`,
      author: {
        id: user.id,
        name: user.name
      }
    };
    
    const currentPosts = getUserPosts();
    const updatedPosts = [...currentPosts, newPost];
    
    localStorage.setItem(`blogSpherePosts-${user.id}`, JSON.stringify(updatedPosts));
    
    return newPost;
  };

  // Update an existing post
  const updateUserPost = (postId: string, updatedPost: Partial<Post>): boolean => {
    if (!user) return false;
    
    const currentPosts = getUserPosts();
    const postIndex = currentPosts.findIndex(post => post.id === postId);
    
    if (postIndex === -1) return false;
    
    currentPosts[postIndex] = {
      ...currentPosts[postIndex],
      ...updatedPost,
      lastEdit: new Date().toISOString()
    };
    
    localStorage.setItem(`blogSpherePosts-${user.id}`, JSON.stringify(currentPosts));
    
    return true;
  };

  // Delete a post
  const deleteUserPost = (postId: string): boolean => {
    if (!user) return false;
    
    const currentPosts = getUserPosts();
    const updatedPosts = currentPosts.filter(post => post.id !== postId);
    
    if (updatedPosts.length === currentPosts.length) return false;
    
    localStorage.setItem(`blogSpherePosts-${user.id}`, JSON.stringify(updatedPosts));
    
    return true;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      signup, 
      signout,
      getUserPosts,
      addUserPost,
      updateUserPost,
      deleteUserPost
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
