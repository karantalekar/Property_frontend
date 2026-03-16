import { getBlogBySlug } from "@/API/layouts";
import BlogDetailClient from "@/component/Blogdetailclient";

export default async function BlogDetailPage({
  params,
}: {
  // params: Promise<{ slug: string }>;
  params: { slug: string };
}) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f3f4f6",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h2
            style={{
              fontSize: "30px",
              fontWeight: "bold",
              color: "#111827",
              marginBottom: "8px",
            }}
          >
            Blog Not Found
          </h2>
          <p style={{ color: "#4b5563", marginBottom: "24px" }}>
            Sorry, the blog you're looking for doesn't exist.
          </p>
          <a
            href="/blogs"
            style={{
              display: "inline-block",
              backgroundColor: "#2563eb",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Back to Blogs
          </a>
        </div>
      </div>
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://beljumlah-11072023-28562543.dev.odoo.com";

  return <BlogDetailClient blog={blog} baseUrl={baseUrl} />;
}
