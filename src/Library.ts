export type ReferenceType = "doi" | "issn" | "pmid" | "pmc" | "url";

export type Reference = { type: ReferenceType, value: string, description?: string };

export type Resource = {
    readonly type: string;
    readonly tags: string[];
    readonly citation?: string;
    readonly summary?: string;
    readonly title?: string;
    readonly created?: string;
    readonly references: Reference[];
}
export type Tags = { [k: string]: Resource[] };

export type Library = {
    readonly resources: Resource[],
    readonly tags: Tags,

}