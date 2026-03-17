// Terms and Conditions API

export interface LegalPageResult {
  error: string;
  heading: string;
  description: string;
  image: string;
  image_alternate_text: string;
  write_date: string;
  points: LegalPage[];
}

export interface LegalPage {
  error: string;
  id: number;
  sequence_number: number;
  heading: string;
  description: string;
  sub_points: SubPoint[];
}

export interface SubPoint {
  id: number;
  sequence_number: number;
  sub_point: string;
}
