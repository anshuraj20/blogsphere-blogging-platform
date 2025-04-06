
import React, { createContext, useContext, useState, useEffect } from "react";

// User type definition
export interface User {
  id: string;
  name: string;
  email: string;
}

// Auth context type definition
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  notifications: number;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  signout: () => void;
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
  const [notifications] = useState(3);

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

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, notifications, login, signup, signout }}>
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
