import { apiFetcher } from "./api-fetcher";

export async function getBlogs() {
  const result = await apiFetcher("/blogs/lists", {
    page: 1,
    page_size: 10,
    lang: "en_001",
    show_on_homepage: true,
  });

  return result?.data || [];
}
