import Image from "next/image";
import Link from "next/link";

interface Props {
  blog: any;
}

export default function SingleBlogCard({ blog }: Props) {
  return (
    <Link href={`/blogs/${blog.slug}`} className="block group">
      <div className="relative w-full transition-transform duration-300 hover:scale-105">
        <div className="relative z-10 h-72 sm:h-96 md:h-72 lg:h-96 w-[85%] mx-auto rounded-xl overflow-hidden">
          <Image
            // src={blog.image}
            src={`${process.env.NEXT_PUBLIC_BASE_URL}${blog.image}`}
            alt={blog.image_alternate_text}
            fill
            className="object-cover"
          />
        </div>

        <div
          className="
            lg:-mt-60 md:-mt-50 sm:-mt-60 -mt-50
            bg-[#F7F4EE]
            px-5  pb-3
            rounded-xl
            h-96  w-full
            flex flex-col justify-end
          "
        >
          <p className="lg:text-2xl text-xl lg:ml-4 sm:ml-7 text-black font-semibold sm:font-normal sm:line-clamp-1 leading-snug">
            {blog.heading}
          </p>

          <p className="mt-2 text-lg lg:ml-4 sm:ml-7 text-gray-600 leading-relaxed line-clamp-2">
            {blog.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
