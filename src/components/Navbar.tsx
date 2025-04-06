
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PenSquare } from "lucide-react";

const Navbar = () => {
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
          <Link to="/create-post">
            <Button variant="outline" className="gap-2">
              <PenSquare className="h-4 w-4" />
              <span>Write</span>
            </Button>
          </Link>
          <Button>Sign In</Button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
