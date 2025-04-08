
import PostCard from "./PostCard";
import { useAuth, Post } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

// Dummy data for featured posts with Indian writer names
const DUMMY_FEATURED_POSTS = [
  {
    id: "dummy-1",
    title: "The Art of Mindful Writing: Finding Your Creative Flow",
    excerpt: "Discover how mindfulness practices can enhance your writing process and help you overcome creative blocks.",
    content: "Mindfulness is the practice of being fully present and engaged in the moment, aware of your thoughts and feelings without distraction or judgment. For writers, mindfulness can be a powerful tool to enhance creativity and overcome writer's block.\n\nWhen we write mindfully, we create from a place of awareness rather than from autopilot. This allows us to access deeper insights and more authentic expression. Many writers find that their best ideas come when they are fully present with their work.\n\nTo practice mindful writing, start by setting aside a dedicated time and space free from distractions. Begin with a few minutes of deep breathing to center yourself. As you write, notice when your mind wanders and gently bring your attention back to your words. Don't judge what emerges—simply observe and continue.\n\nRegular mindfulness practice can help you develop a more consistent writing habit, reduce anxiety about your work, and connect more deeply with your creative intuition. The goal isn't perfection but presence.",
    coverImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    author: {
      name: "Ananya Sharma",
      id: "dummy-author-1"
    },
    category: "Creativity",
    tags: ["mindfulness", "writing", "creativity"],
    status: "published",
    publishDate: "2025-02-15",
    views: 2450,
    commentsCount: 24,
    likesCount: 152,
  },
  {
    id: "dummy-2",
    title: "Essential Tools Every Modern Writer Needs in 2025",
    excerpt: "From AI assistants to distraction-free editors, these tools will revolutionize your writing workflow.",
    content: "The writing landscape has transformed dramatically with technology. Today's writers have access to tools that can streamline their workflow, enhance creativity, and improve the quality of their work.\n\nAI writing assistants have become indispensable for many writers. These tools can help with grammar checking, suggest style improvements, and even assist with research. While they shouldn't replace human creativity, they can serve as valuable collaborators in the writing process.\n\nDistraction-free writing environments help writers focus solely on their words. Applications that offer minimalist interfaces, dark modes, and focus-enhancing features have gained popularity for good reason. They create a digital space that promotes deep work and sustained attention.\n\nOrganizational tools for writers have also evolved. Modern note-taking apps allow writers to capture and organize ideas across devices, creating a seamless ecosystem for developing concepts into finished pieces. Cloud-based solutions ensure your work is accessible anywhere and protected from local hardware failures.",
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    author: {
      name: "Vikram Mehta",
      id: "dummy-author-2"
    },
    category: "Technology",
    tags: ["writing tools", "productivity", "technology"],
    status: "published",
    publishDate: "2025-01-22",
    views: 1850,
    commentsCount: 18,
    likesCount: 97,
  },
  {
    id: "dummy-3",
    title: "The Future of Digital Publishing: Trends to Watch",
    excerpt: "How emerging technologies and changing reader habits are reshaping the publishing landscape.",
    content: "Digital publishing continues to evolve at a rapid pace, driven by technological innovation and shifting reader preferences. Understanding these trends is crucial for writers and publishers looking to stay relevant in the coming years.\n\nInteractive storytelling is gaining momentum as creators explore ways to engage readers beyond traditional text. This includes multimedia elements, choose-your-own-adventure formats, and immersive experiences that blur the line between literature and other media forms.\n\nSubscription models have disrupted traditional publishing economics. Platforms offering unlimited access to curated content libraries have changed how readers discover and consume written work. For writers, this means adapting to new compensation structures and audience development strategies.\n\nMobile-first content consumption continues to grow, with readers increasingly accessing content on smartphones and tablets. Successful digital publishers are optimizing the reading experience for smaller screens, shorter attention spans, and on-the-go consumption patterns.",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    author: {
      name: "Priya Nair",
      id: "dummy-author-3"
    },
    category: "Publishing",
    tags: ["digital publishing", "future trends", "technology"],
    status: "published",
    publishDate: "2025-03-10",
    views: 2120,
    commentsCount: 31,
    likesCount: 127,
  },
];

const FeaturedPosts = () => {
  const { addDummyPosts } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Add dummy posts to the context when component mounts
  useEffect(() => {
    if (!isLoaded) {
      addDummyPosts(DUMMY_FEATURED_POSTS);
      setIsLoaded(true);
    }
  }, [addDummyPosts, isLoaded]);

  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Featured Posts</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DUMMY_FEATURED_POSTS.map((post) => (
            <PostCard 
              key={post.id}
              id={post.id}
              title={post.title}
              excerpt={post.excerpt}
              coverImage={post.coverImage}
              author={{
                name: post.author.name,
                avatar: ""
              }}
              category={post.category}
              readTime={`${Math.ceil(post.content.length / 1000)} min read`}
              commentsCount={post.commentsCount}
              likesCount={post.likesCount}
              featured
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPosts;
