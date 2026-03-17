import Link from "next/link";
import SingleBlogCard from "./SingleBlogCard";
import { BlogTypes } from "@/types/blogsDataType";
import { translations } from "@/i18n/translations";

interface RelatedBlogsProps {
  blogs: BlogTypes[];
  lang: "en" | "ar";
}

export default function RelatedBlogs({ blogs, lang }: RelatedBlogsProps) {
  if (!blogs || blogs.length === 0) {
    return null;
  }

  const t = translations[lang];

  return (
    <aside className="sticky top-8 px-4 py-6">
      <h3 className="text-xl mb-6 text-(--primaryColor) font-medium md:text-3xl">
        {t.otherBlogs}
      </h3>

      <div className="grid grid-cols-1 gap-8">
        {blogs.map((blog) => (
          <SingleBlogCard key={blog.id} blog={blog} />
        ))}
      </div>

      <div className="mt-6 text-end">
        <Link
          href="/blogs"
          className="inline-block text-(--primaryColor) font-medium transition-colors"
        >
          {t.viewAllBlogs} &gt;&gt;
        </Link>
      </div>
    </aside>
  );
}
