
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedPosts from "@/components/FeaturedPosts";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";

// Mock data for recent posts
const RECENT_POSTS = [
  {
    id: "4",
    title: "How to Build a Personal Brand as a Writer",
    excerpt: "Learn strategies to develop a strong personal brand that helps you stand out in a crowded marketplace.",
    coverImage: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    author: {
      name: "Jordan Smith",
      avatar: "https://randomuser.me/api/portraits/men/52.jpg",
    },
    category: "Personal Growth",
    readTime: "6 min read",
    commentsCount: 14,
    likesCount: 87,
  },
  {
    id: "5",
    title: "The Psychology Behind Great Storytelling",
    excerpt: "Explore the psychological principles that make stories resonate deeply with readers.",
    coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    author: {
      name: "Casey Wong",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    category: "Writing Tips",
    readTime: "9 min read",
    commentsCount: 22,
    likesCount: 134,
  },
  {
    id: "6",
    title: "Finding Your Voice: Authenticity in Writing",
    excerpt: "Discover techniques to develop your unique writing voice and connect with your audience.",
    coverImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    author: {
      name: "Riley Johnson",
      avatar: "https://randomuser.me/api/portraits/men/43.jpg",
    },
    category: "Creativity",
    readTime: "7 min read",
    commentsCount: 19,
    likesCount: 112,
  },
  {
    id: "7",
    title: "The Definitive Guide to Self-Publishing",
    excerpt: "Everything you need to know about self-publishing your work and reaching your audience directly.",
    coverImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    author: {
      name: "Morgan Lee",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    },
    category: "Publishing",
    readTime: "12 min read",
    commentsCount: 28,
    likesCount: 165,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <Hero />
        <FeaturedPosts />
        
        <section className="py-12 bg-secondary/30">
          <div className="container px-4 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Recent Articles</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {RECENT_POSTS.map((post) => (
                    <PostCard key={post.id} {...post} />
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Button variant="outline" size="lg">Load More Articles</Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-blogSphere-800 text-white py-10 mt-auto">
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
                <li><a href="#" className="text-blogSphere-200 hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="text-blogSphere-200 hover:text-white transition-colors">Popular Posts</a></li>
                <li><a href="#" className="text-blogSphere-200 hover:text-white transition-colors">About Us</a></li>
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

export default Index;
