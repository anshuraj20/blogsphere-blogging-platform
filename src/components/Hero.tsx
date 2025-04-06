
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, Users, Shield, PenSquare } from "lucide-react";

const Hero = () => {
  return (
    <div className="py-20 bg-gradient-to-b from-white to-blogSphere-50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Welcome to <span className="text-blogSphere-600">BlogSphere</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              A dynamic blogging platform enabling writers to create, publish, and engage with their audience effortlessly.
            </p>
          </div>
          
          <div className="space-x-4">
            <Link to="/categories">
              <Button className="bg-blogSphere-600 hover:bg-blogSphere-700">
                Explore Topics
              </Button>
            </Link>
            <Link to="/create-post">
              <Button variant="outline">Start Writing</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 w-full max-w-4xl">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="p-3 bg-blogSphere-50 rounded-full mb-4">
                <Sparkles className="h-6 w-6 text-blogSphere-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">AI-Assisted Writing</h3>
              <p className="text-muted-foreground">
                Smart suggestions, grammar checks, and readability enhancements as you write.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="p-3 bg-blogSphere-50 rounded-full mb-4">
                <Users className="h-6 w-6 text-blogSphere-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Social Engagement</h3>
              <p className="text-muted-foreground">
                Connect with your audience through likes, shares, and meaningful discussions.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="p-3 bg-blogSphere-50 rounded-full mb-4">
                <Shield className="h-6 w-6 text-blogSphere-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">AI Moderation</h3>
              <p className="text-muted-foreground">
                Intelligent content filtering and reporting system to maintain quality and safety.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
