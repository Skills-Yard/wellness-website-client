// types/subdetail.ts

export interface Highlight {
  id: number;
  title: string;
}

export interface Requirement {
  id: number;
  name: string;
}

export interface SubDetailData {
  image: string;
  heading: string;
  description: string;
  requirements: Requirement[];
  highlights: Highlight[];
}