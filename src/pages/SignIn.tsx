
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: "Sign in successful",
          description: "Welcome back to BlogSphere!",
        });
        // Redirect to the home page after successful login
        navigate("/");
      } else {
        setError("Invalid email or password. Please try again.");
        toast({
          title: "Sign in failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
      toast({
        title: "Sign in failed",
        description: "An error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Sign in to BlogSphere</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 p-3 rounded-md text-red-500 text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link 
                    to="/reset-password" 
                    className="text-sm text-blogSphere-600 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
              <div className="text-sm text-center text-muted-foreground">
                <p>Demo credentials: alex@example.com / password123</p>
              </div>
            </form>
            
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Button variant="outline" className="w-full">Google</Button>
                <Button variant="outline" className="w-full">Twitter</Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-center">
            <div className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/sign-up" className="text-blogSphere-600 hover:underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
};

export default SignIn;
