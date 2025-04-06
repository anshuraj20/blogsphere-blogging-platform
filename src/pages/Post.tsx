
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MessageSquare, Heart, Share2, Bookmark } from "lucide-react";

// Mock post data for demonstration
const POST = {
  id: "1",
  title: "The Art of Mindful Writing: Finding Your Creative Flow",
  content: `
    <p>
    In a world filled with distractions, finding your creative flow as a writer can seem like an elusive goal. 
    Yet, the practice of mindful writing offers a path forward, allowing you to tap into deeper levels of creativity 
    and produce work that truly resonates with readers.
    </p>
    
    <h2>What is Mindful Writing?</h2>
    
    <p>
    Mindful writing is the practice of bringing full attention to the writing process. 
    It involves being present with your words, embracing the current moment without judgment, 
    and letting go of distractions and self-criticism that often plague writers.
    </p>
    
    <p>
    Unlike rushed or forced writing, mindful writing creates space for ideas to emerge organically. 
    It's about quality over quantity, depth over speed, and connection over perfection.
    </p>
    
    <blockquote>
    "The true art of writing lies not in putting words on a page, but in listening deeply enough to hear what wants to be written."
    </blockquote>
    
    <h2>Benefits of Mindful Writing</h2>
    
    <p>
    The benefits of adopting a mindful approach to writing extend far beyond productivity:
    </p>
    
    <p>
    <strong>Reduced writer's block</strong> - By releasing the pressure to produce perfect prose immediately, 
    mindfulness creates an environment where ideas can flow more freely.
    </p>
    
    <p>
    <strong>Deeper insights</strong> - When we slow down and truly engage with our writing, 
    we often discover connections and perspectives that wouldn't emerge during rushed sessions.
    </p>
    
    <p>
    <strong>More authentic voice</strong> - Mindfulness helps quiet the inner critic and external influences that can dilute your unique voice.
    </p>
    
    <p>
    <strong>Greater resilience</strong> - A mindful approach builds the ability to stay with difficult emotions that writing can trigger, 
    rather than avoiding challenging topics.
    </p>
    
    <h2>Practical Techniques for Mindful Writing</h2>
    
    <p>
    Incorporating mindfulness into your writing practice doesn't require meditation expertise or major life changes. 
    Simple techniques can transform your relationship with writing:
    </p>
    
    <p>
    <strong>Begin with breath</strong> - Before you start writing, take three deep breaths. 
    This creates a transition moment and signals to your brain that it's time to focus.
    </p>
    
    <p>
    <strong>Set an intention</strong> - Clarify why you're writing today. Is it to explore, communicate, persuade, or simply practice? 
    Having an intention keeps your writing grounded.
    </p>
    
    <p>
    <strong>Use timed sessions</strong> - The Pomodoro Technique (25 minutes of focused work followed by a 5-minute break) can help maintain presence throughout longer writing sessions.
    </p>
    
    <p>
    <strong>Practice sensory awareness</strong> - Periodically pause to notice the physical sensations of writing: 
    the feel of your fingers on the keyboard, the sounds in your environment, the rhythm of your breathing.
    </p>
    
    <p>
    The journey to mindful writing is ongoing, but even small steps toward greater awareness can transform your creative process. 
    By approaching writing with presence and compassion, you open the door to more authentic expression and deeper connection with your readers.
    </p>
  `,
  publishedAt: "2025-03-22",
  readTime: "5 min read",
  coverImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
  author: {
    id: "a1",
    name: "Alex Morgan",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    bio: "Alex is a writer and mindfulness coach with over a decade of experience helping creators find their flow state."
  },
  category: "Creativity",
  tags: ["writing", "mindfulness", "creativity", "productivity"],
  commentsCount: 24,
  likesCount: 152,
  comments: [
    {
      id: "c1",
      author: {
        name: "Jamie Wilson",
        avatar: "https://randomuser.me/api/portraits/women/72.jpg",
      },
      content: "This resonated with me so deeply. I've been struggling with my writing lately, and I think mindfulness might be the missing piece. Thank you for sharing these insights!",
      publishedAt: "2025-03-22",
      likesCount: 8,
    },
    {
      id: "c2",
      author: {
        name: "Taylor Reed",
        avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      },
      content: "I've been practicing mindful writing for about a year now, and it's completely transformed my work. The section about setting intentions before writing sessions is especially important - it's helped me stay focused even on days when motivation is low.",
      publishedAt: "2025-03-23",
      likesCount: 12,
    }
  ]
};

