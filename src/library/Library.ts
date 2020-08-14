export type IdentifierType = "doi" | "issn" | "pmid" | "pmc" | "url";

export type Identifier = { type: IdentifierType, value: string, description?: string };

export type Resource = {
    readonly type: string;
    readonly tags: string[];
    readonly citation?: string;
    readonly summary?: string;
    readonly title?: string;
    readonly created?: string;
    readonly identifiers: Identifier[];
}
export type Tags = { [k: string]: Resource[] };

export type ById<T> = { [k: string]: T };
export type ByIds = {
    doi: ById<Resource>,
    url: ById<Resource>,
};

export type Library = {
    readonly resources: Resource[],
    readonly tags: Tags,
    readonly ids: ByIds,
}