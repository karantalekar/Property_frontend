// import { getBlogs } from "@/API/layouts";
// import BlogCard from "@/component/Blogcard";

// export default async function BlogPage() {
//   const blogs = await getBlogs();

//   return (

//     <div className="max-w-7xl mx-auto px-6 py-16">
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
//         {blogs.map((blog: any) => (
//           <BlogCard key={blog.id} blog={blog} />
//         ))}
//       </div>
//     </div>
//   );
// }

import { getBlogs } from "@/API/layouts";
import BlogCard from "@/component/Blogcard";
import Image from "next/image";

export default async function BlogPage() {
  const blogs = await getBlogs();

  const banner = {
    heading: "Luxury Property Booking Insights",
    description:
      "Explore expert insights, premium property trends, and exclusive guides for luxury home and real estate bookings.",
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full md:h-[450px] h-[380px] flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src="/regent-grove-cta.png"
          alt={banner.heading}
          fill
          priority
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 z-0" />

        {/* Content */}
        <div className="relative z-10 px-4">
          <h1 className="text-3xl md:text-6xl  mb-4 mt-15">{banner.heading}</h1>

          <p className="text-lg md:text-2xl opacity-90 ">
            {banner.description}
          </p>
        </div>
      </section>

      <div className="container mx-auto py-16 px-4 md:px-6">
        {" "}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog: any) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      </div>
    </>
  );
}
