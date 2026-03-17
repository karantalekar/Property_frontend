import { BlogTypes } from "@/types/blogsDataType";
import SingleBlogCard from "./SingleBlogCard";

interface BlogGridProps {
  blogs: BlogTypes[];
  isLoading: boolean;
}

export default function BlogGrid({ blogs, isLoading }: BlogGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-100 animate-pulse h-[450px] rounded-lg"
          ></div>
        ))}
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-600">
          No blog posts found for this category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.map((blog) => (
        <SingleBlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  );
}
