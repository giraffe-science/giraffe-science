import {bufferText} from "@http4t/core/bodies";
import {HttpHandler} from "@http4t/core/contract";
import {get} from "@http4t/core/requests";

export type Metadata = {
    readonly title: string;
    readonly published: Date;
    readonly publicationTitle: string;
    readonly authors: string[];
    readonly doi: string;
    readonly issn?: string;
}

export interface Lookup {
    lookup(doi: string): Promise<Metadata | undefined>;
}

export type Crossref = {
    message: {
        title: string[],
        DOI:string,
        ISSN?:string,
        created: {
            timestamp: number
        }
        "published-print": {
            timestamp: number
        },
        "container-title": string,
        author: { given: string, family: string, suffix?: string, sequence: "first" | "additional" }[]
    }
}

export class CrossRefLookup implements Lookup {
    constructor(private readonly http: HttpHandler) {

    }

    async lookup(doi: string): Promise<Metadata | undefined> {
        const url = `https://api.crossref.org/works/${doi}`;
        const response = await this.http.handle(get(url));
        if (response.status !== 200) {
            return undefined;
        }
        const json: Crossref = JSON.parse(await bufferText(response.body));
        const meta = json.message;
        return {
            title: meta.title.join(" "),
            doi: meta.DOI,
            issn:meta.ISSN,
            published: meta["published-print"]?.timestamp ? new Date(meta["published-print"].timestamp) : new Date(meta.created.timestamp),
            publicationTitle: meta["container-title"],
            authors: [
                ...meta.author.filter(a=>a.sequence==="first").map(a=>`${a.family}, ${a.given}`),
                ...meta.author.filter(a=>a.sequence!=="first").map(a=>`${a.family}, ${a.given}`)
            ]
        };
    }
}

export class CachedLookup implements Lookup {
    constructor(private readonly decorated: Lookup, private readonly cache: { [doi: string]: Metadata | undefined } = {}) {

    }

    async lookup(doi: string): Promise<Metadata | undefined> {
        if (!this.cache.hasOwnProperty(doi))
            this.cache[doi] = await this.decorated.lookup(doi);
        return this.cache[doi];
    }
}