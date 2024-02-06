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

export const TYPE_DESCRIPTIONS: { [key: string]: string } = {
    collaborations: "Veranstaltungen, die durch kreative Konzepte entstehen.",
    collectives: "Gruppen, die gemeinsam inspirierende Inhalte erstellen.",
    concepts: "Ideen, die unseren Content formen.",
    creatives: "Inhaltsschöpfer, die ihre Vorstellungskraft in die Tat umsetzen.",
    // contact: "Kontaktinformationen für die Singularität.",
    changes: "Veränderungen in Bezug auf die Singularität.",
    // cyberware: "Werkzeuge und Dienstleistungen, die unser#e Singularität antreiben.",
};

