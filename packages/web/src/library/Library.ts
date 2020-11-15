import {__, arrayof, data, enumvalue, isboolean, isdata, isstring, opt} from "@deckchair-technicians/vice";

export enum IdType {
    doi = "doi",
    url = "url"
}

@data
export class Identifier {
    readonly type: IdType = __(enumvalue(IdType));
    readonly value: string = __(isstring());
    readonly description?: string = __(opt(isstring()));
}

export enum ResourceType {
    article = "article",
    handout = "handout",
    webinar = "webinar",
    web_page = "web page",
    pdf = "pdf",
}

@data
export class Tag {
    readonly id: string = __(isstring())
    readonly name: string = __(isstring())
    readonly isDiagnosis: boolean = __(isboolean())
}

@data
export class Link {
    readonly type?: string = __(opt(isstring()));
    readonly text?: string = __(opt(isstring()));
    readonly url: string = __(isstring());
}

export const isResourceType = enumvalue(ResourceType);

@data
export class Resource {
    readonly id: Identifier = __(isdata(Identifier));
    readonly type: ResourceType = __(isResourceType);
    readonly tags: Tag[] = __(arrayof(isdata(Tag)));
    readonly summary?: string = __(opt(isstring()));
    readonly title?: string = __(opt(isstring()));
    readonly created?: string = __(opt(isstring()));
    readonly links: Link[] = __(arrayof(isdata(Link)));
}

export type ById<T> = { [k: string]: T };
export type ByTag<T> = { [k: string]: T[] };
export type ByIds = {
    doi: ById<Resource>,
    url: ById<Resource>,
};

export type Library = {
    readonly resources: Resource[],
    readonly tags: ById<Tag>,
    readonly byTag: ByTag<Resource>,
    readonly byId: ByIds,
}

export function library(resources: Resource[], tags: ById<Tag>): Library {
    const byTag = resources
        .reduce((acc, resource) =>
            resource.tags.reduce((acc, tag) => {
                acc[tag.id] = (acc[tag.id] || [])
                acc[tag.id].push(resource);
                return acc;
            }, acc), {} as ByTag<Resource>)

    const byId = resources.reduce((acc, resource) => {
        const id = resource.id;
        if (id.type === "doi" || id.type === "url") {
            const existing = acc[id.type][id.value];
            if (!existing || resource.summary) {
                acc[id.type][id.value] = resource;
            }
        }
        return acc;
    }, {doi: {}, url: {}} as ByIds)

    return {resources: resources, tags, byTag, byId};
}

export function getDoi(resource: Resource): string | undefined {
    return resource.id.type === IdType.doi ? resource.id.value : undefined;
}
