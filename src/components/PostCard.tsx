
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageSquare, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface PostCardProps {
  id: string;
  title: string;
  excerpt: string;
  coverImage: string;
  author: {
    name: string;
    avatar: string;
  };
  category: string;
  readTime: string;
  commentsCount: number;
  likesCount: number;
  featured?: boolean;
}

const PostCard = ({
  id,
  title,
  excerpt,
  coverImage,
  author,
  category,
  readTime,
  commentsCount,
  likesCount,
  featured = false,
}: PostCardProps) => {
  return (
    <Card className={`overflow-hidden transition-all duration-200 hover:shadow-md ${featured ? 'border-blogSphere-300' : ''}`}>
      <Link to={`/post/${id}`}>
        <div className="aspect-video w-full overflow-hidden">
          <img
            src={coverImage}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>
      
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="bg-blogSphere-50 text-blogSphere-700 hover:bg-blogSphere-100">
            {category}
          </Badge>
          <div className="flex items-center text-sm text-muted-foreground">
            <BookOpen className="mr-1 h-3 w-3" />
            {readTime}
          </div>
        </div>
        <Link to={`/post/${id}`} className="hover:underline hover:text-blogSphere-700 transition-colors">
          <h3 className={`font-serif ${featured ? 'text-2xl' : 'text-xl'} font-bold leading-tight mt-2`}>{title}</h3>
        </Link>
      </CardHeader>
      
      <CardContent className="p-4">
        <p className="text-muted-foreground">{excerpt}</p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blogSphere-100 text-blogSphere-700">
              {author.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{author.name}</span>
        </div>
        
        <div className="flex items-center space-x-3 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Heart className="mr-1 h-4 w-4" />
            {likesCount}
          </div>
          <div className="flex items-center">
            <MessageSquare className="mr-1 h-4 w-4" />
            {commentsCount}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
