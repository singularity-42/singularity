export enum OrderType {
    Alphabetical = "Alphabetical",
    Random = "Random",
    CounterAlphabetical = "CounterAlphabetical"
}

export interface Entity {
    title: string;
    tags: string[];
    address?: string;
    location?: string;
    description?: string;
}
