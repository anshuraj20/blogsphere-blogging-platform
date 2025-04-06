
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  PenSquare, 
  User, 
  Bell, 
  ChevronDown 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock auth state for demonstration
const MOCK_AUTH = {
  isAuthenticated: true, // Changed to true to show authenticated state by default
  user: {
    name: "Alex Johnson",
    avatar: "https://randomuser.me/api/portraits/men/44.jpg"
  },
  notifications: 3,
};

const Navbar = () => {
  const [auth] = useState(MOCK_AUTH);
  
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-50">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="font-serif text-2xl font-bold text-blogSphere-700">
          BlogSphere
        </Link>
        
        <div className="flex-1 max-w-md mx-auto px-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              type="search" 
              placeholder="Search articles..." 
              className="pl-8 w-full bg-secondary/50"
            />
          </div>
        </div>
        
        <nav className="flex items-center gap-4">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
            Categories
          </Link>
          {auth.isAuthenticated ? (
            <>
              <Link to="/create-post">
                <Button variant="outline" className="gap-2">
                  <PenSquare className="h-4 w-4" />
                  <span>Write</span>
                </Button>
              </Link>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {auth.notifications > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
                    {auth.notifications}
                  </span>
                )}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 relative flex items-center">
                    <div className="h-8 w-8 rounded-full overflow-hidden">
                      <img 
                        src={auth.user.avatar} 
                        alt="Profile" 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link to="/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/dashboard" className="w-full">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/settings" className="w-full">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/create-post">
                <Button variant="outline" className="gap-2">
                  <PenSquare className="h-4 w-4" />
                  <span>Write</span>
                </Button>
              </Link>
              <Link to="/sign-in">
                <Button>Sign In</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
