"use client";
import React, { useEffect, useState } from "react";

import BlogTabs from "./BlogTabs";
import BlogGrid from "./BlogGrid";
import { BlogTypes } from "@/types/blogsDataType";
import { getBlogs } from "@/API/home/blogsApi";

interface BlogSectionProps {
  // labels: Label[];
  initialBlogsData: BlogTypes[];
  lang: "en" | "ar";
}

export default function BlogSection({
  // labels,
  initialBlogsData,
  lang,
}: BlogSectionProps) {
  const [activeLabel, setActiveLabel] = useState<number>(0);
  const [blogsData, setBlogsData] = useState<BlogTypes[]>(initialBlogsData);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitching, setIsSwitching] = useState<boolean>(false);

  useEffect(() => {
    // Load more after fade completes
    if (page === 1 || activeLabel !== 0) return;
    fetchBlogs(page, activeLabel, true);
  }, [page, activeLabel]);

  const fetchBlogs = async (
    pageToFetch: number,
    labelId: number,
    append: boolean,
  ) => {
    setIsLoading(true);
    try {
      const response = await getBlogs(
        lang,
        // labelId === 0 ? undefined : labelId,
        pageToFetch,
      );
      const result = response.result;

      setBlogsData((prev) => {
        if (append) {
          return {
            ...result,
            blogs: [...result.data],
          };
        }
        return result;
      });
    } catch (error) {
      return error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!isLoading) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <section className="container mx-auto py-8 lg:py-12 px-4">
      <div className="">
        {/* <BlogTabs
          labels={labels}
          activeLabel={activeLabel}
          onTabChange={handleTabChange}
        /> */}

        <div
          className={
            `transition-all duration-300 ease-in-out transform ` +
            (isSwitching ? "opacity-0 scale-95" : "opacity-100 scale-100")
          }
        >
          {/* <BlogGrid blogs={blogsData.data} isLoading={isLoading} /> */}
        </div>

        {page && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className={`bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-colors ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
