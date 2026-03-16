"use client";

import Link from "next/link";
import Image from "next/image";
import BlogCard from "./Blogcard";

interface BlogDetailClientProps {
  blog: any;
  allBlogs?: any[];
  baseUrl: string;
}

export default function BlogDetailClient({
  blog,
  allBlogs = [],
  baseUrl,
}: BlogDetailClientProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString + "T00:00:00Z");
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  console.log("BlogDetailClient received blog:", allBlogs);

  const banner = {
    heading: "Luxury Property Booking Insights",
    description:
      "Explore expert insights, premium property trends, and exclusive guides for luxury home and real estate bookings.",
  };

  const publishDate = formatDate(blog.publish_date);
  const imageUrl = `${baseUrl}${blog.image}`;

  // Filter out current blog from all blogs
  const otherBlogs = allBlogs.filter((b) => b.id !== blog.id);

  return (
    <>
      {/* Banner Section */}
      <section className="relative w-full h-[300px] sm:h-[380px] md:h-[450px] flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src="/regent-grove-cta.png"
          alt={banner.heading}
          fill
          priority
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 z-0" />

        {/* Content */}
        <div className="relative z-10 px-3 sm:px-4 md:px-6">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 sm:mb-3 md:mb-4">
            {banner.heading}
          </h1>

          <p className="text-sm sm:text-base md:text-lg lg:text-2xl opacity-90">
            {banner.description}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="min-h-screen bg-white container mx-auto py-8 px-4 md:px-6">
        <div className="w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
            {/* Left Column (2/3 - Main Content) */}
            <article className="col-span-1 md:col-span-8 space-y-6 sm:space-y-8">
              {/* Featured Image with Description - Side by Side */}
              {blog.image && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 lg:gap-8 items-start">
                  {/* Left - Description Text */}
                  <div className="space-y-3 sm:space-y-4 flex flex-col justify-start md:pr-4  order-2 md:order-1">
                    <p className="text-base sm:text-lg md:text-lg lg:text-2xl text-gray-700 leading-relaxed">
                      {blog.description.split("\n").slice(0, 3).join("\n")}
                    </p>
                  </div>

                  {/* Right - Image */}
                  <figure className="rounded-lg overflow-hidden shadow-md h-auto md:h-full order-1 md:order-2">
                    <div className="relative w-full h-auto">
                      <img
                        src={imageUrl}
                        alt={blog.image_alternate_text || blog.heading}
                        className="w-full h-auto object-contain block"
                        loading="lazy"
                        onError={(e) =>
                        ((e.target as HTMLImageElement).style.display =
                          "none")
                        }
                      />
                    </div>
                    {blog.image_alternate_text && (
                      <figcaption className="text-center text-gray-600 text-xs md:text-2xl sm:text-sm p-2 sm:p-3 bg-gray-50">
                        {/* {blog.image_alternate_text} */}
                      </figcaption>
                    )}
                  </figure>
                </div>
              )}

              {/* Components / Sections */}
              {blog.components && blog.components.length > 0 && (
                <div className="space-y-8 sm:space-y-10 md:space-y-12">
                  {blog.components.map((component: any, idx: number) => (
                    <section
                      key={idx}
                      className="space-y-3 sm:space-y-4 border-l-4  pl-4 sm:pl-6"
                    >
                      <h2 className="text-2xl sm:text-3xl md:text-5xl  text-black">
                        {component.heading}
                      </h2>

                      {component.sub_heading && (
                        <h3 className="text-base sm:text-lg md:text-2xl font-semibold text-blue-600">
                          {component.sub_heading}
                        </h3>
                      )}

                      <p className="text-gray-700 text-base md:text-2xl sm:text-lg leading-relaxed whitespace-pre-wrap">
                        {component.description}
                      </p>

                      {/* Points */}
                      {component.points && component.points.length > 0 && (
                        <ul className="disc list-inside text-gray-700 space-y-2 text-sm sm:text-base">
                          {component.points.map((point: string, i: number) => (
                            <li key={i} className="ml-2">
                              {point}
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* Content */}
                      {component.content && component.content.length > 0 && (
                        <div className="space-y-2 sm:space-y-3 text-gray-700">
                          {component.content.map((c: string, i: number) => (
                            <p
                              key={i}
                              className="text-sm sm:text-base leading-relaxed"
                            >
                              {c}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* CTA Button */}
                      {component.button_text && component.button_link && (
                        <div className="pt-4">
                          <a
                            href={component.button_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm sm:text-base"
                          >
                            {component.button_text} →
                          </a>
                        </div>
                      )}
                    </section>
                  ))}
                </div>
              )}

              {/* Back Button */}
              <div className="pt-6 sm:pt-8 border-t border-gray-200">
                <a
                  href="/blogs"
                  className="text-blue-600 font-semibold hover:text-blue-700 transition-colors text-base sm:text-lg"
                >
                  ← Back to All Blogs
                </a>
              </div>
            </article>

            {/* Right Column (1/3 - Sidebar with All Blogs) */}

            <aside className="col-span-1 md:col-span-4">
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                  More Blogs
                </h3>

                {otherBlogs && otherBlogs.length > 0 ? (
                  // render the mapped BlogCard components directly (no extra braces)
                  otherBlogs.map((b) => <BlogCard key={b.id} blog={b} />)
                ) : (
                  <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm md:text-base">No other blogs available</p>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
