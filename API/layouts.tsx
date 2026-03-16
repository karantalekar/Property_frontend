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

// export async function getBlogBySlug(slug: string) {
//   const result = await apiFetcher("/blog/", { slug });
//   console.log(result);
//   return result?.data || null;
// }

// interface BlogComponent {
//   component: string;
//   heading: string;
//   sub_heading?: string;
//   description: string;
//   number_of_columns?: number;
//   align_element?: string;
//   image_size?: string;
//   gap_top?: number;
//   gap_bottom?: number;
//   button_text?: string;
//   button_link?: string;
//   banner_horizontal_position?: string;
//   banner_horizontal_position_value?: string;
//   banner_vertical_position?: string;
//   banner_vertical_position_value?: string;
//   image?: string;
//   image_alternate_text?: string;
//   points?: any[];
//   content?: any[];
// }

// export interface BlogItem {
//   id: number;
//   slug: string;
//   heading: string;
//   description: string;
//   author: string;
//   author_image: string;
//   publish_date: string;
//   image: string;
//   image_alternate_text: string;
//   components: BlogComponent[];
//   website_meta_title?: boolean | string;
//   website_meta_description?: boolean | string;
//   website_meta_keywords?: boolean | string;
// }

// interface ApiResponse {
//   jsonrpc: string;
//   id: null | string | number;
//   result: {
//     status: boolean;
//     message: string;
//     data: BlogItem | null;
//   };
// }

// /**
//  * Fetch single blog by slug
//  * @param slug - Blog slug identifier
//  * @returns Blog item or null if not found
//  */
// export async function getBlogBySlug(slug: string): Promise<BlogItem | null> {
//   // Validate slug
//   if (!slug || typeof slug !== "string" || slug.trim() === "") {
//     console.error("Invalid slug provided");
//     return null;
//   }

//   try {
//     const result = await apiFetcher("/blog/", { slug });
//     console.log(result);

//     return result;
//   } catch (error) {
//     console.error(`Error fetching blog with slug "${slug}":`, error);
//     return null;
//   }
// }

export async function getBlogBySlug(slug: string) {
  if (!slug || typeof slug !== "string" || slug.trim() === "") {
    console.error("Invalid slug provided");
    return null;
  }

  try {
    const response = await apiFetcher("/blog/", { slug });

    console.log("Blog API response:", response);

    // If API structure is: { status, message, data }
    if (!response?.status || !response?.data) {
      return null;
    }

    return response.data; // ✅ return actual blog
  } catch (error) {
    console.error(`Error fetching blog with slug "${slug}":`, error);
    return null;
  }
}
