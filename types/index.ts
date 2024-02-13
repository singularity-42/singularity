import { Edge, Node } from "vis-network";

export enum OrderType {
    Alphabetical = "Alphabetical",
    Random = "Random",
    CounterAlphabetical = "CounterAlphabetical"
}

export interface Relation {
    title: string;
    nodes: Node[];
    edges: Edge[];
}

export interface I18nMessages {
  [key: string]: string;
}

export const TYPE_DESCRIPTIONS: { [key: string]: string } = {
    collaborations: "Veranstaltungen, die durch kreative Konzepte entstehen.",
    collectives: "Gruppen, die gemeinsam inspirierende Inhalte erstellen.",
    creatives: "Inhaltsschöpfer, die ihre Vorstellungskraft in die Tat umsetzen.",
    concepts: "Ideen, die unseren Content formen.",
    changes: "Veränderungen mit Geschichte.",
};

// types.ts

export interface Metadata {
  [key: string]: string | string[];
}

export interface FileContent {
  name: string;
  metadata: Metadata;
  markdown: string;
  category: string | null;
  path: string | null;
  date: string | null;
}

export interface LoadResult extends FileContent {
  content: string;
}

export interface SaveFile extends FileContent {}

export interface Change {
  type: string;
  key: string;
  post: string;
  past: string;
}