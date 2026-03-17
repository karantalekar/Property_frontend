export interface BlogTypes {
  id: number;
  slug: string;
  heading: string;
  description: string;
  image: string;
  image_alternate_text: string;
  author: string;
  publish_date: string; // ISO date string (YYYY-MM-DD)
  button_text: string;
  button_url: string;
}
