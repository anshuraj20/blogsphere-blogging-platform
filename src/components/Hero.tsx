
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
              A place where stories unfold. Discover thought-provoking articles, share your ideas, 
              and connect with writers from around the world.
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
        </div>
      </div>
    </div>
  );
};

export default Hero;
