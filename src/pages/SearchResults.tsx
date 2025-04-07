
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

// Mock posts data to search from
const ALL_POSTS = [
  {
    id: "1",
    title: "10 Essential Tips for Better Writing",
    excerpt: "Improve your writing skills with these practical tips that you can apply immediately.",
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a",
    author: {
      name: "Alex Johnson",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    category: "Writing Tips",
    readTime: "5 min read",
    commentsCount: 12,
    likesCount: 89,
    content: "Writing is an essential skill in today's world. Whether you're a student, professional, or hobbyist, these tips will help you improve your writing significantly."
  },
  {
    id: "2",
    title: "The Future of AI in Content Creation",
    excerpt: "Explore how artificial intelligence is transforming the landscape of content creation and publishing.",
    coverImage: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
    author: {
      name: "Taylor Kim",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    category: "Technology",
    readTime: "8 min read",
    commentsCount: 24,
    likesCount: 156,
    content: "Artificial intelligence is revolutionizing how we create, edit, and distribute content. This post explores the latest AI tools for writers and publishers."
  },
  {
    id: "3",
    title: "Building a Sustainable Writing Practice",
    excerpt: "Learn how to establish a consistent writing routine that leads to long-term success and growth.",
    coverImage: "https://images.unsplash.com/photo-1516383740770-fbcc5ccbece0",
    author: {
      name: "Jamie Rivera",
      avatar: "https://randomuser.me/api/portraits/women/62.jpg",
    },
    category: "Creativity",
    readTime: "7 min read",
    commentsCount: 18,
    likesCount: 103,
    content: "Consistency is key to improving as a writer. This article shares practical strategies for building a sustainable writing practice that fits your lifestyle."
  },
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
    content: "Building a personal brand as a writer is essential in today's digital landscape. Learn how to position yourself and grow your audience effectively."
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
    content: "Great stories tap into fundamental human psychology. This article explores the principles that make narratives compelling and memorable to readers."
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
    content: "Finding your authentic voice is crucial for standing out as a writer. This post explores exercises and techniques to uncover and refine your unique writing style."
  },
];

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState<typeof ALL_POSTS>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate search operation
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (query) {
        const searchResults = ALL_POSTS.filter(post => {
          const searchTerm = query.toLowerCase();
          return (
            post.title.toLowerCase().includes(searchTerm) || 
            post.excerpt.toLowerCase().includes(searchTerm) || 
            post.content.toLowerCase().includes(searchTerm) || 
            post.category.toLowerCase().includes(searchTerm) ||
            post.author.name.toLowerCase().includes(searchTerm)
          );
        });
        setResults(searchResults);
      } else {
        setResults([]);
      }
      setIsLoading(false);
    }, 500); // Simulate network delay

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">Search Results</h1>
            <p className="text-muted-foreground">
              {isLoading ? (
                "Searching..."
              ) : results.length > 0 ? (
                `Found ${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`
              ) : (
                `No results found for "${query}"`
              )}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-pulse flex flex-col items-center">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Searching for posts...</p>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {results.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-full max-w-md">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any posts matching your search. Try different keywords or browse recent posts.
                </p>
                <Button onClick={() => window.history.back()}>Go Back</Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchResults;
