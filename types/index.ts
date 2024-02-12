import { Edge, Node } from "vis-network";

export enum OrderType {
    Alphabetical = "Alphabetical",
    Random = "Random",
    CounterAlphabetical = "CounterAlphabetical"
}

export interface Entity {
    title?: string;
    tags?: string[];
    folder?: string;
    address?: string;
    location?: string;
    description?: string;
    content?: string;
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
    // contact: "Kontaktinformationen für die Singularität.",
    changes: "Veränderungen in Bezug auf die Singularität.",
    // cyberware: "Werkzeuge und Dienstleistungen, die unser#e Singularität antreiben.",
};

// types.ts

export interface Metadata {
  [key: string]: string | string[];
}

export interface FileContent {
  metadata: Metadata;
  markdown: string;
  content: string;
}

export interface LoadResult extends FileContent {
  content: string;
}

export interface SaveFile extends FileContent {}

export interface DeepSearchResult {
  count: number;
}

export interface DeepListResult {
  values: string[];
}

export interface DeepListFilesResult {
  result: string[];
}

export interface ExtractResult extends FileContent {}

export interface InexactResult {
  inexactContent: string;
}

export interface GetFilesResult {
  files: string[];
}

export interface DeleteResult {
  deleted: boolean;
}

export interface GetPathResult {
  path: string | false;
}

export interface DeepListFilesResult {
  result: string[];
}

export interface Change {
  type: string;
  key: string;
  value: string;
}
