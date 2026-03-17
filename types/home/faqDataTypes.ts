export interface FaqSubSection {
  id: number;
  name: string;
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
  banner: any[];
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
  sub_sections: FaqSubSection[];
  banner: any[];
}

export const propertyDummyData = [
  {
    id: 1,
    image: "/cities/jeddah.png",
    title: "Studio with Master Bed",
    price: 372.96,
    rating: 10.0,
    reviews: 398,
    discount: 30,
    amenities: [
      "Parking",
      "Television",
      "Wifi",
      "House Keeping",
      "Almirah",
      "Bed Sheet",
      "CCTV",
      "air conditionor",
      "Pillow",
      "Drinking Water",
      "Bathroom",
      "Food",
    ],
  },
  {
    id: 2,
    image: "/cities/jeddah.png",
    title: "Studio with Master Bed",
    price: 372.96,
    rating: 10.0,
    reviews: 398,
    discount: 30,
    amenities: [
      "Parking",
      "Television",
      "Wifi",
      "House Keeping",
      "Almirah",
      "Bed Sheet",
      "CCTV",
      "air conditionor",
      "Pillow",
      "Drinking Water",
      "Bathroom",
      "Food",
    ],
  },
  {
    id: 3,
    image: "/cities/mecca.png",
    title: "Luxury Studio Room",
    price: 420.0,
    rating: 9.5,
    reviews: 214,
    amenities: [
      "Wifi",
      "Television",
      "Bathroom",
      "Bed Sheet",
      "Pillow",
      "Drinking Water",
    ],
  },
  {
    id: 4,
    image: "/cities/mecca.png",
    title: "Luxury Studio Room",
    price: 420.0,
    rating: 9.5,
    reviews: 214,
    amenities: [
      "Wifi",
      "Television",
      "Bathroom",
      "Bed Sheet",
      "Pillow",
      "Drinking Water",
    ],
  },
  {
    id: 5,
    image: "/cities/jeddah.png",
    title: "Studio with Master Bed",
    price: 372.96,
    rating: 10.0,
    reviews: 398,
    discount: 30,
    amenities: [
      "Food",
      "Drinking Water",
      "Bathroom",
      "Parking",
      "Television",
      "Wifi",
      "House Keeping",
      "Almirah",
      "Bed Sheet",
      "CCTV",
      "air conditionor",
      "Pillow",
    ],
  },
];
