import { Edge, Node } from "vis-network";
import { CategoryType } from "./defaults";

export interface Connection {
  title: string;
  nodes: Node[];
  edges: Edge[];
}


export interface Metadata {
  [key: string]: string | string[] | number;
}

// export interface Metadata {
//   tags?: string[];
//   connections?: string | string[];
//   image?: string;
  
//   website?: string;
//   mail?: string;
//   address?: string;
//   tel?: string;
//   instagram?: string;
//   youtube?: string;
//   soundcloud?: string;
//   spotify?: string;
//   facebook?: string;
//   bandcamp?: string;
//   telegram?: string;
//   twitter?: string;
//   github?: string;
//   linkedin?: string;
//   vimeo?: string;
// }

export interface FileContent {
  name: string;
  metadata: Metadata;
  markdown: string;
  category: string | null;
  path: string | null;
  date: string | null;
}

export interface Change {
  type: string;
  key: string;
  post: string;
  past: string;
}

export interface Filter {
  tags?: string[];
  name?: string;
  date?: Date;
  category?: CategoryType;
  connections?: string[];
}
