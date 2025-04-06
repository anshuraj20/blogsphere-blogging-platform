
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Mock categories data with counts
const CATEGORIES = [
  { id: "1", name: "Technology", count: 128 },
  { id: "2", name: "Creativity", count: 85 },
  { id: "3", name: "Publishing", count: 64 },
  { id: "4", name: "Writing Tips", count: 47 },
  { id: "5", name: "Personal Growth", count: 92 },
  { id: "6", name: "Book Reviews", count: 56 },
  { id: "7", name: "Industry News", count: 38 },
  { id: "8", name: "Author Interviews", count: 29 },
];

const CategoryList = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="font-serif text-xl font-bold mb-4">Popular Categories</h3>
      <div className="space-y-2">
        {CATEGORIES.map((category) => (
          <Link 
            key={category.id} 
            to={`/category/${category.id}`}
            className="flex items-center justify-between py-2 hover:text-blogSphere-700 transition-colors"
          >
            <span>{category.name}</span>
            <span className="text-sm text-muted-foreground px-2 py-1 rounded-full bg-secondary">
              {category.count}
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-6">
        <Button variant="outline" className="w-full">View All Categories</Button>
      </div>
    </div>
  );
};

export default CategoryList;
