export interface BlogTypes {
  id: number;
  slug: string;
  heading: string;
  description: string;
  image: string;
  image_alternate_text: string;
  author: string;
  author_image?: string;
  publish_date: string; // ISO date string (YYYY-MM-DD)
  button_text: string;
  button_url: string;
  components?: Array<{
    heading?: string;
    sub_heading?: string;
    description?: string;
    image?: string;
    image_alternate_text?: string;
    button_text?: string;
    button_link?: string;
  }>;
  [key: string]: any; // Allow additional properties from API
}
