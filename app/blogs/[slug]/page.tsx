import { getBlogs } from "@/API/layouts";

export default async function BlogDetail({
  params,
}: {
  params: { slug: string };
}) {
  const blogs = await getBlogs();

  const blog = blogs.find((b: any) => b.slug === params.slug);

  if (!blog) {
    return <div className="p-20 text-center">Blog not found</div>;
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const imageUrl = baseUrl + blog.image;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <img
        src={imageUrl}
        alt={blog.heading}
        className="w-full rounded-xl mb-8"
      />

      <h1 className="text-4xl font-bold mb-4">{blog.heading}</h1>

      <p className="text-gray-500 mb-6">
        By {blog.author} • {blog.publish_date}
      </p>

      <p className="text-lg text-gray-700 leading-relaxed">
        {blog.description}
      </p>
    </div>
  );
}
