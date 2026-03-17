export interface SectionData {
  id: number;
  type: string;
  heading: string;
  sub_heading: string;
  description: string;
  is_active: boolean;
  image: string;
  image_2?: string;
  image_alternate_text: string;
  image_alternate_text_2?: string;
  button_text_1: string;
  button_url_1: string;
  button_text_2: string;
  button_url_2: string;
  sub_sections: SubSectionData[];
  banner: Banner[];
  amenities?: Amenity[];
}

export interface SubSectionData {
  id: number;
  type: string;
  heading: string;
  sub_heading: string;
  description: string;
  is_active: boolean;
  image: string;
  image_alternate_text: string;
  button_text_1: string;
  button_url_1: string;
  button_text_2: string;
  button_url_2: string;
  name: string;
}

export interface Banner {
  id: number;
  heading: string;
  subheading: string;
  description: string;
  image: string;
  image_alternate_text: string;
  btn_text: string;
  btn_link: string;
}
export interface GallerySectionTypes {
  id: number;
  type: string;
  heading: string | false;
  sub_heading: string | false;
  description: string | false;
  is_active: boolean;
  image: string;
  image_alternate_text: string | false;
  button_text_1: string | false;
  button_url_1: string | false;
  button_text_2: string | false;
  button_url_2: string | false;
  sub_sections: SubSectionData[];
  banner: Banner[];
}

export interface FaqSection {
  id: number;
  type: "faq";
  heading: string;
  sub_heading: string;
  description: string;
  is_active: boolean;
  button_text_1: string;
  button_url_1: string;
  button_text_2: string;
  button_url_2: string;
  image: string;
  image_alternate_text: string;
  sub_sections: SubSectionData[];
  banner: Banner[];
}

export interface FeedbackSection {
  id: number;
  type: "feedback";
  heading: string | false;
  sub_heading: string | false;
  description: string | false;
  is_active: boolean;
  button_text_1: string | false;
  button_url_1: string | false;
  button_text_2: string | false;
  button_url_2: string | false;
  image: string;
  image_alternate_text: string | false;
  sub_sections: SubSectionData[];
  banner: Banner[];
}

export interface Amenity {
  id: number;
  name: string;
  image: string;
}
