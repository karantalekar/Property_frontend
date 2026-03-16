import Link from "next/link";

export default function BlogCard({ blog }: any) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const imageUrl = baseUrl + blog.image;

  const publishDate = new Date(blog.publish_date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Link href={`/blogs/${blog.slug}`}>
      <div className="cursor-pointer group h-full  w-full md:w-[100%] mb-4 md:mb-6">
        {/* Card */}
        <div className="bg-[#FFFBF1] rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full flex flex-col hover:-translate-y-2">
          {/* Image */}
          <div className="overflow-hidden relative bg-gray-200 ">
            <img
              src={imageUrl}
              alt={blog.heading}
              className="w-full h-auto "
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col flex-grow">
            <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 line-clamp-2 sm:line-clamp-3 mb-2 sm:mb-3 leading-snug">
              {blog.heading}
            </h3>

            <p className="text-xs sm:text-sm md:text-base text-gray-600 line-clamp-2 sm:line-clamp-3 md:line-clamp-4 mb-3 sm:mb-4 flex-grow leading-relaxed">
              {blog.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
