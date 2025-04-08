
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedPosts from "@/components/FeaturedPosts";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

// Dummy data for recent posts with Indian writer names
const RECENT_DUMMY_POSTS = [
  {
    id: "dummy-4",
    title: "How to Build a Personal Brand as a Writer",
    excerpt: "Learn strategies to develop a strong personal brand that helps you stand out in a crowded marketplace.",
    content: "Building a personal brand as a writer is essential in today's competitive landscape. Your brand is how readers perceive you and your work, and it can significantly impact your success.\n\nConsistency is the foundation of a strong personal brand. This applies to your writing style, the themes you explore, your visual identity, and how you engage with your audience. Readers should know what to expect from your work while still being surprised by your creativity.\n\nAuthenticity resonates with readers. Share your unique perspective and voice rather than trying to mimic other successful writers. Your personal experiences, insights, and worldview are what make your writing distinctive and valuable.\n\nStrategic visibility is important for brand growth. This doesn't mean being everywhere at once, but rather choosing the platforms and communities where your ideal readers gather. Focus your energy on meaningful engagement rather than spreading yourself too thin across multiple channels.",
    coverImage: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7",
    author: {
      name: "Raj Malhotra",
      id: "dummy-author-4"
    },
    category: "Personal Growth",
    tags: ["personal branding", "writing career", "marketing"],
    status: "published",
    publishDate: "2025-02-28",
    views: 1420,
    commentsCount: 14,
    likesCount: 87,
  },
  {
    id: "dummy-5",
    title: "The Psychology Behind Great Storytelling",
    excerpt: "Explore the psychological principles that make stories resonate deeply with readers.",
    content: "Stories have captivated humans since the dawn of civilization, and there are deep psychological reasons why narrative has such a powerful grip on our minds.\n\nEmpathy is at the heart of storytelling. When we follow a character's journey, our brains simulate their experiences, activating many of the same neural pathways as if we were encountering the events ourselves. This is why we can feel genuine emotions while reading fiction.\n\nNarrative transportation—the feeling of being 'lost' in a story—occurs when we are fully immersed in a narrative world. This state reduces our analytical thinking and makes us more receptive to the themes and ideas embedded in the story. Skilled writers create immersive experiences that transport readers away from their immediate surroundings.\n\nThe psychological concept of 'closure' helps explain why stories with satisfying endings feel so rewarding. Our brains naturally seek resolution and meaning, and a well-crafted conclusion provides the emotional payoff we crave.",
    coverImage: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    author: {
      name: "Neha Desai",
      id: "dummy-author-5"
    },
    category: "Writing Tips",
    tags: ["psychology", "storytelling", "writing craft"],
    status: "published",
    publishDate: "2025-01-15",
    views: 1890,
    commentsCount: 22,
    likesCount: 134,
  },
  {
    id: "dummy-6",
    title: "Finding Your Voice: Authenticity in Writing",
    excerpt: "Discover techniques to develop your unique writing voice and connect with your audience.",
    content: "A distinctive writing voice is perhaps the most valuable asset a writer can develop. Voice is the personality of your writing—it's what makes your work recognizably yours.\n\nReading widely is essential for developing your voice. By exposing yourself to diverse styles and approaches, you'll begin to identify what resonates with you and what doesn't. This understanding forms the foundation of your own distinctive voice.\n\nWriting regularly without self-censorship helps your natural voice emerge. Many writers find that their authentic voice only appears after they've written through their initial imitations of others and their internal critic's constraints.\n\nFeedback from trusted readers can help you identify the aspects of your voice that are most effective. Often, others can recognize the strengths in your writing that you might overlook or take for granted.",
    coverImage: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    author: {
      name: "Arjun Patel",
      id: "dummy-author-6"
    },
    category: "Creativity",
    tags: ["writing voice", "authenticity", "writing craft"],
    status: "published",
    publishDate: "2025-03-22",
    views: 1580,
    commentsCount: 19,
    likesCount: 112,
  },
  {
    id: "dummy-7",
    title: "The Definitive Guide to Self-Publishing",
    excerpt: "Everything you need to know about self-publishing your work and reaching your audience directly.",
    content: "Self-publishing has revolutionized the literary landscape, giving writers unprecedented control over their work and careers. Understanding the process is essential for those looking to take this path.\n\nProfessional editing remains crucial despite the independent nature of self-publishing. Investing in quality editing—developmental, line, and copy editing—significantly improves your work and demonstrates respect for your readers.\n\nCover design plays a vital role in a book's success. Your cover is your most important marketing tool, and professional design that meets genre expectations while standing out is worth the investment.\n\nDistribution strategy determines how readers discover your work. Understanding the advantages and limitations of various platforms—from Amazon KDP to wide distribution through aggregators like Draft2Digital—helps you make informed decisions about where and how to sell your books.",
    coverImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    author: {
      name: "Meera Joshi",
      id: "dummy-author-7"
    },
    category: "Publishing",
    tags: ["self-publishing", "book marketing", "indie author"],
    status: "published",
    publishDate: "2025-02-05",
    views: 2250,
    commentsCount: 28,
    likesCount: 165,
  },
];

const Index = () => {
  const { addDummyPosts } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Add dummy posts to the context when component mounts
  useEffect(() => {
    if (!isLoaded) {
      addDummyPosts(RECENT_DUMMY_POSTS);
      setIsLoaded(true);
    }
  }, [addDummyPosts, isLoaded]);

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
                  {RECENT_DUMMY_POSTS.map((post) => (
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
                    />
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
