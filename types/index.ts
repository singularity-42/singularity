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
