import { BlogTypes } from "@/types/blogsDataType";
import Image from "next/image";
import ShareButton from "../reusable/ShareButton";

interface BlogContentProps {
  blogData: BlogTypes;
  lang: "en" | "ar";
}

export default function BlogContent({ blogData, lang }: BlogContentProps) {
  return (
    <article className="container mx-auto px-4 py-6">
      {/* Blog components */}
      {blogData.image && (
        <div className="mb-8 md:mb-4 md:my-4 md:float-end md:w-1/2 md:ms-4 clear-both">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_URL}${blogData.image}`}
            alt={blogData.image_alternate_text || "Blog image"}
            width={400}
            height={300}
            className="rounded-lg w-full object-cover"
          />
        </div>
      )}
      {blogData.components &&
        blogData.components.map((component, index) => (
          <div key={index} className="mb-8">
            {component.heading && (
              <h2 className="text-xl text-black font-medium md:text-3xl">
                {component.heading}
              </h2>
            )}

            {component.sub_heading && (
              <h3 className="text-lg md:text-2xl font-medium mb-3 text-black">
                {component.sub_heading}
              </h3>
            )}

            {component.image && (
              <div className="my-6">
                <Image
                  src={`${process.env.NEXT_PUBLIC_BASE_URL}${component.image}`}
                  alt={component.image_alternate_text || "Blog image"}
                  width={800}
                  height={400}
                  className="rounded-lg w-full object-cover"
                />
              </div>
            )}

            {component.description && (
              <div className="prose max-w-none text-lg text-gray-600">
                {component.description.split("\n").map((paragraph, i) => {
                  // Check if paragraph starts with a bullet point
                  if (
                    paragraph.trim().startsWith("•") ||
                    paragraph.trim().startsWith("-")
                  ) {
                    return (
                      <ul key={i} className="list-disc pl-6 my-4">
                        <li>{paragraph.trim().substring(1).trim()}</li>
                      </ul>
                    );
                  }

                  // Check if it's a numbered list
                  const numberedMatch = paragraph.trim().match(/^\d+\.\s(.+)/);
                  if (numberedMatch) {
                    return (
                      <ol key={i} className="list-decimal pl-6 my-4">
                        <li>{numberedMatch[1]}</li>
                      </ol>
                    );
                  }

                  // Regular paragraph
                  return paragraph.trim() ? (
                    <p key={i} className="my-4">
                      {paragraph}
                    </p>
                  ) : null;
                })}
              </div>
            )}

            {component.button_text && component.button_link && (
              <a
                href={component.button_link}
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors mt-4"
              >
                {component.button_text}
              </a>
            )}
          </div>
        ))}
      {/* Author and date info */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex gap-2 items-center">
          <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
            <Image
              src={
                blogData.author_image
                  ? `${process.env.NEXT_PUBLIC_BASE_URL}${blogData.author_image}`
                  : "/searchIcons/guests.png"
              }
              alt="Author"
              width={48}
              height={48}
            />
          </div>
          <div>
            <p className="font-medium text-gray-800">
              {blogData.author || "Admin - Regent Grove"}
            </p>
            <p className="text-gray-500">
              {blogData.publish_date || "Published recently"}
            </p>
          </div>
        </div>
        <div className="border p-[0.5px] rounded-full border-black hover:border-none hover:bg-gray-100 ">
          <ShareButton
            title={blogData.heading}
            url={`${process.env.NEXT_PUBLIC_DOMAIN_URL}/blogs/${blogData.slug}`}
            lang={lang}
          />
        </div>
      </div>
    </article>
  );
}