const Post = () => {
  const { id } = useParams();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [commentText, setCommentText] = useState("");
  
  // In a real app, we would fetch the post data based on the ID
  const post = POST;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero section with cover image */}
        <div className="relative h-[40vh] w-full">
          <div className="absolute inset-0">
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
          </div>
        </div>
        
        <div className="container max-w-4xl px-4 md:px-6 -mt-20 relative">
          <article className="bg-background rounded-lg shadow-lg p-6 md:p-10 mb-10">
            {/* Category and post meta */}
            <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
              <Badge className="bg-blogSphere-50 text-blogSphere-700 hover:bg-blogSphere-100">
                {post.category}
              </Badge>
              <div className="flex items-center text-muted-foreground">
                <Calendar className="mr-1 h-4 w-4" />
                <span>{post.publishedAt}</span>
              </div>
              <div className="flex items-center text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
            
            {/* Title */}
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-6">
              {post.title}
            </h1>
            
            {/* Author */}
            <div className="flex items-center gap-4 mb-8">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{post.author.name}</div>
                <div className="text-sm text-muted-foreground">Author</div>
              </div>
            </div>
            
            {/* Post content */}
            <div 
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-muted-foreground">
                  #{tag}
                </Badge>
              ))}
            </div>
            
            {/* Post actions */}
            <div className="mt-8 flex justify-between items-center">
              <div className="flex gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`gap-2 ${liked ? 'text-red-500' : ''}`}
                  onClick={() => setLiked(!liked)}
                >
                  <Heart className="h-5 w-5" />
                  <span>{liked ? post.likesCount + 1 : post.likesCount}</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <MessageSquare className="h-5 w-5" />
                  <span>{post.commentsCount}</span>
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={saved ? 'text-blogSphere-600' : ''}
                  onClick={() => setSaved(!saved)}
                >
                  <Bookmark className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            <Separator className="my-8" />
            
            {/* Author bio */}
            <div className="bg-secondary/30 rounded-lg p-6">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-serif text-xl font-bold">{post.author.name}</h3>
                  <p className="text-muted-foreground mt-2 mb-4">{post.author.bio}</p>
                  <Button variant="outline" size="sm">Follow Author</Button>
                </div>
              </div>
            </div>
          </article>
          
          {/* Comments section */}
          <section className="bg-background rounded-lg shadow-lg p-6 md:p-10 mb-10">
            <h2 className="font-serif text-2xl font-bold mb-6">Comments ({post.comments.length})</h2>
            
            {/* Comment form */}
            <div className="mb-8">
              <Textarea 
                placeholder="Share your thoughts..." 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full min-h-[100px] mb-4"
              />
              <Button disabled={!commentText.trim()}>Post Comment</Button>
            </div>
            
            {/* Comments list */}
            <div className="space-y-6">
              {post.comments.map((comment) => (
                <div key={comment.id} className="border-b border-border pb-6">
                  <div className="flex items-center gap-4 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                      <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{comment.author.name}</div>
                      <div className="text-xs text-muted-foreground">{comment.publishedAt}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-2">{comment.content}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <Button variant="ghost" size="sm" className="gap-1 h-auto px-2 py-1">
                      <Heart className="h-4 w-4" />
                      <span>{comment.likesCount}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="h-auto px-2 py-1 text-sm">
                      Reply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      
      <footer className="bg-blogSphere-800 text-white py-10">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">BlogSphere</h3>
              <p className="text-blogSphere-200">
                A place where stories unfold and ideas come to life.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Explore</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-blogSphere-200 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/categories" className="text-blogSphere-200 hover:text-white transition-colors">Categories</Link></li>
                <li><Link to="/" className="text-blogSphere-200 hover:text-white transition-colors">Popular Posts</Link></li>
                <li><Link to="/" className="text-blogSphere-200 hover:text-white transition-colors">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-blogSphere-200 hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="text-blogSphere-200 hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="text-blogSphere-200 hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="text-blogSphere-200 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blogSphere-700 mt-8 pt-6 text-center text-blogSphere-300">
            <p>© 2025 BlogSphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Post;
