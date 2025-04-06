
import PostCard from "./PostCard";

// Mock data for featured posts
const FEATURED_POSTS = [
  {
    id: "1",
    title: "The Art of Mindful Writing: Finding Your Creative Flow",
    excerpt: "Discover how mindfulness practices can enhance your writing process and help you overcome creative blocks.",
    coverImage: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    author: {
      name: "Alex Morgan",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    category: "Creativity",
    readTime: "5 min read",
    commentsCount: 24,
    likesCount: 152,
  },
  {
    id: "2",
    title: "10 Essential Tools Every Modern Writer Needs in 2025",
    excerpt: "From AI assistants to distraction-free editors, these tools will revolutionize your writing workflow.",
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    author: {
      name: "Jamie Chen",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    category: "Technology",
    readTime: "7 min read",
    commentsCount: 18,
    likesCount: 97,
  },
  {
    id: "3",
    title: "The Future of Digital Publishing: Trends to Watch",
    excerpt: "How emerging technologies and changing reader habits are reshaping the publishing landscape.",
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    author: {
      name: "Taylor Reed",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    },
    category: "Publishing",
    readTime: "8 min read",
    commentsCount: 31,
    likesCount: 127,
  },
];

const FeaturedPosts = () => {
  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold tracking-tight">Featured Posts</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_POSTS.map((post) => (
            <PostCard key={post.id} {...post} featured />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPosts;
