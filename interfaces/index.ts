// interfaces/index.ts

export interface MarkdownData {
  title: string;
  children: string;
  metadata: {
    website: string;
    instagram: string;
    mail: string;
    tel: string;
    tags: string[];
  };
}  